import Link from 'next/link';
import CategoryCard from './CategoryCard';
import { getTranslations } from 'next-intl/server';
import type { CategoryWithCount } from '@/types';

interface CategoryGridProps {
  categories: CategoryWithCount[];
  locale: string;
}

export default async function CategoryGrid({ categories, locale }: CategoryGridProps) {
  const isAr = locale === 'ar';
  const t = await getTranslations({ locale });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-4">
      <Link
        href={`/${locale}/categories/all`}
        className="group relative block overflow-hidden rounded-xl bg-card"
      >
        <div className="aspect-video relative flex items-center justify-center bg-gradient-to-br from-card to-[#111]">
          <svg
            className="h-14 w-14 text-accent/25 group-hover:text-accent/50 transition-colors duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className={`absolute bottom-0 ${isAr ? 'right-0' : 'left-0'} p-3`}>
            <p className="text-white font-semibold text-sm">{t('home.allCartoons')}</p>
          </div>
        </div>
      </Link>
      {categories.slice(0, 24).map(cat => (
        <CategoryCard key={cat.id} category={cat} locale={locale} />
      ))}
    </div>
  );
}
