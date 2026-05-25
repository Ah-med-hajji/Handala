'use client';

import { useState } from 'react';
import VideoModal from './VideoModal';
import type { Video } from '@/types';

interface VideoCardProps {
  video: Video;
  locale: string;
}

export default function VideoCard({ video, locale }: VideoCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isAr = locale === 'ar';
  const title = isAr ? video.title_ar : (video.title_en || video.title_ar);
  const desc = isAr ? video.description_ar : video.description_en;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group w-full text-start bg-card rounded-lg overflow-hidden border border-border hover:border-accent/50 transition-colors"
      >
        <div className="relative aspect-video overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 rounded-full w-14 h-14 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6 text-white ms-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm line-clamp-2">{title}</h3>
          {desc && <p className="text-text-muted text-xs mt-1 line-clamp-2">{desc}</p>}
        </div>
      </button>
      {isOpen && (
        <VideoModal youtubeId={video.youtube_id} title={title} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
