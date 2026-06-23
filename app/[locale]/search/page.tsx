import { searchCartoons } from '@/lib/data';
import CartoonGrid from '@/components/cartoons/CartoonGrid';
import { getTranslations } from 'next-intl/server';
import { pickLocaleField } from '@/lib/i18n-utils';

export default async function SearchPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';
  const results =
    query.length >= 2
      ? await searchCartoons(query)
      : { cartoons: [], categories: [] };
  const t = await getTranslations({ locale });

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('common.search')}</h1>
        {query && (
          <p className="text-text-muted mb-4">
            {t('search.results', { count: results.cartoons.length, query })}
          </p>
        )}
        {results.categories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm text-text-muted mb-2">{t('search.categoryMatch')}</h2>
            <div className="flex flex-wrap gap-2">
              {results.categories.map(cat => (
                <a
                  key={cat.id}
                  href={`/${locale}/categories/${cat.slug}`}
                  className="text-sm bg-card border border-accent/50 px-3 py-1.5 rounded hover:border-accent text-accent transition-colors"
                >
                  {pickLocaleField(cat, 'name', locale)}
                </a>
              ))}
            </div>
          </div>
        )}
        <CartoonGrid cartoons={results.cartoons} locale={locale} />
        {query && results.cartoons.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            <p className="text-xl">{t('search.noResults')}</p>
            <p className="text-sm mt-2">{t('search.noResultsHint')}</p>
          </div>
        )}
        {!query && (
          <div className="text-center py-16 text-text-muted">
            <p>{t('search.minChars')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
