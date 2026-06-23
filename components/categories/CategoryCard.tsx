import Link from 'next/link';
import Image from 'next/image';
import { pickLocaleField } from '@/lib/i18n-utils';
import type { CategoryWithCount } from '@/types';

interface CategoryCardProps {
  category: CategoryWithCount;
  locale: string;
}

export default function CategoryCard({ category, locale }: CategoryCardProps) {
  const isAr = locale === 'ar';
  const name = pickLocaleField(category, 'name', locale);

  return (
    <Link
      href={`/${locale}/categories/${category.slug}`}
      className="group relative block overflow-hidden rounded-xl bg-card"
    >
      <div className="aspect-video relative">
        {category.cover_image_url ? (
          <Image
            src={category.cover_image_url}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-card to-[#111] flex items-center justify-center">
            <svg className="h-10 w-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-200 group-hover:from-black/70" />
        <div className={`absolute bottom-0 ${isAr ? 'right-0' : 'left-0'} p-3`}>
          <p className="text-white font-semibold text-sm leading-tight line-clamp-2">{name}</p>
          {category.cartoon_count > 0 && (
            <p className="text-white/50 text-xs mt-0.5">{category.cartoon_count}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
