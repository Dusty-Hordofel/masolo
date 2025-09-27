"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  // FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "@/lib/(auth)/better-auth/auth-client";
import { cn } from "@/lib/utils";
import { ErrorContext } from "better-auth/react";
import SignInSchema from "@/lib/zod/signin-schema";
import { Icons } from "../ui/icons";
/* import { Icons } from "../ui/icons";
import SignInSchema from "@/helpers/zod/signin-schema"; */

// [better-auth magic-link](https://www.better-auth.com/docs/plugins/magic-link)
export default function MagicLink() {
  const router = useRouter();

  const form = useForm<z.infer<(typeof SignInSchema.options)[1]>>({
    resolver: zodResolver(SignInSchema.options[1]),
    defaultValues: {
      email: "",
    },
  });

  const [isLoadingOAuth, setIsLoadingOAuth] = useState<{
    google: boolean;
    github: boolean;
    microsoft: boolean;
    facebook: boolean;
  }>({ google: false, github: false, microsoft: false, facebook: false });

  const handleCredentialsSignIn = async (
    values: z.infer<(typeof SignInSchema.options)[1]>
  ) => {
    await signIn.magicLink(
      { email: values.email },
      {
        // onRequest: () => setLoading(true),
        // onResponse: () => setLoading(false),
        onSuccess: () => {
          // setSuccess("A magic link has been sent to your email.");
          toast("Magic Link Sent", {
            description: "A magic link has been sent to your email.",
          });

          form.reset();
          router.push("/two-factor-verification");
        },
        onError: (ctx) => {
          //   setError(ctx.error.message || "Failed to send magic link.");
          toast("Something went wrong", {
            description: ctx.error.message ?? "Failed to send magic link.",
          });
        },
      }
    );
  };

  const handleSignInWithOAuth = async (
    provider: "github" | "apple" | "facebook" | "microsoft" | "google",
    callbackURL: string
  ) => {
    await signIn.social(
      {
        provider,
        callbackURL,
      },
      {
        onRequest: () => {
          setIsLoadingOAuth((prev) => ({ ...prev, provider: true }));
        },
        onResponse: () => {
          setIsLoadingOAuth((prev) => ({ ...prev, [provider]: false }));
        },
        onSuccess: async () => {
          // setIsLoadingOAuth((prev) => ({ ...prev, provider: false }));
          router.push("/");
          router.refresh();
        },
        onError: (ctx: ErrorContext) => {
          // setIsLoadingOAuth((prev) => ({ ...prev, provider: false }));
          toast("Something went wrong", {
            description: ctx.error.message ?? "Something went wrong.",
          });
        },
      }
    );
  };

  return (
    <Card className="z-50 rounded-md rounded-t-none max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCredentialsSignIn)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              key="email"
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Send Magic Link"
              )}
            </Button>
          </form>
        </Form>
        <div
          className={cn(
            "w-full gap-2 flex items-center",
            "justify-between flex-col mt-4"
          )}
        >
          <Button
            variant="outline"
            className={cn("w-full gap-2")}
            onClick={async () => await handleSignInWithOAuth("google", "/")}
            disabled={isLoadingOAuth.google}
          >
            <span className="pointer-events-none ">
              {!isLoadingOAuth.google ? (
                <Icons.google />
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </span>
            Sign in with Google
          </Button>
          <Button
            variant="outline"
            className={cn("w-full gap-2")}
            onClick={async () => await handleSignInWithOAuth("github", "/")}
            disabled={isLoadingOAuth.github}
          >
            <span className="pointer-events-none ">
              {!isLoadingOAuth.github ? (
                <Icons.github />
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </span>
            Sign in with Github
          </Button>
          {/* <Button
            variant="outline"
            className={cn("w-full gap-2")}
            onClick={async () => await handleSignInWithOAuth("facebook", "/")}
            disabled={isLoadingOAuth.facebook}
          >
            <span className="pointer-events-none ">
              {!isLoadingOAuth.facebook ? (
                <Icons.facebook />
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </span>
            Sign in with Facebook
          </Button> */}
          <Button
            variant="outline"
            className={cn("w-full gap-2")}
            disabled={isLoadingOAuth.microsoft}
            onClick={async () => await handleSignInWithOAuth("microsoft", "/")}
          >
            <span className="pointer-events-none ">
              {!isLoadingOAuth.microsoft ? (
                <Icons.microsoft />
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </span>
            Sign in with Microsoft
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center w-full border-t py-4">
          <p className="text-center text-xs text-neutral-500">
            Secured by <span className="text-orange-400">better-auth.</span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
