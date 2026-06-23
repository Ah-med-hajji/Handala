'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCategory } from '@/lib/actions/category-actions';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { Category } from '@/types';

export default function EditCategoryClient({ category }: { category: Category }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name_ar: category.name_ar,
    name_en: category.name_en,
    name_fr: category.name_fr || '',
    name_es: category.name_es || '',
    slug: category.slug,
    description_ar: category.description_ar || '',
    description_en: category.description_en || '',
    description_fr: category.description_fr || '',
    description_es: category.description_es || '',
    cover_image_url: category.cover_image_url || '',
    display_order: category.display_order,
    is_published: category.is_published,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const result = await updateCategory(category.id, form);
    if (result.success) {
      router.push('/admin/categories');
    } else {
      setError(result.error || 'Failed to save');
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">Arabic Name *</label>
            <input value={form.name_ar} onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))} className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" dir="rtl" required />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">English Name *</label>
            <input value={form.name_en} onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))} className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" required />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">French Name</label>
            <input value={form.name_fr} onChange={e => setForm(f => ({ ...f, name_fr: e.target.value }))} className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">Spanish Name</label>
            <input value={form.name_es} onChange={e => setForm(f => ({ ...f, name_es: e.target.value }))} className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-text-muted mb-1">Slug</label>
          <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-accent" required />
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
        <ImageUpload bucket="categories" label="Cover Image" currentUrl={form.cover_image_url} onUpload={url => setForm(f => ({ ...f, cover_image_url: url }))} />
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
          <button type="submit" disabled={saving} className="bg-accent text-black px-6 py-2 rounded font-semibold hover:bg-accent/90 disabled:opacity-50 text-sm">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 rounded border border-border text-text-muted hover:text-white hover:border-white text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
