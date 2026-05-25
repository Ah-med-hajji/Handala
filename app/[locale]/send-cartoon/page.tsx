'use client';

export default function SendCartoonPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          {locale === 'ar' ? 'أرسل رسمًا' : 'Send a Cartoon'}
        </h1>
        <p className="text-text-muted mb-8">
          {locale === 'ar'
            ? 'هل لديك رسم لناجي العلي؟ شاركه معنا ليُضاف إلى الأرشيف بعد المراجعة.'
            : 'Do you have a Naji Al-Ali cartoon? Share it with us to be added to the archive after review.'}
        </p>
        <form className="space-y-4">
          <input
            className="w-full bg-card border border-border rounded px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-accent"
            placeholder={locale === 'ar' ? 'الاسم' : 'Name'}
            required
          />
          <input
            type="email"
            className="w-full bg-card border border-border rounded px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-accent"
            placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            required
          />
          <textarea
            className="w-full bg-card border border-border rounded px-4 py-3 text-white placeholder:text-text-muted h-32 focus:outline-none focus:border-accent resize-none"
            placeholder={locale === 'ar' ? 'رسالة (اختياري)' : 'Message (optional)'}
          />
          <div>
            <label className="block text-text-muted text-sm mb-2">
              {locale === 'ar' ? 'صورة (اختياري)' : 'Image (optional)'}
            </label>
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
            {locale === 'ar' ? 'إرسال' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
