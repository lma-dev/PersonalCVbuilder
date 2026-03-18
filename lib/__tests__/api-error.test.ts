import { ApiError, errorResponse } from "@/lib/api-error";

describe("ApiError", () => {
  it("has correct message, statusCode, code, and name", () => {
    const error = new ApiError("Not found", 404, "NOT_FOUND");

    expect(error.message).toBe("Not found");
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
    expect(error.name).toBe("ApiError");
  });

  it("defaults statusCode to 400", () => {
    const error = new ApiError("Bad request");

    expect(error.statusCode).toBe(400);
    expect(error.code).toBeUndefined();
  });

  it("is an instance of Error", () => {
    const error = new ApiError("test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
  });
});

describe("errorResponse", () => {
  it("returns correct status and body for ApiError", async () => {
    const error = new ApiError("Not found", 404, "NOT_FOUND");
    const response = errorResponse(error);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body).toEqual({ error: "Not found", code: "NOT_FOUND" });
  });

  it("includes undefined code in body when ApiError has no code", async () => {
    const error = new ApiError("Bad request");
    const response = errorResponse(error);

    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toBe("Bad request");
  });

  it("passes through Response objects unchanged", () => {
    const original = new Response("custom", { status: 403 });
    const result = errorResponse(original);

    expect(result).toBe(original);
  });

  it("returns 500 for unknown errors", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = errorResponse(new TypeError("something broke"));

    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body).toEqual({ error: "Internal server error" });

    consoleSpy.mockRestore();
  });

  it("returns 500 for string errors", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = errorResponse("unexpected");

    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body).toEqual({ error: "Internal server error" });

    consoleSpy.mockRestore();
  });
});
