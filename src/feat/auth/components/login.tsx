"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/form/password-input";
import { FormField } from "@/components/form/form-field";
import { loginFormSchema, type TLoginFormData } from "../auth-schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginApi } from "../auth-api";

export function Login() {
  const router = useRouter();

  const form = useForm<TLoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess() {
      router.push("/");
    },
  });

  const onLogin = form.handleSubmit((formData) => mutate(formData));

  return (
    <section className="flex min-h-screen items-center justify-center">
      <div className="border-border bg-card flex w-full max-w-110 flex-col rounded-3xl border p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-foreground mb-2 text-2xl font-bold tracking-tight">
            Welcome back to <span className="text-primary">OmniStock</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Sign in to continue managing your inventory.
          </p>
        </div>

        <form onSubmit={onLogin} className="space-y-5">
          <FormField control={form.control} name="email" label="Email Address">
            {({ field }) => (
              <Input {...field} id="email" type="email" placeholder="name@company.com" />
            )}
          </FormField>

          <FormField control={form.control} name="password" label="Password">
            {({ field }) => <PasswordInput {...field} placeholder="Enter your password" />}
          </FormField>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </div>

          <p className="text-muted-foreground mt-4 text-center text-[13px] font-medium">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-semibold transition-colors hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
