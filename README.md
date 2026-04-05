# JobTrack

A full-stack job application tracker built with React, GraphQL, and NestJS. Track applications, manage interview schedules, and visualize your job search pipeline from a single dashboard.

## Features

- **Applications table** — sortable, filterable list with server-side GraphQL queries and cursor-based pagination
- **9 outcome statuses** — Applied, Phone Screen, Interview Scheduled/Completed, Offer Received/Accepted, Rejected, Withdrawn, No Response, Ghosted
- **Salary tracking** — supports annual and hourly rate ranges with optional type indicator
- **Dashboard** — outcome breakdown chart, applications-per-week bar chart, and upcoming interviews widget
- **Create / edit forms** — React Hook Form + Zod validation, with draft auto-save to localStorage
- **Detail view** — full application record with all fields

## Tech Stack

### Frontend (`apps/web`)
| | |
|---|---|
| React 19 + Vite | UI and build tooling |
| TypeScript (strict) | Type safety end-to-end |
| Apollo Client 3 | GraphQL data layer with normalized `InMemoryCache` |
| TanStack Table v8 | Headless, composable table |
| React Hook Form + Zod | Form state and validation |
| Recharts | Dashboard charts |
| Tailwind CSS v4 | Utility-first styling |

### Backend (`apps/api`)
| | |
|---|---|
| NestJS | Server framework with DI and module system |
| Apollo Server (Fastify) | GraphQL server via `@nestjs/graphql` (code-first) |
| Prisma ORM | Type-safe database access and migrations |
| PostgreSQL | Primary database (hosted on Supabase) |
| class-validator | DTO validation |

### Infrastructure
| | |
|---|---|
| Vercel | Frontend deployment |
| Railway | API deployment (Dockerfile) |
| Supabase | Managed PostgreSQL |
| GitHub Actions | CI: typecheck, test, build |

## Project Structure

```
job-application-tracker/
├── apps/
│   ├── web/                        # Vite + React frontend
│   │   └── src/
│   │       ├── features/
│   │       │   ├── applications/   # Table, filters, form, detail, hooks
│   │       │   └── dashboard/      # Metrics, charts, upcoming interviews
│   │       ├── components/ui/      # Shared UI components
│   │       └── lib/graphql/        # Apollo client setup
│   └── api/                        # NestJS backend
│       ├── src/
│       │   ├── applications/       # Resolver, service, DTOs, model
│       │   ├── dashboard/          # Dashboard resolver and service
│       │   └── prisma/             # Prisma service and module
│       └── prisma/
│           ├── schema.prisma
│           └── migrations/
├── Dockerfile                      # API production image
├── railway.toml                    # Railway deployment config
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL database (local or Supabase)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

**`apps/api/.env`**
```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

**`apps/web/.env.local`**
```env
VITE_GRAPHQL_URL=http://localhost:3000/graphql
```

### 3. Run database migrations

```bash
pnpm --filter api exec prisma migrate dev
```

### 4. Start development servers

```bash
# API (http://localhost:3000/graphql)
pnpm --filter api run dev

# Web (http://localhost:5173)
pnpm --filter web run dev
```

## GraphQL API

The API is code-first via NestJS decorators. The schema is auto-generated at `apps/api/src/schema.gql`.

### Key queries

```graphql
# Paginated, filtered, sorted applications list
query ListApplications(
  $filters: ApplicationFiltersInput
  $sort: ApplicationSortInput
  $first: Int
  $after: String
) {
  jobApplications(filters: $filters, sort: $sort, first: $first, after: $after) {
    edges { cursor node { id companyName positionTitle outcome dateApplied ... } }
    pageInfo { hasNextPage endCursor }
    totalCount
  }
}

# Dashboard metrics
query DashboardMetrics {
  dashboardMetrics {
    totalApplications
    byOutcome { outcome count }
    applicationsByWeek { week count }
    upcomingInterviews { id companyName positionTitle interviewDate }
  }
}
```

### Key mutations

```graphql
mutation CreateApplication($input: CreateApplicationInput!) {
  createJobApplication(input: $input) { id ... }
}

mutation UpdateApplication($id: ID!, $input: UpdateApplicationInput!) {
  updateJobApplication(id: $id, input: $input) { id ... }
}

mutation DeleteApplication($id: ID!) {
  deleteJobApplication(id: $id)
}
```

## Data Model

```prisma
model JobApplication {
  id            String       @id @default(cuid())
  companyName   String
  positionTitle String
  roleType      RoleType     # FULL_TIME | PART_TIME | CONTRACT | FREELANCE | INTERNSHIP
  locationType  LocationType # ON_SITE | HYBRID | REMOTE
  outcome       Outcome      # APPLIED | PHONE_SCREEN | ... | GHOSTED
  dateApplied   DateTime
  interviewDate DateTime?
  salaryMin     Float?
  salaryMax     Float?
  salaryType    SalaryType?  # ANNUAL | HOURLY
  contactName   String?
  contactInfo   String?
  notes         String?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}
```

## CI / CD

GitHub Actions runs on every push and pull request:

| Job | What it checks |
|---|---|
| Typecheck | `tsc --noEmit` across both apps |
| Test API | Jest (passes with no tests) |
| Test Web | Vitest (passes with no tests) |
| Build | `tsc -b && vite build` for the web app |

## Deployment

### API (Railway)

The API is deployed via the `Dockerfile` at the project root. On each deploy, Prisma migrations run automatically before the server starts:

```dockerfile
CMD ["sh", "-c", "pnpm --filter api exec prisma migrate deploy && node apps/api/dist/main.js"]
```

Set the following environment variables in Railway:
- `DATABASE_URL`
- `CORS_ORIGIN` (your Vercel frontend URL)
- `NODE_ENV=production`

### Frontend (Vercel)

Deploy the `apps/web` directory. Set:
- `VITE_GRAPHQL_URL` (your Railway API URL + `/graphql`)

## License

MIT
