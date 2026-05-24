const slugify = (text, suffix) => {
  const base = text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
  return suffix ? `${base}-${suffix}` : base;
};
module.exports = slugify;
