"use client";

import { /*useRef,*/ useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
import Image from "next/image";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/(auth)/better-auth/auth-client";
import { signUpSchema } from "@/helpers/zod/signup-schema";

export function SignUp() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: null,
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    await signUp.email({
      email: values.email,
      password: values.password,
      name: `${values.firstName} ${values.lastName}`,
      image: values.image ? await convertImageToBase64(values.image) : "",
      callbackURL: "/user",
      fetchOptions: {
        onSuccess: async () => {
          toast("Account created", {
            description:
              "Your account has been created. Check your email for a verification link.",
          });
          form.reset();
          setImagePreview(null);
          // fileInputRef.current?.value && (fileInputRef.current.value = "");
        },
        onError: (ctx) => {
          console.log("🚀 ~ onSubmit ~ ctx:", ctx.error.message);
          toast("Something went wrong", {
            description: ctx.error.message ?? "Something went wrong.",
          });
        },
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="z-50 rounded-md rounded-t-none max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* - as const allows TypeScript to understand that [“firstName”, “lastName”] is an array of constant values and not a generic string[].
	- name={field as “firstName” | “lastName”} informs TypeScript that field is one of the valid values defined in the schema. */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {(["firstName", "lastName"] as const).map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={`Enter your ${field}`}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {["email", "password", "confirmPassword"].map((field) => (
              <FormField
                control={form.control}
                key={field}
                name={field as "email" | "password" | "confirmPassword"}
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </FormLabel>
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
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Profile Image (optional)</FormLabel>
                  <div className="flex items-end gap-4">
                    {imagePreview && (
                      <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Profile preview"
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                      />
                      {imagePreview && (
                        <X
                          className="cursor-pointer"
                          onClick={() => {
                            form.setValue("image", null);
                            setImagePreview(null);
                          }}
                        />
                      )}
                    </div>
                  </div>
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
                "Create an account"
              )}
            </Button>
          </form>
        </Form>
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

// Convert image file to base64
const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};
