'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  updateSiteContent,
  createSiteContent,
  deleteSiteContent,
} from '@/lib/actions/content-actions';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import type { SiteContent } from '@/types';

const CONTENT_LABELS: Record<string, string> = {
  about_naji: 'About Naji Al-Ali',
  about_site: 'About the Site',
  about_assassination: 'About the Assassination',
};

const HARDCODED_KEYS = new Set(['about_naji', 'about_site', 'about_assassination']);

type FormState = {
  key: string;
  title_ar: string;
  title_en: string;
  title_fr: string;
  title_es: string;
  content_ar: string;
  content_en: string;
  content_fr: string;
  content_es: string;
};

const emptyForm: FormState = {
  key: '',
  title_ar: '',
  title_en: '',
  title_fr: '',
  title_es: '',
  content_ar: '',
  content_en: '',
  content_fr: '',
  content_es: '',
};

export default function ContentClient({ contents }: { contents: SiteContent[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<'list' | 'edit' | 'create'>('list');
  const [editing, setEditing] = useState<SiteContent | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openEdit = (c: SiteContent) => {
    setEditing(c);
    setForm({
      key: c.key,
      title_ar: c.title_ar,
      title_en: c.title_en || '',
      title_fr: c.title_fr || '',
      title_es: c.title_es || '',
      content_ar: c.content_ar,
      content_en: c.content_en || '',
      content_fr: c.content_fr || '',
      content_es: c.content_es || '',
    });
    setMessage('');
    setMode('edit');
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setMessage('');
    setMode('create');
  };

  const cancel = () => {
    setEditing(null);
    setMessage('');
    setMode('list');
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    let result;
    if (mode === 'edit' && editing) {
      const { ...payload } = form;
      result = await updateSiteContent(editing.key, {
        title_ar: payload.title_ar,
        title_en: payload.title_en,
        title_fr: payload.title_fr,
        title_es: payload.title_es,
        content_ar: payload.content_ar,
        content_en: payload.content_en,
        content_fr: payload.content_fr,
        content_es: payload.content_es,
      });
    } else {
      result = await createSiteContent(form);
    }
    setSaving(false);
    if (result.success) {
      setMessage('Saved successfully!');
      setTimeout(() => {
        cancel();
        router.refresh();
      }, 800);
    } else {
      setMessage(result.error || 'Error saving content');
    }
  };

  const onDelete = async () => {
    if (!deleteKey) return;
    setDeleting(true);
    const result = await deleteSiteContent(deleteKey);
    setDeleting(false);
    setDeleteKey(null);
    if (result.success) router.refresh();
    else setMessage(result.error || 'Failed to delete');
  };

  if (mode !== 'list') {
    return (
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={cancel}
            className="text-text-muted hover:text-white text-sm"
          >
            ← Back
          </button>
          <h2 className="text-xl font-bold">
            {mode === 'edit'
              ? CONTENT_LABELS[editing!.key] || editing!.key
              : 'New Page'}
          </h2>
        </div>

        <form onSubmit={save} className="space-y-5">
          {mode === 'create' && (
            <div>
              <label className="block text-sm text-text-muted mb-1">
                Page Key (unique identifier) *
              </label>
              <input
                value={form.key}
                onChange={e =>
                  setForm(f => ({
                    ...f,
                    key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
                  }))
                }
                className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-accent"
                placeholder="e.g. team_bio"
                required
                pattern="[a-z0-9_]{2,64}"
                title="2–64 chars: lowercase letters, numbers, underscores"
              />
              <p className="text-xs text-text-muted mt-1">
                Used in the URL: <code className="text-accent">/{`{locale}`}/content/{form.key || '<key>'}</code>
              </p>
            </div>
          )}

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

          <div>
            <label className="block text-sm text-text-muted mb-1">Arabic Content *</label>
            <p className="text-xs text-text-muted mb-2">Separate paragraphs with a blank line.</p>
            <textarea
              value={form.content_ar}
              onChange={e => setForm(f => ({ ...f, content_ar: e.target.value }))}
              rows={10}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-y"
              dir="rtl"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1">English Content</label>
            <p className="text-xs text-text-muted mb-2">Separate paragraphs with a blank line.</p>
            <textarea
              value={form.content_en}
              onChange={e => setForm(f => ({ ...f, content_en: e.target.value }))}
              rows={10}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-y"
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1">French Content</label>
            <p className="text-xs text-text-muted mb-2">Separate paragraphs with a blank line.</p>
            <textarea
              value={form.content_fr}
              onChange={e => setForm(f => ({ ...f, content_fr: e.target.value }))}
              rows={10}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-y"
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1">Spanish Content</label>
            <p className="text-xs text-text-muted mb-2">Separate paragraphs with a blank line.</p>
            <textarea
              value={form.content_es}
              onChange={e => setForm(f => ({ ...f, content_es: e.target.value }))}
              rows={10}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-y"
            />
          </div>

          {message && (
            <p className={`text-sm ${message === 'Saved successfully!' ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-black px-6 py-2 rounded font-semibold hover:bg-accent/90 disabled:opacity-50 text-sm"
            >
              {saving ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Page'}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="px-6 py-2 rounded border border-border text-text-muted hover:text-white text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <p className="text-text-muted text-sm max-w-2xl">
          Page content shown on the public site. Custom pages also appear in the navbar &ldquo;Content&rdquo; dropdown.
        </p>
        <button
          onClick={openCreate}
          className="bg-accent text-black px-4 py-2 rounded text-sm font-semibold hover:bg-accent/90 whitespace-nowrap shrink-0"
        >
          + Add Page
        </button>
      </div>

      {message && !mode.startsWith('list') ? null : message ? (
        <p className="text-red-400 text-sm mb-3">{message}</p>
      ) : null}

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {contents.map((c, i) => {
          const isHardcoded = HARDCODED_KEYS.has(c.key);
          return (
            <div
              key={c.id}
              className={`flex items-center justify-between p-4 ${
                i < contents.length - 1 ? 'border-b border-border/50' : ''
              }`}
            >
              <div className="min-w-0">
                <p className="text-white font-medium">
                  {CONTENT_LABELS[c.key] || c.title_en || c.title_ar || c.key}
                </p>
                <p className="text-text-muted text-xs font-mono mt-0.5">{c.key}</p>
                <p className="text-text-muted text-xs mt-1">
                  Last updated: {new Date(c.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3 shrink-0 ms-4">
                <button onClick={() => openEdit(c)} className="text-accent text-sm hover:underline">
                  Edit
                </button>
                {!isHardcoded && (
                  <button
                    onClick={() => setDeleteKey(c.key)}
                    className="text-red-400 text-sm hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {contents.length === 0 && (
          <p className="text-center text-text-muted py-8 text-sm">
            No content entries yet. Click &ldquo;Add Page&rdquo; to create one.
          </p>
        )}
      </div>

      {deleteKey && (
        <ConfirmModal
          title="Delete Page"
          message={`Delete the page "${deleteKey}"? This cannot be undone.`}
          onConfirm={onDelete}
          onCancel={() => setDeleteKey(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
