import { CertificationError } from "@/features/certification/error";

describe("CertificationError", () => {
  it("is an instance of Error and CertificationError", () => {
    const error = new CertificationError("test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CertificationError);
  });

  it("has correct name", () => {
    const error = new CertificationError("test");

    expect(error.name).toBe("CertificationError");
  });

  it("defaults code to CERTIFICATION_ERROR", () => {
    const error = new CertificationError("test");

    expect(error.code).toBe("CERTIFICATION_ERROR");
  });

  describe("notFound", () => {
    it("creates error with CERTIFICATION_NOT_FOUND code", () => {
      const error = CertificationError.notFound("cert-303");

      expect(error.code).toBe("CERTIFICATION_NOT_FOUND");
      expect(error.message).toContain("cert-303");
      expect(error).toBeInstanceOf(CertificationError);
    });
  });
});
