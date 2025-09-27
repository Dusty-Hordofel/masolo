"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { twoFactor } from "@/lib/(auth)/better-auth/auth-client";
import { showToast } from "@/lib/utils";

const otpSingleFieldSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Code must be 6 digits" })
    .max(6, { message: "Code must be 6 digits" })
    .regex(/^\d+$/, { message: "Code must contain only numbers" }),
});

// Form schema for OTP verification with individual digits
const otpDigitsSchema = z.object({
  digit1: z
    .string()
    .length(1, { message: "Required" })
    .regex(/^\d$/, { message: "Must be a digit" }),
  digit2: z
    .string()
    .length(1, { message: "Required" })
    .regex(/^\d$/, { message: "Must be a digit" }),
  digit3: z
    .string()
    .length(1, { message: "Required" })
    .regex(/^\d$/, { message: "Must be a digit" }),
  digit4: z
    .string()
    .length(1, { message: "Required" })
    .regex(/^\d$/, { message: "Must be a digit" }),
  digit5: z
    .string()
    .length(1, { message: "Required" })
    .regex(/^\d$/, { message: "Must be a digit" }),
  digit6: z
    .string()
    .length(1, { message: "Required" })
    .regex(/^\d$/, { message: "Must be a digit" }),
});

type OtpSingleFieldValues = z.infer<typeof otpSingleFieldSchema>;
type OtpDigitsValues = z.infer<typeof otpDigitsSchema>;

