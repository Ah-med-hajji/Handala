import { searchCartoons } from '@/lib/data';
import CartoonGrid from '@/components/cartoons/CartoonGrid';

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

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {locale === 'ar' ? 'البحث' : 'Search'}
        </h1>
        {query && (
          <p className="text-text-muted mb-4">
            {results.cartoons.length}{' '}
            {locale === 'ar' ? `نتائج لـ «${query}»` : `results for "${query}"`}
          </p>
        )}
        {results.categories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm text-text-muted mb-2">
              {locale === 'ar' ? 'موضوع مطابق' : 'Category Match'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {results.categories.map(cat => (
                <a
                  key={cat.id}
                  href={`/${locale}/categories/${cat.slug}`}
                  className="text-sm bg-card border border-accent/50 px-3 py-1.5 rounded hover:border-accent text-accent transition-colors"
                >
                  {locale === 'ar' ? cat.name_ar : cat.name_en}
                </a>
              ))}
            </div>
          </div>
        )}
        <CartoonGrid cartoons={results.cartoons} locale={locale} />
        {query && results.cartoons.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            <p className="text-xl">{locale === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}</p>
            <p className="text-sm mt-2">{locale === 'ar' ? 'جرب كلمات مفتاحية مختلفة' : 'Try different keywords'}</p>
          </div>
        )}
        {!query && (
          <div className="text-center py-16 text-text-muted">
            <p>{locale === 'ar' ? 'أدخل حرفين على الأقل للبحث' : 'Enter at least 2 characters to search'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
