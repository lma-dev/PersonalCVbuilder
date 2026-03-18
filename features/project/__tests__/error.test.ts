import { ProjectError } from "@/features/project/error";

describe("ProjectError", () => {
  it("is an instance of Error and ProjectError", () => {
    const error = new ProjectError("test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ProjectError);
  });

  it("has correct name", () => {
    const error = new ProjectError("test");

    expect(error.name).toBe("ProjectError");
  });

  it("defaults code to PROJECT_ERROR", () => {
    const error = new ProjectError("test");

    expect(error.code).toBe("PROJECT_ERROR");
  });

  describe("notFound", () => {
    it("creates error with PROJECT_NOT_FOUND code", () => {
      const error = ProjectError.notFound("proj-202");

      expect(error.code).toBe("PROJECT_NOT_FOUND");
      expect(error.message).toContain("proj-202");
      expect(error).toBeInstanceOf(ProjectError);
    });
  });
});
