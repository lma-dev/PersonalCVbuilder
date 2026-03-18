import Link from "next/link";
import {
  FileText,
  Briefcase,
  GraduationCap,
  Zap,
  Award,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "Work Experience",
    description:
      "Track your professional history with detailed role descriptions and project highlights.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description:
      "Record your academic background including degrees, majors, and graduation status.",
  },
  {
    icon: Zap,
    title: "Skills",
    description:
      "Organize your technical and professional skills by category with proficiency levels.",
  },
  {
    icon: Award,
    title: "Certifications",
    description:
      "Showcase your professional certifications and credentials with dates and links.",
  },
  {
    icon: FileText,
    title: "Multiple Resumes",
    description:
      "Create and manage multiple resume versions tailored for different opportunities.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="size-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">
              CV Architect
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Build your professional CV
          <br />
          <span className="text-blue-600">with confidence</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          CV Architect helps you create polished, well-structured resumes.
          Manage your work experience, education, skills, and certifications
          all in one place.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get Started
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need
            </h2>
            <p className="mt-3 text-gray-600">
              Organize every section of your resume in a clean, structured way.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-4">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-gray-500">
            CV Architect. Built for professionals who value clarity.
          </p>
        </div>
      </footer>
    </main>
  );
}
