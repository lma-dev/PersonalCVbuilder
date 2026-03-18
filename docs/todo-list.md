# TODO — Personal CV Builder

> Tracks all remaining implementation work. Check items off as completed.

---

## 1. Authentication & User Management

- [x] Implement credential validation in `authorize()` callback (`lib/auth.ts`)
- [x] Add password hashing/verification (bcrypt)
- [x] Build login page UI (`app/auth/login/page.tsx`)
- [x] Create user registration API route (`app/api/auth/register/route.ts`)
- [x] Build registration page UI (`app/auth/register/page.tsx`)
- [x] Create forgot-password API route (send reset email)
- [x] Build forgot-password page UI (`app/auth/forgot-password/page.tsx`)
- [x] Create reset-password API route (validate token, update password)
- [x] Build reset-password page UI (`app/auth/reset-password/page.tsx`)
- [ ] Add email service integration for password reset
- [x] Protect dashboard routes (redirect unauthenticated users to login)

---

## 2. Feature Modules (Clean Architecture)

Each feature needs: `domain/ → data/ → schema.ts → error.ts → types.ts → api-client.ts → atoms.ts → use-*.ts`

### 2.1 Resume

- [x] `features/resume/types.ts` — TypeScript types
- [x] `features/resume/schema.ts` — Zod schemas (create, update)
- [x] `features/resume/error.ts` — Custom ResumeError class
- [x] `features/resume/data/index.ts` — Prisma queries (CRUD, list by user)
- [x] `features/resume/domain/index.ts` — Business logic (status transitions, ownership)
- [x] `features/resume/api-client.ts` — Frontend fetch wrapper
- [x] `features/resume/atoms.ts` — Jotai atoms (active resume, language mode)
- [x] `features/resume/use-resumes.ts` — React Query hooks

### 2.2 Work Experience

- [x] `features/experience/types.ts`
- [x] `features/experience/schema.ts` — Zod schemas
- [x] `features/experience/error.ts`
- [x] `features/experience/data/index.ts` — Prisma queries
- [x] `features/experience/domain/index.ts` — Business logic
- [x] `features/experience/api-client.ts`
- [x] `features/experience/use-experiences.ts` — React Query hooks

### 2.3 Projects (nested under Experience)

- [x] `features/project/types.ts`
- [x] `features/project/schema.ts`
- [x] `features/project/error.ts`
- [x] `features/project/data/index.ts`
- [x] `features/project/domain/index.ts`
- [x] `features/project/api-client.ts`
- [x] `features/project/use-projects.ts`

### 2.4 Skills

- [x] `features/skill/types.ts`
- [x] `features/skill/schema.ts`
- [x] `features/skill/error.ts`
- [x] `features/skill/data/index.ts`
- [x] `features/skill/domain/index.ts`
- [x] `features/skill/api-client.ts`
- [x] `features/skill/use-skills.ts`

### 2.5 Certifications

- [x] `features/certification/types.ts`
- [x] `features/certification/schema.ts`
- [x] `features/certification/error.ts`
- [x] `features/certification/data/index.ts`
- [x] `features/certification/domain/index.ts`
- [x] `features/certification/api-client.ts`
- [x] `features/certification/use-certifications.ts`

### 2.6 Education

- [x] `features/education/types.ts`
- [x] `features/education/schema.ts`
- [x] `features/education/error.ts`
- [x] `features/education/data/index.ts`
- [x] `features/education/domain/index.ts`
- [x] `features/education/api-client.ts`
- [x] `features/education/use-educations.ts`

---

## 3. API Routes

### 3.1 Resume

- [x] `GET /api/resumes` — List user's resumes
- [x] `POST /api/resumes` — Create resume
- [x] `GET /api/resumes/[id]` — Get single resume (with all nested data)
- [x] `PUT /api/resumes/[id]` — Update resume
- [x] `DELETE /api/resumes/[id]` — Soft delete resume

### 3.2 Work Experience

- [x] `GET /api/resumes/[id]/experiences` — List experiences
- [x] `POST /api/resumes/[id]/experiences` — Create experience
- [x] `PUT /api/experiences/[id]` — Update experience
- [x] `DELETE /api/experiences/[id]` — Delete experience
- [x] `PATCH /api/experiences/reorder` — Update sort order

### 3.3 Projects

- [x] `POST /api/experiences/[id]/projects` — Create project
- [x] `PUT /api/projects/[id]` — Update project
- [x] `DELETE /api/projects/[id]` — Delete project

### 3.4 Skills

- [x] `GET /api/resumes/[id]/skills` — List skills
- [x] `POST /api/resumes/[id]/skills` — Create skill
- [x] `PUT /api/skills/[id]` — Update skill
- [x] `DELETE /api/skills/[id]` — Delete skill

### 3.5 Certifications

- [x] `GET /api/resumes/[id]/certifications` — List certifications
- [x] `POST /api/resumes/[id]/certifications` — Create certification
- [x] `PUT /api/certifications/[id]` — Update certification
- [x] `DELETE /api/certifications/[id]` — Delete certification

### 3.6 Education

- [x] `GET /api/resumes/[id]/educations` — List educations
- [x] `POST /api/resumes/[id]/educations` — Create education
- [x] `PUT /api/educations/[id]` — Update education
- [x] `DELETE /api/educations/[id]` — Delete education

---

## 4. Pages

