'use client';

import { useState, useRef } from 'react';
import type { Tag } from '@/types';

interface TagInputProps {
  selectedTags: Tag[];
  availableTags: Tag[];
  onChange: (tags: Tag[]) => void;
}

export function TagInput({ selectedTags, availableTags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = availableTags.filter(
    t =>
      !selectedTags.find(s => s.id === t.id) &&
      (t.name_ar.includes(input) ||
        (t.name_en || '').toLowerCase().includes(input.toLowerCase()))
  );

  const addTag = (tag: Tag) => {
    onChange([...selectedTags, tag]);
    setInput('');
    inputRef.current?.focus();
  };

  const removeTag = (id: string) => {
    onChange(selectedTags.filter(t => t.id !== id));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[2rem]">
        {selectedTags.map(tag => (
          <span
            key={tag.id}
            className="flex items-center gap-1 bg-card border border-accent/50 text-accent text-xs px-2 py-1 rounded"
          >
            {tag.name_ar}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="text-accent/70 hover:text-accent ms-1 leading-none"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent"
          placeholder="Type to search tags..."
        />
        {input && suggestions.length > 0 && (
          <ul className="absolute top-full mt-1 w-full bg-[#1a1a1a] border border-border rounded shadow-xl z-10 max-h-40 overflow-auto">
            {suggestions.map(tag => (
              <li key={tag.id}>
                <button
                  type="button"
                  onClick={() => addTag(tag)}
                  className="w-full text-start px-3 py-2 text-sm text-text-primary hover:bg-card transition-colors"
                >
                  {tag.name_ar}
                  {tag.name_en && <span className="text-text-muted"> / {tag.name_en}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
