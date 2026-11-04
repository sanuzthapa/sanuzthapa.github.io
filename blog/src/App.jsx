import React, { useState, useEffect, useMemo } from 'react';
import {
  Terminal,
  ExternalLink,
  ChevronLeft,
  Globe,
  Search,
  Calendar,
  Tag,
  Clock,
  ArrowRight,
  Code2,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  X,
  Layers,
  Cpu,
  Monitor
} from 'lucide-react';
import { getHtmlProjects } from './lib/loadHtmlProjects';

function GithubIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function App() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' | 'cli' | 'guide'
  const [copiedCmd, setCopiedCmd] = useState('');

  // 1. Auto-discover all HTML projects on mount
  useEffect(() => {
    const loadedProjects = getHtmlProjects();
    setProjects(loadedProjects);

    // Sync with URL Hash for direct deep-linking (e.g. #competition-policy-sim)
    const handleHashSync = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (hash) {
        const found = loadedProjects.find(
          (p) => p.slug.toLowerCase() === hash.toLowerCase() || p.id.toLowerCase() === hash.toLowerCase()
        );
        if (found) {
          setActiveProject(found);
          return;
        }
      }
      setActiveProject(null);
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  // Open an article in full-screen iframe view
  const handleOpenProject = (project) => {
    setActiveProject(project);
    window.location.hash = project.slug;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close the article and return to catalog feed
  const handleCloseProject = () => {
    setActiveProject(null);
    history.pushState('', document.title, window.location.pathname + window.location.search);
  };

  // Extract categories dynamically
  const categories = useMemo(() => {
    const set = new Set(['All']);
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        project.category?.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.title?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.tags?.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(''), 2000);
  };

  return (
    <div
      className={`min-h-screen bg-[#0a192f] text-slate-100 flex flex-col ${
        activeProject ? 'h-screen overflow-hidden' : ''
      }`}
    >
      {/* =========================================================================
          1. PERSISTENT TOP NAVIGATION BAR (Exact dark navbar from specifications)
         ========================================================================= */}
      <header className="sticky top-0 z-50 h-16 bg-[#0a192f]/95 backdrop-blur-md border-b border-[#233554] px-4 md:px-6 flex items-center justify-between select-none">
        {/* Left: Square logo + Name + Pill + Subtitle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('articles');
              handleCloseProject();
            }}
            className="flex items-center gap-3 text-left focus:outline-none group"
            title="Return to Engineering Journal Catalog"
          >
            <div className="w-10 h-10 rounded-lg bg-[#64ffda]/10 border border-[#64ffda]/30 flex items-center justify-center text-[#64ffda] shadow-sm group-hover:bg-[#64ffda]/20 group-hover:border-[#64ffda] transition-all">
              <Terminal className="w-5 h-5 text-[#64ffda]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight group-hover:text-[#64ffda] transition-colors">
                  Sanuz Thapa
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/30 rounded-full">
                  ENGINEERING JOURNAL
                </span>
              </div>
              <div className="text-[11px] text-[#8892b0] font-mono tracking-tight hidden sm:block">
                Live Projects, Deep-Dives & Run Guides
              </div>
            </div>
          </button>
        </div>

        {/* Center: Nav Tabs ("All Articles & Projects", "CLI Run Sandbox", "GitHub Pages Guide") */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#112240]/80 border border-[#233554] p-1 rounded-lg">
          <button
            onClick={() => {
              setActiveTab('articles');
              if (activeProject) handleCloseProject();
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              activeTab === 'articles' && !activeProject
                ? 'bg-[#64ffda]/15 text-[#64ffda] border border-[#64ffda]/30 shadow-sm'
                : 'text-[#8892b0] hover:text-white hover:bg-[#233554]/50'
            }`}
          >
            All Articles & Projects
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              activeTab === 'cli'
                ? 'bg-[#64ffda]/15 text-[#64ffda] border border-[#64ffda]/30 shadow-sm'
                : 'text-[#8892b0] hover:text-white hover:bg-[#233554]/50'
            }`}
          >
            CLI Run Sandbox
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              activeTab === 'guide'
                ? 'bg-[#64ffda]/15 text-[#64ffda] border border-[#64ffda]/30 shadow-sm'
                : 'text-[#8892b0] hover:text-white hover:bg-[#233554]/50'
            }`}
          >
            GitHub Pages Guide
          </button>
        </nav>

        {/* Right Action CTAs ("Portfolio Home", GitHub link) */}
        <div className="flex items-center gap-2.5">
          <a
            href="../"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium text-slate-300 hover:text-[#64ffda] hover:bg-[#112240] border border-[#233554] transition-all"
            title="Navigate to portfolio homepage"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portfolio Home</span>
          </a>

          <a
            href="https://github.com/sanuzthapa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-[#64ffda]/10 text-[#64ffda] hover:bg-[#64ffda]/20 border border-[#64ffda]/30 transition-all"
            title="Sanuz Thapa's GitHub Profile"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* =========================================================================
          SLIM SUB-BAR DIRECTLY BELOW NAVBAR (Height ~41px)
         ========================================================================= */}
      <div className="h-[41px] bg-[#0d1c38] border-b border-[#233554] px-4 md:px-6 flex items-center justify-between text-xs font-mono z-40 select-none">
        {activeProject ? (
          <>
            {/* 1. < Back to All Projects & Articles button */}
            <button
              onClick={handleCloseProject}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#64ffda] transition-colors font-medium group cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#64ffda] transition-transform group-hover:-translate-x-0.5" />
              <span>Back to All Projects & Articles</span>
            </button>

            {/* 2. Status badge (e.g. • Production Ready) + title */}
            <div className="hidden md:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#64ffda]/15 text-[#64ffda] border border-[#64ffda]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#64ffda] animate-pulse"></span>
                {activeProject.status || '• Production Ready'}
              </span>
              <span className="text-[#8892b0]/50">•</span>
              <span className="text-slate-300 font-medium truncate max-w-sm lg:max-w-md">
                {activeProject.title}
              </span>
            </div>

            {/* 3. Link: Open in standalone window ↗ */}
            <a
              href={activeProject.standaloneUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#64ffda] hover:text-[#a8ffea] hover:underline transition-colors font-medium"
            >
              <span>Open in standalone window</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </>
        ) : (
          <>
            {/* Main feed sub-bar state */}
            <div className="flex items-center gap-2 text-[#8892b0]">
              <Sparkles className="w-3.5 h-3.5 text-[#64ffda]" />
              <span className="font-medium text-slate-300">Catalog Feed</span>
              <span className="text-[#8892b0]/50">•</span>
              <span className="hidden sm:inline text-[#8892b0]">
                Auto-Discovered HTML Projects from <code className="text-[#64ffda]">blog/public/posts/*.html</code>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#64ffda]"></span>
                • Production Ready
              </span>
              <span className="text-[11px] text-[#8892b0] hidden sm:inline">
                {projects.length} articles indexed
              </span>
            </div>
          </>
        )}
      </div>

      {/* =========================================================================
          2. CORE CONTENT AREA
             Case A: Active Project -> Full-Screen Edge-to-Edge Webpage Render
             Case B: Catalog Grid Feed (Home View)
         ========================================================================= */}
      {activeProject ? (
        /* Full-screen Edge-to-Edge container:
           - Removed all card containers, max-w constraints, sidebar widgets, padding, and borders
           - 100% viewport width and 100% remaining viewport height (flex-1 / calc(100vh-105px))
           - overflow-hidden so double scrollbars do NOT appear; scrolling is inside iframe */
        <main className="w-full flex-1 h-[calc(100vh-105px)] overflow-hidden bg-[#0a192f] relative">
          <iframe
            src={activeProject.standaloneUrl}
            title={activeProject.title}
            className="w-full h-full border-0 block"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </main>
      ) : (
        /* Standard Catalog Feed view */
        <div className="flex-1 flex flex-col">
          {/* CLI Run Sandbox Modal / Drawer View */}
          {activeTab === 'cli' && (
            <div className="bg-[#0b162c] border-b border-[#233554] px-4 md:px-8 py-6 transition-all">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-[#64ffda]" />
                    <h2 className="text-lg font-bold text-white font-mono">
                      CLI Run Sandbox & Local Execution
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('articles')}
                    className="p-1 text-slate-400 hover:text-white rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-[#8892b0] mb-4">
                  Every standalone project in this journal is designed to be fully reproducible
                  locally. Run these commands in your shell to clone, preview, or launch the interactive
                  environments:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#070d1e] border border-[#233554] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono text-[#64ffda]">Run Blog Dev Server</span>
                      <button
                        onClick={() => copyToClipboard('cd blog && npm run dev', 'run-dev')}
                        className="text-xs text-[#8892b0] hover:text-white flex items-center gap-1 font-mono"
                      >
                        {copiedCmd === 'run-dev' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        Copy
                      </button>
                    </div>
                    <code className="text-xs font-mono text-slate-300 block bg-[#0a192f] p-2.5 rounded border border-[#233554]/50">
                      git clone https://github.com/sanuzthapa/sanuzthapa.github.io.git<br/>
                      cd sanuzthapa.github.io/blog<br/>
                      npm install<br/>
                      npm run dev
                    </code>
                  </div>

                  <div className="bg-[#070d1e] border border-[#233554] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono text-[#64ffda]">Add New Standalone HTML Article</span>
                      <button
                        onClick={() => copyToClipboard('cp template.html blog/public/posts/my-new-post.html', 'add-post')}
                        className="text-xs text-[#8892b0] hover:text-white flex items-center gap-1 font-mono"
                      >
                        {copiedCmd === 'add-post' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        Copy
                      </button>
                    </div>
                    <code className="text-xs font-mono text-slate-300 block bg-[#0a192f] p-2.5 rounded border border-[#233554]/50">
                      # Place raw HTML with &lt;title&gt; and &lt;meta&gt; tags directly in:<br/>
                      blog/public/posts/your-project-slug.html<br/>
                      # Vite auto-discovers and indexes it automatically!
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GitHub Pages Architecture Guide */}
          {activeTab === 'guide' && (
            <div className="bg-[#0b162c] border-b border-[#233554] px-4 md:px-8 py-6 transition-all">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#64ffda]" />
                    <h2 className="text-lg font-bold text-white font-mono">
                      GitHub Pages Deployment & Standalone Post Architecture
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('articles')}
                    className="p-1 text-slate-400 hover:text-white rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="bg-[#070d1e] border border-[#233554] rounded-lg p-4">
                    <h3 className="font-bold text-[#64ffda] mb-2 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" /> 1. Public Auto-Discovery
                    </h3>
                    <p className="text-[#8892b0] leading-relaxed">
                      Files stored in <code className="text-slate-300">blog/public/posts/*.html</code> are served intact by Vite at <code className="text-slate-300">/blog/posts/*.html</code>.
                    </p>
                  </div>

                  <div className="bg-[#070d1e] border border-[#233554] rounded-lg p-4">
                    <h3 className="font-bold text-[#64ffda] mb-2 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" /> 2. Zero-Build HTML Parsing
                    </h3>
                    <p className="text-[#8892b0] leading-relaxed">
                      Vite imports HTML files eagerly with <code className="text-slate-300">?raw</code>. Title and metadata are extracted dynamically to populate catalog cards.
                    </p>
                  </div>

                  <div className="bg-[#070d1e] border border-[#233554] rounded-lg p-4">
                    <h3 className="font-bold text-[#64ffda] mb-2 flex items-center gap-1.5">
                      <Monitor className="w-4 h-4" /> 3. Edge-to-Edge Frame
                    </h3>
                    <p className="text-[#8892b0] leading-relaxed">
                      Clicking an article renders a borderless 100% viewport iframe without container clipping or double scrollbars, maintaining complete original CSS & JS isolation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Catalog Hero Section */}
          <section className="py-12 md:py-16 px-4 md:px-8 border-b border-[#233554]/50 bg-gradient-to-b from-[#0a192f] via-[#0d1c38]/50 to-[#0a192f]">
            <div className="max-w-6xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/30 mb-4">
                <Code2 className="w-3.5 h-3.5" />
                <span>INTERACTIVE ENGINEERING RESEARCH & STANDALONE POSTS</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Engineering Journal, <br className="hidden md:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64ffda] via-[#a8ffea] to-white">
                  Simulations & Live Guides
                </span>
              </h1>
              <p className="text-base md:text-lg text-[#8892b0] max-w-2xl leading-relaxed mb-8">
                Explore standalone interactive research artifacts, machine learning models, and
                econometric simulations. Each article operates as an isolated, complete web
                experience.
              </p>

              {/* Search & Category Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                {/* Search Box */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#8892b0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search articles, topics, algorithms, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#112240] border border-[#233554] focus:border-[#64ffda] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-[#8892b0] focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#64ffda] text-[#0a192f] font-semibold shadow-sm'
                          : 'bg-[#112240] text-[#8892b0] hover:text-white border border-[#233554]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Catalog Grid View */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-10">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20 bg-[#112240]/40 rounded-xl border border-[#233554] p-8">
                <Terminal className="w-12 h-12 text-[#64ffda] mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-white mb-2">No Articles Found</h3>
                <p className="text-sm text-[#8892b0] max-w-md mx-auto mb-4">
                  No standalone posts match your query "{searchQuery}". Place new HTML files in{' '}
                  <code className="text-[#64ffda] font-mono">blog/public/posts/*.html</code> to
                  auto-populate them here.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 rounded-md bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/30 text-xs font-mono hover:bg-[#64ffda]/20 transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="bg-[#112240] border border-[#233554] hover:border-[#64ffda] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col group"
                  >
                    {/* Top Card Bar */}
                    <div className="p-5 pb-0 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/20">
                        {project.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-[#8892b0] font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{project.date}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h2
                        onClick={() => handleOpenProject(project)}
                        className="text-lg font-bold text-white group-hover:text-[#64ffda] transition-colors cursor-pointer mb-2 line-clamp-2"
                      >
                        {project.title}
                      </h2>

                      <p className="text-sm text-[#8892b0] line-clamp-3 mb-4 flex-1">
                        {project.description}
                      </p>

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {project.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-mono text-[#8892b0] bg-[#0a192f] border border-[#233554] px-2 py-0.5 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Card Footer Actions */}
                      <div className="pt-4 border-t border-[#233554] flex items-center justify-between text-xs font-mono">
                        <button
                          onClick={() => handleOpenProject(project)}
                          className="inline-flex items-center gap-1.5 text-[#64ffda] font-semibold hover:text-white transition-colors cursor-pointer group/btn"
                        >
                          <span>Open Full Page</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                        </button>

                        <a
                          href={project.standaloneUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open standalone raw file in a new browser tab"
                          className="p-1.5 rounded text-[#8892b0] hover:text-[#64ffda] hover:bg-[#233554]/50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>

          {/* Simple Footer */}
          <footer className="mt-auto border-t border-[#233554] py-8 px-4 text-center text-xs font-mono text-[#8892b0]">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                © {new Date().getFullYear()} Sanuz Thapa • Engineering Journal & Standalone Lab
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="../"
                  className="hover:text-[#64ffda] transition-colors"
                >
                  Portfolio Home
                </a>
                <span>•</span>
                <a
                  href="https://github.com/sanuzthapa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#64ffda] transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
