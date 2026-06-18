-- The production tags table was originally seeded from the DEPLOYMENT.md
-- snippet, which used a different set of slugs than the local seed.sql /
-- mock-data.ts. Migration 004 only matched the 4 slugs that happened to
-- overlap; this migration removes the remaining 11 legacy slugs so that
-- only the client-supplied tag list from tags.docx is left.
DELETE FROM tags WHERE slug IN (
  'america',
  'betrayal',
  'childhood',
  'false-peace',
  'identity',
  'poverty',
  'regimes',
  'return',
  'revolution',
  'unity',
  'zionism'
);
