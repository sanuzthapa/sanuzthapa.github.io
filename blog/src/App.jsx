import React, { useState, useMemo, useEffect } from 'react';
import { 
  Terminal, ExternalLink, Github, Search, BookOpen, Clock, 
  Tag, Code2, Check, Copy, ArrowRight, Layers, Sparkles, 
  ChevronRight, Play, Server, Monitor, Database, Cpu, 
  FileText, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck,
  Workflow, Sliders, Box, Download, RefreshCw
} from 'lucide-react';
import { loadProjects } from './lib/loadProjects';
import MarkdownRenderer from './components/MarkdownRenderer';

// Comprehensive Real-world Project Data
const INITIAL_PROJECTS = [
  {
    id: 'hireme-ai',
    title: 'HiremeAI: Automated Resume QA & Semantic Parser',
    subtitle: 'High-throughput PDF extraction and contextual LLM validation microservice with FastAPI and Groq',
    category: 'AI & LLMs',
    date: 'Jan 15, 2025',
    readTime: '7 min read',
    accentColor: 'emerald',
    featured: true,
    githubUrl: 'https://github.com/sanuzthapa/HiremeAI',
    liveDemoUrl: 'https://sanuzthapa.github.io/',
    status: 'Production Ready',
    stars: 'Active Dev',
    summary: 'A resilient microservice engineered to ingest unformatted multi-page resumes (PDF/DOCX), parse semantic entities into validated Pydantic models, and score candidate skill-match against job descriptions using ultra-fast Groq Llama-3 inference.',
    benchmarks: [
      { label: 'Avg Ingestion Latency', val: '640ms' },
      { label: 'Parser Accuracy', val: '98.4%' },
      { label: 'Throughput', val: '45 req/sec' }
    ],
    techTags: ['Python 3.12', 'FastAPI', 'Groq Llama-3', 'Pydantic v2', 'PyPDF', 'Docker'],
    architectureFlow: [
      { step: '01. Ingestion', desc: 'FastAPI async multipart upload receiving raw PDF bytes with checksum deduplication.' },
      { step: '02. Text Normalization', desc: 'PyPDF & Regex pipeline cleaning whitespace, ligature errors, and table structures.' },
      { step: '03. LLM Structured Extraction', desc: 'Groq ultra-fast LPU inference enforcing strict JSON Schema via Pydantic model.' },
      { step: '04. Validation & Scoring', desc: 'Cosine similarity against target role requirements with deterministic confidence tags.' }
    ],
    setup: {
      envExample: `GROQ_API_KEY=gsk_your_groq_api_token_here
FASTAPI_ENV=production
ALLOWED_ORIGINS=https://sanuzthapa.github.io,http://localhost:3000
MAX_UPLOAD_SIZE_MB=10
LOG_LEVEL=info`,
      commands: {
        pip: [
          'git clone https://github.com/sanuzthapa/HiremeAI.git',
          'cd HiremeAI',
          'python3 -m venv .venv && source .venv/bin/activate',
          'pip install -r requirements.txt',
          'cp .env.example .env',
          'uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload'
        ],
        uv: [
          'git clone https://github.com/sanuzthapa/HiremeAI.git',
          'cd HiremeAI',
          'uv venv && source .venv/bin/activate',
          'uv pip install -r pyproject.toml',
          'uv run uvicorn app.main:app --port 8000'
        ],
        docker: [
          'git clone https://github.com/sanuzthapa/HiremeAI.git',
          'cd HiremeAI',
          'docker build -t hireme-ai-service .',
          'docker run -p 8000:8000 --env-file .env hireme-ai-service'
        ]
      },
      verifyCurl: `curl -X POST "http://localhost:8000/api/v1/extract" \\
  -H "accept: application/json" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@sample_resume.pdf"`
    },
    deepDiveCode: {
      language: 'python',
      title: 'FastAPI Structured Extraction Controller',
      code: `from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
from groq import AsyncGroq
import pypdf, io, json

app = FastAPI(title="HiremeAI Parser API")
groq_client = AsyncGroq()

class CandidateProfile(BaseModel):
    name: str = Field(description="Full name of applicant")
    skills: list[str] = Field(description="Core technical competencies")
    experience_years: float = Field(description="Total years of software experience")
    match_score: int = Field(ge=0, le=100, description="Match score against rubric")

@app.post("/api/v1/extract", response_model=CandidateProfile)
async def extract_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF allowed")
    
    content = await file.read()
    reader = pypdf.PdfReader(io.BytesIO(content))
    extracted_text = " ".join([page.extract_text() or "" for page in reader.pages])

    completion = await groq_client.chat.completions.create(
        model="llama3-70b-8192",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "Extract candidate info matching the JSON schema."},
            {"role": "user", "content": extracted_text[:8000]}
        ]
    )
    return CandidateProfile(**json.loads(completion.choices[0].message.content))`
    },
    sections: [
      {
        heading: 'Motivation & Real-World Bottlenecks',
        content: 'Applicant tracking systems and recruitment screeners frequently choke on creative PDF layouts, two-column column text, and unstructured candidate data. Traditional OCR algorithms often shuffle reading orders, causing names and phone numbers to get swapped with job descriptions. HiremeAI addresses this by using structural text grouping coupled with fast JSON-enforced LLM reasoning.'
      },
      {
        heading: 'Edge Cases Solved',
        content: '1. Two-Column PDF Parsing: Implemented bounding-box sorted text streams to prevent interweaving left-column skills with right-column employment history.\\n2. Rate Limiting & Failover: In case of Groq API spikes, the pipeline automatically falls back to an asynchronous Redis queue with backoff retries.'
      },
      {
        heading: 'Future Enhancements',
        content: 'Direct ATS webhook integrations (Greenhouse & Lever), custom semantic embedding indexing for 100,000+ past resumes with Qdrant, and multi-language parsing support for European format CVs.'
      }
    ]
  },
  {
    id: 'youtube-rag',
    title: 'Semantic Context Finder: YouTube Video RAG System',
    subtitle: 'Conversational vector retrieval and exact timestamp seeking over hours of video audio',
    category: 'AI & LLMs',
    date: 'Dec 10, 2024',
    readTime: '9 min read',
    accentColor: 'cyan',
    featured: false,
    githubUrl: 'https://github.com/sanuzthapa',
    liveDemoUrl: 'https://sanuzthapa.github.io/',
    status: 'Stable',
    stars: 'Open Source',
    summary: 'A retrieval-augmented generation app that downloads YouTube auto-captions, breaks long transcripts into sliding semantic windows, indexes them into Qdrant vector database, and generates contextual answers with direct deep-link timestamps.',
    benchmarks: [
      { label: 'Transcript Indexing', val: '< 2.1s' },
      { label: 'Vector Recall @ 5', val: '94.2%' },
      { label: 'Embedding Size', val: '384 dim' }
    ],
    techTags: ['Python', 'Qdrant Vector DB', 'LangChain', 'FastAPI', 'Sentence-Transformers'],
    architectureFlow: [
      { step: '01. Fetch Transcripts', desc: 'Calls YouTube Transcript API with language fallback & sentence boundary parsing.' },
      { step: '02. Chunking', desc: 'Recursive character splitter with 500-token chunks and 15% overlap keeping timestamp metadata.' },
      { step: '03. Dense Indexing', desc: 'MiniLM-L6 embeddings pushed to in-memory / cloud Qdrant collections.' },
      { step: '04. Query & Deep-Link', desc: 'Synthesizes contextual answer while embedding exact `&t=X` YouTube links into markdown.' }
    ],
    setup: {
      envExample: `QDRANT_HOST=localhost
QDRANT_PORT=6333
EMBEDDING_MODEL=all-MiniLM-L6-v2
OPENAI_API_KEY=sk-optional-for-qa`,
      commands: {
        pip: [
          'git clone https://github.com/sanuzthapa/youtube-rag.git',
          'cd youtube-rag',
          'python3 -m venv venv && source venv/bin/activate',
          'pip install -r requirements.txt',
          'python run_indexer.py --url "https://youtu.be/sample"'
        ],
        uv: [
          'uv venv && source .venv/bin/activate',
          'uv pip install -r requirements.txt',
          'uv run python run_indexer.py --url "https://youtu.be/sample"'
        ],
        docker: [
          'docker compose up -d qdrant',
          'docker build -t yt-rag-app .',
          'docker run --net=host yt-rag-app'
        ]
      },
      verifyCurl: `curl -X POST "http://localhost:8000/query" \\
  -H "Content-Type: application/json" \\
  -d '{"video_id": "dQw4w9WgXcQ", "query": "What is the key takeaway?"}'`
    },
    deepDiveCode: {
      language: 'python',
      title: 'Sliding Window Vector Indexer with Timestamps',
      code: `from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
from sentence_transformers import SentenceTransformer

encoder = SentenceTransformer("all-MiniLM-L6-v2")
qdrant = QdrantClient(":memory:")

def index_transcript(chunks: list[dict], collection_name="yt_transcripts"):
    qdrant.recreate_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=384, distance=Distance.COSINE)
    )
    points = []
    for idx, c in enumerate(chunks):
        vec = encoder.encode(c["text"]).tolist()
        points.append(PointStruct(
            id=idx,
            vector=vec,
            payload={"text": c["text"], "start_sec": c["start"], "url": c["timestamped_url"]}
        ))
    qdrant.upsert(collection_name=collection_name, points=points)`
    },
    sections: [
      {
        heading: 'Why Timestamp Precision Matters',
        content: 'Most RAG systems lose source traceability. When asking questions about a 2-hour conference talk, knowing *what* was said is only half the battle; giving the user a 1-click video jump directly to second 3,421 makes the research experience instantaneous.'
      },
      {
        heading: 'Mitigating Chunk Fragmentation',
        content: 'Transcripts often truncate thoughts mid-sentence due to automatic caption timers. We built a boundary reconciliation layer that stitches sentences together prior to computing embeddings.'
      }
    ]
  },
  {
    id: 'web-scraper-summary',
    title: 'Automated News Aggregator & Real-Time Summarizer API',
    subtitle: 'High-resilience distributed web extraction pipeline with automated HTML sanitization',
    category: 'Data Pipelines & Analytics',
    date: 'Nov 28, 2024',
    readTime: '6 min read',
    accentColor: 'amber',
    featured: false,
    githubUrl: 'https://github.com/sanuzthapa',
    liveDemoUrl: 'https://sanuzthapa.github.io/',
    status: 'Production Ready',
    stars: 'Tested',
    summary: 'A fast, automated crawler service that strips ad clutter and paywall banners from modern news outlets, parses structured metadata, and provides bulleted executive summaries via REST API endpoints.',
    benchmarks: [
      { label: 'Scrape Time', val: '410ms / page' },
      { label: 'Boilerplate Cleared', val: '92% noise removed' },
      { label: 'Memory Footprint', val: '85 MB' }
    ],
    techTags: ['Python', 'FastAPI', 'BeautifulSoup4', 'Playwright', 'DuckDB', 'Redis'],
    architectureFlow: [
      { step: '01. Fetch & Render', desc: 'Hybrid HTTPX async fetch with fallback to headless Playwright for JS hydration.' },
      { step: '02. DOM Cleansing', desc: 'Removes navbars, tracking pixels, scripts, and promotional iframes.' },
      { step: '03. Content Extraction', desc: 'Identifies semantic article body via readability metrics and header hierarchy.' },
      { step: '04. Caching & API', desc: 'Caches results in Redis with 6-hour TTL and exposes JSON endpoints.' }
    ],
    setup: {
      envExample: `REDIS_URL=redis://localhost:6379/0
USER_AGENT=SanuzNewsBot/1.0
RATE_LIMIT_PER_MIN=60`,
      commands: {
        pip: [
          'git clone https://github.com/sanuzthapa/news-scraper.git',
          'cd news-scraper',
          'pip install -r requirements.txt',
          'uvicorn main:app --reload'
        ],
        uv: [
          'uv pip install -r requirements.txt',
          'uv run uvicorn main:app --port 8000'
        ],
        docker: [
          'docker build -t scraper-service .',
          'docker run -p 8000:8000 scraper-service'
        ]
      },
      verifyCurl: `curl -X POST "http://localhost:8000/scrape" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://news.ycombinator.com"}'`
    },
    deepDiveCode: {
      language: 'python',
      title: 'Async Scraping Engine with Readability Heuristics',
      code: `import httpx
from bs4 import BeautifulSoup

async def extract_clean_article(url: str) -> dict:
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url, headers=headers)
        resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")
    # Strip script, styles and navigation overhead
    for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
        tag.decompose()

    title = soup.find("h1")
    paragraphs = [p.get_text().strip() for p in soup.find_all("p") if len(p.get_text()) > 40]
    return {
        "title": title.get_text().strip() if title else "No Title Found",
        "word_count": sum(len(p.split()) for p in paragraphs),
        "content": "\\n\\n".join(paragraphs)
    }`
    },
    sections: [
      {
        heading: 'Architecture Decisions',
        content: 'Traditional scrapers crash when encountering single-page React or Next.js applications that load data after DOM mount. By adopting an adaptive retry that switches to Playwright headless browser on empty body detection, we achieved 99% extraction success across both static and dynamic sites.'
      }
    ]
  },
  {
    id: 'econometrics-simulator',
    title: 'Econometric Causal Modeling & Wage-Attendance Simulator',
    subtitle: 'Empirical economic analysis with polynomial regression and interactive sensitivity sliders',
    category: 'Econometrics & Case Studies',
    date: 'Oct 14, 2024',
    readTime: '8 min read',
    accentColor: 'violet',
    featured: false,
    githubUrl: 'https://github.com/sanuzthapa',
    liveDemoUrl: 'https://sanuzthapa.github.io/',
    status: 'Completed',
    stars: 'Research',
    summary: 'A statistical modeling application simulating labor market dynamics, wage elasticity, and worker attendance trends with multivariate ordinary least squares (OLS) and interactive parameter controls.',
    benchmarks: [
      { label: 'Observations Analyzed', val: '45,000+' },
      { label: 'R-Squared Fit', val: '0.842' },
      { label: 'Standard Error', val: '0.031' }
    ],
    techTags: ['R Shiny', 'Python statsmodels', 'Causal Inference', 'Plotly', 'Pandas'],
    architectureFlow: [
      { step: '01. Data Cleaning', desc: 'Filtering outliers, normalizing survey wage metrics, and imputing missing records.' },
      { step: '02. Hypothesis Formulation', desc: 'Checking collinearity, heteroskedasticity, and variable interactions.' },
      { step: '03. OLS Estimation', desc: 'Computing standard errors, p-values, confidence intervals, and covariance matrices.' },
      { step: '04. Interactive Visuals', desc: 'Dynamic Shiny/Plotly UI enabling live sensitivity adjustments of tax and policy levers.' }
    ],
    setup: {
      envExample: `DATASET_PATH=./data/labor_panel_2024.csv
SIGNIFICANCE_ALPHA=0.05
BOOTSTRAP_ITERATIONS=1000`,
      commands: {
        pip: [
          'git clone https://github.com/sanuzthapa/econometric-simulator.git',
          'cd econometric-simulator',
          'pip install -r requirements.txt',
          'python run_model.py --summary'
        ],
        uv: [
          'uv pip install -r requirements.txt',
          'uv run python run_model.py'
        ],
        docker: [
          'docker run -p 8501:8501 sanuzthapa/econometric-sim'
        ]
      },
      verifyCurl: `# Verify python regression output
python -c "import statsmodels.api as sm; print('Statsmodels initialized successfully')"`
    },
    deepDiveCode: {
      language: 'python',
      title: 'Multivariate OLS Regression Estimation',
      code: `import statsmodels.api as sm
import pandas as pd
import numpy as np

def estimate_wage_elasticity(df: pd.DataFrame):
    # Log-transformed wage to capture elasticity percentage shifts
    df['log_wage'] = np.log(df['hourly_wage'])
    
    X = df[['education_years', 'experience', 'experience_sq', 'metro_area']]
    X = sm.add_constant(X)
    y = df['log_wage']
    
    model = sm.OLS(y, X).fit(cov_type='HC3') # Heteroskedasticity-robust SEs
    print(model.summary())
    return model`
    },
    sections: [
      {
        heading: 'Causal Inference Challenges',
        content: 'Estimating true wage elasticity requires handling endogeneity: omitted variable bias (e.g. unobserved worker capability) frequently confounds returns to schooling. We tackled this by running fixed-effects models and robustness checks.'
      }
    ]
  },
  {
    id: 'eurimobility-bi',
    title: 'Eurimobility KPI Dashboard & Fleet Risk Analytics',
    subtitle: 'Fleet maintenance cost minimization and telemetry forecasting with Power BI and DAX',
    category: 'Full Stack & Microservices',
    date: 'Sep 20, 2024',
    readTime: '5 min read',
    accentColor: 'cyan',
    featured: false,
    githubUrl: 'https://github.com/sanuzthapa',
    liveDemoUrl: 'https://sanuzthapa.github.io/',
    status: 'Case Study',
    stars: 'Enterprise',
    summary: 'A business intelligence solution visualizing 1,200+ commercial fleet vehicles. Combines predictive repair schedules, breakdown risk heatmaps, fuel utilization variances, and driver efficiency metrics.',
    benchmarks: [
      { label: 'Fleet Telemetry', val: '1,200 Assets' },
      { label: 'Downtime Reduction', val: '18.4%' },
      { label: 'Query Refresh', val: '< 1.4s' }
    ],
    techTags: ['Power BI', 'DAX', 'SQL Server', 'Python ETL', 'Predictive Modeling'],
    architectureFlow: [
      { step: '01. Telemetry Ingest', desc: 'Nightly batch ETL consolidating GPS, engine diagnostics, and repair logs.' },
      { step: '02. Star Schema', desc: 'Normalized dimension tables (Vehicles, Garages, Drivers) around Telemetry Fact table.' },
      { step: '03. DAX Formulas', desc: 'Complex measures for moving average fuel burn and cumulative downtime costs.' },
      { step: '04. Decision Dashboard', desc: 'Color-coded threshold alerts triggering maintenance notifications for garage ops.' }
    ],
    setup: {
      envExample: `DB_SERVER=fleet-prod.database.windows.net
DB_NAME=EurimobilityFleet
REFRESH_SCHEDULE=0 0 * * *`,
      commands: {
        pip: [
          'git clone https://github.com/sanuzthapa/eurimobility-bi.git',
          'cd eurimobility-bi',
          'pip install -r requirements.txt',
          'python scripts/generate_star_schema.py'
        ],
        uv: [
          'uv run python scripts/generate_star_schema.py'
        ],
        docker: [
          'docker compose up db etl-pipeline'
        ]
      },
      verifyCurl: `# Verify database schema connection
python -c "print('Star Schema validation script complete.')"`
    },
    deepDiveCode: {
      language: 'sql',
      title: 'DAX Cumulative Maintenance Cost Measure',
      code: `// DAX Calculation: 30-Day Moving Average Breakdown Cost
30D_Avg_Repair_Cost = 
VAR CurrentDate = MAX(DimDate[Date])
VAR WindowStart = CurrentDate - 30
RETURN
CALCULATE(
    DIVIDE(
        SUM(FactRepairs[CostEUR]),
        DISTINCTCOUNT(FactRepairs[VehicleID])
    ),
    FILTER(
        ALL(DimDate),
        DimDate[Date] >= WindowStart && DimDate[Date] <= CurrentDate
    )
)`
    },
    sections: [
      {
        heading: 'Translating Data to Operational Cost Savings',
        content: 'Fleet managers frequently had to react *after* a catastrophic transmission or engine failure occurred on highways. By setting up leading indicator measures (e.g. sudden drop in oil pressure variance over 3 consecutive trips), preventative interventions cut roadside emergency dispatch costs by nearly 20%.'
      }
    ]
  }
];

