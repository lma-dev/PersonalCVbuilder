import { PrismaClient } from "../app/generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ─── Default Admin Account ──────────────────────────────────────────────────
  const adminHash = await hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@cvbuilder.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@cvbuilder.com",
      password: adminHash,
    },
  });

  console.log(`Created admin: ${admin.email} (${admin.id})`);

  // ─── Demo User ──────────────────────────────────────────────────────────────
  const passwordHash = await hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      name: "Kenji Tanaka",
      email: "demo@example.com",
      password: passwordHash,
    },
  });

  console.log(`Created user: ${user.email} (${user.id})`);

  // ─── Resume ─────────────────────────────────────────────────────────────────
  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      title: "Software Engineer — Full Stack",
      status: "DRAFT",
      languageMode: "BOTH",
      fullName: "Kenji Tanaka",
      email: "kenji.tanaka@example.com",
      phone: "+81-90-1234-5678",
      address: "Tokyo, Japan",
      nationality: "Japanese",
      dateOfBirth: new Date("1992-06-15"),
      gender: "Male",
    },
  });

  console.log(`Created resume: ${resume.title} (${resume.id})`);

  // ─── Education ──────────────────────────────────────────────────────────────
  await prisma.resumeEducation.createMany({
    data: [
      {
        resumeId: resume.id,
        schoolName: "University of Tokyo",
        major: "Computer Science",
        status: "Graduated",
        startDate: new Date("2011-04-01"),
        endDate: new Date("2015-03-31"),
        sortOrder: 0,
      },
      {
        resumeId: resume.id,
        schoolName: "Tokyo Metropolitan High School",
        major: "Science Course",
        status: "Graduated",
        startDate: new Date("2008-04-01"),
        endDate: new Date("2011-03-31"),
        sortOrder: 1,
      },
    ],
  });

  console.log("Created 2 education entries");

  // ─── Work Experience 1 ─────────────────────────────────────────────────────
  const experience1 = await prisma.resumeExperience.create({
    data: {
      resumeId: resume.id,
      companyName: "Rakuten Group, Inc.",
      employmentType: "Full-time",
      startDate: new Date("2019-04-01"),
      endDate: null,
      sortOrder: 0,
    },
  });

  await prisma.resumeProject.createMany({
    data: [
      {
        experienceId: experience1.id,
        projectName: "E-Commerce Platform Modernization",
        descriptionEn:
          "Led migration of legacy monolith to microservices architecture using Next.js and Go. Reduced page load times by 40% and improved deployment frequency from monthly to daily releases.",
        descriptionJp:
          "レガシーモノリスからNext.jsとGoを使用したマイクロサービスアーキテクチャへの移行をリード。ページ読み込み時間を40%削減し、デプロイ頻度を月次から日次へ改善。",
        technologies: JSON.parse(
          '["Next.js", "Go", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"]'
        ),
        sortOrder: 0,
      },
      {
        experienceId: experience1.id,
        projectName: "Internal Developer Portal",
        descriptionEn:
          "Built a self-service developer portal with API documentation, service catalog, and CI/CD pipeline management. Adopted by 200+ engineers across the organization.",
        descriptionJp:
          "APIドキュメント、サービスカタログ、CI/CDパイプライン管理を備えたセルフサービス開発者ポータルを構築。組織全体の200人以上のエンジニアが採用。",
        technologies: JSON.parse(
          '["React", "TypeScript", "Node.js", "GraphQL", "Backstage"]'
        ),
        sortOrder: 1,
      },
    ],
  });

  // ─── Work Experience 2 ─────────────────────────────────────────────────────
  const experience2 = await prisma.resumeExperience.create({
    data: {
      resumeId: resume.id,
      companyName: "CyberAgent, Inc.",
      employmentType: "Full-time",
      startDate: new Date("2015-04-01"),
      endDate: new Date("2019-03-31"),
      sortOrder: 1,
    },
  });

  await prisma.resumeProject.createMany({
    data: [
      {
        experienceId: experience2.id,
        projectName: "Ad Tech Real-Time Bidding Platform",
        descriptionEn:
          "Developed a high-throughput RTB system processing 500K+ bid requests per second. Implemented A/B testing framework for ad placement optimization.",
        descriptionJp:
          "毎秒50万以上の入札リクエストを処理する高スループットRTBシステムを開発。広告配置最適化のためのA/Bテストフレームワークを実装。",
        technologies: JSON.parse(
          '["Java", "Spring Boot", "Kafka", "Cassandra", "Python", "TensorFlow"]'
        ),
        sortOrder: 0,
      },
      {
        experienceId: experience2.id,
        projectName: "Mobile Analytics Dashboard",
        descriptionEn:
          "Created a real-time analytics dashboard for mobile app metrics, serving product managers and marketing teams with actionable insights and custom report generation.",
        descriptionJp:
          "モバイルアプリメトリクスのリアルタイム分析ダッシュボードを作成。プロダクトマネージャーとマーケティングチームにアクショナブルなインサイトとカスタムレポート生成を提供。",
        technologies: JSON.parse(
          '["React", "D3.js", "Python", "Flask", "BigQuery", "GCP"]'
        ),
        sortOrder: 1,
      },
    ],
  });

  console.log("Created 2 work experiences with 4 projects");

  // ─── Skills ─────────────────────────────────────────────────────────────────
  await prisma.resumeSkill.createMany({
    data: [
      // Programming Languages
      { resumeId: resume.id, category: "Programming Languages", name: "TypeScript", level: "Expert", sortOrder: 0 },
      { resumeId: resume.id, category: "Programming Languages", name: "JavaScript", level: "Expert", sortOrder: 1 },
      { resumeId: resume.id, category: "Programming Languages", name: "Go", level: "Advanced", sortOrder: 2 },
      { resumeId: resume.id, category: "Programming Languages", name: "Python", level: "Advanced", sortOrder: 3 },
      { resumeId: resume.id, category: "Programming Languages", name: "Java", level: "Intermediate", sortOrder: 4 },

      // Frontend
      { resumeId: resume.id, category: "Frontend", name: "React", level: "Expert", sortOrder: 0 },
      { resumeId: resume.id, category: "Frontend", name: "Next.js", level: "Expert", sortOrder: 1 },
      { resumeId: resume.id, category: "Frontend", name: "Tailwind CSS", level: "Advanced", sortOrder: 2 },
      { resumeId: resume.id, category: "Frontend", name: "Vue.js", level: "Intermediate", sortOrder: 3 },

      // Backend
      { resumeId: resume.id, category: "Backend", name: "Node.js", level: "Expert", sortOrder: 0 },
      { resumeId: resume.id, category: "Backend", name: "Express", level: "Advanced", sortOrder: 1 },
      { resumeId: resume.id, category: "Backend", name: "GraphQL", level: "Advanced", sortOrder: 2 },
      { resumeId: resume.id, category: "Backend", name: "Spring Boot", level: "Intermediate", sortOrder: 3 },

      // Databases
      { resumeId: resume.id, category: "Databases", name: "PostgreSQL", level: "Expert", sortOrder: 0 },
      { resumeId: resume.id, category: "Databases", name: "Redis", level: "Advanced", sortOrder: 1 },
      { resumeId: resume.id, category: "Databases", name: "MongoDB", level: "Intermediate", sortOrder: 2 },
      { resumeId: resume.id, category: "Databases", name: "Cassandra", level: "Intermediate", sortOrder: 3 },

      // DevOps & Cloud
      { resumeId: resume.id, category: "DevOps & Cloud", name: "AWS", level: "Advanced", sortOrder: 0 },
      { resumeId: resume.id, category: "DevOps & Cloud", name: "Docker", level: "Advanced", sortOrder: 1 },
      { resumeId: resume.id, category: "DevOps & Cloud", name: "Kubernetes", level: "Intermediate", sortOrder: 2 },
      { resumeId: resume.id, category: "DevOps & Cloud", name: "Terraform", level: "Intermediate", sortOrder: 3 },
      { resumeId: resume.id, category: "DevOps & Cloud", name: "GCP", level: "Intermediate", sortOrder: 4 },
    ],
  });

  console.log("Created 22 skills across 5 categories");

  // ─── Certifications ─────────────────────────────────────────────────────────
  await prisma.resumeCertification.createMany({
    data: [
      {
        resumeId: resume.id,
        name: "AWS Solutions Architect — Associate",
        date: new Date("2022-08-15"),
        sortOrder: 0,
      },
      {
        resumeId: resume.id,
        name: "Google Cloud Professional Cloud Developer",
        date: new Date("2021-11-20"),
        sortOrder: 1,
      },
      {
        resumeId: resume.id,
        name: "JLPT N1 — Japanese Language Proficiency Test",
        date: new Date("2014-12-01"),
        sortOrder: 2,
      },
    ],
  });

  console.log("Created 3 certifications");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
