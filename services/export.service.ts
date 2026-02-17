/**
 * Export Service
 * Single Responsibility: Handle all export operations (PDF, Image, Print)
 * Uses html-to-image for DOM capture (reliable with modern CSS); jsPDF for PDF.
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

function isMobile(): boolean {
  return typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getCaptureOptions(): { quality: number; backgroundColor: string; pixelRatio: number; cacheBust: boolean } {
  return {
    quality: 1,
    backgroundColor: '#ffffff',
    pixelRatio: isMobile() ? 1 : 2,
    cacheBust: true,
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

  cropCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
  return cropped;
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
      const captureOpts = getCaptureOptions();
      const sourceCanvas = await toCanvas(element, captureOpts);
      const croppedCanvas = cropCanvasToContent(
        sourceCanvas,
        captureOpts.backgroundColor
      );

      const dataUrl = croppedCanvas.toDataURL('image/jpeg', 0.95);

      const imgWidth = A4_WIDTH_MM;
      const pageHeight = A4_HEIGHT_MM;
      const pdf = new jsPDF('p', 'mm', 'a4');

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image for PDF'));
        img.src = dataUrl;
      });

      const imgHeight = (img.height * imgWidth) / img.width;
      const fitsOnePage = imgHeight <= pageHeight;

      if (fitsOnePage) {
        const y = (pageHeight - imgHeight) / 2;
        pdf.addImage(dataUrl, 'JPEG', 0, y, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(dataUrl, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(dataUrl, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      pdf.save(filename);
      return { success: true };
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export PDF',
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
      const captureOpts = getCaptureOptions();
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
          ctx.drawImage(croppedCanvas, 0, 0, w, h, 0, 0, newW, newH);
          croppedCanvas = small;
        }
      }

      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'jpeg' ? 0.95 : 1;
      const blob = await canvasToBlob(croppedCanvas, mime, quality);

      if (!blob) {
        return { success: false, error: 'Failed to create image' };
      }

      const defaultFilename = `bio-data.${format}`;
      downloadFile(blob, filename ?? defaultFilename);
      return { success: true };
    } catch (error) {
      console.error('Error exporting to image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export image',
      };
    }
  }

  /**
   * Prepare and trigger browser print dialog
   */
  static preparePrint(element: HTMLElement): { success: boolean; error?: string } {
    try {
      const printWindow = window.open('', '_blank');

      if (!printWindow) {
        return { success: false, error: 'Pop-up blocked. Please allow pop-ups for this site.' };
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
        error: error instanceof Error ? error.message : 'Failed to prepare print',
      };
    }
  }

  /**
   * Check if export is supported in current browser
   */
  static isExportSupported(): boolean {
    return typeof window !== 'undefined' && !!document.createElement('canvas').getContext('2d');
  }
}