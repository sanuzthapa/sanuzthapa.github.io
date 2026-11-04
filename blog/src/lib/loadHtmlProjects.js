/**
 * Auto-discovery module for standalone HTML articles and projects.
 * Scans `/public/posts/*.html` and parses metadata (<title>, <meta> tags).
 */

// Use Vite's eager raw glob import to read HTML contents at compile time
const htmlModules = import.meta.glob('/public/posts/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/**
 * Robust parser for HTML <meta> tags.
 * Supports both orderings:
 *   <meta name="xyz" content="abc">
 *   <meta content="abc" name="xyz">
 */
function extractMeta(html, metaName) {
  if (!html) return '';
  const nameFirst = new RegExp(`<meta[^>]*\\bname=["']${metaName}["'][^>]*\\bcontent=["']([^"']*)["']`, 'i');
  const match1 = html.match(nameFirst);
  if (match1 && match1[1]) return match1[1].trim();

  const contentFirst = new RegExp(`<meta[^>]*\\bcontent=["']([^"']*)["'][^>]*\\bname=["']${metaName}["']`, 'i');
  const match2 = html.match(contentFirst);
  if (match2 && match2[1]) return match2[1].trim();

  return '';
}

/**
 * Extracts inner text from the <title> tag.
 */
function extractTitle(html, defaultTitle) {
  if (!html) return defaultTitle;
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match && match[1] && match[1].trim() ? match[1].trim() : defaultTitle;
}

/**
 * Formats a slug filename like "competition-policy-sim" into "Competition Policy Sim".
 */
function formatSlug(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Returns all discovered standalone HTML projects with their parsed metadata.
 */
export function getHtmlProjects() {
  const base = (import.meta.env.BASE_URL || '/blog/').replace(/\/+$/, '');

  const projects = Object.entries(htmlModules).map(([path, rawHtml]) => {
    // path is e.g. "/public/posts/competition-policy-sim.html"
    const fileName = path.split('/').pop() || '';
    const slug = fileName.replace(/\.html$/i, '');
    const fallbackTitle = formatSlug(slug);

    const title = extractTitle(rawHtml, fallbackTitle);
    const category = extractMeta(rawHtml, 'category') || 'Engineering';
    const date = extractMeta(rawHtml, 'date') || '2026-03';
    const description =
      extractMeta(rawHtml, 'description') ||
      'Interactive standalone HTML research paper and engineering model.';
    const status = extractMeta(rawHtml, 'status') || 'Production Ready';
    const author = extractMeta(rawHtml, 'author') || 'Sanuz Thapa';
    const readingTime = extractMeta(rawHtml, 'readingTime') || '5 min read';

    const tagsMeta = extractMeta(rawHtml, 'tags');
    const tags = tagsMeta
      ? tagsMeta.split(',').map((t) => t.trim()).filter(Boolean)
      : [category, 'Interactive'];

    // In Vite, files located inside /public/posts/ are served at `${base}/posts/fileName`
    const standaloneUrl = `${base}/posts/${fileName}`;

    return {
      id: slug,
      slug,
      fileName,
      title,
      category,
      date,
      description,
      status,
      author,
      readingTime,
      tags,
      standaloneUrl,
      rawHtml,
    };
  });

  // Sort descending by date
  return projects.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

export default getHtmlProjects;

