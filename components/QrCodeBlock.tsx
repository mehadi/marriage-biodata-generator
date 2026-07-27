/**
 * QrCodeBlock
 * Renders a small QR code (from a URL) to be embedded in exported documents.
 * Generates the QR code as a data URL on the client side via the `qrcode` package.
 */

'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeBlockProps {
  /** The URL to encode into the QR code */
  url: string;
  /** Size in pixels (default 96) */
  size?: number;
  /** Label text shown below the QR code */
  label?: string;
}

export const QrCodeBlock: React.FC<QrCodeBlockProps> = ({ url, size = 96, label }) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    QRCode.toDataURL(url, {
      width: size * 2, // 2× for retina sharpness
      margin: 1,
      color: { dark: '#1e293b', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [url, size]);

  if (!dataUrl) return null;

  return (
    <div
      className="flex flex-col items-center gap-1"
      style={{ width: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt="QR code to view this bio data"
        width={size}
        height={size}
        style={{ display: 'block', imageRendering: 'pixelated' }}
      />
      {label && (
        <p
          className="text-center leading-tight text-slate-500"
          style={{ fontSize: 8, maxWidth: size }}
        >
          {label}
        </p>
      )}
    </div>
  );
};
