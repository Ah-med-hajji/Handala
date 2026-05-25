import { getSiteContent } from '@/lib/content';

export default async function AboutNajiPage({ params: { locale } }: { params: { locale: string } }) {
  const content = await getSiteContent('about_naji');
  const isAr = locale === 'ar';

  const title = isAr ? (content?.title_ar || 'عن ناجي العلي') : (content?.title_en || 'About Naji Al-Ali');
  const body = isAr ? (content?.content_ar || '') : (content?.content_en || content?.content_ar || '');
  const paragraphs = body.split('\n\n').filter(Boolean);

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-text-primary leading-relaxed text-lg">
              {p}
            </p>
          ))}
          {paragraphs.length === 0 && (
            <p className="text-text-muted">Content coming soon.</p>
          )}
        </div>
      </div>
    </div>
  );
}
