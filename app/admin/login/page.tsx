'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (USE_MOCK) {
      const res = await fetch('/api/mock-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/admin');
      } else {
        setError('Invalid credentials — use password: admin123');
        setLoading(false);
      }
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Invalid credentials');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm bg-card rounded-lg p-8 border border-border">
        <h1 className="text-xl font-bold mb-6 text-center">Admin Login</h1>
        {USE_MOCK && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400 text-xs text-center">
            Preview Mode — use any email + password: <strong>admin123</strong>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={USE_MOCK ? 'any@example.com' : 'Email'}
            className="w-full bg-background border border-border rounded px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-accent"
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-background border border-border rounded px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-accent"
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-black font-semibold py-3 rounded hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
