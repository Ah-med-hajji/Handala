'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteVideo } from '@/lib/actions/video-actions';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { StatusBadge } from '@/components/admin/StatusBadge';

interface VideoRow {
  id: string;
  title_ar: string;
  title_en: string | null;
  youtube_id: string;
  display_order: number;
  is_published: boolean;
}

export default function VideosListClient({ videos }: { videos: VideoRow[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await deleteVideo(deleteId);
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
            {videos.map(v => (
              <tr key={v.id} className="border-b border-border/50 hover:bg-[#222]">
                <td className="p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
                    alt={v.title_ar}
                    className="h-10 w-16 object-cover rounded"
                  />
                </td>
                <td className="p-3 text-white" dir="rtl">{v.title_ar}</td>
                <td className="p-3 text-text-muted">{v.display_order}</td>
                <td className="p-3">
                  <StatusBadge status={v.is_published ? 'published' : 'draft'} />
                </td>
                <td className="p-3 text-end">
                  <div className="flex gap-3 justify-end">
                    <Link href={`/admin/videos/${v.id}/edit`} className="text-accent text-xs hover:underline">Edit</Link>
                    <button onClick={() => setDeleteId(v.id)} className="text-red-400 text-xs hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {videos.length === 0 && (
          <p className="text-center text-text-muted py-8">No videos yet</p>
        )}
      </div>

      {deleteId && (
        <ConfirmModal
          title="Delete Video"
          message="Are you sure you want to delete this video?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
