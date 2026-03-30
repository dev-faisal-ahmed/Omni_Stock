import z from "zod";

export const registerSchema = z
  .object({
    name: z.string({ message: "Name is required" }).trim().nonempty("Name can not be empty"),
    email: z.string({ message: "Email is required" }).trim().email("Invalid email"),
    password: z
      .string({ message: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string({ message: "Please confirm your password" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type TRegisterFormData = z.infer<typeof registerSchema>;
