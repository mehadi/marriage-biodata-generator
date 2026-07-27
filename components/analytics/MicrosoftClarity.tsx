import Script from 'next/script';

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

/**
 * Microsoft Clarity. Self-guards on a missing env var, so it's always safe to
 * render unconditionally from the root layout — no-ops until NEXT_PUBLIC_CLARITY_ID
 * is set. Loads from the /clarity-init.js route (app/clarity-init.js/route.ts),
 * a same-origin external script, instead of an inline one — needs no CSP
 * nonce/hash and doesn't force the app into dynamic rendering.
 */
export function MicrosoftClarity() {
  if (!CLARITY_ID) return null;

  return <Script src="/clarity-init.js" strategy="afterInteractive" />;
}
