import { notFound } from 'next/navigation';
import { getSiteContent } from '@/lib/content';
import { pickLocaleField } from '@/lib/i18n-utils';

// Renders any admin-created site_content row. The 3 hardcoded pages
// (about_naji, about_site, about_assassination) have their own routes and
// don't go through this dynamic route — but it would also work for them.
export default async function CustomContentPage({
  params: { locale, key },
}: {
  params: { locale: string; key: string };
}) {
  const content = await getSiteContent(key);
  if (!content) return notFound();

  const title = pickLocaleField(content, 'title', locale) || key;
  const body = pickLocaleField(content, 'content', locale);
  const paragraphs = body.split('\n\n').filter(Boolean);

  return (
    <div className="min-h-screen px-4 py-12">
      <article className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-text-primary leading-relaxed text-lg text-justify"
            >
              {p}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
