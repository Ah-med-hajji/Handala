// Tests for server actions in mock mode.
// All actions short-circuit with { success: true } when NEXT_PUBLIC_USE_MOCK_DATA=true.

process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';

jest.mock('@/lib/supabase-server', () => ({
  createClient: jest.fn(),
  createServiceClient: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn((name: string) => name === 'mock-admin-session' ? { value: 'true' } : undefined),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

import { createCartoon, updateCartoon, deleteCartoon, togglePublished } from '@/lib/actions/cartoon-actions';
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/category-actions';
import { createVideo, updateVideo, deleteVideo } from '@/lib/actions/video-actions';
import { updateSubmission } from '@/lib/actions/submission-actions';
import { updateSiteContent } from '@/lib/actions/content-actions';
import { createSupporter, updateSupporter, deleteSupporter } from '@/lib/actions/supporter-actions';

const cartoonInput = {
  title_ar: 'رسمة اختبار',
  title_en: 'Test Cartoon',
  description_ar: 'وصف',
  description_en: 'Description',
  image_url: 'https://picsum.photos/600/450',
  is_published: true,
  category_ids: ['cat-01'],
  tag_ids: ['tag-01'],
};

const categoryInput = {
  name_ar: 'تصنيف اختبار',
  name_en: 'Test Category',
  slug: 'test-category',
  is_published: true,
  display_order: 99,
};

const videoInput = {
  title_ar: 'فيديو اختبار',
  youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  is_published: true,
  display_order: 99,
};

describe('cartoon-actions (mock mode)', () => {
  it('createCartoon returns success', async () => {
    const result = await createCartoon(cartoonInput);
    expect(result.success).toBe(true);
  });

  it('updateCartoon returns success', async () => {
    const result = await updateCartoon('cartoon-01', cartoonInput);
    expect(result.success).toBe(true);
  });

  it('deleteCartoon returns success', async () => {
    const result = await deleteCartoon('cartoon-01');
    expect(result.success).toBe(true);
  });

  it('togglePublished returns success', async () => {
    const result = await togglePublished('cartoon-01', true);
    expect(result.success).toBe(true);
  });
});

describe('category-actions (mock mode)', () => {
  it('createCategory returns success', async () => {
    const result = await createCategory(categoryInput);
    expect(result.success).toBe(true);
  });

  it('updateCategory returns success', async () => {
    const result = await updateCategory('cat-01', categoryInput);
    expect(result.success).toBe(true);
  });

  it('deleteCategory returns success', async () => {
    const result = await deleteCategory('cat-01');
    expect(result.success).toBe(true);
  });
});

describe('video-actions (mock mode)', () => {
  it('createVideo returns success', async () => {
    const result = await createVideo(videoInput);
    expect(result.success).toBe(true);
  });

  it('updateVideo returns success', async () => {
    const result = await updateVideo('video-01', videoInput);
    expect(result.success).toBe(true);
  });

  it('deleteVideo returns success', async () => {
    const result = await deleteVideo('video-01');
    expect(result.success).toBe(true);
  });
});

describe('submission-actions (mock mode)', () => {
  it('updateSubmission returns success', async () => {
    const result = await updateSubmission('sub-01', { status: 'reviewed', admin_notes: 'OK' });
    expect(result.success).toBe(true);
  });
});

describe('content-actions (mock mode)', () => {
  it('updateSiteContent returns success', async () => {
    const result = await updateSiteContent('about_naji', {
      title_ar: 'عن ناجي',
      title_en: 'About Naji',
      title_fr: '',
      title_es: '',
      content_ar: 'نص عربي',
      content_en: 'English text',
      content_fr: '',
      content_es: '',
    });
    expect(result.success).toBe(true);
  });
});

describe('supporter-actions (mock mode)', () => {
  it('createSupporter returns success', async () => {
    const result = await createSupporter({ name_ar: 'داعم جديد', is_published: true, display_order: 10 });
    expect(result.success).toBe(true);
  });

  it('updateSupporter returns success', async () => {
    const result = await updateSupporter('sup-01', { name_ar: 'داعم محدّث', is_published: true, display_order: 1 });
    expect(result.success).toBe(true);
  });

  it('deleteSupporter returns success', async () => {
    const result = await deleteSupporter('sup-01');
    expect(result.success).toBe(true);
  });
});
