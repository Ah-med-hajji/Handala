import { getAllSupporters } from '@/lib/content';
import SupportersClient from './SupportersClient';

export default async function AdminSupportersPage() {
  const supporters = await getAllSupporters();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Supporters</h1>
      <p className="text-text-muted text-sm mb-6">Manage the list of supporters displayed on the public supporters page.</p>
      <SupportersClient supporters={supporters} />
    </div>
  );
}
