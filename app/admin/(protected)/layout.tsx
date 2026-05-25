import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';
import LogoutButton from '../LogoutButton';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/cartoons', label: 'Cartoons' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/videos', label: 'Videos' },
  { href: '/admin/submissions', label: 'Submissions' },
  { href: '/admin/tags', label: 'Tags' },
  { href: '/admin/content', label: 'Page Content' },
  { href: '/admin/supporters', label: 'Supporters' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen flex flex-col bg-background" dir="ltr">
      {USE_MOCK && (
        <div className="bg-yellow-500 text-black text-xs font-semibold text-center py-2 px-4">
          ⚠️ Preview Mode — Mock data, no changes will be saved
        </div>
      )}
      <div className="flex flex-1">
        <aside className="w-56 bg-[#141414] border-e border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-white text-sm">Admin Panel</h2>
          </div>
          <nav className="flex-1 py-4">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-4 py-2 text-sm text-text-muted hover:text-white hover:bg-card transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border space-y-2">
            <Link href="/ar" className="block text-sm text-text-muted hover:text-white">
              View Site
            </Link>
            <LogoutButton />
          </div>
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
