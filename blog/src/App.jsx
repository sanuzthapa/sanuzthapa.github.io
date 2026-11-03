import React, { useState, useEffect, useMemo } from 'react';
import { loadProjects } from './lib/loadProjects';
import RunLocallyWidget from './components/RunLocallyWidget';
import MarkdownRenderer from './components/MarkdownRenderer';
import {
  ArrowLeft,
  Search,
  ExternalLink,
  Github,
  Calendar,
  Layers,
  Terminal,
  BookOpen,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Code2
} from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load projects on mount
  useEffect(() => {
    const loaded = loadProjects();
    setProjects(loaded);

    // Initial project from URL hash if provided
    const hash = window.location.hash.replace('#', '');
    if (hash && loaded.some((p) => p.id === hash)) {
      setSelectedProjectId(hash);
    } else if (loaded.length > 0) {
      setSelectedProjectId(loaded[0].id);
    }
  }, []);

  // Sync hash changes with state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && projects.some((p) => p.id === hash)) {
        setSelectedProjectId(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [projects]);

  const selectProject = (id) => {
    setSelectedProjectId(id);
    window.location.hash = id;
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Derive categories
  const categories = useMemo(() => {
    const cats = new Set();
    projects.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [projects]);

  // Filter projects based on search query and category
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        project.category.toLowerCase().includes(q) ||
        project.id.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  const currentProject = useMemo(() => {
    return (
      projects.find((p) => p.id === selectedProjectId) ||
      projects[0] ||
      null
    );
  }, [projects, selectedProjectId]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Top Persistent Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a
              href="/"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-cyan-400 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to Portfolio</span>
            </a>

            <div className="hidden md:flex items-center space-x-2 border-l border-slate-800 pl-4">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-sm font-semibold tracking-tight text-slate-200">
                Engineering Logs
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
                v2.0
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{projects.length} Case Studies</span>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle project menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-8">
        {/* Sidebar / Projects Directory */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 w-80 bg-[#0d1322] p-6 shadow-2xl transition-transform duration-300 md:static md:inset-auto md:w-80 md:bg-transparent md:p-0 md:shadow-none md:translate-x-0
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 md:hidden">
            <span className="font-mono text-sm font-semibold text-slate-200">
              Projects & Articles
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="sticky top-24 space-y-5">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search deep dives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-all font-medium ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Projects List */}
            <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {filteredProjects.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                  No case studies match your query.
                </div>
              ) : (
                filteredProjects.map((project) => {
                  const isSelected = project.id === currentProject?.id;
                  return (
                    <div
                      key={project.id}
                      onClick={() => selectProject(project.id)}
                      className={`group cursor-pointer p-3.5 rounded-xl border transition-all text-left relative overflow-hidden ${
                        isSelected
                          ? 'bg-[#131b2e] border-cyan-500/50 shadow-lg shadow-cyan-950/20'
                          : 'bg-slate-900/40 border-slate-800/70 hover:bg-slate-900 hover:border-slate-700/80'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-l"></div>
                      )}

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                        <span className="text-cyan-400/90 font-medium truncate max-w-[170px]">
                          {project.category}
                        </span>
                        {project.date && <span>{project.date}</span>}
                      </div>

                      <h3
                        className={`text-sm font-semibold leading-snug transition-colors line-clamp-2 ${
                          isSelected
                            ? 'text-white'
                            : 'text-slate-300 group-hover:text-cyan-300'
                        }`}
                      >
                        {project.title}
                      </h3>

                      {project.summary && (
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {project.summary}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-xs"
          />
        )}

        {/* Main Content Area: Project Case Study View */}
        <main className="flex-1 min-w-0">
          {currentProject ? (
            <article className="bg-[#0e1424]/80 border border-slate-800/90 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-sm">
              {/* Header Metadata */}
              <div className="space-y-4 pb-6 border-b border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    <Layers className="w-3 h-3 mr-1" />
                    {currentProject.category}
                  </span>
                  {currentProject.date && (
                    <span className="inline-flex items-center text-xs font-mono text-slate-400">
                      <Calendar className="w-3 h-3 mr-1 text-slate-500" />
                      {currentProject.date}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                  {currentProject.title}
                </h1>

                {currentProject.summary && (
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                    {currentProject.summary}
                  </p>
                )}

                {/* External Action Links */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {currentProject.githubUrl && (
                    <a
                      href={currentProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700/80 transition-all shadow-sm"
                    >
                      <Github className="w-4 h-4" />
                      <span>Source Repository</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  )}

                  {currentProject.demoUrl && (
                    <a
                      href={currentProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 transition-all shadow-sm"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* "How to Run Locally" Interactive Widget */}
              {(currentProject.runInstructions ||
                currentProject.envTemplate ||
                currentProject.verifyCommand) && (
                <RunLocallyWidget
                  runInstructions={currentProject.runInstructions}
                  envTemplate={currentProject.envTemplate}
                  verifyCommand={currentProject.verifyCommand}
                />
              )}

              {/* Markdown Body Viewer */}
              <div className="pt-4">
                <MarkdownRenderer content={currentProject.body} />
              </div>

              {/* Bottom Navigation */}
              <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <a
                  href="/"
                  className="inline-flex items-center space-x-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Return to Main Portfolio</span>
                </a>

                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
                >
                  ↑ Back to top
                </button>
              </div>
            </article>
          ) : (
            <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              No project selected.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

