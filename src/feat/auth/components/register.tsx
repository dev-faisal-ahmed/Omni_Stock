"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/form/password-input";
import { FormField } from "@/components/form/form-field";
import { registerSchema, type TRegisterFormData } from "../auth.schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { queryKeys } from "@/lib/query.keys";
// import { registerApi } from "../auth.api"; // Use your actual API implementation

// Example query key mutation, replace if needed
const mutationKey = ["auth", "register"] as const;

export function Register() {
  const router = useRouter();
  // const queryClient = useQueryClient();

  const form = useForm<TRegisterFormData>({
    // @ts-expect-error Zod v4 type mismatch with current @hookform/resolvers
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey,
    // Replace with your actual register API
    mutationFn: async (data: TRegisterFormData) => {
      // Mock API call
      // await registerApi(data);
      console.log("Mock Register Data:", data);
      await new Promise((r) => setTimeout(r, 1000));
      return { success: true };
    },
    onSuccess: () => {
      form.reset();
      // queryClient.invalidateQueries({ queryKey: [queryKeys.auth.session] });
      router.push("/login"); // Adjust to your actual login route
    },
  });

  const onSubmit = (data: TRegisterFormData) => {
    mutate(data);
  };

  return (
    <section className="flex min-h-screen items-center justify-center">
      <div className="border-border bg-card flex w-full max-w-110 flex-col rounded-3xl border p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-foreground mb-2 text-2xl font-bold tracking-tight">
            Join <span className="text-primary">OmniStock</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Start managing your inventory smarter.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField control={form.control} name="name" label="Full Name">
            {({ field }) => <Input {...field} id="name" placeholder="John Doe" />}
          </FormField>

          <FormField control={form.control} name="email" label="Email Address">
            {({ field }) => (
              <Input {...field} id="email" type="email" placeholder="name@company.com" />
            )}
          </FormField>

          <FormField control={form.control} name="password" label="Password">
            {({ field }) => <PasswordInput {...field} placeholder="Create a strong password" />}
          </FormField>

          <FormField control={form.control} name="confirmPassword" label="Confirm Password">
            {({ field }) => <PasswordInput {...field} placeholder="Confirm your password" />}
          </FormField>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </div>

          <p className="text-muted-foreground mt-4 text-center text-[13px] font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold transition-colors hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
