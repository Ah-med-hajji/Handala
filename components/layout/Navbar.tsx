'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LOCALES, LOCALE_LABELS, type Locale } from '@/lib/i18n-utils';

interface ExtraContentLink {
  key: string;
  label: string;
}

interface NavbarProps {
  locale: string;
  extraContentLinks?: ExtraContentLink[];
}

const LOGO_W = 776;
const LOGO_H = 321;

function HandalaLogo({ size = 44 }: { size?: number }) {
  const width = Math.round((size * LOGO_W) / LOGO_H);
  return (
    <Image
      src="/logo.png"
      alt="Handala"
      width={width}
      height={size}
      priority
      className="shrink-0 object-contain"
      style={{ height: size, width: 'auto' }}
    />
  );
}

function buildPathForLocale(pathname: string, currentLocale: string, nextLocale: string) {
  const prefix = `/${currentLocale}`;
  if (pathname === prefix) return `/${nextLocale}`;
  if (pathname.startsWith(`${prefix}/`)) return `/${nextLocale}${pathname.slice(prefix.length)}`;
  return `/${nextLocale}`;
}

const LOCALE_CHIP: Record<Locale, string> = {
  ar: 'ع',
  en: 'EN',
  fr: 'FR',
  es: 'ES',
};

interface LanguageDropdownProps {
  locale: string;
  pathname: string;
  variant: 'desktop' | 'mobile';
  onNavigate?: () => void;
}

function LanguageDropdown({ locale, pathname, variant, onNavigate }: LanguageDropdownProps) {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const triggerLabel =
    variant === 'mobile'
      ? `${LOCALE_CHIP[locale as Locale] ?? locale.toUpperCase()} · ${LOCALE_LABELS[locale as Locale] ?? locale}`
      : LOCALE_CHIP[locale as Locale] ?? locale.toUpperCase();

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('language')}
        className={
          variant === 'desktop'
            ? 'text-sm font-bold bg-accent/10 border border-accent/60 px-3 py-1.5 rounded-full text-accent hover:bg-accent hover:text-black transition-colors tracking-wide flex items-center gap-1.5'
            : 'inline-flex items-center gap-2 text-base font-bold bg-accent/10 border border-accent/60 px-4 py-2 rounded-full text-accent hover:bg-accent hover:text-black transition-colors w-full justify-center'
        }
      >
        <span>{triggerLabel}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <ul
          role="listbox"
          className={
            variant === 'desktop'
              ? 'absolute end-0 top-full mt-2 w-44 bg-[#1a1a1a] border border-border rounded-lg shadow-xl py-1 z-50'
              : 'absolute end-0 bottom-full mb-2 w-full bg-[#1a1a1a] border border-border rounded-lg shadow-xl py-1 z-50'
          }
        >
          {LOCALES.map(lang => {
            const isCurrent = lang === locale;
            return (
              <li key={lang} role="option" aria-selected={isCurrent}>
                <Link
                  href={buildPathForLocale(pathname, locale, lang)}
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className={`flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors ${
                    isCurrent
                      ? 'text-accent bg-accent/10'
                      : 'text-text-muted hover:text-white hover:bg-card-hover'
                  }`}
                >
                  <span className={lang === 'ar' ? 'font-arabic' : 'font-latin'}>
                    {LOCALE_LABELS[lang]}
                  </span>
                  <span className="text-xs opacity-60">{LOCALE_CHIP[lang]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

interface NavLink {
  href: string;
  label: string;
}

interface ContentDropdownProps {
  label: string;
  links: NavLink[];
  isActiveHref: (href: string) => boolean;
}

function ContentDropdown({ label, links, isActiveHref }: ContentDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const someActive = links.some(l => isActiveHref(l.href));

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`px-2 py-2 text-base font-semibold rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
          someActive ? 'text-accent' : 'text-text-muted hover:text-white'
        }`}
      >
        <span>{label}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute start-0 top-full mt-2 min-w-[14rem] bg-[#1a1a1a] border border-border rounded-lg shadow-xl py-1 z-50"
        >
          {links.map(({ href, label }) => {
            const active = isActiveHref(href);
            return (
              <li key={href} role="none">
                <Link
                  href={href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2 text-sm transition-colors ${
                    active
                      ? 'text-accent bg-accent/10'
                      : 'text-text-muted hover:text-white hover:bg-card-hover'
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function Navbar({ locale, extraContentLinks = [] }: NavbarProps) {
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileContentOpen, setMobileContentOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isAr = locale === 'ar';

  const contentLinks: NavLink[] = [
    { href: `/${locale}/about-site`, label: t('nav.aboutSite') },
    { href: `/${locale}/about-naji`, label: t('nav.aboutNaji') },
    { href: `/${locale}/about-assassination`, label: t('nav.aboutAssassination') },
    ...extraContentLinks.map(p => ({
      href: `/${locale}/content/${p.key}`,
      label: p.label,
    })),
  ];

  const navLinks: NavLink[] = [
    { href: `/${locale}`, label: t('nav.home') },
    { href: `/${locale}/categories/all`, label: t('nav.categories') },
    { href: `/${locale}/videos`, label: t('nav.videos') },
    { href: `/${locale}/send-cartoon`, label: t('nav.sendCartoon') },
    { href: `/${locale}/by-naji`, label: t('nav.byNaji') },
    { href: `/${locale}/supporters`, label: t('nav.supporters') },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== `/${locale}` && pathname.startsWith(href));

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-shadow relative ${
          scrolled ? 'bg-[#111]/95 backdrop-blur-sm shadow-lg' : 'bg-[#111]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-center gap-6 xl:pe-36">
          <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
            <HandalaLogo size={44} />
            <span className="font-bold text-white text-base leading-tight hidden sm:block">
              {isAr ? 'ناجي العلي – حنظلة' : 'Naji Al-Ali – Handala'}
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-2">
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
            <ContentDropdown
              label={t('nav.content')}
              links={contentLinks}
              isActiveHref={isActive}
            />
          </nav>
        </div>

        <div className="absolute end-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <LanguageDropdown locale={locale} pathname={pathname} variant="desktop" />
          <button
            aria-label={t('common.openMenu')}
            onClick={() => setMobileOpen(true)}
            className="xl:hidden text-text-muted hover:text-white p-1 transition-colors"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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
                aria-label={t('common.close')}
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
              <div className="border-t border-border mt-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMobileContentOpen(o => !o)}
                  className="w-full flex items-center justify-between px-6 py-3 text-lg font-semibold text-text-muted hover:text-white"
                  aria-expanded={mobileContentOpen}
                >
                  <span>{t('nav.content')}</span>
                  <Chevron open={mobileContentOpen} />
                </button>
                {mobileContentOpen && (
                  <div className="ps-4">
                    {contentLinks.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-6 py-2 text-base transition-colors ${
                          isActive(href)
                            ? 'text-accent'
                            : 'text-text-muted hover:text-white'
                        }`}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
            <div className="p-4 border-t border-border">
              <LanguageDropdown
                locale={locale}
                pathname={pathname}
                variant="mobile"
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
