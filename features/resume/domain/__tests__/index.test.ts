import { canTransitionStatus, assertStatusTransition } from "../index";
import { ResumeError } from "../../error";
import type { ResumeStatus } from "../../types";

describe("canTransitionStatus", () => {
  it("allows DRAFT → FINAL", () => {
    expect(canTransitionStatus("DRAFT", "FINAL")).toBe(true);
  });

  it("allows FINAL → DRAFT", () => {
    expect(canTransitionStatus("FINAL", "DRAFT")).toBe(true);
  });

  it("allows same status DRAFT → DRAFT", () => {
    expect(canTransitionStatus("DRAFT", "DRAFT")).toBe(true);
  });

  it("allows same status FINAL → FINAL", () => {
    expect(canTransitionStatus("FINAL", "FINAL")).toBe(true);
  });

  it("returns false for unknown status transitions", () => {
    expect(canTransitionStatus("UNKNOWN" as ResumeStatus, "DRAFT")).toBe(false);
  });
});

describe("assertStatusTransition", () => {
  it("does not throw for valid transitions", () => {
    expect(() => assertStatusTransition("DRAFT", "FINAL")).not.toThrow();
    expect(() => assertStatusTransition("FINAL", "DRAFT")).not.toThrow();
    expect(() => assertStatusTransition("DRAFT", "DRAFT")).not.toThrow();
    expect(() => assertStatusTransition("FINAL", "FINAL")).not.toThrow();
  });

  it("throws ResumeError for invalid transitions", () => {
    expect(() =>
      assertStatusTransition("UNKNOWN" as ResumeStatus, "DRAFT")
    ).toThrow(ResumeError);
  });

  it("throws with code RESUME_INVALID_STATUS_TRANSITION", () => {
    try {
      assertStatusTransition("UNKNOWN" as ResumeStatus, "DRAFT");
      expect.unreachable("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ResumeError);
      expect((error as ResumeError).code).toBe(
        "RESUME_INVALID_STATUS_TRANSITION"
      );
    }
  });
});
