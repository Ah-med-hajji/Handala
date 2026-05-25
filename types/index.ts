export type Locale = 'ar' | 'en';
export type SortOrder = 'newest' | 'oldest';
export type SubmissionStatus = 'pending' | 'reviewed' | 'rejected';

export interface Category {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  cover_image_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithCount extends Category {
  cartoon_count: number;
}

export interface Tag {
  id: string;
  name_ar: string;
  name_en: string | null;
  slug: string;
  created_at: string;
}

export interface Cartoon {
  id: string;
  title_ar: string;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  image_url: string;
  image_high_res_url: string | null;
  publication_date: string | null;
  source: string | null;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface CartoonWithRelations extends Cartoon {
  categories: Category[];
  tags: Tag[];
}

export interface Video {
  id: string;
  title_ar: string;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  sender_name: string;
  sender_email: string;
  message: string | null;
  image_url: string | null;
  status: SubmissionStatus;
  admin_notes: string | null;
  created_at: string;
}

export interface SearchResult {
  cartoons: Cartoon[];
  categories: Category[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SiteContent {
  id: string;
  key: string;
  title_ar: string;
  title_en: string | null;
  content_ar: string;
  content_en: string | null;
  updated_at: string;
}

export interface Supporter {
  id: string;
  name_ar: string;
  name_en: string | null;
  url: string | null;
  logo_url: string | null;
  description_ar: string | null;
  description_en: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
}
