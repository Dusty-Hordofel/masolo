"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { toast } from "@/hooks/use-toast"
// import { sendPasswordResetEmail } from "@/app/actions/auth"
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { forgetPassword } from "@/lib/(auth)/better-auth/auth-client";

// Define the form schema with Zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgetPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  // Initialize React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (value: FormValues) => {
    try {
      const { data, error } = await forgetPassword({
        email: value.email,
        redirectTo: "/reset-password",
      });

      setSubmitted(true);
      setSubmittedEmail(value.email);
      console.log("🚀 ~ onSubmit ~ error:", error);
      console.log("🚀 ~ onSubmit ~ data:", data);
    } catch (err) {
      console.log("🚀 ~ onSubmit ~ err:", err);
    }
  };

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className={cn("space-y-1 pb-6", submitted && "text-center")}>
        <CardTitle className="text-2xl font-bold">
          {submitted ? "Check your email" : "Forgot password?"}
        </CardTitle>
        <CardDescription>
          {submitted
            ? "We've sent a password reset link to your email"
            : "Enter your email address and we'll send you a link to reset your password"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="rounded-full bg-green-50 p-3 mb-2">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <p className="text-center text-sm text-gray-600 max-w-sm">
              We&apos;ve sent an email to{" "}
              <span className="font-medium text-black">{submittedEmail}</span>{" "}
              with instructions to reset your password.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSubmitted(false)}
            >
              Send again
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="name@example.com"
                        className="h-12"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-gray-800 transition-colors"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      {!submitted && (
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-xs text-center text-muted-foreground max-w-xs">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
