import { getAllSiteContent } from '@/lib/content';
import ContentClient from './ContentClient';

export default async function AdminContentPage() {
  const contents = await getAllSiteContent();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Page Content</h1>
      <p className="text-text-muted text-sm mb-6">Edit the text content for About Naji, About Site, and other static pages.</p>
      <ContentClient contents={contents} />
    </div>
  );
}
