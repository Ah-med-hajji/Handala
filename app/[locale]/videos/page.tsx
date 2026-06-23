import { getVideos } from '@/lib/data';
import VideoCard from '@/components/videos/VideoCard';
import { getTranslations } from 'next-intl/server';

export default async function VideosPage({ params: { locale } }: { params: { locale: string } }) {
  const videos = await getVideos().catch(() => []);
  const t = await getTranslations({ locale });
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">{t('videos.title')}</h1>
        {videos.length === 0 ? (
          <p className="text-text-muted text-center py-16">{t('videos.noVideos')}</p>
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
