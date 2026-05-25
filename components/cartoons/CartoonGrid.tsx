import CartoonCard from './CartoonCard';
import type { Cartoon } from '@/types';

interface CartoonGridProps {
  cartoons: Cartoon[];
  locale: string;
}

export default function CartoonGrid({ cartoons, locale }: CartoonGridProps) {
  if (!cartoons.length) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {cartoons.map(cartoon => (
        <CartoonCard key={cartoon.id} cartoon={cartoon} locale={locale} />
      ))}
    </div>
  );
}
