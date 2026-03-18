import type {
  Resume,
  ResumeWithRelations,
  ResumeListItem,
  CreateResumeInput,
  UpdateResumeInput,
} from "./types";

const BASE_URL = "/api/resumes";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const resumeApi = {
  async list(): Promise<ResumeListItem[]> {
    const res = await fetch(BASE_URL);
    return handleResponse<ResumeListItem[]>(res);
  },

  async get(id: string): Promise<ResumeWithRelations> {
    const res = await fetch(`${BASE_URL}/${id}`);
    return handleResponse<ResumeWithRelations>(res);
  },

  async create(input: CreateResumeInput): Promise<Resume> {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return handleResponse<Resume>(res);
  },

  async update(input: UpdateResumeInput): Promise<Resume> {
    const { id, ...data } = input;
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Resume>(res);
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? "Failed to delete resume");
    }
  },
};
