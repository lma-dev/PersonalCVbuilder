export class CertificationError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = "CERTIFICATION_ERROR") {
    super(message);
    this.name = "CertificationError";
    this.code = code;
  }

  static notFound(id: string) {
    return new CertificationError(
      `Certification not found: ${id}`,
      "CERTIFICATION_NOT_FOUND"
    );
  }
}
