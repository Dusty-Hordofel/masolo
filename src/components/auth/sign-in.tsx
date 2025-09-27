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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "@/lib/(auth)/better-auth/auth-client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { ErrorContext } from "better-auth/react";
import SignInSchema from "@/lib/zod/signin-schema";
import { Icons } from "../ui/icons";


export default function SignIn() {
  const router = useRouter();

  const form = useForm<z.infer<(typeof SignInSchema.options)[0]>>({
    resolver: zodResolver(SignInSchema.options[0]),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoadingOAuth, setIsLoadingOAuth] = useState<{
    google: boolean;
    github: boolean;
    microsoft: boolean;
    facebook: boolean;
  }>({ google: false, github: false, microsoft: false, facebook: false });

  const handleCredentialsSignIn = async (
    values: z.infer<(typeof SignInSchema.options)[0]>
  ) => {
    // console.log("🚀 ~ handleCredentialsSignIn ~ values:", values);
    await signIn.email({
      email: values.email,
      password: values.password,

      callbackURL: "/user",
      fetchOptions: {
        onSuccess: async () => {
          toast("Account created", {
            description:
              "Your account has been created. Check your email for a verification link.",
          });
          form.reset();
          // router.push("/user");
        },
        onError: (ctx) => {
          console.log("🚀 ~ SignIn ~ ctx:CTX", ctx);
          if (ctx.error.status === 403) {
            toast("Email address not verified ", {
              description: "Please verify your email address to sign in",
            });
          }
          toast("Something went wrong", {
            description: ctx.error.message ?? "Something went wrong.",
          });
        },
      },
    });
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
          // router.push("/user");
          router.refresh();
        },
        onError: (ctx: ErrorContext) => {
          console.log("🚀 ~ SignIn ~ ctx:CTX", ctx.error.message);

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
            {["email", "password"].map((field) => (
              <FormField
                control={form.control}
                key={field}
                name={field as "email" | "password"}
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </FormLabel>
                      {field === "password" && (
                        <Link
                          href="#"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </Link>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        type={
                          field.includes("password")
                            ? "password"
                            : field === "email"
                              ? "email"
                              : "text"
                        }
                        placeholder={`Enter your ${field}`}
                        {...fieldProps}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Remember me</FormLabel>
                    <FormDescription>
                      Stay signed in on this device
                    </FormDescription>
                  </div>
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
                "Sign In with Credentials"
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
