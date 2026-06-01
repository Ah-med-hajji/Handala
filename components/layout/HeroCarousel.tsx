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

const toArabicIndic = (n: number) =>
  String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);

export default function HeroCarousel({ slides, locale = 'ar' }: HeroCarouselProps) {
  const isRTL = locale === 'ar';
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number>(0);

  const goNext = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length]);
  const goPrev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), [slides.length]);

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
    if (Math.abs(delta) > 50) delta > 0 ? goNext() : goPrev();
  };

  const leftArrowAction = isRTL ? goNext : goPrev;
  const rightArrowAction = isRTL ? goPrev : goNext;

  const counter = isRTL
    ? `${toArabicIndic(current + 1)} / ${toArabicIndic(slides.length)}`
    : `${current + 1} / ${slides.length}`;

  return (
    <div
      className="group w-full max-w-5xl mx-auto px-4 mb-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full overflow-hidden rounded-xl h-[360px] lg:h-[440px] bg-[#0d0d0d]">

        {/* Stacked slides — crossfade via opacity */}
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out ${
              i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt={slide.alt}
              className={`w-full h-full object-contain block${i === current ? ' animate-ken-burns' : ''}`}
            />
          </div>
        ))}

        {/* Bottom gradient — fades carousel into page background */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-20"
          style={{
            height: '120px',
            background:
              'linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(10,10,10,0.6) 80%, #0a0a0a 100%)',
          }}
        />

        {/* Left arrow */}
        <button
          onClick={leftArrowAction}
          aria-label="Previous"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.8)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#c8a96e';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.5)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
          }}
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={rightArrowAction}
          aria-label="Next"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.8)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#c8a96e';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.5)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
          }}
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot indicators — pill style */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className="rounded-full"
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                backgroundColor: i === current ? '#c8a96e' : '#444444',
                transition: 'width 300ms ease-in-out, background-color 300ms ease-in-out',
              }}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div
          className="absolute bottom-3 right-4 z-30 text-xs select-none"
          style={{ color: '#888888' }}
        >
          {counter}
        </div>

        {/* Progress bar — key remounts on slide change to restart animation */}
        <div
          key={`progress-${current}`}
          className="absolute bottom-0 left-0 h-[2px] bg-[#c8a96e] z-40 animate-progress-fill"
          style={{ animationPlayState: paused ? 'paused' : 'running' }}
        />
      </div>
    </div>
  );
}
