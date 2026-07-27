/**
 * Serves the Microsoft Clarity bootstrap as a same-origin external script
 * (rather than an inline <script>) so it needs no CSP nonce/hash and doesn't
 * force the rest of the app into dynamic rendering. Reads the ID at request
 * time since it's an env var, not a build-time constant. Empty when unset —
 * MicrosoftClarity.tsx only requests this route when NEXT_PUBLIC_CLARITY_ID is set.
 */
export async function GET() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const body = clarityId
    ? `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityId}");`
    : '';

  return new Response(body, {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
  });
}
