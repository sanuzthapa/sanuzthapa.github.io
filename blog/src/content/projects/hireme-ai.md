---
id: hireme-ai
title: "HireMe AI: Autonomous Resume Tailoring & ATS Optimization Agent"
category: "AI & LLMs"
date: "2026-03-20"
summary: "Production-grade agentic pipeline utilizing LangGraph, FastAPI, and Instructor to analyze candidate profiles against target job requirements, generating high-precision ATS-tailored recommendations."
githubUrl: "https://github.com/sanuzthapa/hireme-ai"
demoUrl: "https://hireme-ai.demo.app"
envTemplate: |
  OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
  ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxx
  MODEL_NAME=gpt-4o
  EMBEDDING_MODEL=text-embedding-3-small
  DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/hireme_db
  REDIS_URL=redis://localhost:6379/0
  PORT=8000
  DEBUG=true
runInstructions:
  uv: |
    # Install dependencies with uv lightning-fast resolver
    uv venv --python 3.12
    source .venv/bin/activate # On Windows: .venv\Scripts\activate
    uv pip install -e ".[dev]"
    uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
  docker: |
    # Build container image with multi-stage caching
    docker build -t hireme-ai:latest .
    docker run -d -p 8000:8000 --env-file .env --name hireme-ai-service hireme-ai:latest
  pip: |
    python -m venv .venv
    source .venv/bin/activate # On Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
verifyCommand: "curl -s -f http://localhost:8000/health | jq ."
---

# HireMe AI: Architecture & System Design

Modern Applicant Tracking Systems (ATS) reject up to 75% of qualified applicants before a human recruiter ever sees a resume. **HireMe AI** was engineered to solve this information-asymmetry problem by converting static resumes and raw job descriptions into structured knowledge graphs, running semantic gap analyses, and synthesising contextual improvements.

```
       [Raw Job Posting]               [Candidate Resume (LaTeX / PDF)]
               │                                      │
               ▼                                      ▼
    ┌──────────────────────┐               ┌──────────────────────┐
    │  Jina Reader / Fire  │               │   PyMuPDF + AST      │
    │  Markdown Extractor  │               │   Section Segmenter  │
    └──────────┬───────────┘               └──────────┬───────────┘
               │                                      │
               └───────────────┬──────────────────────┘
                               ▼
                   ┌────────────────────────┐
                   │ LangGraph Orchestrator │
                   │  - Skill Extraction    │
                   │  - Semantic Alignment │
                   │  - Gap Classification │
                   └───────────┬────────────┘
                               ▼
                   ┌────────────────────────┐
                   │ Instructor + Pydantic  │
                   │ Structured Suggestions │
                   └────────────────────────┘
```

---

## Technical Challenges & Key Architectural Decisions

### 1. Robust AST-Preserving Resume Parsing
Instead of treating resumes as naive plaintext strings, we treat LaTeX resumes as Abstract Syntax Trees (AST). Replacing bullet points without breaking LaTeX macro syntax required building a tokenizer that recognizes command scopes (`\begin{itemize}`, `\item`, `\textbf{...}`).

- **Token Economy**: Standard OCR produces noisy tokens that bloat context windows. Parsing the native AST reduced context token overhead by **42%**.
- **Deterministic Validation**: Every generated suggestion is compiled against `pdflatex` in an ephemeral sandbox to guarantee zero syntax breakages.

### 2. LangGraph State Machine Workflow
The analysis pipeline is modeled as a directed cyclical graph:

1. **Ingestion Node**: Extracts requirements, mandatory qualifications, and nice-to-haves into typed Pydantic models.
2. **Taxonomy Alignment Node**: Cross-references candidate accomplishments against the target role using cosine similarity over `text-embedding-3-small` embeddings.
3. **Drafting Node**: Uses Anthropic Claude 3.5 Sonnet to draft concise, metrics-driven bullet points (using the Google XYZ formula: *"Accomplished [X], as measured by [Y], by doing [Z]"*).
4. **Critic Node**: Verifies that no hallucinations or unverified skills were introduced. If confidence score $< 0.85$, feedback loops back to the Drafting Node.

```python
class AnalysisState(TypedDict):
    job_spec: JobPosting
    resume_ast: ResumeNode
    extracted_gaps: list[SkillGap]
    optimized_bullets: list[TailoredBullet]
    critique_score: float
    iteration_count: int
```

---

## API Specifications & Endpoints

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Kubernetes liveness and readiness probe. |
| `POST` | `/api/v1/analyze` | Ingests resume file + job URL; returns structured gap matrix. |
| `POST` | `/api/v1/tailor` | Generates targeted bullet replacements with justification metrics. |
| `GET` | `/api/v1/export/pdf` | Compiles validated LaTeX into downloadable binary artifact. |

---

## Production Verification

Run the verification suite against your local instance to ensure end-to-end connectivity:

```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "job_url": "https://careers.google.com/jobs/results/12345",
    "candidate_id": "cand_01j7x8k9m"
  }'
```

Expected status response: `200 OK` with JSON payload confirming parsed requirements and match score breakdown.

