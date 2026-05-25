import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import './[locale]/globals.css';

const cairo = Cairo({ subsets: ['arabic'], variable: '--font-arabic', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-latin', display: 'swap' });

export const metadata: Metadata = {
  title: 'ناجي العلي – حنظلة | أرشيف رقمي',
  description: 'أرشيف رقمي لأعمال الفنان الفلسطيني ناجي العلي | Digital archive of Palestinian cartoonist Naji Al-Ali',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`dark ${cairo.variable} ${inter.variable}`}>
      <body className="bg-background text-text-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}
