import yaml from 'js-yaml';

/**
 * Parses markdown raw text with YAML frontmatter.
 * @param {string} rawContent 
 * @param {string} fallbackId 
 * @returns {object}
 */
export function parseMarkdownFile(rawContent, fallbackId = '') {
  if (!rawContent || typeof rawContent !== 'string') {
    return {
      id: fallbackId,
      title: fallbackId,
      body: '',
    };
  }

  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return {
      id: fallbackId,
      title: fallbackId,
      category: 'General',
      date: '',
      summary: '',
      githubUrl: '',
      demoUrl: '',
      envTemplate: '',
      runInstructions: {},
      verifyCommand: '',
      body: rawContent.trim(),
    };
  }

  const rawYaml = match[1];
  const body = match[2].trim();
  let metadata = {};

  try {
    const parsed = yaml.load(rawYaml);
    if (parsed && typeof parsed === 'object') {
      metadata = parsed;
    }
  } catch (err) {
    console.error(`Failed to parse YAML frontmatter for ${fallbackId}:`, err);
  }

  return {
    id: metadata.id || fallbackId,
    title: metadata.title || fallbackId,
    category: metadata.category || 'Engineering',
    date: metadata.date ? String(metadata.date) : '',
    summary: metadata.summary || '',
    githubUrl: metadata.githubUrl || '',
    demoUrl: metadata.demoUrl || '',
    envTemplate: metadata.envTemplate || '',
    runInstructions: metadata.runInstructions || {},
    verifyCommand: metadata.verifyCommand || '',
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
    body,
  };
}

/**
 * Loads and sorts all project markdown files in /src/content/projects/*.md
 * @returns {Array<object>}
 */
export function loadProjects() {
  const modules = import.meta.glob('/src/content/projects/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  });

  const projects = Object.entries(modules).map(([filePath, rawContent]) => {
    const filenameMatch = filePath.match(/\/([^/]+)\.md$/);
    const fallbackId = filenameMatch ? filenameMatch[1] : filePath;
    return parseMarkdownFile(rawContent, fallbackId);
  });

  // Sort by date descending
  projects.sort((a, b) => {
    const timeA = new Date(a.date || 0).getTime();
    const timeB = new Date(b.date || 0).getTime();
    return timeB - timeA;
  });

  return projects;
}

export default loadProjects;

