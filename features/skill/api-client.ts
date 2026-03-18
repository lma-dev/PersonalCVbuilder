import type {
  SkillType,
  CreateSkillInput,
  UpdateSkillInput,
} from "./types";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const skillApi = {
  async list(resumeId: string): Promise<SkillType[]> {
    const res = await fetch(`/api/resumes/${resumeId}/skills`);
    return handleResponse<SkillType[]>(res);
  },

  async create(input: CreateSkillInput): Promise<SkillType> {
    const { resumeId, ...data } = input;
    const res = await fetch(`/api/resumes/${resumeId}/skills`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<SkillType>(res);
  },

  async update(input: UpdateSkillInput): Promise<SkillType> {
    const { id, ...data } = input;
    const res = await fetch(`/api/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<SkillType>(res);
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? "Failed to delete skill");
    }
  },
};
