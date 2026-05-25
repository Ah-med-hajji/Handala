import * as realDb from './database';
import * as mockDb from './mock-database';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

const db = USE_MOCK ? mockDb : realDb;

export const {
  getCategories,
  getCategoryBySlug,
  getCartoonsByCategory,
  getCartoonById,
  getRelatedCartoons,
  searchCartoons,
  getVideos,
  getAllCartoons,
} = db;
