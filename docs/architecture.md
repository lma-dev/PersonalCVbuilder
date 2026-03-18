# Project Architecture

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **Database:** PostgreSQL 16 + Prisma 7 (with `@prisma/adapter-pg`)
- **Auth:** NextAuth v4 (JWT strategy, Credentials provider)
- **UI:** Tailwind CSS 4 + shadcn/ui (new-york style, lucide icons)
- **State:** Jotai (client) + TanStack React Query v5 (server)
- **Validation:** Zod v4
- **Package Manager:** pnpm

## Directory Structure

```
app/
  api/                              # API routes grouped by resource
    auth/[...nextauth]/route.ts     # NextAuth API route
    auth/register/route.ts          # User registration
    resumes/route.ts                # List / create resumes
    resumes/[id]/route.ts           # Get / update / soft-delete resume
    resumes/[id]/experiences/       # List / create experiences for a resume
    resumes/[id]/skills/            # List / create skills for a resume
    resumes/[id]/certifications/    # List / create certifications for a resume
    resumes/[id]/educations/        # List / create educations for a resume
    resumes/[id]/export/            # Export resume (PDF, Excel, JSON)
    experiences/[id]/               # Update / delete experience
    experiences/[id]/projects/      # Create project under experience
    experiences/reorder/            # Reorder experiences (PATCH)
    projects/[id]/                  # Update / delete project
    skills/[id]/                    # Update / delete skill
    certifications/[id]/            # Update / delete certification
    educations/[id]/                # Update / delete education
  auth/                             # Auth pages
    login/page.tsx
    register/page.tsx
    forgot-password/page.tsx
    reset-password/page.tsx
  (dashboard)/                      # Protected routes (sidebar layout)
    layout.tsx                      # DashboardShell with sidebar
    dashboard/page.tsx              # Personal info / basic info form
    dashboard/experience/page.tsx   # Work experience management
    dashboard/education/page.tsx    # Education management
    dashboard/skills/page.tsx       # Skills management
    dashboard/certifications/page.tsx # Certifications management
    dashboard/preview/page.tsx      # Resume preview
  generated/prisma/                 # Auto-generated Prisma client (DO NOT EDIT)
  globals.css                       # Tailwind + theme variables
  layout.tsx                        # Root layout
  page.tsx                          # Landing page (hero, features, CTAs)

components/
  ui/                               # shadcn/ui primitives
    button.tsx, card.tsx, dialog.tsx, input.tsx, label.tsx,
    textarea.tsx, select.tsx, badge.tsx
  layout/                           # Shell and navigation
    DashboardShell.tsx              # Main layout wrapper
    Sidebar.tsx                     # Sidebar navigation
    SidebarItem.tsx                 # Individual sidebar link
    Navbar.tsx                      # Top navbar (preview, export)
    UserProfile.tsx                 # User avatar / menu
  experience/                       # Experience feature components
    ExperienceCard.tsx
    ExperienceDialog.tsx
  education/                        # Education feature components
    EducationCard.tsx
    EducationDialog.tsx
  skills/                           # Skills feature components
    SkillCard.tsx
    SkillDialog.tsx
  certification/                    # Certification feature components
    CertificationCard.tsx
    CertificationDialog.tsx
  ResumeBuilder.tsx                 # Orchestrates all resume sections
  ResumePreview.tsx                 # Live resume preview
  ErrorBoundary.tsx                 # Global error boundary

features/                           # Feature modules (clean architecture)
  resume/
    domain/index.ts                 # Business logic (status transitions, ownership)
    data/index.ts                   # Prisma queries (CRUD, list by user)
    schema.ts                       # Zod schemas (create, update)
    types.ts                        # TypeScript types
    error.ts                        # ResumeError class
    api-client.ts                   # Frontend fetch wrapper
    atoms.ts                        # Jotai atoms (active resume, language mode)
    use-resumes.ts                  # React Query hooks
    export/                         # Export utilities
      pdf.ts                        # PDF generation (pdfkit)
      excel.ts                      # Excel export (exceljs)
      json.ts                       # JSON export
      types.ts                      # Export type definitions
  experience/
    domain/index.ts, data/index.ts, schema.ts, types.ts,
    error.ts, api-client.ts, use-experiences.ts
  project/
    domain/index.ts, data/index.ts, schema.ts, types.ts,
    error.ts, api-client.ts, use-projects.ts
  skill/
    domain/index.ts, data/index.ts, schema.ts, types.ts,
    error.ts, api-client.ts, use-skills.ts
  certification/
    domain/index.ts, data/index.ts, schema.ts, types.ts,
    error.ts, api-client.ts, use-certifications.ts
  education/
    domain/index.ts, data/index.ts, schema.ts, types.ts,
    error.ts, api-client.ts, use-educations.ts

config/
  navigation.ts                     # Sidebar navigation config

lib/
  auth.ts                           # NextAuth configuration
  prisma.ts                         # Prisma client singleton (PG adapter)
  api-auth.ts                       # requireAuth() API middleware
  api-error.ts                      # Standardized API error responses
  utils.ts                          # cn() classname helper

providers/
  index.tsx                         # Provider composition
  session-provider.tsx              # NextAuth SessionProvider
  query-provider.tsx                # React Query provider
  theme-provider.tsx                # Theme provider (dark mode)

prisma/
  schema.prisma                     # Database schema
  migrations/                       # Migration history
  seed.ts                           # Database seed script (demo user + sample data)

types/
  next-auth.d.ts                    # NextAuth type augmentation
```

