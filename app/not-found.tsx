import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
      <div className="text-8xl text-accent font-bold mb-4">٤٠٤</div>
      <h1 className="text-2xl font-bold text-white mb-2">الصفحة غير موجودة</h1>
      <p className="text-text-muted mb-8">Page not found</p>
      <Link
        href="/ar"
        className="bg-accent text-black px-6 py-3 rounded font-semibold hover:bg-accent/90 transition-colors"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
