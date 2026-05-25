import { createServiceClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { MOCK_CARTOONS, MOCK_CATEGORIES, MOCK_VIDEOS, MOCK_SUBMISSIONS } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export default async function AdminDashboard() {
  let totalCartoons: number, publishedCartoons: number, totalCategories: number, totalVideos: number, pendingSubmissions: number;

  if (USE_MOCK) {
    totalCartoons = MOCK_CARTOONS.length;
    publishedCartoons = MOCK_CARTOONS.filter(c => c.is_published).length;
    totalCategories = MOCK_CATEGORIES.length;
    totalVideos = MOCK_VIDEOS.length;
    pendingSubmissions = MOCK_SUBMISSIONS.filter(s => s.status === 'pending').length;
  } else {
    const supabase = createServiceClient();
    const [
      { count: tc },
      { count: pc },
      { count: tcat },
      { count: tv },
      { count: ps },
    ] = await Promise.all([
      supabase.from('cartoons').select('*', { count: 'exact', head: true }),
      supabase.from('cartoons').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('videos').select('*', { count: 'exact', head: true }),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);
    totalCartoons = tc || 0; publishedCartoons = pc || 0; totalCategories = tcat || 0;
    totalVideos = tv || 0; pendingSubmissions = ps || 0;
  }

  const stats = [
    { label: 'Cartoons', value: totalCartoons, sub: `${publishedCartoons} published`, href: '/admin/cartoons' },
    { label: 'Categories', value: totalCategories, href: '/admin/categories' },
    { label: 'Videos', value: totalVideos, href: '/admin/videos' },
    { label: 'Pending Submissions', value: pendingSubmissions, href: '/admin/submissions', alert: pendingSubmissions > 0 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-card rounded-lg p-6 border border-border hover:border-accent/50 transition-colors"
          >
            <p className="text-text-muted text-sm">{stat.label}</p>
            <p className={`text-3xl font-bold mt-2 ${stat.alert ? 'text-accent' : 'text-white'}`}>
              {stat.value}
            </p>
            {stat.sub && <p className="text-text-muted text-xs mt-1">{stat.sub}</p>}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/cartoons/new" className="flex items-center gap-3 bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors">
          <span className="text-2xl">+</span>
          <div>
            <p className="text-white font-medium">Add Cartoon</p>
            <p className="text-text-muted text-sm">Upload a new Naji Al-Ali cartoon</p>
          </div>
        </Link>
        <Link href="/admin/categories/new" className="flex items-center gap-3 bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors">
          <span className="text-2xl">+</span>
          <div>
            <p className="text-white font-medium">Add Category</p>
            <p className="text-text-muted text-sm">Create a new cartoon category</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
