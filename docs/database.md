# Database Schema

## Entity Relationship Diagram

```mermaid
erDiagram
    users {
        String id PK
        String name
        String email UK
        String password
        DateTime created_at
        DateTime updated_at
    }

    resumes {
        String id PK
        String user_id FK
        String title
        ResumeStatus status "DRAFT | FINAL"
        LanguageMode language_mode "EN | JP | BOTH"
        String full_name
        String email "nullable"
        String phone "nullable"
        String address "nullable"
        String nationality "nullable"
        DateTime date_of_birth "nullable"
        String gender "nullable"
        DateTime created_at
        DateTime updated_at
        DateTime deleted_at "nullable, soft delete"
    }

    resume_educations {
        String id PK
        String resume_id FK
        DateTime start_date
        DateTime end_date "nullable"
        String school_name
        String major "nullable"
        String status "nullable"
        Int sort_order
        DateTime created_at
    }

    resume_experiences {
        String id PK
        String resume_id FK
        String company_name
        String employment_type "nullable"
        DateTime start_date
        DateTime end_date "nullable"
        Int sort_order
        DateTime created_at
    }

    resume_projects {
        String id PK
        String experience_id FK
        String project_name
        String description_en "nullable"
        String description_jp "nullable"
        Json technologies "array"
        Int sort_order
        DateTime created_at
    }

    resume_skills {
        String id PK
        String resume_id FK
        String category "OS | Language | Framework | DB | Tools"
        String name
        String level "nullable"
        Int sort_order
        DateTime created_at
    }

    resume_certifications {
        String id PK
        String resume_id FK
        DateTime date
        String name
        Int sort_order
        DateTime created_at
    }

    users ||--o{ resumes : "owns"
    resumes ||--o{ resume_educations : "has"
    resumes ||--o{ resume_experiences : "has"
    resumes ||--o{ resume_skills : "has"
    resumes ||--o{ resume_certifications : "has"
    resume_experiences ||--o{ resume_projects : "contains"
```

## Tables

### users
Core user account. One user can own many resumes.

### resumes
Main resume entity with personal info merged in. Holds title, status (draft/final), language mode (en/jp/both), and basic personal details (name, contact, nationality, etc.). Uses soft delete via `deleted_at`.

### resume_educations
Education history entries (1:N with resume). Supports ongoing education via nullable `end_date`.

### resume_experiences
Work experience entries (1:N with resume). Each experience can contain nested projects.

### resume_projects
Projects nested under a work experience (1:N with resume_experiences). Supports bilingual descriptions (EN/JP) and a JSON array for technologies.

### resume_skills
Categorized skills (1:N with resume). Grouped by category (OS, Language, Framework, DB, Tools) with proficiency level.

### resume_certifications
Certifications and qualifications (1:N with resume).

## Key Design Decisions

- **Soft delete** on `resumes` via `deleted_at` column (NULL = active)
- **Cascade deletes** on all child relations — deleting a resume cleans up all sections
- **`sort_order`** on all list tables — enables drag-and-drop reordering in the UI
- **JSON columns** used sparingly — only for `technologies` where flexibility outweighs queryability
- **Bilingual support** via `description_en`/`description_jp` on projects
- **Templates as code** — layout templates live as React components in the codebase, not in the database
- **Personal info merged into `resumes`** — avoids unnecessary 1:1 join table
