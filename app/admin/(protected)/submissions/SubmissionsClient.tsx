'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { updateSubmission } from '@/lib/actions/submission-actions';
import type { Submission, SubmissionStatus } from '@/types';

export default function SubmissionsClient({
  submissions,
  currentFilter,
}: {
  submissions: Submission[];
  currentFilter: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Submission | null>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<SubmissionStatus>('pending');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const openDetail = (sub: Submission) => {
    setSelected(sub);
    setNotes(sub.admin_notes || '');
    setStatus(sub.status);
  };

  const setFilter = (f: string) => {
    router.push(`/admin/submissions${f !== 'all' ? `?status=${f}` : ''}`);
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    const result = await updateSubmission(selected.id, { status, admin_notes: notes });
    if (result.success) {
      setMessage('Saved!');
      setTimeout(() => { setMessage(''); setSelected(null); router.refresh(); }, 800);
    }
    setSaving(false);
  };

  const filters = ['all', 'pending', 'reviewed', 'rejected'];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Submissions</h1>

      <div className="flex gap-2 mb-6">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-sm rounded capitalize ${
              currentFilter === f
                ? 'bg-accent text-black'
                : 'bg-card border border-border text-text-muted hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {submissions.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-8 text-center text-text-muted">
          No submissions found
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-text-muted">
                <th className="text-start p-3">Name</th>
                <th className="text-start p-3">Email</th>
                <th className="text-start p-3">Submitted</th>
                <th className="text-start p-3">Image</th>
                <th className="text-start p-3">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => (
                <tr key={sub.id} className="border-b border-border/50 hover:bg-[#222]">
                  <td className="p-3 text-white">{sub.sender_name}</td>
                  <td className="p-3 text-text-muted">{sub.sender_email}</td>
                  <td className="p-3 text-text-muted">{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-text-muted">{sub.image_url ? '✓' : '–'}</td>
                  <td className="p-3"><StatusBadge status={sub.status} /></td>
                  <td className="p-3">
                    <button onClick={() => openDetail(sub)} className="text-accent text-xs hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-border rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-bold text-white">Submission Detail</h2>
              <button onClick={() => setSelected(null)} className="text-text-muted hover:text-white text-xl leading-none">×</button>
            </div>
            <dl className="space-y-3 text-sm mb-4">
              <div><dt className="text-text-muted text-xs">Name</dt><dd className="text-white">{selected.sender_name}</dd></div>
              <div><dt className="text-text-muted text-xs">Email</dt><dd className="text-white">{selected.sender_email}</dd></div>
              {selected.message && <div><dt className="text-text-muted text-xs">Message</dt><dd className="text-white whitespace-pre-wrap">{selected.message}</dd></div>}
              {selected.image_url && (
                <div>
                  <dt className="text-text-muted text-xs mb-1">Image</dt>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.image_url} alt="Submission" className="max-h-48 rounded" />
                </div>
              )}
            </dl>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-muted mb-1">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as SubmissionStatus)}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Admin Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>
              {message && <p className="text-green-400 text-sm">{message}</p>}
              <button
                onClick={save}
                disabled={saving}
                className="w-full bg-accent text-black font-semibold py-2 rounded hover:bg-accent/90 disabled:opacity-50 text-sm"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
