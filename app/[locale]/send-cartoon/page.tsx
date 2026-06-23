'use client';

import { useTranslations } from 'next-intl';

export default function SendCartoonPage() {
  const t = useTranslations('sendCartoon');
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
        <p className="text-text-muted mb-8">{t('description')}</p>
        <form className="space-y-4">
          <input
            className="w-full bg-card border border-border rounded px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-accent"
            placeholder={t('name')}
            required
          />
          <input
            type="email"
            className="w-full bg-card border border-border rounded px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-accent"
            placeholder={t('email')}
            required
          />
          <textarea
            className="w-full bg-card border border-border rounded px-4 py-3 text-white placeholder:text-text-muted h-32 focus:outline-none focus:border-accent resize-none"
            placeholder={t('message')}
          />
          <div>
            <label className="block text-text-muted text-sm mb-2">{t('image')}</label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-text-muted text-sm file:bg-card file:border file:border-border file:text-white file:px-3 file:py-2 file:rounded file:mr-3 file:cursor-pointer"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-black font-semibold py-3 rounded hover:bg-accent/90 transition-colors"
          >
            {t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
