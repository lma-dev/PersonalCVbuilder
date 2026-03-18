export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }
  if (error instanceof Response) {
    return error;
  }
  console.error("Unexpected error:", error);
  return Response.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
