import { CertificationError } from "../error";
import { getCertification } from "../data";

export async function validateCertificationExists(id: string) {
  const certification = await getCertification(id);

  if (!certification) {
    throw CertificationError.notFound(id);
  }

  return certification;
}
