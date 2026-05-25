// Tests for the content library (mock mode)
// These run against mock data without any Supabase connection.

// Force mock mode for all tests in this file
process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';

// Supabase modules are never called in mock mode, but we still need to
// provide stubs so the import of lib/content.ts doesn't crash.
jest.mock('@/lib/supabase-server', () => ({
  createClient: jest.fn(),
  createServiceClient: jest.fn(),
}));

import { getSiteContent, getAllSiteContent, getPublishedSupporters, getAllSupporters } from '@/lib/content';

describe('getSiteContent', () => {
  it('returns about_naji content in mock mode', async () => {
    const content = await getSiteContent('about_naji');
    expect(content).not.toBeNull();
    expect(content!.key).toBe('about_naji');
    expect(content!.content_ar).toBeTruthy();
    expect(content!.content_en).toBeTruthy();
  });

  it('returns about_site content in mock mode', async () => {
    const content = await getSiteContent('about_site');
    expect(content).not.toBeNull();
    expect(content!.key).toBe('about_site');
  });

  it('returns null for an unknown key', async () => {
    const content = await getSiteContent('nonexistent_key');
    expect(content).toBeNull();
  });
});

describe('getAllSiteContent', () => {
  it('returns all content blocks in mock mode', async () => {
    const all = await getAllSiteContent();
    expect(all.length).toBeGreaterThanOrEqual(2);
    const keys = all.map(c => c.key);
    expect(keys).toContain('about_naji');
    expect(keys).toContain('about_site');
  });
});

describe('getPublishedSupporters', () => {
  it('returns only published supporters', async () => {
    const supporters = await getPublishedSupporters();
    expect(supporters.every(s => s.is_published)).toBe(true);
  });

  it('returns at least one supporter in mock mode', async () => {
    const supporters = await getPublishedSupporters();
    expect(supporters.length).toBeGreaterThan(0);
  });

  it('every supporter has a name_ar', async () => {
    const supporters = await getPublishedSupporters();
    for (const s of supporters) {
      expect(s.name_ar).toBeTruthy();
    }
  });
});

describe('getAllSupporters', () => {
  it('returns all supporters (including unpublished) in mock mode', async () => {
    const all = await getAllSupporters();
    const published = await getPublishedSupporters();
    expect(all.length).toBeGreaterThanOrEqual(published.length);
  });
});
