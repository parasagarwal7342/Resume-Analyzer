# Workspace

## Overview

Advanced Resume Parser — AI-powered resume intelligence platform. Parses resumes into structured data, enables job description matching, and provides talent analytics. Built as a pnpm workspace monorepo using TypeScript.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: OpenAI via Replit AI Integrations (gpt-5-mini for resume parsing and job matching)
- **Frontend**: React + Vite + Tailwind + shadcn/ui + Recharts

## Features

- **AI Resume Parsing**: Paste or upload (.txt) resume text; AI extracts structured fields (contact, experience, education, skills, projects, certifications)
- **Resume Library**: Browse, search, and manage all parsed resumes
- **Resume Detail**: View parsed data in organized tabs (Overview, Experience, Skills, Education, Projects)
- **Job Match**: Paste a job description to get AI-powered match score, skill gap analysis, strengths, and recommendation
- **Analytics Dashboard**: Top skills bar chart, seniority distribution pie chart, avg experience, top locations

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (resume routes + AI parsing)
│   └── resume-parser/      # React + Vite frontend (SPA)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   └── integrations-openai-ai-server/  # OpenAI client wrapper
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Key Files

- `lib/api-spec/openapi.yaml` — API contract for all endpoints
- `lib/db/src/schema/resumes.ts` — Drizzle schema for the resumes table
- `artifacts/api-server/src/routes/resumes.ts` — All resume routes (parse, list, get, delete, match)
- `artifacts/resume-parser/src/pages/` — All frontend pages

## API Routes

- `GET /api/healthz` — Health check
- `GET /api/resumes` — List resumes (paginated)
- `POST /api/resumes/parse` — AI-parse resume text
- `GET /api/resumes/stats` — Aggregate stats
- `GET /api/resumes/:id` — Get specific resume
- `DELETE /api/resumes/:id` — Delete resume
- `POST /api/resumes/:id/match` — AI job match analysis

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned by Replit)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — Replit AI proxy URL
- `AI_INTEGRATIONS_OPENAI_API_KEY` — Replit AI proxy key
- `SESSION_SECRET` — Session secret

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API types from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push schema changes to database
