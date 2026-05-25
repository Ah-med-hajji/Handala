'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCartoon, updateCartoon } from '@/lib/actions/cartoon-actions';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { TagInput } from '@/components/admin/TagInput';
import type { Tag } from '@/types';

interface Category {
  id: string;
  name_ar: string;
  name_en: string;
}

interface CartoonFormProps {
  cartoon?: any;
  categories: Category[];
  tags: Tag[];
  selectedCategoryIds?: string[];
  selectedTagIds?: string[];
}

export default function CartoonFormClient({
  cartoon,
  categories,
  tags,
  selectedCategoryIds = [],
  selectedTagIds = [],
}: CartoonFormProps) {
  const router = useRouter();
  const isEdit = !!cartoon;

  const [form, setForm] = useState({
    title_ar: cartoon?.title_ar || '',
    title_en: cartoon?.title_en || '',
    description_ar: cartoon?.description_ar || '',
    description_en: cartoon?.description_en || '',
    image_url: cartoon?.image_url || '',
    image_high_res_url: cartoon?.image_high_res_url || '',
    publication_date: cartoon?.publication_date || '',
    source: cartoon?.source || '',
    is_published: cartoon?.is_published ?? true,
  });
  const [categoryIds, setCategoryIds] = useState<string[]>(selectedCategoryIds);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    tags.filter(t => selectedTagIds.includes(t.id))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) { setError('Image is required'); return; }
    setSaving(true);
    setError('');

    const input = {
      ...form,
      category_ids: categoryIds,
      tag_ids: selectedTags.map(t => t.id),
    };

    const result = isEdit
      ? await updateCartoon(cartoon.id, input)
      : await createCartoon(input);

    if (result.success) {
      router.push('/admin/cartoons');
    } else {
      setError(result.error || 'Failed to save');
      setSaving(false);
    }
  };

  const toggleCategory = (id: string) => {
    setCategoryIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Cartoon' : 'New Cartoon'}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
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
          <label className="block text-sm text-text-muted mb-1">Arabic Description</label>
          <textarea
            value={form.description_ar}
            onChange={e => setForm(f => ({ ...f, description_ar: e.target.value }))}
            rows={4}
            className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none"
            dir="rtl"
          />
        </div>
        <div>
          <label className="block text-sm text-text-muted mb-1">English Description</label>
          <textarea
            value={form.description_en}
            onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))}
            rows={4}
            className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none"
          />
        </div>

        <ImageUpload
          bucket="cartoons"
          label="Cartoon Image *"
          currentUrl={form.image_url}
          onUpload={url => setForm(f => ({ ...f, image_url: url }))}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">Publication Date</label>
            <input
              type="date"
              value={form.publication_date}
              onChange={e => setForm(f => ({ ...f, publication_date: e.target.value }))}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">Source</label>
            <input
              value={form.source}
              onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              placeholder="e.g. السفير"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-2">Categories</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-card border border-border rounded p-3 max-h-48 overflow-auto">
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={categoryIds.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="accent-accent"
                />
                <span className="text-sm text-white" dir="rtl">{cat.name_ar}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-2">Tags</label>
          <TagInput
            selectedTags={selectedTags}
            availableTags={tags}
            onChange={setSelectedTags}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
            className="accent-accent"
          />
          <span className="text-sm text-white">Published</span>
        </label>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-accent text-black px-6 py-2 rounded font-semibold hover:bg-accent/90 disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Cartoon'}
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
