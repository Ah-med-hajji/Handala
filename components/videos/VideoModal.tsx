'use client';

import { useEffect } from 'react';

interface VideoModalProps {
  youtubeId: string;
  title: string;
  onClose: () => void;
}

export default function VideoModal({ youtubeId, title, onClose }: VideoModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 end-4 text-white text-xl bg-black/60 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black transition-colors"
      >
        ×
      </button>
      <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
        <p className="text-white font-semibold mb-3 text-center text-sm">{title}</p>
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title={title}
            className="w-full h-full rounded"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