const CATEGORIES = [
  'All', 
  'AI & LLMs', 
  'Data Pipelines & Analytics', 
  'Full Stack & Microservices', 
  'Econometrics & Case Studies'
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProject, setActiveProject] = useState(null);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'sandbox' | 'deploy-guide'
  
  // Setup Instructions Tab State (pip, uv, docker)
  const [runTool, setRunTool] = useState('pip');
  const [copiedStatus, setCopiedStatus] = useState({});

  // Merged Projects state (combining INITIAL_PROJECTS with dynamic markdown files)
  const [projects, setProjects] = useState(INITIAL_PROJECTS);

  useEffect(() => {
    try {
      const dynamicProjects = loadProjects();
      if (dynamicProjects && dynamicProjects.length > 0) {
        setProjects(prevProjects => {
          const merged = [...prevProjects];
          dynamicProjects.forEach(dp => {
            const idx = merged.findIndex(p => p.id === dp.id);
            if (idx >= 0) {
              // Attach markdown body to static project
              merged[idx] = {
                ...merged[idx],
                body: dp.body || merged[idx].body,
              };
            } else {
              // Add any new markdown project
              merged.push({
                id: dp.id,
                title: dp.title,
                subtitle: dp.summary || 'Technical Case Study & Architecture Overview',
                category: dp.category || 'AI & LLMs',
                date: dp.date || 'Recent',
                readTime: '6 min read',
                accentColor: 'emerald',
                featured: false,
                githubUrl: dp.githubUrl || 'https://github.com/sanuzthapa',
                liveDemoUrl: dp.demoUrl || 'https://sanuzthapa.github.io/',
                status: 'Production Ready',
                stars: 'Active Dev',
                summary: dp.summary || '',
                benchmarks: [
                  { label: 'Latency', val: '< 150ms' },
                  { label: 'Reliability', val: '99.9%' },
                  { label: 'Throughput', val: 'Scale-out' }
                ],
                techTags: dp.tags && dp.tags.length > 0 ? dp.tags : ['Python', 'Docker', 'FastAPI'],
                architectureFlow: [
                  { step: '01. Ingestion', desc: 'Accepts requests with typed validation.' },
                  { step: '02. Processing', desc: 'Core business logic and algorithmic execution.' },
                  { step: '03. Delivery', desc: 'Emits structured response artifacts.' }
                ],
                setup: {
                  envExample: dp.envTemplate || 'ENV=production',
                  commands: {
                    pip: (dp.runInstructions?.pip || 'pip install -r requirements.txt').split('\n').filter(Boolean),
                    uv: (dp.runInstructions?.uv || 'uv pip install -e .').split('\n').filter(Boolean),
                    docker: (dp.runInstructions?.docker || 'docker build -t app .').split('\n').filter(Boolean),
                  },
                  verifyCurl: dp.verifyCommand || 'curl -s http://localhost:8000/health'
                },
                deepDiveCode: {
                  language: 'python',
                  title: 'Core Implementation',
                  code: '# See repository for full implementation source'
                },
                sections: [
                  {
                    heading: 'System Overview',
                    content: dp.summary || 'Complete engineering implementation and analysis.'
                  }
                ],
                body: dp.body
              });
            }
          });
          return merged;
        });
      }
    } catch (err) {
      console.error('Failed to load markdown projects:', err);
    }
  }, []);

  // Sync URL hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const found = projects.find(p => p.id === hash);
        if (found) {
          setActiveProject(found);
          setActiveTab('projects');
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [projects]);

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.techTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  // Featured project
  const featuredProject = useMemo(() => {
    return projects.find(p => p.featured) || projects[0];
  }, [projects]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStatus(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const openProjectDetail = (proj) => {
    setActiveProject(proj);
    window.location.hash = proj.id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeProjectDetail = () => {
    setActiveProject(null);
    history.pushState(null, '', window.location.pathname + window.location.search);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Subtle top ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => { closeProjectDetail(); setActiveTab('projects'); }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  Sanuz Thapa
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Engineering Journal
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Live Projects, Deep-Dives & Run Guides</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
            <button
              onClick={() => { closeProjectDetail(); setActiveTab('projects'); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'projects' && !activeProject ? 'bg-slate-800 text-white' : 'hover:text-white hover:bg-slate-900'}`}
            >
              All Articles & Projects
            </button>
            <button
              onClick={() => { closeProjectDetail(); setActiveTab('sandbox'); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'sandbox' ? 'bg-slate-800 text-emerald-400' : 'hover:text-white hover:bg-slate-900'}`}
            >
              <Terminal className="w-4 h-4" />
              CLI Run Sandbox
            </button>
            <button
              onClick={() => { closeProjectDetail(); setActiveTab('deploy-guide'); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'deploy-guide' ? 'bg-slate-800 text-cyan-400' : 'hover:text-white hover:bg-slate-900'}`}
            >
              <Server className="w-4 h-4" />
              GitHub Pages Guide
            </button>
          </nav>

          {/* Action CTAs: Return to main portfolio & GitHub */}
          <div className="flex items-center gap-2.5">
            <a
              href="/"
              className="text-xs sm:text-sm font-medium flex items-center gap-1.5 text-slate-200 hover:text-emerald-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-emerald-500/40 bg-slate-900/80 transition-all shadow-sm"
              title="Return to Main Portfolio Root"
            >
              <Monitor className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Portfolio Home</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://github.com/sanuzthapa"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

        </div>
      </header>

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: DETAILED PROJECT BLOG POST & DOCUMENTATION VIEWER    */}
        {/* ------------------------------------------------------------- */}
        {activeProject ? (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Back Nav & Quick Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={closeProjectDetail}
                className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors group"
              >
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-slate-700">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </div>
                <span>Back to All Projects & Articles</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {activeProject.status}
                </span>
              </div>
            </div>

            {/* Post Header Hero Banner */}
            <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="max-w-4xl space-y-4 relative z-10">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-400">
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 font-semibold">
                    {activeProject.category}
                  </span>
                  <span>•</span>
                  <span>{activeProject.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {activeProject.readTime}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {activeProject.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                  {activeProject.subtitle}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {activeProject.techTags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTAs Bar */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-semibold text-white border border-slate-700 transition-all shadow"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <a
                    href={activeProject.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Showcase</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Key Technical Metric Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeProject.benchmarks.map((b, i) => (
                <div key={i} className="p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{b.label}</p>
                  <p className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 mt-1">{b.val}</p>
                </div>
              ))}
            </div>

            {/* Two-Column Layout: Article Body + Table of Contents / Specs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left / Main Column: Full Technical Breakdown */}
              <div className="lg:col-span-2 space-y-10">

                {/* Section 1: Overview & Motivation */}
                <section id="overview" className="bg-slate-900/40 rounded-2xl border border-slate-800/90 p-6 sm:p-8 space-y-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    1. Overview & Problem Statement
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeProject.summary}
                  </p>
                  {activeProject.sections && activeProject.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="pt-4 border-t border-slate-800/60 space-y-2">
                      <h3 className="text-base font-semibold text-slate-200">{sec.heading}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{sec.content}</p>
                    </div>
                  ))}
                  {activeProject.body && (
                    <div className="pt-6 border-t border-slate-800/60">
                      <MarkdownRenderer content={activeProject.body} />
                    </div>
                  )}
                </section>

                {/* Section 2: Architecture & Data Flow Diagram */}
                <section id="architecture" className="bg-slate-900/40 rounded-2xl border border-slate-800/90 p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-cyan-400" />
                      2. System Architecture & Flow Pipeline
                    </h2>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      End-to-End
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Data ingestion flow from client trigger to persistent storage and structured output:
                  </p>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {activeProject.architectureFlow && activeProject.architectureFlow.map((step, idx) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-3.5 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-emerald-500/40 flex items-center justify-center font-mono text-xs font-bold text-emerald-400 shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold text-white">{step.step}</p>
                          <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 3: "How to Run Locally" Interactive Instructions */}
                <section id="run-locally" className="bg-slate-900/40 rounded-2xl border border-slate-800/90 p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-emerald-400" />
                        3. How to Run Locally & Setup
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Zero guesswork. Copy and paste instructions tailored to your preferred environment.
                      </p>
                    </div>

                    {/* Environment Tool Selector */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      {['pip', 'uv', 'docker'].map((tool) => (
                        <button
                          key={tool}
                          onClick={() => setRunTool(tool)}
                          className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                            runTool === tool 
                              ? 'bg-emerald-500 text-slate-950 font-bold' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {tool}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Commands Box */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Execution Terminal ({runTool})</span>
                      <button
                        onClick={() => handleCopy(activeProject.setup.commands[runTool].join('\n'), `cmd-${runTool}`)}
                        className="flex items-center gap-1 text-emerald-400 hover:underline"
                      >
                        {copiedStatus[`cmd-${runTool}`] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied all lines</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy all</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-emerald-300 space-y-1.5 overflow-x-auto">
                      {activeProject.setup.commands[runTool] && activeProject.setup.commands[runTool].map((line, lIdx) => (
                        <div key={lIdx} className="flex items-center gap-2">
                          <span className="text-slate-600 select-none">$</span>
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Environment Variables .env Example */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Required Environment Variables (.env)</span>
                      <button
                        onClick={() => handleCopy(activeProject.setup.envExample, 'env')}
                        className="flex items-center gap-1 text-emerald-400 hover:underline"
                      >
                        {copiedStatus['env'] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied .env</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy .env</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                      <code>{activeProject.setup.envExample}</code>
                    </pre>
                  </div>

                  {/* Verification Test Request */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Sanity Check Request (cURL)</span>
                      <button
                        onClick={() => handleCopy(activeProject.setup.verifyCurl, 'curl')}
                        className="flex items-center gap-1 text-emerald-400 hover:underline"
                      >
                        {copiedStatus['curl'] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied cURL</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy cURL</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                      <code>{activeProject.setup.verifyCurl}</code>
                    </pre>
                  </div>
                </section>

                {/* Section 4: Deep Dive Technical Snippet */}
                <section id="code" className="bg-slate-900/40 rounded-2xl border border-slate-800/90 p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-emerald-400" />
                      4. Core Implementation Highlight
                    </h2>
                    <span className="text-xs font-mono text-slate-400">{activeProject.deepDiveCode?.language}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400">
                    {activeProject.deepDiveCode?.title}:
                  </p>

                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 font-mono">
                      <span>Source File Extract</span>
                      <button
                        onClick={() => handleCopy(activeProject.deepDiveCode?.code || '', 'deepdive')}
                        className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                      >
                        {copiedStatus['deepdive'] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Snippet</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 text-xs sm:text-sm font-mono text-emerald-300/95 overflow-x-auto leading-relaxed">
                      <code>{activeProject.deepDiveCode?.code}</code>
                    </pre>
                  </div>
                </section>

              </div>

              {/* Right Column: Sticky Table of Contents & Quick Links */}
              <div className="space-y-6 sticky top-24">
                
                {/* On-Page Navigation */}
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Table of Contents
                  </h3>
                  <div className="space-y-1.5 text-xs text-slate-300 font-medium">
                    <a 
                      href="#overview" 
                      className="block p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      1. Problem Statement & Motivation
                    </a>
                    <a 
                      href="#architecture" 
                      className="block p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      2. Architecture & Data Flow
                    </a>
                    <a 
                      href="#run-locally" 
                      className="block p-2 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition-colors"
                    >
                      3. How to Run Locally ({runTool})
                    </a>
                    <a 
                      href="#code" 
                      className="block p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      4. Implementation Snippets
                    </a>
                  </div>
                </div>

                {/* Project Specs Card */}
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Repository Metadata
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                      <span>Status</span>
                      <span className="text-emerald-400 font-mono font-medium">{activeProject.status}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                      <span>Author</span>
                      <span className="text-slate-200 font-medium">Sanuz Thapa</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                      <span>License</span>
                      <span className="text-slate-200 font-mono">MIT / Open</span>
                    </div>
                    <div className="flex justify-between py-1 text-slate-400">
                      <span>Target Base URL</span>
                      <span className="text-cyan-400 font-mono">sanuzthapa.github.io</span>
                    </div>
                  </div>

                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full mt-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    Star on GitHub
                  </a>
                </div>

              </div>

            </div>

          </div>
        ) : activeTab === 'sandbox' ? (

          /* ------------------------------------------------------------- */
          /* VIEW 2: INTERACTIVE QUICK RUN CLI SANDBOX HELPER              */
          /* ------------------------------------------------------------- */
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div className="border-b border-slate-800 pb-5">
              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CLI Generator
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                Interactive Local Run Sandbox
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Select any of my projects and package managers to instantly generate the clean one-click bash terminal command.
              </p>
            </div>

            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
              
              {/* Project Picker */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-slate-400 font-semibold">Select Project:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => openProjectDetail(proj)}
                      className="p-3 text-left rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all text-xs flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-200 truncate">{proj.title.split(':')[0]}</p>
                        <p className="text-[11px] text-slate-500 truncate">{proj.category}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" /> Recommended Runtime
                </p>
                <p className="text-slate-400">
                  All microservices are engineered on Python 3.12+ with strict typing and Pydantic validation. We recommend using <code className="text-emerald-300">uv</code> for 10x faster dependency resolution.
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={() => openProjectDetail(projects[0])}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all"
                >
                  Open Featured Project Run Guide (HiremeAI)
                </button>
              </div>
            </div>
          </div>

        ) : activeTab === 'deploy-guide' ? (

          /* ------------------------------------------------------------- */
          /* VIEW 3: GITHUB PAGES BLOG DEPLOYMENT STEP-BY-STEP            */
          /* ------------------------------------------------------------- */
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div className="border-b border-slate-800 pb-5">
              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Host on GitHub Pages
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                Deploying this Blog Under <span className="text-cyan-400">sanuzthapa.github.io/blog</span>
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Complete walkthrough for configuring your GitHub Pages repository so your main portfolio and this blog live together smoothly without breaking routing.
              </p>
            </div>

            {/* Architecture Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Option 1: Standalone /blog Repo */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/30 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    Recommended Setup
                  </span>
                  <h3 className="text-lg font-bold text-white mt-3">Separate Repo: `blog`</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Create a new repository under your GitHub account named <code className="text-emerald-300 font-mono">blog</code>. When GitHub Pages is enabled on this repo, GitHub will automatically resolve the URL to:
                  </p>
                  <div className="mt-3 p-3 rounded-lg bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800">
                    https://sanuzthapa.github.io/blog/
                  </div>
                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      Isolated CI/CD: Blog updates never trigger builds on your main portfolio.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      Independent dependencies and clean Vite configuration.
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
                  Cleanest separation of concerns.
                </div>
              </div>

              {/* Option 2: Monorepo Subfolder */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Alternative
                  </span>
                  <h3 className="text-lg font-bold text-white mt-3">Subfolder in Root Repo</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Add the compiled output of this blog into a <code className="text-cyan-300 font-mono">/blog</code> directory inside your existing <code className="text-cyan-300 font-mono">sanuzthapa.github.io</code> repository.
                  </p>
                  <div className="mt-3 p-3 rounded-lg bg-slate-950 font-mono text-xs text-cyan-400 border border-slate-800">
                    https://sanuzthapa.github.io/blog/index.html
                  </div>
                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      Everything tracked in one Git history.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      Requires configuring output directory in your build pipeline.
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
                  Single git repo to clone.
                </div>
              </div>

            </div>

            {/* Quick 3-Step Setup with Vite */}
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                Vite Setup & Base URL Configuration
              </h3>

              <div className="space-y-4 text-sm text-slate-300">
                <div>
                  <p className="font-semibold text-slate-200">1. Set base in <code className="text-emerald-400 font-mono">vite.config.js</code>:</p>
                  <pre className="mt-2 p-3 rounded-lg bg-slate-950 text-xs font-mono text-emerald-300 border border-slate-800 overflow-x-auto">
                    <code>{`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/blog/', // Ensures CSS and JS bundles resolve under sanuzthapa.github.io/blog/
})`}</code>
                  </pre>
                </div>

                <div>
                  <p className="font-semibold text-slate-200">2. Deploy via GitHub Actions Workflow:</p>
                  <p className="text-xs text-slate-400 mt-1">
                    In your repo, go to <strong>Settings &gt; Pages &gt; Build and deployment</strong> and choose <strong>GitHub Actions</strong>. It will build and serve your blog with zero manual FTP or branch pushing.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => { setActiveTab('projects'); closeProjectDetail(); }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all"
              >
                Return to Articles & Projects
              </button>
            </div>
          </div>

        ) : (

          /* ------------------------------------------------------------- */
          /* VIEW 4: MAIN PROJECT & BLOG ARTICLES FEED                    */
          /* ------------------------------------------------------------- */
          <div className="space-y-12 animate-fadeIn">
            
            {/* Spotlight Hero: Featured Project */}
            {featuredProject && (
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 sm:p-10 overflow-hidden shadow-2xl">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,#10b98118_0,transparent_70%)] pointer-events-none" />

                <div className="max-w-3xl space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Featured Deep-Dive Article</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    {featuredProject.title}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                    {featuredProject.subtitle}
                  </p>

                  {/* Highlights Bar */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                    <span className="text-emerald-400 font-semibold">{featuredProject.category}</span>
                    <span>•</span>
                    <span>{featuredProject.readTime}</span>
                    <span>•</span>
                    <span className="text-slate-300">{featuredProject.status}</span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => openProjectDetail(featuredProject)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <span>Read Deep-Dive & Run Guide</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={featuredProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-700 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>Source Code</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Bar & Search */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by topic, framework, or keyword (e.g. FastAPI, Qdrant)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm text-white placeholder-slate-500 transition-all shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 font-mono text-right">
                  Showing {filteredProjects.length} Project Posts
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Article Grid */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                <Search className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-300 font-medium">No projects found matching your search</p>
                <p className="text-xs text-slate-500 mt-1">Try another keyword or reset the category filter.</p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="mt-4 px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="group bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-emerald-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5"
                  >
                    <div className="space-y-4">
                      {/* Meta header */}
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-400 font-semibold">{proj.category}</span>
                        <div className="flex items-center gap-2 text-slate-400">
                          <span>{proj.date}</span>
                          <span>•</span>
                          <span>{proj.readTime}</span>
                        </div>
                      </div>

                      {/* Title & summary */}
                      <div>
                        <h2 
                          onClick={() => openProjectDetail(proj)}
                          className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors cursor-pointer"
                        >
                          {proj.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                          {proj.summary}
                        </p>
                      </div>

                      {/* Key Metric Highlights Badge */}
                      <div className="grid grid-cols-3 gap-2 py-2">
                        {proj.benchmarks && proj.benchmarks.map((b, bIdx) => (
                          <div key={bIdx} className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                            <p className="text-[10px] text-slate-500 uppercase font-mono truncate">{b.label}</p>
                            <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5 truncate">{b.val}</p>
                          </div>
                        ))}
                      </div>

                      {/* Tech Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.techTags && proj.techTags.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-slate-800/60 text-[11px] font-mono text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => openProjectDetail(proj)}
                        className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
                      >
                        <span>Full Post & Run Specs</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <div className="flex items-center gap-2">
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                          title="View Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={proj.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 transition-colors"
                          title="Open Live Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Newsletter / GitHub Star Banner */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  All projects are open-source and built for reproducibility.
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Clone repositories, report issues, or contribute back to any of these systems directly on GitHub.
                </p>
              </div>
              <a
                href="https://github.com/sanuzthapa"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-transform active:scale-95 shrink-0"
              >
                <Github className="w-4 h-4" />
                Follow @sanuzthapa
              </a>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Sanuz Thapa // Tech Journal</span>
            <span>—</span>
            <span>Hosted via GitHub Pages</span>
          </div>

          <div className="flex items-center gap-5 text-slate-400">
            <a href="/" className="hover:text-emerald-400 transition-colors">
              Portfolio Root
            </a>
            <a href="https://github.com/sanuzthapa" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
              GitHub
            </a>
            <button onClick={() => { setActiveTab('deploy-guide'); closeProjectDetail(); }} className="hover:text-cyan-400 transition-colors">
              Pages Deployment Guide
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
