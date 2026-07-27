/**
 * Service Worker Registrar
 * Single Responsibility: Register the PWA service worker in the browser
 * Client-only component — renders nothing, only registers the SW on mount
 */

'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((error) => {
          console.warn('Service worker registration failed:', error);
        });
    }
  }, []);

  return null;
}
