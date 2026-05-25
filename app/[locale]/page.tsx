import { getCategories } from '@/lib/data';
import CategoryGrid from '@/components/categories/CategoryGrid';
import SearchInput from '@/components/ui/SearchInput';

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const categories = await getCategories().catch(() => []);
  return (
    <div className="min-h-screen">
      <div className="flex justify-center px-4 py-6">
        <SearchInput locale={locale} className="w-full max-w-2xl" />
      </div>
      <CategoryGrid categories={categories} locale={locale} />
    </div>
  );
}
