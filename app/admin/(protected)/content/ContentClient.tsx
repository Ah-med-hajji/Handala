'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSiteContent } from '@/lib/actions/content-actions';
import type { SiteContent } from '@/types';

const CONTENT_LABELS: Record<string, string> = {
  about_naji: 'About Naji Al-Ali',
  about_site: 'About the Site',
};

export default function ContentClient({ contents }: { contents: SiteContent[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<SiteContent | null>(null);
  const [form, setForm] = useState({ title_ar: '', title_en: '', content_ar: '', content_en: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const openEdit = (c: SiteContent) => {
    setEditing(c);
    setForm({
      title_ar: c.title_ar,
      title_en: c.title_en || '',
      content_ar: c.content_ar,
      content_en: c.content_en || '',
    });
    setMessage('');
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const result = await updateSiteContent(editing.key, form);
    setSaving(false);
    if (result.success) {
      setMessage('Saved successfully!');
      setTimeout(() => { setMessage(''); setEditing(null); router.refresh(); }, 1000);
    } else {
      setMessage('Error saving content');
    }
  };

  if (editing) {
    return (
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setEditing(null)}
            className="text-text-muted hover:text-white text-sm"
          >
            ← Back
          </button>
          <h2 className="text-xl font-bold">{CONTENT_LABELS[editing.key] || editing.key}</h2>
        </div>

        <form onSubmit={save} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Arabic Title</label>
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
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1">Arabic Content</label>
            <p className="text-xs text-text-muted mb-2">Separate paragraphs with a blank line.</p>
            <textarea
              value={form.content_ar}
              onChange={e => setForm(f => ({ ...f, content_ar: e.target.value }))}
              rows={12}
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
              rows={12}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-y"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {message}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-black px-6 py-2 rounded font-semibold hover:bg-accent/90 disabled:opacity-50 text-sm"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
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
    <div className="bg-card rounded-lg border border-border overflow-hidden max-w-2xl">
      {contents.map((c, i) => (
        <div
          key={c.id}
          className={`flex items-center justify-between p-4 ${i < contents.length - 1 ? 'border-b border-border/50' : ''}`}
        >
          <div>
            <p className="text-white font-medium">{CONTENT_LABELS[c.key] || c.key}</p>
            <p className="text-text-muted text-xs mt-1">
              Last updated: {new Date(c.updated_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => openEdit(c)}
            className="text-accent text-sm hover:underline"
          >
            Edit
          </button>
        </div>
      ))}
      {contents.length === 0 && (
        <p className="text-center text-text-muted py-8 text-sm">
          No content entries found. They will be created automatically when you save.
        </p>
      )}
    </div>
  );
}
