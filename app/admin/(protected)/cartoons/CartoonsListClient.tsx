'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteCartoon, togglePublished } from '@/lib/actions/cartoon-actions';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { StatusBadge } from '@/components/admin/StatusBadge';

interface CartoonRow {
  id: string;
  title_ar: string;
  image_url: string;
  publication_date: string | null;
  is_published: boolean;
  view_count: number;
}

export default function CartoonsListClient({
  cartoons,
  page,
  totalPages,
  q,
}: {
  cartoons: CartoonRow[];
  page: number;
  totalPages: number;
  q: string;
}) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState(q);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/cartoons?q=${encodeURIComponent(search)}&page=1`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await deleteCartoon(deleteId);
    setDeleteId(null);
    setDeleting(false);
    router.refresh();
  };

  const handleToggle = async (id: string, current: boolean) => {
    await togglePublished(id, current);
    router.refresh();
  };

  return (
    <>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by Arabic title..."
          className="flex-1 bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
        />
        <button type="submit" className="bg-accent text-black px-4 py-2 rounded text-sm font-semibold">Search</button>
        {q && <Link href="/admin/cartoons" className="px-4 py-2 rounded border border-border text-text-muted text-sm hover:text-white">Clear</Link>}
      </form>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr className="text-text-muted">
              <th className="text-start p-3">Thumbnail</th>
              <th className="text-start p-3">Title</th>
              <th className="text-start p-3">Date</th>
              <th className="text-start p-3">Views</th>
              <th className="text-start p-3">Status</th>
              <th className="p-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartoons.map(c => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-[#222]">
                <td className="p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image_url} alt={c.title_ar} className="h-10 w-14 object-cover rounded" />
                </td>
                <td className="p-3 text-white max-w-xs" dir="rtl">
                  <span className="line-clamp-2">{c.title_ar}</span>
                </td>
                <td className="p-3 text-text-muted">{c.publication_date || '–'}</td>
                <td className="p-3 text-text-muted">{c.view_count}</td>
                <td className="p-3">
                  <button onClick={() => handleToggle(c.id, c.is_published)}>
                    <StatusBadge status={c.is_published ? 'published' : 'draft'} />
                  </button>
                </td>
                <td className="p-3 text-end">
                  <div className="flex gap-3 justify-end">
                    <Link href={`/admin/cartoons/${c.id}/edit`} className="text-accent text-xs hover:underline">Edit</Link>
                    <button onClick={() => setDeleteId(c.id)} className="text-red-400 text-xs hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cartoons.length === 0 && (
          <p className="text-center text-text-muted py-8">No cartoons found</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          {page > 1 && (
            <Link href={`/admin/cartoons?page=${page - 1}${q ? `&q=${q}` : ''}`} className="px-4 py-2 rounded border border-border text-text-muted text-sm hover:text-white">
              Previous
            </Link>
          )}
          <span className="px-4 py-2 text-text-muted text-sm">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`/admin/cartoons?page=${page + 1}${q ? `&q=${q}` : ''}`} className="px-4 py-2 rounded border border-border text-text-muted text-sm hover:text-white">
              Next
            </Link>
          )}
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete Cartoon"
          message="Are you sure? This will permanently delete the cartoon."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
