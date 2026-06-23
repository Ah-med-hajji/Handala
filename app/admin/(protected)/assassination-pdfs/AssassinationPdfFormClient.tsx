'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createAssassinationPdf,
  updateAssassinationPdf,
} from '@/lib/actions/assassination-pdf-actions';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { PdfUpload } from '@/components/admin/PdfUpload';
import type { AssassinationPdf } from '@/types';

interface AssassinationPdfFormProps {
  pdf?: AssassinationPdf;
}

export default function AssassinationPdfFormClient({ pdf }: AssassinationPdfFormProps) {
  const router = useRouter();
  const isEdit = !!pdf;

  const [form, setForm] = useState({
    title_ar: pdf?.title_ar || '',
    title_en: pdf?.title_en || '',
    title_fr: pdf?.title_fr || '',
    title_es: pdf?.title_es || '',
    description_ar: pdf?.description_ar || '',
    description_en: pdf?.description_en || '',
    description_fr: pdf?.description_fr || '',
    description_es: pdf?.description_es || '',
    pdf_url: pdf?.pdf_url || '',
    thumbnail_url: pdf?.thumbnail_url || '',
    display_order: pdf?.display_order ?? 0,
    is_published: pdf?.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pdf_url) {
      setError('PDF file is required');
      return;
    }
    setSaving(true);
    setError('');

    const result = isEdit
      ? await updateAssassinationPdf(pdf!.id, form)
      : await createAssassinationPdf(form);

    if (result.success) {
      router.push('/admin/assassination-pdfs');
    } else {
      setError(result.error || 'Failed to save');
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit PDF' : 'New PDF'}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">Arabic Title *</label>
            <input
              value={form.title_ar}
              onChange={e => setForm(f => ({ ...f, title_ar: e.target.value }))}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              dir="rtl"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">English Title</label>
            <input
              value={form.title_en}
              onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">French Title</label>
            <input
              value={form.title_fr}
              onChange={e => setForm(f => ({ ...f, title_fr: e.target.value }))}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">Spanish Title</label>
            <input
              value={form.title_es}
              onChange={e => setForm(f => ({ ...f, title_es: e.target.value }))}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">Arabic Description</label>
            <textarea
              value={form.description_ar}
              onChange={e => setForm(f => ({ ...f, description_ar: e.target.value }))}
              rows={3}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">English Description</label>
            <textarea
              value={form.description_en}
              onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))}
              rows={3}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">French Description</label>
            <textarea
              value={form.description_fr}
              onChange={e => setForm(f => ({ ...f, description_fr: e.target.value }))}
              rows={3}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">Spanish Description</label>
            <textarea
              value={form.description_es}
              onChange={e => setForm(f => ({ ...f, description_es: e.target.value }))}
              rows={3}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none"
            />
          </div>
        </div>

        <PdfUpload
          bucket="assassination-pdfs"
          label="PDF File *"
          currentUrl={form.pdf_url}
          onUpload={url => setForm(f => ({ ...f, pdf_url: url }))}
        />

        <ImageUpload
          bucket="assassination-thumbnails"
          label="Thumbnail (cover image shown in the catalogue)"
          currentUrl={form.thumbnail_url}
          onUpload={url => setForm(f => ({ ...f, thumbnail_url: url }))}
        />

        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">Display Order</label>
            <input
              type="number"
              value={form.display_order}
              onChange={e =>
                setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))
              }
              className="w-24 bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
            />
          </div>
          <label className="flex items-center gap-2 mt-5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
              className="accent-accent"
            />
            <span className="text-sm text-white">Published</span>
          </label>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-accent text-black px-6 py-2 rounded font-semibold hover:bg-accent/90 disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create PDF'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded border border-border text-text-muted hover:text-white hover:border-white text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
