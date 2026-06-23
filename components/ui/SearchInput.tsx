'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface SearchInputProps {
  locale: string;
  className?: string;
  initialValue?: string;
}

export default function SearchInput({ locale, className = '', initialValue = '' }: SearchInputProps) {
  const t = useTranslations('common');
  const [value, setValue] = useState(initialValue);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSearchPage = pathname.includes('/search');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (isSearchPage) {
          const params = new URLSearchParams(searchParams.toString());
          if (newValue) params.set('q', newValue);
          else params.delete('q');
          router.replace(`${pathname}?${params.toString()}`);
        } else if (newValue.length >= 2) {
          router.push(`/${locale}/search?q=${encodeURIComponent(newValue)}`);
        }
      }, 400);
    },
    [isSearchPage, locale, pathname, router, searchParams]
  );

  const handleClear = () => {
    setValue('');
    if (isSearchPage) router.replace(pathname);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleClear();
    if (e.key === 'Enter' && value.length >= 2 && !isSearchPage) {
      router.push(`/${locale}/search?q=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 start-3 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="search"
        dir="auto"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={t('searchPlaceholder')}
        className="w-full bg-card border border-border rounded-full ps-10 pe-10 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent text-sm transition-colors"
      />
      {value && (
        <button
          onClick={handleClear}
          aria-label={t('clearSearch')}
          className="absolute inset-y-0 end-3 flex items-center text-text-muted hover:text-white transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