export default function OtpVerificationForm() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverResponse, setServerResponse] = useState<{
    message?: string;
    success?: boolean;
  } | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const useSingleField = false;

  // Initialize React Hook Form for OTP verification with single field
  const otpSingleFieldForm = useForm<OtpSingleFieldValues>({
    resolver: zodResolver(otpSingleFieldSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  // Initialize React Hook Form for OTP verification with individual digits
  const otpDigitsForm = useForm<OtpDigitsValues>({
    resolver: zodResolver(otpDigitsSchema),
    defaultValues: {
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
      digit5: "",
      digit6: "",
    },
    mode: "onChange",
  });

  const requestOTP = async () => {
    setIsSubmitting(true);
    try {
      const res = await twoFactor.sendOtp();
      if (res.data) {
        setIsOtpSent(true);
        setServerResponse({
          message: "OTP sent to your email",
          success: true,
        });
        return true;
        // showToast("Success!", "OTP Sent successfully ");
      } else {
        setIsOtpSent(false);
        setServerResponse({
          message: "OTP does not sent successfully",
          success: false,
        });
        return false;
        // showToast("Error!", "OTP dont sent successfully ");
      }
    } catch (error) {
      console.log("🚀 ~ requestOTP ~ error:", error);
      setServerResponse({
        message: "An error occurred while sending OTP",
        success: false,
      });
      // showToast("Error!", "An error occurred while sending OTP");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOtpSingleFieldSubmit: SubmitHandler<OtpSingleFieldValues> = async (
    data
  ) => {
    console.log("🚀 ~ TwoFactorVerificationForm ~ data:", data);
  };

  const onOtpDigitsSubmit: SubmitHandler<OtpDigitsValues> = async (data) => {
    try {
      // Combine digits into a single OTP
      const otp = Object.values(data).join("");
      await twoFactor.verifyOtp({
        code: otp,
        fetchOptions: {
          onSuccess() {
            showToast("Success!", "OTP validated successfully ");
            router.push("/user");
          },
          onError(ctx) {
            showToast("Error!", ctx.error.message);
          },
        },
      });
    } catch (error) {
      console.log(
        "🚀 ~ constonOtpDigitsSubmit:SubmitHandler<OtpDigitsValues>= ~ error:",
        error
      );
      showToast("Error!", "An error occurred during verification.");
    }
  };

  const handleOtpInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;

    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    // Update the form value
    const fieldName = `digit${index + 1}` as keyof OtpDigitsValues;
    otpDigitsForm.setValue(fieldName, value, { shouldValidate: true });

    // Auto-focus next input if value is entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all fields are filled
    if (value && index === 5) {
      const allValues = [
        otpDigitsForm.getValues("digit1"),
        otpDigitsForm.getValues("digit2"),
        otpDigitsForm.getValues("digit3"),
        otpDigitsForm.getValues("digit4"),
        otpDigitsForm.getValues("digit5"),
        otpDigitsForm.getValues("digit6"),
      ];

      if (allValues.every((v) => v && /^\d$/.test(v))) {
        otpDigitsForm.handleSubmit(onOtpDigitsSubmit)();
      }
    }
  };

  // Handle OTP input keydown for individual digits
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace") {
      const fieldName = `digit${index + 1}` as keyof OtpDigitsValues;
      const currentValue = otpDigitsForm.getValues(fieldName);

      // If current field is empty, focus previous field
      if (!currentValue && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Only process if it looks like an OTP
    if (!/^\d+$/.test(pastedData)) return;

    // Fill in as many digits as we can
    const digits = pastedData.split("").slice(0, 6);

    digits.forEach((digit, index) => {
      const fieldName = `digit${index + 1}` as keyof OtpDigitsValues;
      otpDigitsForm.setValue(fieldName, digit, { shouldValidate: true });
    });

    // Focus the next empty field or the last field
    const nextEmptyIndex = digits.length < 6 ? digits.length : 5;
    if (inputRefs.current[nextEmptyIndex]) {
      inputRefs.current[nextEmptyIndex]?.focus();
    }

    // Auto-submit if all fields are filled
    if (digits.length === 6) {
      otpDigitsForm.handleSubmit(onOtpDigitsSubmit)();
    }
  };

  return (
    <Card className="border-gray-200 rounded-md z-50 w-full max-w-md mx-auto flex flex-col">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Send className="h-6 w-6 text-primary" />
          Verification Code
        </CardTitle>
        <CardDescription>
          We&apos;ll send a verification code to confirm your identity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 mb-10">
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <ShieldCheck className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Secure Verification</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              To protect your account, we need to verify your identity. We will
              send you a verification code by email.
            </p>
          </div>
        </div>
        <div className="grid w-full items-center gap-4">
          {!isOtpSent ? (
            <Button
              onClick={requestOTP}
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 /> Sending Verification Code
                </>
              ) : (
                <>
                  Send Verification Code <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <>
              {useSingleField ? (
                // Single field OTP input
                <Form {...otpSingleFieldForm}>
                  <form
                    onSubmit={otpSingleFieldForm.handleSubmit(
                      onOtpSingleFieldSubmit
                    )}
                    className="space-y-6"
                  >
                    <FormField
                      control={otpSingleFieldForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Code</FormLabel>
                          <FormControl>
                            <Input
                              id="otp-single-field"
                              placeholder="Enter 6-digit code"
                              className="text-center text-lg tracking-widest"
                              maxLength={6}
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              {...field}
                              onChange={(e) => {
                                const { value } = e.target;
                                // Only allow numbers
                                if (value && !/^\d*$/.test(value)) {
                                  return;
                                }
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        isSubmitting || !otpSingleFieldForm.formState.isValid
                      }
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Verifying...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Verify Code
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <>
                  {/* Individual digits OTP input */}
                  <Form {...otpDigitsForm}>
                    <form
                      onSubmit={otpDigitsForm.handleSubmit(onOtpDigitsSubmit)}
                      className="space-y-6"
                    >
                      <FormItem className="space-y-2">
                        <FormLabel>Verification Code</FormLabel>
                        <div className="flex justify-between gap-2">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <Controller
                              key={`digit${index + 1}`}
                              control={otpDigitsForm.control}
                              name={
                                `digit${index + 1}` as keyof OtpDigitsValues
                              }
                              render={({ field, fieldState }) => (
                                <div>
                                  <Input
                                    {...field}
                                    ref={(el) => {
                                      inputRefs.current[index] = el;
                                      field.ref(el);
                                    }}
                                    className={`w-12 h-12 text-center text-xl font-medium p-0 ${
                                      fieldState.error
                                        ? "border-destructive"
                                        : ""
                                    }`}
                                    maxLength={1}
                                    onChange={(e) =>
                                      handleOtpInputChange(index, e)
                                    }
                                    onKeyDown={(e) =>
                                      handleOtpKeyDown(index, e)
                                    }
                                    onPaste={
                                      index === 0 ? handleOtpPaste : undefined
                                    }
                                    inputMode="numeric"
                                    autoComplete={
                                      index === 0 ? "one-time-code" : "off"
                                    }
                                  />
                                </div>
                              )}
                            />
                          ))}
                        </div>
                        <div className="flex justify-center">
                          <FormMessage />
                        </div>
                      </FormItem>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={
                          isSubmitting || !otpDigitsForm.formState.isValid
                        }
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Verifying...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Verify Code
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </>
          )}
        </div>
        {serverResponse?.success && (
          <div
            className={`flex items-center gap-2 mt-4 ${!serverResponse.success ? "text-red-500" : "text-primary"}`}
          >
            {!serverResponse.success ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <p className="text-sm">{serverResponse.message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <div className="text-center w-full text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </CardFooter>
    </Card>
  );
}
