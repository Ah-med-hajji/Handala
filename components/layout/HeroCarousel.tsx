'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Slide {
  src: string;
  alt: string;
}

interface HeroCarouselProps {
  slides: Slide[];
  locale?: string;
}

export default function HeroCarousel({ slides, locale = 'ar' }: HeroCarouselProps) {
  const isRTL = locale === 'ar';
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number>(0);

  const goNext = useCallback(() => {
    setCurrent(c => (c + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrent(c => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(goNext, 5000);
    return () => clearInterval(id);
  }, [paused, current, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goNext() : goPrev();
    }
  };

  const leftArrowAction = isRTL ? goNext : goPrev;
  const rightArrowAction = isRTL ? goPrev : goNext;

  return (
    <div
      className="group w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full overflow-hidden">
        {/* Slide 0 in normal flow → its height sizes the container */}
        {slides.map((slide, i) => (
          <div
            key={i}
            aria-hidden={i !== current}
            className={`w-full transition-opacity duration-700 ease-in-out ${
              i === 0 ? 'block' : 'absolute top-0 left-0 w-full'
            } ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {/* Plain img — bypasses Next.js optimization to confirm images load */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-auto block"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Edge vignettes */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background/75 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background/75 to-transparent pointer-events-none z-10" />

        {/* Left arrow */}
        <button
          onClick={leftArrowAction}
          aria-label="Previous"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-black/65 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={rightArrowAction}
          aria-label="Next"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-black/65 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center items-center gap-2 mt-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-4 h-2 bg-accent'
                : 'w-2 h-2 bg-[#555] hover:bg-[#888]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
