import { validateTechnologies } from "../index";

describe("validateTechnologies", () => {
  it("trims whitespace from entries", () => {
    expect(validateTechnologies(["  React  ", " Node.js "])).toEqual([
      "React",
      "Node.js",
    ]);
  });

  it("filters out empty strings", () => {
    expect(validateTechnologies(["React", "", "  ", "Node.js"])).toEqual([
      "React",
      "Node.js",
    ]);
  });

  it("returns cleaned array with valid entries", () => {
    expect(validateTechnologies(["TypeScript", "Prisma"])).toEqual([
      "TypeScript",
      "Prisma",
    ]);
  });

  it("handles empty input array", () => {
    expect(validateTechnologies([])).toEqual([]);
  });

  it("returns empty array when all entries are whitespace-only", () => {
    expect(validateTechnologies(["  ", "", "   "])).toEqual([]);
  });
});
