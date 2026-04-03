import z from "zod";

export const registerFormSchema = z
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

export const loginFormSchema = z.object({
  email: z.email({ message: "Email is required" }),
  password: z.string({ message: "Password is required" }).nonempty("Password can not be empty"),
});

export type TRegisterFormData = z.infer<typeof registerFormSchema>;
export type TLoginFormData = z.infer<typeof loginFormSchema>;
