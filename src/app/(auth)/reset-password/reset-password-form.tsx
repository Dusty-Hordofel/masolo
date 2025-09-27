"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { resetPassword } from "@/lib/(auth)/better-auth/auth-client";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export default function ResetPasswordForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      toast.error("Token invalide ou expiré.");
      return;
    }

    const res = await resetPassword({ newPassword: data.password, token });

    if (res.error) {
      toast("Something went wrong", {
        description: res.error.message ?? "Something went wrong.",
      });

      return;
    }

    toast("Success", {
      description: "Password updated successfully!",
    });

    router.push("/sign-in");
  };

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className={cn("space-y-1 pb-6")}>
        <CardTitle className="text-2xl font-bold">Password reset</CardTitle>
        <CardDescription>Enter a new password and confirm.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {(["password", "confirmPassword"] as const).map((field) => (
              <FormField
                control={form.control}
                key={field}
                name={field}
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>
                      {field === "password"
                        ? "New password"
                        : "Confirm password"}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={
                          field === "password"
                            ? "Entrez votre mot de passe"
                            : "Confirmez votre mot de passe"
                        }
                        autoComplete="new-password"
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button
              className="w-full h-12 bg-black hover:bg-gray-800 transition-colors"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Réinitialisation..."
                : "Réinitialiser le mot de passe"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10 h-12", className)}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
