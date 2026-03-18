import type {
  CertificationType,
  CreateCertificationInput,
  UpdateCertificationInput,
} from "./types";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const certificationApi = {
  async list(resumeId: string): Promise<CertificationType[]> {
    const res = await fetch(`/api/resumes/${resumeId}/certifications`);
    return handleResponse<CertificationType[]>(res);
  },

  async create(input: CreateCertificationInput): Promise<CertificationType> {
    const { resumeId, ...data } = input;
    const res = await fetch(`/api/resumes/${resumeId}/certifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<CertificationType>(res);
  },

  async update(input: UpdateCertificationInput): Promise<CertificationType> {
    const { id, ...data } = input;
    const res = await fetch(`/api/certifications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<CertificationType>(res);
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/certifications/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? "Failed to delete certification");
    }
  },
};
