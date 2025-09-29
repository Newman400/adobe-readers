import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // Redirect to the API route with email as smn param
      window.location.href = `/api/redirect?smn=${encodeURIComponent(email)}`;
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Continue</button>
      </form>
    </main>
  );
}
