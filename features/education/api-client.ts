import type {
  EducationType,
  CreateEducationInput,
  UpdateEducationInput,
} from "./types";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const educationApi = {
  async list(resumeId: string): Promise<EducationType[]> {
    const res = await fetch(`/api/resumes/${resumeId}/educations`);
    return handleResponse<EducationType[]>(res);
  },

  async create(input: CreateEducationInput): Promise<EducationType> {
    const { resumeId, ...data } = input;
    const res = await fetch(`/api/resumes/${resumeId}/educations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<EducationType>(res);
  },

  async update(input: UpdateEducationInput): Promise<EducationType> {
    const { id, ...data } = input;
    const res = await fetch(`/api/educations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<EducationType>(res);
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/educations/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? "Failed to delete education");
    }
  },
};
