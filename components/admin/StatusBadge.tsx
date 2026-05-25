type Status = 'published' | 'draft' | 'pending' | 'reviewed' | 'rejected';

const styles: Record<Status, string> = {
  published: 'bg-green-900/50 text-green-400 border-green-800',
  draft: 'bg-gray-800 text-gray-400 border-gray-700',
  pending: 'bg-yellow-900/50 text-yellow-400 border-yellow-800',
  reviewed: 'bg-blue-900/50 text-blue-400 border-blue-800',
  rejected: 'bg-red-900/50 text-red-400 border-red-800',
};

const labels: Record<Status, string> = {
  published: 'Published',
  draft: 'Draft',
  pending: 'Pending',
  reviewed: 'Reviewed',
  rejected: 'Rejected',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
