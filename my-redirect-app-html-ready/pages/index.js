// pages/index.js

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Optional: pass email from query param on /?email=...
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const target = '/api/redirect' + (email ? `?email=${encodeURIComponent(email)}` : '');
    window.location.href = target;
  }, []);

  return null;
}
