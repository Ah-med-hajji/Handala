import { getVideos } from '@/lib/data';
import VideoCard from '@/components/videos/VideoCard';

export default async function VideosPage({ params: { locale } }: { params: { locale: string } }) {
  const videos = await getVideos().catch(() => []);
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">{locale === 'ar' ? 'فيديوهات' : 'Videos'}</h1>
        {videos.length === 0 ? (
          <p className="text-text-muted text-center py-16">
            {locale === 'ar' ? 'لا توجد فيديوهات حاليًا' : 'No videos available'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(video => (
              <VideoCard key={video.id} video={video} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
