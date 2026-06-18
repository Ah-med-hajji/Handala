-- Drop the original 15 generic tags so only the client-supplied tag list
-- (tags.docx, applied in migration 003) remains. Deleting from `tags`
-- cascades through `cartoon_tags` so any join rows pointing at these
-- slugs go with them.
DELETE FROM tags WHERE slug IN (
  'handala',
  'satire',
  'resistance',
  'occupation',
  'diaspora',
  'solidarity',
  'children',
  'women',
  'olive',
  'camp',
  'key',
  'nakba',
  'martyrdom',
  'media-critique',
  'political'
);
