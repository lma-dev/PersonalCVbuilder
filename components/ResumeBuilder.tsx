"use client";

import { useState } from "react";
import { Plus, Briefcase, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import {
  ExperienceDialog,
  type Experience,
} from "@/components/experience/ExperienceDialog";
import { SkillCard } from "@/components/skills/SkillCard";
import {
  SkillDialog,
  type SkillCategory,
} from "@/components/skills/SkillDialog";
import { CertificationCard } from "@/components/certification/CertificationCard";
import {
  CertificationDialog,
  type Certification,
} from "@/components/certification/CertificationDialog";

// ─── Dummy Data ─────────────────────────────────────────────────

const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: "1",
    company: "TechCorp Japan",
    employmentType: "Full-time",
    startDate: "2022-04",
    endDate: "",
    roleTitleEn: "Senior Software Engineer",
    roleTitleJp: "シニアソフトウェアエンジニア",
    descriptionEn:
      "Led the development of microservices architecture, mentored junior engineers, and drove adoption of modern CI/CD practices across the engineering org.",
    descriptionJp:
      "マイクロサービスアーキテクチャの開発をリードし、ジュニアエンジニアのメンタリングを行い、エンジニアリング組織全体でモダンなCI/CDプラクティスの導入を推進しました。",
    projects: [
      {
        name: "Payment System Redesign",
        description:
          "Rebuilt the payment processing pipeline to handle 10x throughput with 99.99% uptime.",
        tags: ["Go", "PostgreSQL", "Kafka", "Kubernetes"],
      },
      {
        name: "Developer Portal",
        description:
          "Created an internal developer portal for API documentation and service discovery.",
        tags: ["React", "TypeScript", "Next.js", "GraphQL"],
      },
    ],
  },
  {
    id: "2",
    company: "StartupXYZ",
    employmentType: "Contract",
    startDate: "2020-01",
    endDate: "2022-03",
    roleTitleEn: "Full Stack Developer",
    roleTitleJp: "フルスタック開発者",
    descriptionEn:
      "Built and maintained a SaaS platform from the ground up, handling everything from database design to frontend implementation.",
    descriptionJp:
      "データベース設計からフロントエンド実装まで、SaaSプラットフォームをゼロから構築・保守しました。",
    projects: [
      {
        name: "Analytics Dashboard",
        description:
          "Real-time analytics dashboard with customizable widgets and data export.",
        tags: ["React", "D3.js", "Node.js", "Redis"],
      },
    ],
  },
];

const INITIAL_SKILLS: SkillCategory[] = [
  {
    id: "os",
    name: "Operating Systems",
    skills: [
      { name: "Linux", level: "Advanced" },
      { name: "macOS", level: "Advanced" },
      { name: "Windows", level: "Intermediate" },
    ],
  },
  {
    id: "lang",
    name: "Languages",
    skills: [
      { name: "TypeScript", level: "Advanced" },
      { name: "Go", level: "Advanced" },
      { name: "Python", level: "Intermediate" },
      { name: "Rust", level: "Basic" },
      { name: "SQL", level: "Advanced" },
    ],
  },
  {
    id: "fw",
    name: "Frameworks",
    skills: [
      { name: "React", level: "Advanced" },
      { name: "Next.js", level: "Advanced" },
      { name: "Express", level: "Intermediate" },
      { name: "Tailwind CSS", level: "Advanced" },
    ],
  },
  {
    id: "db",
    name: "Databases",
    skills: [
      { name: "PostgreSQL", level: "Advanced" },
      { name: "Redis", level: "Intermediate" },
      { name: "MongoDB", level: "Intermediate" },
    ],
  },
  {
    id: "tools",
    name: "Tools & DevOps",
    skills: [
      { name: "Docker", level: "Advanced" },
      { name: "Kubernetes", level: "Intermediate" },
      { name: "GitHub Actions", level: "Advanced" },
      { name: "Terraform", level: "Basic" },
      { name: "AWS", level: "Intermediate" },
    ],
  },
];

const INITIAL_CERTIFICATIONS: Certification[] = [
  {
    id: "1",
    name: "AWS Solutions Architect – Associate",
    organization: "Amazon Web Services",
    date: "2023-06",
    credentialUrl: "",
  },
  {
    id: "2",
    name: "Google Cloud Professional Developer",
    organization: "Google Cloud",
    date: "2022-11",
    credentialUrl: "",
  },
  {
    id: "3",
    name: "Certified Kubernetes Administrator",
    organization: "Cloud Native Computing Foundation",
    date: "2023-01",
    credentialUrl: "",
  },
];

