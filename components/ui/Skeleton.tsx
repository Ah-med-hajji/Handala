export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-card rounded ${className}`} />;
}

export function CartoonCardSkeleton() {
  return (
    <div className="aspect-[4/3] bg-card rounded animate-pulse" />
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="aspect-video bg-card rounded animate-pulse" />
  );
}
