import z from "zod";

export const registerDto = z.object({
  name: z.string("Name is required").trim().nonempty("Name can not be empty"),
  email: z.email("Invalid email"),
  password: z.string("Password is required").min(6, "Password must be at least 6 characters"),
});

export const loginDto = z.object({
  email: z.email("Invalid email"),
  password: z.string("Password is required"),
});

export type RegisterDto = z.infer<typeof registerDto>;
export type LoginDto = z.infer<typeof loginDto>;