// ─── Section Header Component ───────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  count,
  onAdd,
  addLabel,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count: number;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="size-5 text-blue-600" />
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">({count})</span>
      </div>
      <Button size="sm" onClick={onAdd}>
        <Plus className="size-4 mr-1" />
        {addLabel}
      </Button>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────

export function ResumeBuilder() {
  // Experience state
  const [experiences, setExperiences] =
    useState<Experience[]>(INITIAL_EXPERIENCES);
  const [expDialogOpen, setExpDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  // Skills state
  const [skills, setSkills] = useState<SkillCategory[]>(INITIAL_SKILLS);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillCategory | null>(null);

  // Certifications state
  const [certifications, setCertifications] = useState<Certification[]>(
    INITIAL_CERTIFICATIONS
  );
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  // ─── Experience Handlers ────────────────────────────────────

  function handleSaveExperience(exp: Experience) {
    setExperiences((prev) => {
      const idx = prev.findIndex((e) => e.id === exp.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = exp;
        return updated;
      }
      return [exp, ...prev];
    });
  }

  function handleDeleteExperience(id: string) {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  }

  function openNewExperience() {
    setEditingExp(null);
    setExpDialogOpen(true);
  }

  function openEditExperience(exp: Experience) {
    setEditingExp(exp);
    setExpDialogOpen(true);
  }

  // ─── Skills Handlers ────────────────────────────────────────

  function handleSaveSkill(category: SkillCategory) {
    setSkills((prev) =>
      prev.map((c) => (c.id === category.id ? category : c))
    );
  }

  function openEditSkill(category: SkillCategory) {
    setEditingSkill(category);
    setSkillDialogOpen(true);
  }

  // ─── Certification Handlers ─────────────────────────────────

  function handleSaveCertification(cert: Certification) {
    setCertifications((prev) => {
      const idx = prev.findIndex((c) => c.id === cert.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = cert;
        return updated;
      }
      return [cert, ...prev];
    });
  }

  function handleDeleteCertification(id: string) {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
  }

  function openNewCertification() {
    setEditingCert(null);
    setCertDialogOpen(true);
  }

  function openEditCertification(cert: Certification) {
    setEditingCert(cert);
    setCertDialogOpen(true);
  }

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="space-y-10">
      {/* ── Work Experience ────────────────────────────────── */}
      <section>
        <SectionHeader
          icon={Briefcase}
          title="Work Experience"
          count={experiences.length}
          onAdd={openNewExperience}
          addLabel="Add Experience"
        />
        <div className="space-y-4">
          {experiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              onEdit={openEditExperience}
              onDelete={handleDeleteExperience}
            />
          ))}
          {experiences.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
              <Briefcase className="mx-auto size-8 text-gray-300 mb-2" />
              <p className="text-sm text-muted-foreground">
                No work experience added yet.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={openNewExperience}
              >
                <Plus className="size-4 mr-1" />
                Add your first experience
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ── Skills ─────────────────────────────────────────── */}
      <section>
        <SectionHeader
          icon={Zap}
          title="Skills"
          count={skills.reduce((acc, c) => acc + c.skills.length, 0)}
          onAdd={() => {}}
          addLabel="Add Category"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {skills.map((category) => (
            <SkillCard
              key={category.id}
              category={category}
              onEdit={openEditSkill}
            />
          ))}
        </div>
      </section>

      {/* ── Certifications ─────────────────────────────────── */}
      <section>
        <SectionHeader
          icon={Award}
          title="Certifications"
          count={certifications.length}
          onAdd={openNewCertification}
          addLabel="Add Certification"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <CertificationCard
              key={cert.id}
              certification={cert}
              onEdit={openEditCertification}
              onDelete={handleDeleteCertification}
            />
          ))}
          {certifications.length === 0 && (
            <div className="col-span-full rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
              <Award className="mx-auto size-8 text-gray-300 mb-2" />
              <p className="text-sm text-muted-foreground">
                No certifications added yet.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={openNewCertification}
              >
                <Plus className="size-4 mr-1" />
                Add your first certification
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ── Dialogs ────────────────────────────────────────── */}
      <ExperienceDialog
        open={expDialogOpen}
        onOpenChange={setExpDialogOpen}
        experience={editingExp}
        onSave={handleSaveExperience}
      />
      <SkillDialog
        open={skillDialogOpen}
        onOpenChange={setSkillDialogOpen}
        category={editingSkill}
        onSave={handleSaveSkill}
      />
      <CertificationDialog
        open={certDialogOpen}
        onOpenChange={setCertDialogOpen}
        certification={editingCert}
        onSave={handleSaveCertification}
      />
    </div>
  );
}
