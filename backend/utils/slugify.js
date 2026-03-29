/**
 * Backend slugify utils
 */
const slugify = (str) => {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const unsSlugify = (slug) => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

module.exports = { slugify, unsSlugify };

