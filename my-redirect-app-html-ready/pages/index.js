// pages/index.js
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Grab email from query string: /?email=someone@example.com
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");

    // Redirect to API route with the email
    let target = "/api/redirect";
    if (email) target += `?email=${encodeURIComponent(email)}`;

    window.location.href = target;
  }, []);

  return null;
}
