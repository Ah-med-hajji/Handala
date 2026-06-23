import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const locales = ['ar', 'en', 'fr', 'es'];

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) notFound();
  const messages = await getMessages();
  const isRTL = locale === 'ar';

  return (
    <div
      className={`min-h-screen flex flex-col ${isRTL ? 'font-arabic' : 'font-latin'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <NextIntlClientProvider messages={messages}>
        <Navbar locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </div>
  );
}
