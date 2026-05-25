'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageZoomProps {
  src: string;
  alt: string;
  locale?: string;
}

export default function ImageZoom({ src, alt, locale = 'ar' }: ImageZoomProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  return (
    <>
      <div className="relative group">
        <Image
          src={src}
          alt={alt}
          width={960}
          height={720}
          className="w-full rounded"
          priority
        />
        <button
          onClick={() => setIsOpen(true)}
          aria-label={locale === 'ar' ? 'تكبير الصورة' : 'Zoom image'}
          className="absolute bottom-2 end-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          🔍 {locale === 'ar' ? 'تكبير' : 'Zoom'}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <button
            aria-label={locale === 'ar' ? 'إغلاق' : 'Close'}
            className="absolute top-4 end-4 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
