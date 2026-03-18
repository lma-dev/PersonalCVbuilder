import { ProjectError } from "../error";
import { getProject } from "../data";

export async function validateProjectExists(id: string) {
  const project = await getProject(id);

  if (!project) {
    throw ProjectError.notFound(id);
  }

  return project;
}

export function validateTechnologies(technologies: string[]): string[] {
  return technologies
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}
