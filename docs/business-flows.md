# Business Flows

## User Registration & Login

```
User → /auth/register → POST /api/auth/register → Create user (bcrypt hash) → Redirect to login
User → /auth/login → NextAuth signIn("credentials") → Validate credentials → JWT issued → Redirect to /dashboard
```

## Forgot / Reset Password

```
User → /auth/forgot-password → Submit email → Send reset token via email
User → /auth/reset-password?token=... → Submit new password → Validate token → Update password → Redirect to login
```

> Note: Email service integration is pending. Registration works but reset emails are not sent yet.

## Resume Lifecycle

```
Create Resume → status: DRAFT
  ├── Edit personal info (fullName, email, phone, address, nationality, dateOfBirth, gender)
  ├── Add/edit/delete/reorder sections:
  │   ├── Work Experiences (with nested Projects)
  │   ├── Education
  │   ├── Skills (categorized: OS, Language, Framework, DB, Tools)
  │   └── Certifications
  ├── Preview resume → /dashboard/preview
  ├── Export resume → PDF / Excel / JSON
  └── Finalize → status: FINAL
Soft Delete Resume → sets deletedAt timestamp (data preserved, hidden from UI)
```

## Resume Sections CRUD

Each section (experience, education, skill, certification) follows the same pattern:

```
List:    GET    /api/resumes/[resumeId]/<section>
Create:  POST   /api/resumes/[resumeId]/<section>
Update:  PUT    /api/<section>/[id]
Delete:  DELETE /api/<section>/[id]
```

Projects are nested under experiences:

```
Create:  POST   /api/experiences/[experienceId]/projects
Update:  PUT    /api/projects/[id]
Delete:  DELETE /api/projects/[id]
```

## Data Ownership & Authorization

```
Request → middleware (JWT check) → requireAuth() in API route
  → Verify user owns the resume (userId match)
  → Verify section belongs to the resume (resumeId match)
  → Proceed with operation
```


## Export Flow

```
User clicks "Download PDF" (or Excel/JSON) in Navbar
  → GET /api/resumes/[id]/export?format=pdf
  → requireAuth() + ownership check
  → Fetch full resume with all nested relations
  → Generate file (pdfkit / exceljs / JSON)
  → Return file as downloadable response
```

PDF export supports bilingual rendering (EN/JP) based on the resume's `languageMode` setting.

## Dashboard Navigation

```
/dashboard                  → Personal info form (basic resume details)
/dashboard/experience       → Work experience cards + add/edit dialog
/dashboard/education        → Education cards + add/edit dialog
/dashboard/skills           → Skills cards + add/edit dialog
/dashboard/certifications   → Certification cards + add/edit dialog
/dashboard/preview          → Live resume preview
```

Sidebar navigation is configured in `config/navigation.ts` and uses `usePathname()` for active state.
