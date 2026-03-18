import type {
  ExperienceWithProjects,
  CreateExperienceInput,
  UpdateExperienceInput,
  ReorderExperienceInput,
  ExperienceType,
} from "./types";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const experienceApi = {
  async list(resumeId: string): Promise<ExperienceWithProjects[]> {
    const res = await fetch(`/api/resumes/${resumeId}/experiences`);
    return handleResponse<ExperienceWithProjects[]>(res);
  },

  async create(input: CreateExperienceInput): Promise<ExperienceType> {
    const { resumeId, ...data } = input;
    const res = await fetch(`/api/resumes/${resumeId}/experiences`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<ExperienceType>(res);
  },

  async update(input: UpdateExperienceInput): Promise<ExperienceType> {
    const { id, ...data } = input;
    const res = await fetch(`/api/experiences/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<ExperienceType>(res);
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? "Failed to delete experience");
    }
  },

  async reorder(items: ReorderExperienceInput): Promise<void> {
    const res = await fetch(`/api/experiences/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? "Failed to reorder experiences");
    }
  },
};