## Feature Module Pattern

Each feature follows a layered architecture:

```
features/<name>/
  domain/index.ts   # Pure business logic, no framework dependencies
  data/index.ts     # Prisma queries (repository pattern)
  schema.ts         # Input/output validation (Zod)
  types.ts          # TypeScript type definitions
  error.ts          # Feature-specific error class
  api-client.ts     # Client-side fetch() wrapper
  use-*.ts          # React Query hooks consuming api-client
  atoms.ts          # Jotai atoms for client-side UI state (optional)
```

Data flows: `domain/ → data/ → schema.ts → api-client.ts → use-*.ts → components/`

## Auth Flow

1. User submits email + password on `/auth/login`
2. `signIn("credentials", ...)` calls NextAuth API route
3. NextAuth's `authorize` calls `authenticateUser` (domain layer)
4. Domain layer queries user via repository, validates password with bcrypt
5. On success: JWT token issued, session created
6. Middleware protects `/dashboard/*` routes — unauthenticated users are redirected to `/auth/login`
7. API routes use `requireAuth()` from `lib/api-auth.ts` to enforce authentication

Additional auth pages: register, forgot-password, reset-password.

## Database

See [database.md](./database.md) for the full ER diagram.

**Models:** User, Resume, ResumeEducation, ResumeExperience, ResumeProject, ResumeSkill, ResumeCertification

Key design decisions:
- Soft delete on `resumes` via `deletedAt` column (NULL = active)
- Cascade deletes on all child relations
- `sortOrder` on all list tables for drag-and-drop reordering
- Personal info merged into `resumes` (avoids 1:1 join table)
- Bilingual support via `descriptionEn`/`descriptionJp` on projects

## API Design

RESTful routes grouped by resource:

- **Collection routes** (nested under resume): `GET/POST /api/resumes/[id]/<resource>`
- **Item routes** (flat): `PUT/DELETE /api/<resource>/[id]`
- **Special routes**: `PATCH /api/experiences/reorder`, `GET /api/resumes/[id]/export?format=pdf|excel|json`

All mutation routes use `requireAuth()` and return standardized error responses via `lib/api-error.ts`.

## Export

Resume export supports three formats:
- **PDF** — Generated via pdfkit with bilingual rendering (EN/JP)
- **Excel** — Generated via exceljs
- **JSON** — Raw resume data
