import { getSiteContent } from '@/lib/content';
import { getTranslations } from 'next-intl/server';
import { pickLocaleField } from '@/lib/i18n-utils';

export default async function AboutSitePage({ params: { locale } }: { params: { locale: string } }) {
  const content = await getSiteContent('about_site');
  const t = await getTranslations({ locale });

  const title = pickLocaleField(content, 'title', locale) || t('aboutSite.title');
  const body = pickLocaleField(content, 'content', locale);
  const paragraphs = body.split('\n\n').filter(Boolean);

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-text-primary leading-relaxed text-lg text-justify">
              {p}
            </p>
          ))}
          {paragraphs.length === 0 && (
            <p className="text-text-muted">{t('common.contentComingSoon')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