### 4.1 Dashboard Section Pages

- [x] `app/(dashboard)/dashboard/page.tsx` — Personal info form (name, email, phone, address, links)
- [x] `app/(dashboard)/dashboard/education/page.tsx` — Education management (cards + dialog)
- [x] Build Education components (`components/education/EducationCard.tsx`, `EducationDialog.tsx`)
- [x] Wire sidebar navigation to actual routes (currently all items point to same page)

### 4.2 Home / Landing Page

- [x] Design and build landing page (`app/page.tsx`)
- [x] Add CTA to login/register

---

## 5. Data Persistence & Integration

- [x] Replace local state in `ResumeBuilder.tsx` with React Query hooks
- [x] Connect ExperienceDialog save to API
- [x] Connect SkillDialog save to API
- [x] Connect CertificationDialog save to API
- [ ] Add optimistic updates for create/edit/delete
- [x] Add toast notifications on success/error (sonner)

---

## 6. Export Functionality

- [x] `features/resume/export/pdf.ts` — PDF generation (pdfkit)
- [x] `features/resume/export/excel.ts` — Excel export (exceljs)
- [x] `features/resume/export/json.ts` — JSON export
- [x] `app/api/resumes/[id]/export/route.ts` — Export API endpoint
- [x] Bilingual PDF rendering (EN/JP side-by-side or toggle)
- [ ] Resume template selection UI
- [x] Wire Navbar "Download PDF" button to export API
- [x] Wire Navbar "Preview" button to preview modal/page

---

## 7. Advanced UI Features

- [ ] Drag-and-drop reordering for experiences (sort_order field ready in DB)
- [ ] Drag-and-drop reordering for education entries
- [x] Resume preview modal (live preview of final output)
- [ ] Language mode toggle (EN / JP / Both) — wired to resume `languageMode`
- [ ] Custom sections (Add Custom Section sidebar item)
- [ ] Theme toggle (dark mode — ThemeProvider already set up)
- [ ] Responsive improvements for mobile form dialogs

---

## 8. Database & Seeding

- [x] `prisma/seed.ts` — Seed script with sample user + resume data
- [x] Add `pnpm db:seed` script to package.json (if not already)
- [x] Add database indexes for performance (user lookups, resume queries)

---

## 9. Testing

- [x] Unit tests for domain logic (`features/*/domain/`)
- [x] Unit tests for Zod schemas (`features/*/schema.ts`)
- [x] Unit tests for error classes (`features/*/error.ts`, `lib/api-error.ts`)
- [x] Unit tests for export functions (`features/resume/export/json.ts`)
- [ ] Integration tests for API routes
- [ ] Component tests for dialogs and cards
- [ ] E2E tests for critical flows (login, create experience, export)

---

## 10. Error Handling & Observability

- [x] Custom error classes per feature (`features/*/error.ts`)
- [x] Global error boundary component
- [x] API error response standardization (consistent JSON error format)
- [x] Client-side error toast handling

---

## 11. DevOps & Deployment

- [ ] Finalize Dockerfile and docker-compose.yml
- [ ] Environment variable documentation (`.env.example`)
- [ ] CI/CD pipeline (GitHub Actions: lint, test, build)
- [ ] Production database migration strategy
- [ ] Health check endpoint (`/api/health`)

---

## Completed

- [x] Project initialization (Next.js 16, React 19, TypeScript 5)
- [x] Prisma schema with all models (User, Resume, Experience, Project, Skill, Certification, Education)
- [x] Database migration (init)
- [x] Prisma client with PG adapter (`lib/prisma.ts`)
- [x] NextAuth v4 scaffolding (JWT strategy, credentials provider)
- [x] `requireAuth()` API middleware (`lib/api-auth.ts`)
- [x] Dashboard layout (DashboardShell, Sidebar, Navbar, UserProfile)
- [x] Sidebar navigation config (`config/navigation.ts`)
- [x] shadcn/ui components (Button, Dialog, Card, Badge, Select, Input, Label, Textarea)
- [x] Providers (Session, Query, Theme)
- [x] Work Experience UI — ExperienceCard + ExperienceDialog (bilingual, projects, tags)
- [x] Skills UI — SkillCard + SkillDialog (categories, proficiency levels)
- [x] Certifications UI — CertificationCard + CertificationDialog
- [x] ResumeBuilder component (orchestrates all 3 sections with local state + dummy data)
- [x] Dashboard page rendering ResumeBuilder
- [x] Auth system (credential validation, bcrypt, login/register/forgot/reset pages, middleware)
- [x] All 6 feature modules (resume, experience, project, skill, certification, education)
- [x] All API routes (28 endpoints across 16 route files)
- [x] Dashboard section pages (basic-info, experience, skills, certifications, education, preview)
- [x] Sidebar navigation wired to Next.js routing with `usePathname()`
- [x] Landing page with hero section and CTAs
- [x] Education components (EducationCard, EducationDialog)
- [x] Data persistence — all pages wired to API via React Query hooks
- [x] Export functionality (PDF, Excel, JSON) with bilingual support
- [x] Resume preview component (`ResumePreview.tsx`)
- [x] Error boundary, API error standardization
- [x] Seed script with demo user and full sample resume data
- [x] Navbar wired (Preview → preview page, Download PDF → export API)
- [x] Unit tests — 156 tests across 19 files (domain logic, Zod schemas, error classes, export)
