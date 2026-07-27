/**
 * Server-Side PDF Generation Route Handler
 * POST /api/generate-pdf
 * Accepts BioData JSON, returns a PDF buffer generated server-side
 * using @react-pdf/renderer (no headless Chromium required).
 *
 * Runs in the default Node.js runtime (not Edge) to support React-PDF.
 */

import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer, DocumentProps } from '@react-pdf/renderer';
import React, { ReactElement, JSXElementConstructor } from 'react';
import { BioDataPdfDocument } from './template';
import { BioData } from '@/types/biodata';

export const runtime = 'nodejs';

/** Maximum accepted payload size: 2 MB (base64 photo + form data) */
const MAX_PAYLOAD_BYTES = 2 * 1024 * 1024;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: 'Payload too large.' }, { status: 413 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Request body must be a JSON object.' }, { status: 400 });
    }

    const bioData = body as BioData;

    if (!bioData.personalInfo?.fullName) {
      return NextResponse.json({ error: 'personalInfo.fullName is required.' }, { status: 422 });
    }

    const element = React.createElement(BioDataPdfDocument, { bioData }) as unknown as ReactElement<DocumentProps, string | JSXElementConstructor<DocumentProps>>;
    const buffer = await renderToBuffer(element);

    const filename = `biodata-${bioData.personalInfo.fullName.replace(/\s+/g, '-')}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(buffer.length),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[generate-pdf] Unhandled error:', error);
    return NextResponse.json(
      { error: 'PDF generation failed. Please try again.' },
      { status: 500 }
    );
  }
}
