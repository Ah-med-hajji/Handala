import { notFound } from 'next/navigation';
import { getCategoryBySlug, getCartoonsByCategory } from '@/lib/data';
import CartoonGrid from '@/components/cartoons/CartoonGrid';
import type { SortOrder } from '@/types';

export default async function CategoryPage({
  params: { locale, slug },
  searchParams,
}: {
  params: { locale: string; slug: string };
  searchParams: { sort?: string; page?: string };
}) {
  const sort: SortOrder = searchParams.sort === 'oldest' ? 'oldest' : 'newest';
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 12;

  let category = null;
  if (slug !== 'all') {
    category = await getCategoryBySlug(slug);
    if (!category) notFound();
  }

  const { cartoons, total } = await getCartoonsByCategory(
    category?.id || 'all',
    { sort, page, limit }
  );

  const totalPages = Math.ceil(total / limit);
  const name = category
    ? (locale === 'ar' ? category.name_ar : category.name_en)
    : (locale === 'ar' ? 'جميع الرسومات' : 'All Cartoons');

  return (
    <div className="min-h-screen">
      <div
        className="relative w-full h-48 md:h-72 bg-card flex items-end overflow-hidden"
        style={
          category?.cover_image_url
            ? { backgroundImage: `url(${category.cover_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}
        }
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="relative z-10 p-6 md:p-10">
          <h1 className="text-2xl md:text-4xl font-bold text-white">{name}</h1>
          <p className="text-text-muted mt-1">{total} {locale === 'ar' ? 'رسومات' : 'cartoons'}</p>
        </div>
      </div>
      <div className="px-4 py-4 flex items-center gap-4 border-b border-border">
        <span className="text-text-muted text-sm">{locale === 'ar' ? 'ترتيب:' : 'Sort:'}</span>
        <a
          href={`?sort=newest&page=1`}
          className={`text-sm px-3 py-1 rounded ${sort === 'newest' ? 'bg-accent text-black' : 'text-text-muted hover:text-white'}`}
        >
          {locale === 'ar' ? 'الأحدث' : 'Newest'}
        </a>
        <a
          href={`?sort=oldest&page=1`}
          className={`text-sm px-3 py-1 rounded ${sort === 'oldest' ? 'bg-accent text-black' : 'text-text-muted hover:text-white'}`}
        >
          {locale === 'ar' ? 'الأقدم' : 'Oldest'}
        </a>
      </div>
      <div className="p-4">
        <CartoonGrid cartoons={cartoons} locale={locale} />
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            {page > 1 && (
              <a href={`?sort=${sort}&page=${page - 1}`} className="px-4 py-2 bg-card border border-border rounded hover:border-accent text-sm">
                {locale === 'ar' ? 'السابق' : 'Previous'}
              </a>
            )}
            <span className="px-4 py-2 text-text-muted text-sm">
              {locale === 'ar' ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
            </span>
            {page < totalPages && (
              <a href={`?sort=${sort}&page=${page + 1}`} className="px-4 py-2 bg-card border border-border rounded hover:border-accent text-sm">
                {locale === 'ar' ? 'التالي' : 'Next'}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
