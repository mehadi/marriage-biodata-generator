import Script from 'next/script';

const GTM_ID = "GTM-WHFBLK4V";

/**
 * Google Tag Manager script and noscript snippet.
 * The bootstrap loader lives at public/gtm-init.js (a same-origin external
 * script) rather than inline, so it needs no CSP nonce/hash and doesn't force
 * the rest of the app into dynamic rendering the way a per-request nonce would.
 */
export function GoogleTagManager() {
  return (
    <>
      <Script src="/gtm-init.js" strategy="afterInteractive" />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
