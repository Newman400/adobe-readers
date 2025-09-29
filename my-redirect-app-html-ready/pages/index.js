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
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 100 }}>
      <h2>Enter your email to continue</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 8, fontSize: 16, minWidth: 300 }}
        />
        <button type="submit" style={{ padding: 10, fontSize: 16 }}>Continue</button>
      </form>
    </main>
  );
}
