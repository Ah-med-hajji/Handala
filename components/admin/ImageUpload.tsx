'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  label?: string;
  bucket: string;
}

export function ImageUpload({ currentUrl, onUpload, label = 'Image', bucket }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Vercel serverless functions reject bodies over ~4.5 MB before the route
    // even runs, returning a plain-text "Request Entity Too Large" page that
    // fails to parse as JSON on the client. Cap at 4 MB to stay safely below.
    if (file.size > 4 * 1024 * 1024) {
      setError('File too large (max 4MB). Compress the image and try again.');
      return;
    }
    setError(null);
    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const text = await res.text();
      let data: { url?: string; error?: string } = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          res.status === 413
            ? 'File too large for the server. Use a smaller file.'
            : `Upload failed (${res.status}): ${text.slice(0, 120)}`
        );
      }
      if (data.url) onUpload(data.url);
      else throw new Error(data.error || `Upload failed (${res.status})`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && <label className="block text-sm text-text-muted mb-1">{label}</label>}
      <div
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-accent/50 transition-colors text-center"
      >
        {preview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded object-contain" />
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded">
                <span className="text-white text-sm">Uploading...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6">
            <svg className="h-8 w-8 text-text-muted mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-text-muted text-sm">Drop image here or click to upload</p>
            <p className="text-text-muted text-xs mt-1">JPG, PNG, WEBP — max 4MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
