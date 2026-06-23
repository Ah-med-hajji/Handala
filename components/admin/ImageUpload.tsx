'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  label?: string;
  bucket: string;
  maxMb?: number;
}

const DEFAULT_MAX_MB = 15;

export function ImageUpload({
  currentUrl,
  onUpload,
  label = 'Image',
  bucket,
  maxMb = DEFAULT_MAX_MB,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.size > maxMb * 1024 * 1024) {
      setError(`File too large (max ${maxMb}MB).`);
      return;
    }
    setError(null);
    setUploading(true);
    setProgress(0);
    setPreview(URL.createObjectURL(file));

    try {
      const urlRes = await fetch('/api/upload-signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, bucket }),
      });
      const urlText = await urlRes.text();
      let urlData: {
        signedUrl?: string;
        publicUrl?: string;
        error?: string;
        mock?: boolean;
      } = {};
      try {
        urlData = JSON.parse(urlText);
      } catch {
        throw new Error(`Could not get upload URL (${urlRes.status})`);
      }
      if (!urlRes.ok || urlData.error) {
        throw new Error(urlData.error || `Upload URL failed (${urlRes.status})`);
      }

      if (urlData.mock && urlData.publicUrl) {
        setProgress(100);
        onUpload(urlData.publicUrl);
        return;
      }

      if (!urlData.signedUrl || !urlData.publicUrl) {
        throw new Error('Upload URL response missing fields.');
      }

      await uploadWithProgress(urlData.signedUrl, file, setProgress);
      onUpload(urlData.publicUrl);
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
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
                <div className="text-white text-sm space-y-2 w-3/4">
                  <p className="text-center">Uploading… {progress}%</p>
                  <div className="w-full bg-border h-1.5 rounded overflow-hidden">
                    <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6">
            <svg className="h-8 w-8 text-text-muted mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-text-muted text-sm">Drop image here or click to upload</p>
            <p className="text-text-muted text-xs mt-1">JPG, PNG, WEBP — max {maxMb}MB</p>
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

function uploadWithProgress(
  url: string,
  file: File,
  onProgress: (pct: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText.slice(0, 200)}`));
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(file);
  });
}
