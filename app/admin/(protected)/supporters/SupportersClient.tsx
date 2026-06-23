'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupporter, updateSupporter, deleteSupporter } from '@/lib/actions/supporter-actions';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import type { Supporter } from '@/types';

type SupporterForm = {
  name_ar: string;
  name_en: string;
  name_fr: string;
  name_es: string;
  url: string;
  description_ar: string;
  description_en: string;
  description_fr: string;
  description_es: string;
  display_order: number;
  is_published: boolean;
};

const emptyForm: SupporterForm = {
  name_ar: '',
  name_en: '',
  name_fr: '',
  name_es: '',
  url: '',
  description_ar: '',
  description_en: '',
  description_fr: '',
  description_es: '',
  display_order: 0,
  is_published: true,
};

export default function SupportersClient({ supporters }: { supporters: Supporter[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Supporter | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<SupporterForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');

  const openCreate = () => {
    setForm({ ...emptyForm, display_order: supporters.length + 1 });
    setCreating(true);
    setEditing(null);
    setMessage('');
  };

  const openEdit = (s: Supporter) => {
    setForm({
      name_ar: s.name_ar,
      name_en: s.name_en || '',
      name_fr: s.name_fr || '',
      name_es: s.name_es || '',
      url: s.url || '',
      description_ar: s.description_ar || '',
      description_en: s.description_en || '',
      description_fr: s.description_fr || '',
      description_es: s.description_es || '',
      display_order: s.display_order,
      is_published: s.is_published,
    });
    setEditing(s);
    setCreating(false);
    setMessage('');
  };

  const closeForm = () => {
    setEditing(null);
    setCreating(false);
    setMessage('');
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const result = editing
      ? await updateSupporter(editing.id, form)
      : await createSupporter(form);
    setSaving(false);
    if (result.success) {
      setMessage('Saved!');
      setTimeout(() => { closeForm(); router.refresh(); }, 600);
    } else {
      setMessage((result as any).error || 'Failed to save');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await deleteSupporter(deleteId);
    setDeleteId(null);
    setDeleting(false);
    router.refresh();
  };

  const isFormOpen = creating || !!editing;

  return (
    <div className="max-w-3xl">
      {!isFormOpen && (
        <button
          onClick={openCreate}
          className="mb-5 bg-accent text-black px-4 py-2 rounded text-sm font-semibold hover:bg-accent/90"
        >
          + Add Supporter
        </button>
      )}

      {isFormOpen && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="font-bold text-white mb-4">{editing ? 'Edit Supporter' : 'New Supporter'}</h2>
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">Arabic Name *</label>
                <input
                  value={form.name_ar}
                  onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                  dir="rtl"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">English Name</label>
                <input
                  value={form.name_en}
                  onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">French Name</label>
                <input
                  value={form.name_fr}
                  onChange={e => setForm(f => ({ ...f, name_fr: e.target.value }))}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Spanish Name</label>
                <input
                  value={form.name_es}
                  onChange={e => setForm(f => ({ ...f, name_es: e.target.value }))}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-1">Website URL</label>
              <input
                type="url"
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">Arabic Description</label>
                <textarea
                  value={form.description_ar}
                  onChange={e => setForm(f => ({ ...f, description_ar: e.target.value }))}
                  rows={2}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">English Description</label>
                <textarea
                  value={form.description_en}
                  onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))}
                  rows={2}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">French Description</label>
                <textarea
                  value={form.description_fr}
                  onChange={e => setForm(f => ({ ...f, description_fr: e.target.value }))}
                  rows={2}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Spanish Description</label>
                <textarea
                  value={form.description_es}
                  onChange={e => setForm(f => ({ ...f, description_es: e.target.value }))}
                  rows={2}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <label className="block text-sm text-text-muted mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                  className="w-20 bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-5">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                  className="accent-accent"
                />
                <span className="text-sm text-white">Published</span>
              </label>
            </div>

            {message && (
              <p className={`text-sm ${message === 'Saved!' ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-accent text-black px-5 py-2 rounded font-semibold text-sm hover:bg-accent/90 disabled:opacity-50"
              >
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Supporter'}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2 rounded border border-border text-text-muted hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {supporters.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-8 text-center text-text-muted">
          No supporters yet. Add the first one.
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {supporters.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-start justify-between p-4 ${i < supporters.length - 1 ? 'border-b border-border/50' : ''} hover:bg-[#222]`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium" dir="rtl">{s.name_ar}</p>
                  {s.name_en && <p className="text-text-muted text-sm">/ {s.name_en}</p>}
                  {!s.is_published && (
                    <span className="text-xs bg-border text-text-muted px-2 py-0.5 rounded">Draft</span>
                  )}
                </div>
                {s.description_ar && (
                  <p className="text-text-muted text-sm mt-1 line-clamp-1" dir="rtl">{s.description_ar}</p>
                )}
                {s.url && (
                  <p className="text-accent text-xs mt-1">{s.url}</p>
                )}
              </div>
              <div className="flex gap-3 ms-4 shrink-0">
                <button onClick={() => openEdit(s)} className="text-accent text-xs hover:underline">Edit</button>
                <button onClick={() => setDeleteId(s.id)} className="text-red-400 text-xs hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete Supporter"
          message="Are you sure you want to remove this supporter?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
