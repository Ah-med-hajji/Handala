import { getPublishedSupporters } from '@/lib/content';
import { getTranslations } from 'next-intl/server';
import { pickLocaleField } from '@/lib/i18n-utils';
import type { Supporter } from '@/types';

export default async function SupportersPage({ params: { locale } }: { params: { locale: string } }) {
  const supporters = await getPublishedSupporters();
  const t = await getTranslations({ locale });

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{t('supporters.title')}</h1>
        <p className="text-text-muted mb-10">{t('supporters.thanks')}</p>

        {supporters.length === 0 ? (
          <p className="text-text-muted">{t('common.contentComingSoon')}</p>
        ) : (
          <div className="space-y-6">
            {supporters.map((s: Supporter) => {
              const name = pickLocaleField(s, 'name', locale);
              const desc = pickLocaleField(s, 'description', locale);
              return (
                <div key={s.id} className="bg-card border border-border rounded-lg p-5">
                  <div className="flex items-center justify-between">
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent font-semibold hover:underline text-lg"
                      >
                        {name}
                      </a>
                    ) : (
                      <p className="font-semibold text-white text-lg">{name}</p>
                    )}
                  </div>
                  {desc && (
                    <p className="text-text-muted text-sm mt-2 leading-relaxed text-justify">{desc}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
