import { ContentfulStatusCode } from "hono/utils/http-status";

const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  FETCH_FAILED: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export class AppError extends Error {
  statusCode: ContentfulStatusCode;
  constructor(message: string, status: keyof typeof ERROR_CODES = "BAD_REQUEST") {
    super(message);
    const statusCode = ERROR_CODES[status];
    this.statusCode = statusCode;
  }
}
