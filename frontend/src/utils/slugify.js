/**
 * Simple slugify for category names
 * "Luxury Villas" → "luxury-villas"
 */
export const slugify = (str) => {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/[\s_-]+/g, '-') // convert spaces/underscores to -
    .replace(/^-+|-+$/g, ''); // remove leading/trailing -
};

/**
 * From slug back to approximate original (for display/matching)
 */
export const unsSlugify = (slug) => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

