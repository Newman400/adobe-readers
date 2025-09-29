import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      window.location.href = `/api/redirect?smn=${encodeURIComponent(email)}`;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        placeholder="Enter your email"
      />
      <button type="submit">Continue</button>
    </form>
  );
}
