'use client';

import { useState, useRef } from 'react';

interface PdfUploadProps {
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  label?: string;
  bucket: string;
  maxMb?: number;
}

const DEFAULT_MAX_MB = 25;

export function PdfUpload({
  currentUrl,
  onUpload,
  label = 'PDF',
  bucket,
  maxMb = DEFAULT_MAX_MB,
}: PdfUploadProps) {
  const [fileName, setFileName] = useState<string | null>(
    currentUrl ? decodeURIComponent(currentUrl.split('/').pop() || '') : null
  );
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('File must be a PDF.');
      return;
    }
    if (file.size > maxMb * 1024 * 1024) {
      setError(`File too large (max ${maxMb} MB).`);
      return;
    }

    setUploading(true);
    setFileName(file.name);
    setProgress(0);

    try {
      const urlRes = await fetch('/api/upload-signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, bucket }),
      });
      const urlText = await urlRes.text();
      let urlData: {
        signedUrl?: string;
        token?: string;
        path?: string;
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
  }

  return (
    <div>
      {label && <label className="block text-sm text-text-muted mb-1">{label}</label>}
      <div
        onDrop={e => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-accent/50 transition-colors text-center"
      >
        {fileName ? (
          <div className="py-4 space-y-2">
            <svg
              className="h-8 w-8 text-accent mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m-6-8h6M5 21h14a2 2 0 002-2V7l-5-5H5a2 2 0 00-2 2v15a2 2 0 002 2z"
              />
            </svg>
            <p className="text-text-primary text-sm truncate">{fileName}</p>
            {uploading && (
              <div className="w-full bg-border h-1.5 rounded overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            {!uploading && currentUrl && (
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="text-accent text-xs hover:underline"
              >
                Open current file
              </a>
            )}
          </div>
        ) : (
          <div className="py-6">
            <svg
              className="h-8 w-8 text-text-muted mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
              />
            </svg>
            <p className="text-text-muted text-sm">Drop PDF here or click to upload</p>
            <p className="text-text-muted text-xs mt-1">PDF — max {maxMb}MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
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
    xhr.setRequestHeader('Content-Type', file.type || 'application/pdf');
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
