'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteAssassinationPdf } from '@/lib/actions/assassination-pdf-actions';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { StatusBadge } from '@/components/admin/StatusBadge';

interface PdfRow {
  id: string;
  title_ar: string;
  title_en: string | null;
  thumbnail_url: string | null;
  pdf_url: string;
  display_order: number;
  is_published: boolean;
}

export default function AssassinationPdfsListClient({ pdfs }: { pdfs: PdfRow[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await deleteAssassinationPdf(deleteId);
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
              <th className="text-start p-3">Thumbnail</th>
              <th className="text-start p-3">Title</th>
              <th className="text-start p-3">Order</th>
              <th className="text-start p-3">Status</th>
              <th className="p-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pdfs.map(p => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-[#222]">
                <td className="p-3">
                  {p.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.thumbnail_url}
                      alt={p.title_ar}
                      className="h-12 w-9 object-cover rounded bg-[#111]"
                    />
                  ) : (
                    <div className="h-12 w-9 rounded bg-[#111] flex items-center justify-center">
                      <span className="text-text-muted text-xs">PDF</span>
                    </div>
                  )}
                </td>
                <td className="p-3 text-white" dir="rtl">{p.title_ar}</td>
                <td className="p-3 text-text-muted">{p.display_order}</td>
                <td className="p-3">
                  <StatusBadge status={p.is_published ? 'published' : 'draft'} />
                </td>
                <td className="p-3 text-end">
                  <div className="flex gap-3 justify-end">
                    <a
                      href={p.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted text-xs hover:underline"
                    >
                      Open
                    </a>
                    <Link
                      href={`/admin/assassination-pdfs/${p.id}/edit`}
                      className="text-accent text-xs hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="text-red-400 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pdfs.length === 0 && (
          <p className="text-center text-text-muted py-8">No PDFs yet</p>
        )}
      </div>

      {deleteId && (
        <ConfirmModal
          title="Delete PDF"
          message="Are you sure you want to delete this PDF? This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
