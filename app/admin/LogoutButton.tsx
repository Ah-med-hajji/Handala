'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="block w-full text-start text-sm text-text-muted hover:text-red-400 transition-colors disabled:opacity-50"
    >
      {loading ? 'Logging out...' : 'Log Out'}
    </button>
  );
}
