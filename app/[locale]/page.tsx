import { getCategories } from '@/lib/data';
import CategoryGrid from '@/components/categories/CategoryGrid';
import SearchInput from '@/components/ui/SearchInput';
import HeroCarousel from '@/components/layout/HeroCarousel';

const CAROUSEL_SLIDES = [
  { src: '/carrousel/1.jpeg', alt: 'اقتباس ناجي العلي — إن هذا المخلوق الذي ابتدعته لن ينتهي من بعدي' },
  { src: '/carrousel/2.jpeg', alt: 'اقتباس ناجي العلي — أنا ضد التسوية ولكن مع السلام' },
  { src: '/carrousel/3.jpeg', alt: 'اقتباس ناجي العلي — في الوقت الذي كان فيه الإعلام العربي يطبل' },
];

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const categories = await getCategories().catch(() => []);
  return (
    <div className="min-h-screen">
      <HeroCarousel slides={CAROUSEL_SLIDES} locale={locale} />
      <div className="flex justify-center px-4 pt-4 pb-6">
        <SearchInput locale={locale} className="w-full max-w-2xl" />
      </div>
      <CategoryGrid categories={categories} locale={locale} />
    </div>
  );
}
