'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTag, deleteTag } from '@/lib/actions/tag-actions';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

interface TagWithCount {
  id: string;
  name_ar: string;
  name_en: string | null;
  slug: string;
  usage_count: number;
}

export default function TagsClient({ tags }: { tags: TagWithCount[] }) {
  const router = useRouter();
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;
    setAdding(true);
    setError('');
    const slug = generateSlug(nameEn || nameAr);
    const result = await createTag({ name_ar: nameAr.trim(), name_en: nameEn.trim() || undefined, slug });
    if (result.success) {
      setNameAr('');
      setNameEn('');
      router.refresh();
    } else {
      setError(result.error || 'Failed to create tag');
    }
    setAdding(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const result = await deleteTag(deleteId);
    if (result.success) {
      setDeleteId(null);
      router.refresh();
    } else {
      setError(result.error || 'Failed to delete tag');
      setDeleteId(null);
    }
    setDeleting(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tags</h1>

      <form onSubmit={handleAdd} className="bg-card border border-border rounded-lg p-4 mb-6 flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs text-text-muted mb-1">Arabic Name *</label>
          <input
            value={nameAr}
            onChange={e => setNameAr(e.target.value)}
            className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
            placeholder="الاسم بالعربية"
            dir="rtl"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-text-muted mb-1">English Name</label>
          <input
            value={nameEn}
            onChange={e => setNameEn(e.target.value)}
            className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
            placeholder="English name"
          />
        </div>
        <button
          type="submit"
          disabled={adding || !nameAr.trim()}
          className="bg-accent text-black px-4 py-2 rounded text-sm font-semibold hover:bg-accent/90 disabled:opacity-50 whitespace-nowrap"
        >
          {adding ? 'Adding...' : '+ Add Tag'}
        </button>
      </form>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr className="text-text-muted">
              <th className="text-start p-3">Arabic</th>
              <th className="text-start p-3">English</th>
              <th className="text-start p-3">Slug</th>
              <th className="text-start p-3">Used In</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {tags.map(tag => (
              <tr key={tag.id} className="border-b border-border/50 hover:bg-[#222]">
                <td className="p-3 text-white" dir="rtl">{tag.name_ar}</td>
                <td className="p-3 text-text-muted">{tag.name_en || '–'}</td>
                <td className="p-3 text-text-muted font-mono text-xs">{tag.slug}</td>
                <td className="p-3 text-text-muted">{tag.usage_count} cartoons</td>
                <td className="p-3">
                  <button
                    onClick={() => setDeleteId(tag.id)}
                    className="text-red-400 text-xs hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tags.length === 0 && (
          <p className="text-center text-text-muted py-8">No tags yet</p>
        )}
      </div>

      {deleteId && (
        <ConfirmModal
          title="Delete Tag"
          message="Are you sure you want to delete this tag? This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
