'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteCategory } from '@/lib/actions/category-actions';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { StatusBadge } from '@/components/admin/StatusBadge';

interface CategoryRow {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  cover_image_url: string | null;
  display_order: number;
  is_published: boolean;
  cartoon_count: number;
}

export default function CategoriesListClient({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await deleteCategory(deleteId);
    setDeleteId(null);
    setDeleting(false);
    router.refresh();
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr className="text-text-muted">
              <th className="text-start p-3">Cover</th>
              <th className="text-start p-3">Arabic Name</th>
              <th className="text-start p-3">English Name</th>
              <th className="text-start p-3">Cartoons</th>
              <th className="text-start p-3">Order</th>
              <th className="text-start p-3">Status</th>
              <th className="p-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-b border-border/50 hover:bg-[#222]">
                <td className="p-3">
                  {cat.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.cover_image_url} alt={cat.name_ar} className="h-10 w-16 object-cover rounded" />
                  ) : (
                    <div className="h-10 w-16 bg-border rounded" />
                  )}
                </td>
                <td className="p-3 text-white" dir="rtl">{cat.name_ar}</td>
                <td className="p-3 text-text-muted">{cat.name_en}</td>
                <td className="p-3 text-text-muted">{cat.cartoon_count}</td>
                <td className="p-3 text-text-muted">{cat.display_order}</td>
                <td className="p-3">
                  <StatusBadge status={cat.is_published ? 'published' : 'draft'} />
                </td>
                <td className="p-3 text-end">
                  <div className="flex gap-3 justify-end">
                    <Link href={`/admin/categories/${cat.id}/edit`} className="text-accent text-xs hover:underline">Edit</Link>
                    <button onClick={() => setDeleteId(cat.id)} className="text-red-400 text-xs hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="text-center text-text-muted py-8">No categories yet</p>
        )}
      </div>

      {deleteId && (
        <ConfirmModal
          title="Delete Category"
          message="Deleting a category will not delete its cartoons, but they will lose this category association."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
