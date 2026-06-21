import {
  BY_NAJI_FOOTNOTE_AR,
  BY_NAJI_SECTIONS_AR,
  BY_NAJI_SUBTITLE_AR,
  BY_NAJI_TITLE_AR,
  BY_NAJI_TITLE_EN,
} from '@/lib/static-content/by-naji';

export default function ByNajiPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const title = isAr ? BY_NAJI_TITLE_AR : BY_NAJI_TITLE_EN;

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
            English translation coming soon. Please view this page in Arabic for
            the full text.
          </p>
        )}
      </article>
    </div>
  );
}
