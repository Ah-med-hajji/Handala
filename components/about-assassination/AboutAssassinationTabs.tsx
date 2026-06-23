'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { AssassinationPdf } from '@/types';
import { pickLocaleField } from '@/lib/i18n-utils';

interface AboutAssassinationTabsProps {
  locale: string;
  title: string;
  paragraphs: string[];
  pdfs: AssassinationPdf[];
  labels: {
    articleTab: string;
    documentsTab: string;
    emptyDocuments: string;
    openPdf: string;
    untitledPdf: string;
  };
}

type Tab = 'article' | 'documents';

export default function AboutAssassinationTabs({
  locale,
  title,
  paragraphs,
  pdfs,
  labels,
}: AboutAssassinationTabsProps) {
  const [tab, setTab] = useState<Tab>('article');

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>

        <div
          role="tablist"
          aria-label={title}
          className="flex justify-center gap-2 border-b border-border mb-8"
        >
          <TabButton
            isActive={tab === 'article'}
            onClick={() => setTab('article')}
            label={labels.articleTab}
          />
          <TabButton
            isActive={tab === 'documents'}
            onClick={() => setTab('documents')}
            label={labels.documentsTab}
          />
        </div>

        {tab === 'article' ? (
          <article className="max-w-2xl mx-auto">
            <div className="space-y-4">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-text-primary leading-relaxed text-lg text-justify"
                >
                  {p}
                </p>
              ))}
            </div>
          </article>
        ) : (
          <div>
            {pdfs.length === 0 ? (
              <p className="text-text-muted text-center py-12">
                {labels.emptyDocuments}
              </p>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {pdfs.map(pdf => {
                  const pdfTitle =
                    pickLocaleField(pdf, 'title', locale) || labels.untitledPdf;
                  const desc = pickLocaleField(pdf, 'description', locale);
                  return (
                    <li key={pdf.id}>
                      <a
                        href={pdf.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${labels.openPdf}: ${pdfTitle}`}
                        className="group block bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-colors"
                      >
                        <div className="relative aspect-[3/4] bg-[#111]">
                          {pdf.thumbnail_url ? (
                            <Image
                              src={pdf.thumbnail_url}
                              alt={pdfTitle}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <PdfIcon />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-3">
                            <span className="text-xs bg-accent text-black font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {labels.openPdf}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-sm text-white line-clamp-2">
                            {pdfTitle}
                          </h3>
                          {desc && (
                            <p className="text-text-muted text-xs mt-1 line-clamp-2">
                              {desc}
                            </p>
                          )}
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  isActive,
  onClick,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={`px-5 py-3 text-sm font-semibold transition-colors -mb-px border-b-2 ${
        isActive
          ? 'border-accent text-accent'
          : 'border-transparent text-text-muted hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function PdfIcon() {
  return (
    <svg
      className="h-16 w-16 text-text-muted/60"
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
  );
}
