import { getPublishedSupporters } from '@/lib/content';
import type { Supporter } from '@/types';

export default async function SupportersPage({ params: { locale } }: { params: { locale: string } }) {
  const supporters = await getPublishedSupporters();
  const isAr = locale === 'ar';

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          {isAr ? 'الداعمون' : 'Supporters'}
        </h1>
        <p className="text-text-muted mb-10">
          {isAr
            ? 'شكر وتقدير لكل من ساهم في إحياء هذا الإرث وحفظه.'
            : 'Our gratitude to all who contributed to preserving this legacy.'}
        </p>

        {supporters.length === 0 ? (
          <p className="text-text-muted">
            {isAr ? 'لا يوجد داعمون بعد.' : 'No supporters listed yet.'}
          </p>
        ) : (
          <div className="space-y-6">
            {supporters.map((s: Supporter) => {
              const name = isAr ? s.name_ar : (s.name_en || s.name_ar);
              const desc = isAr ? s.description_ar : (s.description_en || s.description_ar);
              return (
                <div key={s.id} className="bg-card border border-border rounded-lg p-5">
                  <div className="flex items-center justify-between">
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent font-semibold hover:underline text-lg"
                      >
                        {name}
                      </a>
                    ) : (
                      <p className="font-semibold text-white text-lg">{name}</p>
                    )}
                  </div>
                  {desc && (
                    <p className="text-text-muted text-sm mt-2 leading-relaxed text-justify">{desc}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
