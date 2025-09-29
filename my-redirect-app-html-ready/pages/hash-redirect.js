// pages/hash-redirect.js
import { useEffect } from "react";

export default function HashRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const email = hash.slice(1); // remove the #
      // Redirect to your API with email as query
      window.location.href = `/api/redirect?email=${encodeURIComponent(email)}`;
    } else {
      // No hash, just go to API without email
      window.location.href = "/api/redirect";
    }
  }, []);

  return null;
}
