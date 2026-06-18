import {
  MOCK_CATEGORIES,
  MOCK_TAGS,
  MOCK_CARTOONS,
  MOCK_VIDEOS,
  MOCK_SUBMISSIONS,
  MOCK_CONTENT,
  MOCK_SUPPORTERS,
  buildCartoonWithRelations,
} from '@/lib/mock-data';

describe('MOCK_CATEGORIES', () => {
  it('has 25 entries', () => {
    expect(MOCK_CATEGORIES).toHaveLength(25);
  });

  it('every entry has required fields', () => {
    for (const cat of MOCK_CATEGORIES) {
      expect(cat.id).toBeTruthy();
      expect(cat.slug).toBeTruthy();
      expect(cat.name_ar).toBeTruthy();
      expect(cat.name_en).toBeTruthy();
      expect(typeof cat.is_published).toBe('boolean');
      expect(typeof cat.display_order).toBe('number');
    }
  });

  it('all slugs are unique', () => {
    const slugs = MOCK_CATEGORIES.map(c => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('all ids are unique', () => {
    const ids = MOCK_CATEGORIES.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('MOCK_TAGS', () => {
  it('has 83 entries', () => {
    expect(MOCK_TAGS).toHaveLength(83);
  });

  it('all ids are unique', () => {
    const ids = MOCK_TAGS.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all slugs are unique', () => {
    const slugs = MOCK_TAGS.map(t => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every entry has required fields', () => {
    for (const tag of MOCK_TAGS) {
      expect(tag.id).toBeTruthy();
      expect(tag.slug).toBeTruthy();
      expect(tag.name_ar).toBeTruthy();
      expect(tag.created_at).toBeTruthy();
    }
  });
});

describe('MOCK_CARTOONS', () => {
  it('has 60 entries', () => {
    expect(MOCK_CARTOONS).toHaveLength(60);
  });

  it('all published', () => {
    expect(MOCK_CARTOONS.every(c => c.is_published)).toBe(true);
  });

  it('every entry has required fields', () => {
    for (const cartoon of MOCK_CARTOONS) {
      expect(cartoon.id).toBeTruthy();
      expect(cartoon.title_ar).toBeTruthy();
      expect(cartoon.image_url).toBeTruthy();
      expect(typeof cartoon.view_count).toBe('number');
      expect(Array.isArray(cartoon.categoryIds)).toBe(true);
      expect(Array.isArray(cartoon.tagIds)).toBe(true);
    }
  });

  it('all ids are unique', () => {
    const ids = MOCK_CARTOONS.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all categoryIds reference valid categories', () => {
    const catIds = new Set(MOCK_CATEGORIES.map(c => c.id));
    for (const cartoon of MOCK_CARTOONS) {
      for (const cid of cartoon.categoryIds) {
        expect(catIds.has(cid)).toBe(true);
      }
    }
  });

  it('all tagIds reference valid tags', () => {
    const tagIds = new Set(MOCK_TAGS.map(t => t.id));
    for (const cartoon of MOCK_CARTOONS) {
      for (const tid of cartoon.tagIds) {
        expect(tagIds.has(tid)).toBe(true);
      }
    }
  });
});

describe('MOCK_VIDEOS', () => {
  it('has 6 entries', () => {
    expect(MOCK_VIDEOS).toHaveLength(6);
  });

  it('every entry has a youtube_id', () => {
    for (const video of MOCK_VIDEOS) {
      expect(video.youtube_id).toBeTruthy();
      expect(video.title_ar).toBeTruthy();
    }
  });
});

describe('MOCK_SUBMISSIONS', () => {
  it('has 5 entries', () => {
    expect(MOCK_SUBMISSIONS).toHaveLength(5);
  });

  it('includes pending and reviewed statuses', () => {
    const statuses = new Set(MOCK_SUBMISSIONS.map(s => s.status));
    expect(statuses.has('pending')).toBe(true);
    expect(statuses.has('reviewed')).toBe(true);
  });
});

describe('MOCK_CONTENT', () => {
  it('has about_naji and about_site entries', () => {
    const keys = MOCK_CONTENT.map(c => c.key);
    expect(keys).toContain('about_naji');
    expect(keys).toContain('about_site');
  });

  it('every entry has Arabic and English content', () => {
    for (const block of MOCK_CONTENT) {
      expect(block.content_ar).toBeTruthy();
      expect(block.content_en).toBeTruthy();
    }
  });
});

describe('MOCK_SUPPORTERS', () => {
  it('has at least one supporter', () => {
    expect(MOCK_SUPPORTERS.length).toBeGreaterThan(0);
  });

  it('every entry has required fields', () => {
    for (const s of MOCK_SUPPORTERS) {
      expect(s.id).toBeTruthy();
      expect(s.name_ar).toBeTruthy();
      expect(typeof s.is_published).toBe('boolean');
      expect(typeof s.display_order).toBe('number');
    }
  });
});

describe('buildCartoonWithRelations', () => {
  it('attaches correct categories to a cartoon', () => {
    const cartoon = MOCK_CARTOONS[0]; // cartoon-01 has cat-01 and cat-21
    const result = buildCartoonWithRelations(cartoon);
    expect(result.categories).toHaveLength(cartoon.categoryIds.length);
    for (const cat of result.categories) {
      expect(cartoon.categoryIds).toContain(cat.id);
    }
  });

  it('attaches correct tags to a cartoon', () => {
    const cartoon = MOCK_CARTOONS[0];
    const result = buildCartoonWithRelations(cartoon);
    expect(result.tags).toHaveLength(cartoon.tagIds.length);
    for (const tag of result.tags) {
      expect(cartoon.tagIds).toContain(tag.id);
    }
  });

  it('preserves all original cartoon fields', () => {
    const cartoon = MOCK_CARTOONS[5];
    const result = buildCartoonWithRelations(cartoon);
    expect(result.id).toBe(cartoon.id);
    expect(result.title_ar).toBe(cartoon.title_ar);
    expect(result.image_url).toBe(cartoon.image_url);
  });

  it('returns empty arrays when cartoon has no categories/tags', () => {
    const cartoon = { ...MOCK_CARTOONS[0], categoryIds: [], tagIds: [] };
    const result = buildCartoonWithRelations(cartoon);
    expect(result.categories).toHaveLength(0);
    expect(result.tags).toHaveLength(0);
  });
});
