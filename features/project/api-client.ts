import type {
  ProjectType,
  CreateProjectInput,
  UpdateProjectInput,
} from "./types";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const projectApi = {
  async list(experienceId: string): Promise<ProjectType[]> {
    const res = await fetch(`/api/experiences/${experienceId}/projects`);
    return handleResponse<ProjectType[]>(res);
  },

  async create(input: CreateProjectInput): Promise<ProjectType> {
    const { experienceId, ...data } = input;
    const res = await fetch(`/api/experiences/${experienceId}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<ProjectType>(res);
  },

  async update(input: UpdateProjectInput): Promise<ProjectType> {
    const { id, ...data } = input;
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<ProjectType>(res);
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? "Failed to delete project");
    }
  },
};
