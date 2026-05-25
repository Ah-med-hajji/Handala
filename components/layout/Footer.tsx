'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-[#111] border-t border-border py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-white font-bold mb-1">ناجي العلي – Naji Al-Ali</p>
        <p className="text-text-muted text-sm mb-4">{t('tagline')}</p>
        <p className="text-text-muted text-xs">{t('copyright')}</p>
      </div>
    </footer>
  );
}
