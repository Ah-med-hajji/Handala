import { notFound } from 'next/navigation';
import { getCartoonById, getRelatedCartoons } from '@/lib/data';
import { getTranslations } from 'next-intl/server';
import { pickLocaleField } from '@/lib/i18n-utils';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  const cartoon = await getCartoonById(params.id);
  if (!cartoon) return {};
  const title = pickLocaleField(cartoon, 'title', params.locale);
  const description = pickLocaleField(cartoon, 'description', params.locale);
  return {
    title: `${title} | ناجي العلي`,
    description: description?.slice(0, 160) || undefined,
    openGraph: { images: [cartoon.image_url] },
  };
}

export default async function CartoonPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const cartoon = await getCartoonById(id);
  if (!cartoon) notFound();

  const related = await getRelatedCartoons(
    id,
    cartoon.categories.map(c => c.id),
    cartoon.tags.map(t => t.id)
  );

  const t = await getTranslations({ locale });
  const isRTL = locale === 'ar';
  const title = pickLocaleField(cartoon, 'title', locale);
  const description = pickLocaleField(cartoon, 'description', locale);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-sm text-text-muted">
          <a href={`/${locale}`} className="hover:text-accent">
            {t('nav.home')}
          </a>
          <span className="mx-2">{isRTL ? '←' : '→'}</span>
          <span>{title}</span>
        </div>
        <div className="relative bg-card rounded-lg overflow-hidden mb-6 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cartoon.image_url} alt={title} className="w-full" />
          <a
            href={cartoon.image_high_res_url || cartoon.image_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('cartoon.viewFullSizeAria')}
            title={t('cartoon.viewFullSize')}
            className="absolute top-3 end-3 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-sm opacity-80 md:opacity-0 md:group-hover:opacity-100 hover:bg-black/80 hover:border-accent hover:text-accent transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </a>
        </div>
        <div className="bg-card rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          {cartoon.publication_date && (
            <p className="text-text-muted text-sm mb-2">
              {t('cartoon.publishedOn')}: {cartoon.publication_date}
            </p>
          )}
          {cartoon.source && (
            <p className="text-text-muted text-sm mb-4">
              {t('cartoon.source')}: {cartoon.source}
            </p>
          )}
          {cartoon.categories.length > 0 && (
            <div className="mb-4">
              <p className="text-text-muted text-sm mb-2">{t('cartoon.categories')}:</p>
              <div className="flex flex-wrap gap-2">
                {cartoon.categories.map(cat => (
                  <a
                    key={cat.id}
                    href={`/${locale}/categories/${cat.slug}`}
                    className="text-xs bg-card border border-border px-2 py-1 rounded hover:border-accent text-text-muted hover:text-accent transition-colors"
                  >
                    {pickLocaleField(cat, 'name', locale)}
                  </a>
                ))}
              </div>
            </div>
          )}
          {cartoon.tags.length > 0 && (
            <div className="mb-4">
              <p className="text-text-muted text-sm mb-2">{t('cartoon.tags')}:</p>
              <div className="flex flex-wrap gap-2">
                {cartoon.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="text-xs bg-card border border-border px-2 py-1 rounded text-text-muted"
                  >
                    {pickLocaleField(tag, 'name', locale)}
                  </span>
                ))}
              </div>
            </div>
          )}
          {description ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">{t('cartoon.description')}</h2>
              <p className="text-text-primary leading-relaxed">{description}</p>
            </div>
          ) : (
            <p className="text-text-muted italic">{t('cartoon.noDescription')}</p>
          )}
        </div>
        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">{t('cartoon.relatedWorks')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {related.map(r => (
                <a key={r.id} href={`/${locale}/cartoon/${r.id}`} className="group block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image_url}
                    alt={pickLocaleField(r, 'title', locale)}
                    className="w-full aspect-[4/3] object-cover rounded border border-border group-hover:border-accent/50 transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
