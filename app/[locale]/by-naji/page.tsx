import {
  BY_NAJI_FOOTNOTE_AR,
  BY_NAJI_SECTIONS_AR,
  BY_NAJI_SUBTITLE_AR,
  BY_NAJI_TITLE_AR,
  BY_NAJI_TITLE_EN,
} from '@/lib/static-content/by-naji';
import { getTranslations } from 'next-intl/server';

export default async function ByNajiPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  // Article body is authored only in Arabic. ar renders the full text; every
  // other locale (en/fr/es) shows the English title and a localized
  // "translation coming soon" notice until human translations are produced.
  const title = isAr ? BY_NAJI_TITLE_AR : BY_NAJI_TITLE_EN;
  const t = await getTranslations({ locale });

  return (
    <div className="min-h-screen px-4 py-12">
      <article className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">{title}</h1>
          {isAr && (
            <p className="text-text-muted text-lg">{BY_NAJI_SUBTITLE_AR}</p>
          )}
          <div className="mt-6 h-px bg-border" />
        </header>

        {isAr ? (
          <div className="space-y-10">
            {BY_NAJI_SECTIONS_AR.map((section, sIdx) => (
              <section key={sIdx}>
                {section.heading && (
                  <h2 className="text-2xl font-bold text-accent mb-4">
                    {section.heading}
                  </h2>
                )}
                <div className="space-y-4">
                  {section.paragraphs.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-text-primary leading-loose text-lg text-justify"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
            <p className="text-text-muted text-sm border-t border-border pt-6 leading-relaxed">
              {BY_NAJI_FOOTNOTE_AR}
            </p>
          </div>
        ) : (
          <p className="text-text-muted text-lg leading-relaxed">
            {t('byNaji.translationComingSoon')}
          </p>
        )}
      </article>
    </div>
  );
}
