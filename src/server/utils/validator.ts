import { ZodType } from "zod";
import { validator } from "hono/validator";

export function jsonValidator<TSchema extends ZodType>(schema: TSchema) {
  return validator("json", async (value) => {
    const parsed = await schema.parseAsync(value);
    return parsed;
  });
}

export function queryValidator<TSchema extends ZodType>(schema: TSchema) {
  return validator("query", async (value) => {
    const parsed = await schema.parseAsync(value);
    return parsed;
  });
}
