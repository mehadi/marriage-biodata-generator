/**
 * Export Service
 * Single Responsibility: Handle all export operations (PDF, Image, Print, WhatsApp Card)
 * Uses html-to-image for DOM capture; jsPDF for PDF.
 */

import { toCanvas } from 'html-to-image';
import jsPDF from 'jspdf';
import { downloadFile } from '@/lib/utils';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

/** Mobile browsers throw IndexSizeError when getImageData exceeds size/memory limits */
const MAX_CANVAS_PIXELS = 4096 * 4096;

/** Max pixels for toBlob on mobile (toBlob often returns null for large canvases) */
const MAX_TOBLOB_PIXELS = 2048 * 2048;

/** WhatsApp card target size: 1080x1080px */
const WHATSAPP_CARD_SIZE = 1080;

function isMobile(): boolean {
  return typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Desktop: base width for capture. With pixelRatio 2, effective width is 2x (~3448px).
 * Chosen so (baseWidth * 2) * (baseHeight * 2) <= MAX_CANVAS_PIXELS.
 */
const TARGET_EXPORT_WIDTH_DESKTOP = 1724;

/** Target export width on mobile to avoid toBlob/memory limits */
const TARGET_EXPORT_WIDTH_MOBILE = 1200;

/** pixelRatio applied by html-to-image (canvas size = width * pixelRatio). Use 2 on desktop for sharper output. */
const DESKTOP_PIXEL_RATIO = 2;

/**
 * Max base pixels so that (width * pixelRatio) * (height * pixelRatio) <= MAX_CANVAS_PIXELS.
 */
const MAX_BASE_PIXELS_DESKTOP = Math.floor(MAX_CANVAS_PIXELS / (DESKTOP_PIXEL_RATIO * DESKTOP_PIXEL_RATIO));

/**
 * Compute export dimensions from the element's aspect ratio so output is deterministic
 * and high-res regardless of how large the preview is on screen.
 */
function getExportDimensions(element: HTMLElement): { width: number; height: number } {
  const w = element.offsetWidth || 400;
  const h = element.offsetHeight || 600;
  const aspect = h / w;
  const targetWidth = isMobile() ? TARGET_EXPORT_WIDTH_MOBILE : TARGET_EXPORT_WIDTH_DESKTOP;
  let width = targetWidth;
  let height = Math.round(targetWidth * aspect);
  const maxPixels = isMobile() ? MAX_CANVAS_PIXELS : MAX_BASE_PIXELS_DESKTOP;
  if (width * height > maxPixels) {
    const scale = Math.sqrt(maxPixels / (width * height));
    width = Math.max(1, Math.floor(width * scale));
    height = Math.max(1, Math.floor(height * scale));
  }
  return { width, height };
}

function getCaptureOptions(element: HTMLElement): {
  quality: number;
  backgroundColor: string;
  pixelRatio: number;
  cacheBust: boolean;
  skipAutoScale?: boolean;
  width?: number;
  height?: number;
} {
  const dimensions = getExportDimensions(element);
  return {
    quality: 1,
    backgroundColor: '#ffffff',
    pixelRatio: isMobile() ? 1 : DESKTOP_PIXEL_RATIO,
    cacheBust: true,
    skipAutoScale: true,
    width: dimensions.width,
    height: dimensions.height,
  };
}

/** Tolerance for treating a pixel as background (handles antialiasing) */
const BG_TOLERANCE = 5;

/**
 * Scale down canvas if it exceeds mobile-safe pixel count to avoid getImageData IndexSizeError.
 */
function ensureCanvasWithinLimit(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const w = canvas.width;
  const h = canvas.height;
  if (!w || !h || w * h <= MAX_CANVAS_PIXELS) return canvas;

  const scale = Math.sqrt(MAX_CANVAS_PIXELS / (w * h));
  const newW = Math.max(1, Math.floor(w * scale));
  const newH = Math.max(1, Math.floor(h * scale));
  const scaled = document.createElement('canvas');
  scaled.width = newW;
  scaled.height = newH;
  const ctx = scaled.getContext('2d');
  if (!ctx) return canvas;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(canvas, 0, 0, w, h, 0, 0, newW, newH);
  return scaled;
}

/**
 * Convert canvas to Blob. Uses toBlob first; on mobile toBlob often returns null, so fallback to toDataURL + fetch.
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        try {
          const dataUrl = canvas.toDataURL(mime, quality);
          if (!dataUrl || dataUrl.length < 100) {
            resolve(null);
            return;
          }
          fetch(dataUrl)
            .then((r) => r.blob())
            .then(resolve)
            .catch(() => resolve(null));
        } catch {
          resolve(null);
        }
      },
      mime,
      quality
    );
  });
}

/**
 * Get R,G,B from hex color (e.g. '#ffffff')
 */
function parseBackgroundRgb(hex: string): [number, number, number] {
  const n = hex.replace('#', '');
  const v = parseInt(n, 16);
  return [(v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff];
}

/**
 * Crop canvas to the bounding box of non-background pixels (removes empty space on all sides).
 * Scales down oversized canvases on mobile to avoid getImageData IndexSizeError.
 */
function cropCanvasToContent(
  canvas: HTMLCanvasElement,
  backgroundColor: string = '#ffffff'
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  canvas = ensureCanvasWithinLimit(canvas);
  const w = canvas.width;
  const h = canvas.height;
  if (!w || !h) return canvas;

  const ctx2 = canvas.getContext('2d');
  if (!ctx2) return canvas;

  const [br, bg, bb] = parseBackgroundRgb(backgroundColor);
  const imageData = ctx2.getImageData(0, 0, w, h);
  const data = imageData.data;

  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      const isBackground =
        a < 128 ||
        (Math.abs(r - br) <= BG_TOLERANCE &&
          Math.abs(g - bg) <= BG_TOLERANCE &&
          Math.abs(b - bb) <= BG_TOLERANCE);
      if (!isBackground) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (minX > maxX || minY > maxY) return canvas;

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const cropped = document.createElement('canvas');
  cropped.width = cropW;
  cropped.height = cropH;
  const cropCtx = cropped.getContext('2d');
  if (!cropCtx) return canvas;

  cropCtx.imageSmoothingEnabled = true;
  cropCtx.imageSmoothingQuality = 'high';
  cropCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
  return cropped;
}

/**
 * Fit the bio data canvas into a square 1080x1080 canvas with padding, for WhatsApp sharing.
 */
function fitIntoSquare(sourceCanvas: HTMLCanvasElement, size: number): HTMLCanvasElement {
  const square = document.createElement('canvas');
  square.width = size;
  square.height = size;
  const ctx = square.getContext('2d');
  if (!ctx) return sourceCanvas;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const padding = Math.floor(size * 0.05);
  const available = size - padding * 2;
  const aspect = sourceCanvas.height / sourceCanvas.width;
  let drawW = available;
  let drawH = Math.round(available * aspect);

  if (drawH > available) {
    drawH = available;
    drawW = Math.round(available / aspect);
  }

  const x = Math.floor((size - drawW) / 2);
  const y = Math.floor((size - drawH) / 2);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(sourceCanvas, x, y, drawW, drawH);

  return square;
}

export class ExportService {
  /**
   * Export element to PDF. Uses same crop-to-content as image export (no empty space).
   */
  static async exportToPDF(
    element: HTMLElement,
    filename: string = 'bio-data.pdf'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isExportSupported()) {
        return { success: false, error: 'PDF export is not supported in this browser. Please try printing instead.' };
      }
      const captureOpts = getCaptureOptions(element);
      const sourceCanvas = await toCanvas(element, captureOpts);
      const croppedCanvas = cropCanvasToContent(
        sourceCanvas,
        captureOpts.backgroundColor
      );

      const dataUrl = croppedCanvas.toDataURL('image/png');

      const imgWidth = A4_WIDTH_MM;
      const pageHeight = A4_HEIGHT_MM;
      const pdf = new jsPDF('p', 'mm', 'a4');

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image for PDF. Please try again.'));
        img.src = dataUrl;
      });

      let drawWidth = imgWidth;
      let drawHeight = (img.height * imgWidth) / img.width;

      if (drawHeight > pageHeight) {
        const scale = pageHeight / drawHeight;
        drawHeight = pageHeight;
        drawWidth = drawWidth * scale;
      }

      const x = (A4_WIDTH_MM - drawWidth) / 2;
      const y = (pageHeight - drawHeight) / 2;
      pdf.addImage(dataUrl, 'PNG', x, y, drawWidth, drawHeight);

      pdf.save(filename);
      return { success: true };
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      const message = error instanceof Error ? error.message : 'Failed to export PDF';
      return {
        success: false,
        error: message.includes('Failed') ? message : `PDF export failed: ${message}. Please try again or use Print instead.`,
      };
    }
  }

  /**
   * Export element to Image (PNG or JPEG). Image contains only the content with no extra empty space.
   */
  static async exportToImage(
    element: HTMLElement,
    format: 'png' | 'jpeg' = 'png',
    filename?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isExportSupported()) {
        return { success: false, error: 'Image export is not supported in this browser.' };
      }
      const captureOpts = getCaptureOptions(element);
      const sourceCanvas = await toCanvas(element, captureOpts);
      let croppedCanvas = cropCanvasToContent(
        sourceCanvas,
        captureOpts.backgroundColor
      );

      if (isMobile() && croppedCanvas.width * croppedCanvas.height > MAX_TOBLOB_PIXELS) {
        const w = croppedCanvas.width;
        const h = croppedCanvas.height;
        const scale = Math.sqrt(MAX_TOBLOB_PIXELS / (w * h));
        const newW = Math.max(1, Math.floor(w * scale));
        const newH = Math.max(1, Math.floor(h * scale));
        const small = document.createElement('canvas');
        small.width = newW;
        small.height = newH;
        const ctx = small.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(croppedCanvas, 0, 0, w, h, 0, 0, newW, newH);
          croppedCanvas = small;
        }
      }

      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'jpeg' ? 1 : 1;
      const blob = await canvasToBlob(croppedCanvas, mime, quality);

      if (!blob) {
        return { success: false, error: 'Failed to create image. Your browser may not support this feature. Please try a different browser.' };
      }

      const defaultFilename = `bio-data.${format}`;
      downloadFile(blob, filename ?? defaultFilename);
      return { success: true };
    } catch (error) {
      console.error('Error exporting to image:', error);
      const message = error instanceof Error ? error.message : 'Failed to export image';
      return {
        success: false,
        error: `${message}. Please try again or use a different browser.`,
      };
    }
  }

  /**
   * Export element as a 1080x1080 square PNG image optimized for WhatsApp sharing.
   */
  static async exportToWhatsAppCard(
    element: HTMLElement,
    filename: string = 'biodata-whatsapp.png'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isExportSupported()) {
        return { success: false, error: 'WhatsApp card export is not supported in this browser.' };
      }

      const captureOpts = getCaptureOptions(element);
      const sourceCanvas = await toCanvas(element, captureOpts);
      const croppedCanvas = cropCanvasToContent(sourceCanvas, captureOpts.backgroundColor);
      const squareCanvas = fitIntoSquare(croppedCanvas, WHATSAPP_CARD_SIZE);

      const blob = await canvasToBlob(squareCanvas, 'image/png', 1);
      if (!blob) {
        return { success: false, error: 'Failed to create WhatsApp card image. Please try again.' };
      }

      downloadFile(blob, filename);
      return { success: true };
    } catch (error) {
      console.error('Error exporting WhatsApp card:', error);
      const message = error instanceof Error ? error.message : 'Failed to export WhatsApp card';
      return { success: false, error: message };
    }
  }

  /**
   * Prepare and trigger browser print dialog
   */
  static preparePrint(element: HTMLElement): { success: boolean; error?: string } {
    try {
      const printWindow = window.open('', '_blank');

      if (!printWindow) {
        return { success: false, error: 'Pop-up blocked. Please allow pop-ups for this site and try again.' };
      }

      const clonedElement = element.cloneNode(true) as HTMLElement;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Marriage Bio Data</title>
            <style>
              @media print {
                @page {
                  size: A4;
                  margin: 0;
                }
                body {
                  margin: 0;
                  padding: 0;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
              body {
                font-family: system-ui, -apple-system, sans-serif;
                margin: 0;
                padding: 0;
              }
              * {
                box-sizing: border-box;
              }
            </style>
            <link rel="stylesheet" href="${window.location.origin}/_next/static/css/app/layout.css" />
          </head>
          <body>
            ${clonedElement.outerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }, 250);
      };

      return { success: true };
    } catch (error) {
      console.error('Error preparing print:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to prepare print. Please try again.',
      };
    }
  }

  /**
   * Check if export is supported in current browser
   */
  static isExportSupported(): boolean {
    return typeof window !== 'undefined' && !!document.createElement('canvas').getContext('2d');
  }

  /**
   * Request server-side PDF generation via the /api/generate-pdf route.
   * Falls back gracefully if the API is unavailable (e.g., network error).
   */
  static async exportToPDFServerSide(
    bioData: object,
    filename: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Exclude photo to keep payload small; server template doesn't embed images
        body: JSON.stringify({ ...bioData, photo: undefined }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown server error' }));
        return { success: false, error: (err as { error?: string }).error ?? 'Server PDF generation failed.' };
      }

      const blob = await response.blob();
      downloadFile(blob, filename);
      return { success: true };
    } catch (error) {
      console.error('Server-side PDF generation error:', error);
      return {
        success: false,
        error: 'Could not reach the PDF server. Please use the client-side PDF export instead.',
      };
    }
  }
}
