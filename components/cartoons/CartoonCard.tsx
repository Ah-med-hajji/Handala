import Link from 'next/link';
import Image from 'next/image';
import { pickLocaleField } from '@/lib/i18n-utils';
import type { Cartoon } from '@/types';

const BLUR_PLACEHOLDER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=';

interface CartoonCardProps {
  cartoon: Cartoon;
  locale: string;
}

export default function CartoonCard({ cartoon, locale }: CartoonCardProps) {
  const title = pickLocaleField(cartoon, 'title', locale);

  return (
    <Link
      href={`/${locale}/cartoon/${cartoon.id}`}
      className="group block relative overflow-hidden bg-card border border-border hover:border-accent/40 transition-colors"
    >
      <div className="aspect-[4/3] relative">
        <Image
          src={cartoon.image_url}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-200 flex flex-col justify-end p-3">
          <div className="opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
            <p className="text-white text-xs font-semibold line-clamp-2">{title}</p>
            {cartoon.publication_date && (
              <p className="text-white/60 text-xs mt-0.5">{cartoon.publication_date}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
