'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateVideo } from '@/lib/actions/video-actions';
import type { Video } from '@/types';

export default function EditVideoClient({ video }: { video: Video }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title_ar: video.title_ar,
    title_en: video.title_en || '',
    title_fr: video.title_fr || '',
    title_es: video.title_es || '',
    description_ar: video.description_ar || '',
    description_en: video.description_en || '',
    description_fr: video.description_fr || '',
    description_es: video.description_es || '',
    youtube_url: video.youtube_url,
    display_order: video.display_order,
    is_published: video.is_published,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const result = await updateVideo(video.id, form);
    if (result.success) {
      router.push('/admin/videos');
    } else {
      setError(result.error || 'Failed to save');
      setSaving(false);
    }
  };

  const previewId = form.youtube_url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&]+)/)?.[1];

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-text-muted mb-1">YouTube URL *</label>
          <input value={form.youtube_url} onChange={e => setForm(f => ({ ...f, youtube_url: e.target.value }))} className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" required />
          {previewId && (
            <div className="mt-2 max-w-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://img.youtube.com/vi/${previewId}/maxresdefault.jpg`} alt="Preview" className="w-full rounded" />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">Arabic Title *</label>
            <input value={form.title_ar} onChange={e => setForm(f => ({ ...f, title_ar: e.target.value }))} className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" dir="rtl" required />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">English Title</label>
            <input value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">French Title</label>
            <input value={form.title_fr} onChange={e => setForm(f => ({ ...f, title_fr: e.target.value }))} className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">Spanish Title</label>
            <input value={form.title_es} onChange={e => setForm(f => ({ ...f, title_es: e.target.value }))} className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">Arabic Description</label>
            <textarea value={form.description_ar} onChange={e => setForm(f => ({ ...f, description_ar: e.target.value }))} rows={3} className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none" dir="rtl" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">English Description</label>
            <textarea value={form.description_en} onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))} rows={3} className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">French Description</label>
            <textarea value={form.description_fr} onChange={e => setForm(f => ({ ...f, description_fr: e.target.value }))} rows={3} className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">Spanish Description</label>
            <textarea value={form.description_es} onChange={e => setForm(f => ({ ...f, description_es: e.target.value }))} rows={3} className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">Display Order</label>
            <input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} className="w-24 bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
          </div>
          <label className="flex items-center gap-2 mt-5 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} className="accent-accent" />
            <span className="text-sm text-white">Published</span>
          </label>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-accent text-black px-6 py-2 rounded font-semibold hover:bg-accent/90 disabled:opacity-50 text-sm">{saving ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 rounded border border-border text-text-muted hover:text-white hover:border-white text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
