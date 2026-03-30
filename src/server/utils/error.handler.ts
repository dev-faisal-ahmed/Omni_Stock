import { Context } from "hono";
import { ZodError } from "zod";

import { ContentfulStatusCode } from "hono/utils/http-status";
import { AppError } from "./app.error";
import { ResponseDto } from "./response.dto";

export function errorHandler(error: unknown, ctx: Context) {
  if (process.env.NODE_ENV === "development") {
    console.error("Error occurred:", error);
  }

  let message = "Internal Server Error";
  let statusCode = 500;

  if (error instanceof ZodError) {
    message = formatZodError(error);
    statusCode = 400;
  } else if (error instanceof AppError) {
    message = error.message;
    statusCode = error.statusCode;
  }

  return ctx.json(ResponseDto.error(message), statusCode as ContentfulStatusCode);
}

function formatZodError(error: ZodError) {
  const errorMessages = error.issues.map((issue) => {
    const field = issue.path.join(".");

    // Build human-readable messages
    switch (issue.code) {
      case "invalid_type":
        const invalidTypeIssue = issue as { expected?: string; received?: string };
        return `[${field}]: expected ${invalidTypeIssue.expected}, received ${invalidTypeIssue.received}`;
      case "too_small":
        return `[${field}]: too small, minimum ${issue.minimum}`;
      case "too_big":
        return `[${field}]: too big, maximum ${issue.maximum}`;
      default:
        return `[${field}]: ${issue.message}`;
    }
  });

  return errorMessages.join(", ");
}
