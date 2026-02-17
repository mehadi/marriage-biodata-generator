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

const CAPTURE_OPTIONS = {
  quality: 1,
  backgroundColor: '#ffffff',
  pixelRatio: 2,
  cacheBust: true,
} as const;

/** Tolerance for treating a pixel as background (handles antialiasing) */
const BG_TOLERANCE = 5;

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
 */
function cropCanvasToContent(
  canvas: HTMLCanvasElement,
  backgroundColor: string = '#ffffff'
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const [br, bg, bb] = parseBackgroundRgb(backgroundColor);
  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
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
      const sourceCanvas = await toCanvas(element, CAPTURE_OPTIONS);
      const croppedCanvas = cropCanvasToContent(
        sourceCanvas,
        CAPTURE_OPTIONS.backgroundColor
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
      const sourceCanvas = await toCanvas(element, CAPTURE_OPTIONS);
      const croppedCanvas = cropCanvasToContent(
        sourceCanvas,
        CAPTURE_OPTIONS.backgroundColor
      );

      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const blob = await new Promise<Blob | null>((resolve) => {
        croppedCanvas.toBlob(resolve, mime, format === 'jpeg' ? 0.95 : 1);
      });

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