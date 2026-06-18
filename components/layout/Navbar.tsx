'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  locale: string;
}

function HandalaLogo({ size = 44 }: { size?: number }) {
  return (
    <Image
      src="/handala-logo.gif"
      alt="Handala"
      width={size}
      height={size}
      unoptimized
      priority
      className="shrink-0"
    />
  );
}

export default function Navbar({ locale }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isAr = locale === 'ar';
  const otherLocale = isAr ? 'en' : 'ar';
  const otherLocalePath = pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`;

  const navLinks = [
    { href: `/${locale}`, label: isAr ? 'الرئيسية' : 'Home' },
    { href: `/${locale}/categories/all`, label: isAr ? 'التصنيفات' : 'Categories' },
    { href: `/${locale}/videos`, label: isAr ? 'فيديوهات' : 'Videos' },
    { href: `/${locale}/send-cartoon`, label: isAr ? 'أرسل رسمًا' : 'Send a Cartoon' },
    { href: `/${locale}/about-site`, label: isAr ? 'عن الموقع' : 'About Site' },
    { href: `/${locale}/about-naji`, label: isAr ? 'عن ناجي' : 'About Naji' },
    { href: `/${locale}/by-naji`, label: isAr ? 'بقلم ناجي العلي' : 'By Naji Al-Ali' },
    { href: `/${locale}/about-assassination`, label: isAr ? 'عن الاغتيال' : 'The Assassination' },
    { href: `/${locale}/supporters`, label: isAr ? 'الداعمون' : 'Supporters' },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== `/${locale}` && pathname.startsWith(href));

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-shadow ${
          scrolled ? 'bg-[#111]/95 backdrop-blur-sm shadow-lg' : 'bg-[#111]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
            <HandalaLogo size={44} />
            <span className="font-bold text-white text-base leading-tight hidden sm:block">
              {isAr ? 'ناجي العلي – حنظلة' : 'Naji Al-Ali – Handala'}
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-start ms-4 me-2 min-w-0">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-2 py-2 text-base font-semibold rounded transition-colors whitespace-nowrap ${
                  isActive(href)
                    ? 'text-accent border-b-2 border-accent pb-1'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={otherLocalePath}
              className="text-sm font-bold bg-accent/10 border border-accent/60 px-3 py-1.5 rounded-full text-accent hover:bg-accent hover:text-black transition-colors tracking-wide"
            >
              {isAr ? 'EN' : 'ع'}
            </Link>
            <button
              aria-label={isAr ? 'فتح القائمة' : 'Open menu'}
              onClick={() => setMobileOpen(true)}
              className="xl:hidden text-text-muted hover:text-white p-1 transition-colors"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className={`absolute inset-y-0 ${isAr ? 'right-0' : 'left-0'} w-80 bg-[#111] flex flex-col shadow-xl`}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <HandalaLogo size={36} />
                <span className="font-bold text-white text-base">
                  {isAr ? 'ناجي العلي' : 'Naji Al-Ali'}
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label={isAr ? 'إغلاق' : 'Close'}
                className="text-text-muted hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 py-4 overflow-auto">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-6 py-3 text-lg font-semibold transition-colors ${
                    isActive(href)
                      ? 'text-accent border-s-2 border-accent bg-card'
                      : 'text-text-muted hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-border">
              <Link
                href={otherLocalePath}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 text-base font-bold bg-accent/10 border border-accent/60 px-4 py-2 rounded-full text-accent hover:bg-accent hover:text-black transition-colors"
              >
                <span>{isAr ? 'EN' : 'ع'}</span>
                <span className="font-normal">{isAr ? 'English' : 'العربية'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
