import { useState } from 'react';
import { useRouter } from 'next/router';
import cookie from 'cookie'; // Tambah ini di atas

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Ganti ini sesuai kebutuhan!
    const ADMIN_USER = 'admin';
    const ADMIN_PASS = 'password123';

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // Set cookie sederhana
      document.cookie = `admin_auth=true; path=/`;
      router.push('/admin');
    } else {
      alert('Username atau password salah!');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-4">Login Admin</h1>

      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-xs">
        <input
          type="text"
          placeholder="Username"
          className="w-full border px-3 py-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
      </form>
    </main>
  );
}
