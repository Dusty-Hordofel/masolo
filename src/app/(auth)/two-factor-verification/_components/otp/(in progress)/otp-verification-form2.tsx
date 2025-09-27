import React from "react";

const Test = () => {
  return <div>Test</div>;
};

export default Test;

// // IN PROGRESS
// "use client";

// import type React from "react";

// import { useState, useEffect, useRef } from "react";
// import { useForm, Controller, type SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//   Mail,
//   Smartphone,
//   ArrowRight,
//   CheckCircle2,
//   AlertCircle,
//   Clock,
//   RefreshCw,
//   Send,
//   ShieldCheck,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { ScrollArea } from "@/components/ui/scroll-area";

// const sendOtpSchema = z
//   .object({
//     contactMethod: z.enum(["email", "sms"], {
//       required_error: "Please select a contact method",
//     }),
//     contact: z.string().min(1, "This field is required"),
//   })
//   .superRefine((data, ctx) => {
//     if (data.contactMethod === "email") {
//       const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//       if (!emailRegex.test(data.contact)) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "Please enter a valid email address.",
//           path: ["contact"],
//         });
//       }
//     } else if (data.contactMethod === "sms") {
//       // Retirer tous les caractères non numériques
//       const digitsOnly = data.contact.replace(/\D/g, "");

//       // Validation pour les numéros français

//       // Cas 1: Format commençant par 0 (format national)
//       if (digitsOnly.startsWith("0")) {
//         // Doit avoir exactement 10 chiffres
//         if (digitsOnly.length !== 10) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message:
//               "Les numéros français doivent comporter exactement 10 chiffres.",
//             path: ["contact"],
//           });
//           return;
//         }

//         // Vérifier que le deuxième chiffre est valide (0[1-9])
//         const secondDigit = parseInt(digitsOnly.charAt(1));
//         if (secondDigit < 1 || secondDigit > 9) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message:
//               "Le format du numéro français n'est pas valide. Il doit commencer par 01-09.",
//             path: ["contact"],
//           });
//           return;
//         }
//       }
//       // Cas 2: Format international (+33)
//       else if (data.contact.includes("+33") || digitsOnly.startsWith("33")) {
//         // Pour +33, on vérifie qu'il y a 9 chiffres après le 33
//         const relevantDigits = digitsOnly.startsWith("33")
//           ? digitsOnly.substring(2)
//           : digitsOnly.replace("+33", "");

//         if (relevantDigits.length !== 9) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message:
//               "Les numéros français au format international doivent comporter 9 chiffres après le +33.",
//             path: ["contact"],
//           });
//           return;
//         }

//         // Vérifier que le premier chiffre après l'indicatif est valide (doit être 6, 7, etc. et non 0)
//         const firstDigitAfterCode = parseInt(relevantDigits.charAt(0));
//         if (firstDigitAfterCode < 1 || firstDigitAfterCode > 9) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message:
//               "Le format du numéro français n'est pas valide. Après +33, il doit commencer par 1-9.",
//             path: ["contact"],
//           });
//           return;
//         }
//       }
//       // Cas 3: Ni format national ni international reconnu
//       else {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message:
//             "Veuillez entrer un numéro français valide (commençant par 0 ou +33).",
//           path: ["contact"],
//         });
//         return;
//       }

//       // Validation du format visuel (espaces, tirets, etc.)
//       const formattingRegex =
//         /^(\+33|0)[1-9](\s|-|\.)?(\d{2}(\s|-|\.)?){4}$|^(\+33\s?|0)[1-9](\s|-|\.)?(\d{2}(\s|-|\.)?){3}\d{2}$/;
//       if (!formattingRegex.test(data.contact)) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message:
//             "Format incorrect. Exemples valides: 06 12 34 56 78, 0612345678, +33 6 12 34 56 78",
//           path: ["contact"],
//         });
//       }
//     }
//   });

// // Form schema for OTP verification with a single field
// const otpSingleFieldSchema = z.object({
//   otp: z
//     .string()
//     .min(6, { message: "Code must be 6 digits" })
//     .max(6, { message: "Code must be 6 digits" })
//     .regex(/^\d+$/, { message: "Code must contain only numbers" }),
// });

// // Form schema for OTP verification with individual digits
// const otpDigitsSchema = z.object({
//   digit1: z
//     .string()
//     .length(1, { message: "Required" })
//     .regex(/^\d$/, { message: "Must be a digit" }),
//   digit2: z
//     .string()
//     .length(1, { message: "Required" })
//     .regex(/^\d$/, { message: "Must be a digit" }),
//   digit3: z
//     .string()
//     .length(1, { message: "Required" })
//     .regex(/^\d$/, { message: "Must be a digit" }),
//   digit4: z
//     .string()
//     .length(1, { message: "Required" })
//     .regex(/^\d$/, { message: "Must be a digit" }),
//   digit5: z
//     .string()
//     .length(1, { message: "Required" })
//     .regex(/^\d$/, { message: "Must be a digit" }),
//   digit6: z
//     .string()
//     .length(1, { message: "Required" })
//     .regex(/^\d$/, { message: "Must be a digit" }),
// });

// type SendOtpFormValues = z.infer<typeof sendOtpSchema>;
// type OtpSingleFieldValues = z.infer<typeof otpSingleFieldSchema>;
// type OtpDigitsValues = z.infer<typeof otpDigitsSchema>;

// // Verification steps
// type VerificationStep = "send" | "verify" | "success";

// // Mock function to send OTP
// async function sendOtp(contactMethod: string, contact: string) {
//   // Simulate API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         success: true,
//         message: `Verification code sent to your ${contactMethod === "email" ? "email" : "phone"}`,
//         expiresIn: 300, // 5 minutes in seconds
//       });
//     }, 1500);
//   });
// }

// // Mock function to verify OTP
// async function verifyOtp(otp: string) {
//   // Simulate API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // For demo purposes, "123456" is the valid code
//       const isValid = otp === "123456";
//       resolve({
//         success: isValid,
//         message: isValid
//           ? "Verification successful"
//           : "Invalid verification code. Please try again.",
//       });
//     }, 1500);
//   });
// }

// export function OtpVerificationForm2() {
//   const [step, setStep] = useState<VerificationStep>("send");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [serverResponse, setServerResponse] = useState<{
//     message?: string;
//     success?: boolean;
//   } | null>(null);
//   const [contactInfo, setContactInfo] = useState<{
//     method: string;
//     value: string;
//   } | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState<number>(0);
//   const [canResend, setCanResend] = useState<boolean>(false);
//   const [useSingleField, setUseSingleField] = useState<boolean>(false);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   // Initialize React Hook Form for sending OTP
//   const sendOtpForm = useForm<SendOtpFormValues>({
//     resolver: zodResolver(sendOtpSchema),
//     defaultValues: {
//       contactMethod: "email",
//       contact: "",
//     },
//     mode: "onChange",
//   });

//   // Initialize React Hook Form for OTP verification with single field
//   const otpSingleFieldForm = useForm<OtpSingleFieldValues>({
//     resolver: zodResolver(otpSingleFieldSchema),
//     defaultValues: {
//       otp: "",
//     },
//     mode: "onChange",
//   });

//   // Initialize React Hook Form for OTP verification with individual digits
//   const otpDigitsForm = useForm<OtpDigitsValues>({
//     resolver: zodResolver(otpDigitsSchema),
//     defaultValues: {
//       digit1: "",
//       digit2: "",
//       digit3: "",
//       digit4: "",
//       digit5: "",
//       digit6: "",
//     },
//     mode: "onChange",
//   });

//   // Handle countdown timer
//   useEffect(() => {
//     let interval: NodeJS.Timeout | null = null;

//     if (timeRemaining > 0) {
//       interval = setInterval(() => {
//         setTimeRemaining((prev) => {
//           if (prev <= 1) {
//             setCanResend(true);
//             if (interval) clearInterval(interval);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [timeRemaining]);

//   // Format time remaining
//   const formatTimeRemaining = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
//   };

//   // Handle sending OTP
//   const onSendOtpSubmit: SubmitHandler<SendOtpFormValues> = async (data) => {
//     setIsSubmitting(true);
//     setServerResponse(null);

//     try {
//       const result = (await sendOtp(data.contactMethod, data.contact)) as any;

//       setServerResponse({
//         message: result.message,
//         success: result.success,
//       });

//       if (result.success) {
//         setContactInfo({
//           method: data.contactMethod,
//           value: data.contact,
//         });
//         setTimeRemaining(result.expiresIn || 300);
//         setCanResend(false);
//         setStep("verify");

//         // Reset OTP forms
//         otpSingleFieldForm.reset();
//         otpDigitsForm.reset();

//         // Focus on first input
//         setTimeout(() => {
//           if (useSingleField) {
//             const singleFieldInput =
//               document.getElementById("otp-single-field");
//             if (singleFieldInput) {
//               (singleFieldInput as HTMLInputElement).focus();
//             }
//           } else if (inputRefs.current[0]) {
//             inputRefs.current[0].focus();
//           }
//         }, 100);
//       }
//     } catch (error) {
//       setServerResponse({
//         message: "An error occurred while sending the verification code.",
//         success: false,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle OTP verification with single field
//   const onOtpSingleFieldSubmit: SubmitHandler<OtpSingleFieldValues> = async (
//     data
//   ) => {
//     setIsSubmitting(true);
//     setServerResponse(null);

//     try {
//       const result = (await verifyOtp(data.otp)) as any;

//       setServerResponse({
//         message: result.message,
//         success: result.success,
//       });

//       if (result.success) {
//         setStep("success");
//       }
//     } catch (error) {
//       setServerResponse({
//         message: "An error occurred during verification.",
//         success: false,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle OTP verification with individual digits
//   const onOtpDigitsSubmit: SubmitHandler<OtpDigitsValues> = async (data) => {
//     setIsSubmitting(true);
//     setServerResponse(null);

//     try {
//       // Combine digits into a single OTP
//       const otp = Object.values(data).join("");

//       const result = (await verifyOtp(otp)) as any;

//       setServerResponse({
//         message: result.message,
//         success: result.success,
//       });

//       if (result.success) {
//         setStep("success");
//       }
//     } catch (error) {
//       setServerResponse({
//         message: "An error occurred during verification.",
//         success: false,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle resending OTP
//   const handleResendOtp = async () => {
//     if (!contactInfo || !canResend) return;

//     setIsSubmitting(true);
//     setServerResponse(null);

//     try {
//       const result = (await sendOtp(
//         contactInfo.method,
//         contactInfo.value
//       )) as any;

//       setServerResponse({
//         message: result.message,
//         success: result.success,
//       });

//       if (result.success) {
//         setTimeRemaining(result.expiresIn || 300);
//         setCanResend(false);

//         // Reset OTP forms
//         otpSingleFieldForm.reset();
//         otpDigitsForm.reset();

//         // Focus on first input
//         setTimeout(() => {
//           if (useSingleField) {
//             const singleFieldInput =
//               document.getElementById("otp-single-field");
//             if (singleFieldInput) {
//               (singleFieldInput as HTMLInputElement).focus();
//             }
//           } else if (inputRefs.current[0]) {
//             inputRefs.current[0].focus();
//           }
//         }, 100);
//       }
//     } catch (error) {
//       setServerResponse({
//         message: "An error occurred while resending the verification code.",
//         success: false,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle OTP input change for individual digits
//   const handleOtpInputChange = (
//     index: number,
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { value } = e.target;

//     // Only allow numbers
//     if (value && !/^\d$/.test(value)) {
//       return;
//     }

//     // Update the form value
//     const fieldName = `digit${index + 1}` as keyof OtpDigitsValues;
//     otpDigitsForm.setValue(fieldName, value, { shouldValidate: true });

//     // Auto-focus next input if value is entered
//     if (value && index < 5 && inputRefs.current[index + 1]) {
//       inputRefs.current[index + 1]?.focus();
//     }

//     // Auto-submit if all fields are filled
//     if (value && index === 5) {
//       const allValues = [
//         otpDigitsForm.getValues("digit1"),
//         otpDigitsForm.getValues("digit2"),
//         otpDigitsForm.getValues("digit3"),
//         otpDigitsForm.getValues("digit4"),
//         otpDigitsForm.getValues("digit5"),
//         otpDigitsForm.getValues("digit6"),
//       ];

//       if (allValues.every((v) => v && /^\d$/.test(v))) {
//         otpDigitsForm.handleSubmit(onOtpDigitsSubmit)();
//       }
//     }
//   };

//   // Handle OTP input keydown for individual digits
//   const handleOtpKeyDown = (
//     index: number,
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     // Handle backspace
//     if (e.key === "Backspace") {
//       const fieldName = `digit${index + 1}` as keyof OtpDigitsValues;
//       const currentValue = otpDigitsForm.getValues(fieldName);

//       // If current field is empty, focus previous field
//       if (!currentValue && index > 0 && inputRefs.current[index - 1]) {
//         inputRefs.current[index - 1]?.focus();
//       }
//     }
//   };

//   // Handle OTP input paste for individual digits
//   const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData("text");

//     // Only process if it looks like an OTP
//     if (!/^\d+$/.test(pastedData)) return;

//     // Fill in as many digits as we can
//     const digits = pastedData.split("").slice(0, 6);

//     digits.forEach((digit, index) => {
//       const fieldName = `digit${index + 1}` as keyof OtpDigitsValues;
//       otpDigitsForm.setValue(fieldName, digit, { shouldValidate: true });
//     });

//     // Focus the next empty field or the last field
//     const nextEmptyIndex = digits.length < 6 ? digits.length : 5;
//     if (inputRefs.current[nextEmptyIndex]) {
//       inputRefs.current[nextEmptyIndex]?.focus();
//     }

//     // Auto-submit if all fields are filled
//     if (digits.length === 6) {
//       otpDigitsForm.handleSubmit(onOtpDigitsSubmit)();
//     }
//   };

//   // Toggle between single field and individual digits
//   const toggleInputMode = () => {
//     setUseSingleField(!useSingleField);
//     // Reset forms when switching
//     otpSingleFieldForm.reset();
//     otpDigitsForm.reset();
//   };

//   // Render the send OTP step
//   if (step === "send") {
//     return (
//       <Card className="border-border/40 shadow-lg w-full max-w-md mx-auto flex flex-col">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl flex items-center gap-2">
//             <Send className="h-6 w-6 text-primary" />
//             Verification Code
//           </CardTitle>
//           <CardDescription>
//             We'll send a verification code to confirm your identity
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="flex-grow">
//           <ScrollArea className="h-full pr-4">
//             <div className="space-y-6">
//               <div className="flex flex-col items-center justify-center py-4 text-center">
//                 <div className="rounded-full bg-primary/10 p-3 mb-4">
//                   <ShieldCheck className="h-12 w-12 text-primary" />
//                 </div>
//                 <h3 className="text-xl font-medium mb-2">
//                   Secure Verification
//                 </h3>
//                 <p className="text-sm text-muted-foreground max-w-sm">
//                   To protect your account, we need to verify your identity.
//                   Choose how you'd like to receive your verification code.
//                 </p>
//               </div>

//               <Form {...sendOtpForm}>
//                 <form
//                   onSubmit={sendOtpForm.handleSubmit(onSendOtpSubmit)}
//                   className="space-y-6"
//                 >
//                   <FormField
//                     control={sendOtpForm.control}
//                     name="contactMethod"
//                     render={({ field }) => (
//                       <FormItem className="space-y-3">
//                         <FormLabel>Verification Method</FormLabel>
//                         <FormControl>
//                           <RadioGroup
//                             onValueChange={field.onChange}
//                             defaultValue={field.value}
//                             className="flex flex-col space-y-1"
//                           >
//                             <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
//                               <RadioGroupItem value="email" id="email" />
//                               <Label
//                                 htmlFor="email"
//                                 className="flex items-center gap-2 cursor-pointer"
//                               >
//                                 <Mail className="h-4 w-4 text-primary" />
//                                 <div>
//                                   <p className="font-medium">Email</p>
//                                   <p className="text-sm text-muted-foreground">
//                                     Receive code via email
//                                   </p>
//                                 </div>
//                               </Label>
//                             </div>
//                             <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
//                               <RadioGroupItem value="sms" id="sms" />
//                               <Label
//                                 htmlFor="sms"
//                                 className="flex items-center gap-2 cursor-pointer"
//                               >
//                                 <Smartphone className="h-4 w-4 text-primary" />
//                                 <div>
//                                   <p className="font-medium">SMS</p>
//                                   <p className="text-sm text-muted-foreground">
//                                     Receive code via text message
//                                   </p>
//                                 </div>
//                               </Label>
//                             </div>
//                           </RadioGroup>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={sendOtpForm.control}
//                     name="contact"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           {sendOtpForm.watch("contactMethod") === "email"
//                             ? "Email Address"
//                             : "Phone Number"}
//                         </FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             {sendOtpForm.watch("contactMethod") === "email" ? (
//                               <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                             ) : (
//                               <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                             )}
//                             <Input
//                               placeholder={
//                                 sendOtpForm.watch("contactMethod") === "email"
//                                   ? "name@example.com"
//                                   : "06 12 34 56 78"
//                               }
//                               className="pl-10"
//                               type={
//                                 sendOtpForm.watch("contactMethod") === "email"
//                                   ? "email"
//                                   : "tel"
//                               }
//                               {...field}
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <Button
//                     type="submit"
//                     className="w-full"
//                     disabled={isSubmitting || !sendOtpForm.formState.isValid}
//                   >
//                     {isSubmitting ? (
//                       <span className="flex items-center gap-2">
//                         <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                         Sending Code...
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-2">
//                         Send Verification Code
//                         <ArrowRight className="h-4 w-4" />
//                       </span>
//                     )}
//                   </Button>
//                 </form>
//               </Form>

//               {serverResponse?.message && (
//                 <Alert
//                   variant={serverResponse.success ? "default" : "destructive"}
//                   className="mt-4"
//                 >
//                   {serverResponse.success ? (
//                     <CheckCircle2 className="h-4 w-4" />
//                   ) : (
//                     <AlertCircle className="h-4 w-4" />
//                   )}
//                   <AlertDescription>{serverResponse.message}</AlertDescription>
//                 </Alert>
//               )}
//             </div>
//           </ScrollArea>
//         </CardContent>
//         <CardFooter className="pt-4 border-t">
//           <div className="text-center w-full text-sm text-muted-foreground">
//             By continuing, you agree to our Terms of Service and Privacy Policy.
//           </div>
//         </CardFooter>
//       </Card>
//     );
//   }

//   // Render the verify OTP step
//   if (step === "verify") {
//     return (
//       <Card className="border-border/40 shadow-lg w-full max-w-md mx-auto flex flex-col">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl flex items-center gap-2">
//             <ShieldCheck className="h-6 w-6 text-primary" />
//             Enter Verification Code
//           </CardTitle>
//           <CardDescription>
//             Enter the code we sent to verify your identity
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="flex-grow">
//           {/* <ScrollArea className="h-full pr-4"> */}
//           <div className="space-y-6">
//             <div className="flex flex-col items-center justify-center py-4 text-center">
//               <div className="rounded-full bg-primary/10 p-3 mb-4">
//                 {contactInfo?.method === "email" ? (
//                   <Mail className="h-12 w-12 text-primary" />
//                 ) : (
//                   <Smartphone className="h-12 w-12 text-primary" />
//                 )}
//               </div>
//               <h3 className="text-xl font-medium mb-2">
//                 Check Your {contactInfo?.method === "email" ? "Email" : "Phone"}
//               </h3>
//               <p className="text-sm text-muted-foreground max-w-sm">
//                 We've sent a 6-digit verification code to{" "}
//                 <span className="font-medium">{contactInfo?.value}</span>
//               </p>
//             </div>

//             <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
//               <Clock className="h-5 w-5 text-muted-foreground mr-2" />
//               <p className="text-sm">
//                 Code expires in{" "}
//                 <span className="font-medium">
//                   {formatTimeRemaining(timeRemaining)}
//                 </span>
//               </p>
//             </div>

//             <div className="flex justify-end mb-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={toggleInputMode}
//                 className="text-xs h-7 px-2"
//               >
//                 Switch to {useSingleField ? "Separated" : "Single"} Input
//               </Button>
//             </div>

//             {useSingleField ? (
//               // Single field OTP input
//               <Form {...otpSingleFieldForm}>
//                 <form
//                   onSubmit={otpSingleFieldForm.handleSubmit(
//                     onOtpSingleFieldSubmit
//                   )}
//                   className="space-y-6"
//                 >
//                   <FormField
//                     control={otpSingleFieldForm.control}
//                     name="otp"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Verification Code</FormLabel>
//                         <FormControl>
//                           <Input
//                             id="otp-single-field"
//                             placeholder="Enter 6-digit code"
//                             className="text-center text-lg tracking-widest"
//                             maxLength={6}
//                             inputMode="numeric"
//                             autoComplete="one-time-code"
//                             {...field}
//                             onChange={(e) => {
//                               const { value } = e.target;
//                               // Only allow numbers
//                               if (value && !/^\d*$/.test(value)) {
//                                 return;
//                               }
//                               field.onChange(e);
//                             }}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <Button
//                     type="submit"
//                     className="w-full"
//                     disabled={
//                       isSubmitting || !otpSingleFieldForm.formState.isValid
//                     }
//                   >
//                     {isSubmitting ? (
//                       <span className="flex items-center gap-2">
//                         <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                         Verifying...
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-2">
//                         Verify Code
//                         <ArrowRight className="h-4 w-4" />
//                       </span>
//                     )}
//                   </Button>
//                 </form>
//               </Form>
//             ) : (
//               // Individual digits OTP input
//               <Form {...otpDigitsForm}>
//                 <form
//                   onSubmit={otpDigitsForm.handleSubmit(onOtpDigitsSubmit)}
//                   className="space-y-6"
//                 >
//                   <FormItem className="space-y-2">
//                     <FormLabel>Verification Code</FormLabel>
//                     <div className="flex justify-between gap-2">
//                       {[0, 1, 2, 3, 4, 5].map((index) => (
//                         <Controller
//                           key={`digit${index + 1}`}
//                           control={otpDigitsForm.control}
//                           name={`digit${index + 1}` as keyof OtpDigitsValues}
//                           render={({ field, fieldState }) => (
//                             <div>
//                               <Input
//                                 {...field}
//                                 ref={(el) => {
//                                   inputRefs.current[index] = el;
//                                   field.ref(el);
//                                 }}
//                                 className={`w-12 h-12 text-center text-xl font-medium p-0 ${
//                                   fieldState.error ? "border-destructive" : ""
//                                 }`}
//                                 maxLength={1}
//                                 onChange={(e) => handleOtpInputChange(index, e)}
//                                 onKeyDown={(e) => handleOtpKeyDown(index, e)}
//                                 onPaste={
//                                   index === 0 ? handleOtpPaste : undefined
//                                 }
//                                 inputMode="numeric"
//                                 autoComplete={
//                                   index === 0 ? "one-time-code" : "off"
//                                 }
//                               />
//                             </div>
//                           )}
//                         />
//                       ))}
//                     </div>
//                     <div className="flex justify-center">
//                       <FormMessage />
//                     </div>
//                   </FormItem>

//                   <Button
//                     type="submit"
//                     className="w-full"
//                     disabled={isSubmitting || !otpDigitsForm.formState.isValid}
//                   >
//                     {isSubmitting ? (
//                       <span className="flex items-center gap-2">
//                         <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                         Verifying...
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-2">
//                         Verify Code
//                         <ArrowRight className="h-4 w-4" />
//                       </span>
//                     )}
//                   </Button>
//                 </form>
//               </Form>
//             )}

//             <div className="flex flex-col items-center justify-center text-center space-y-2">
//               <p className="text-sm text-muted-foreground">
//                 Didn't receive the code?
//               </p>
//               <Button
//                 variant="link"
//                 size="sm"
//                 onClick={handleResendOtp}
//                 disabled={!canResend || isSubmitting}
//                 className="h-auto p-0"
//               >
//                 {canResend ? (
//                   <span className="flex items-center gap-1">
//                     <RefreshCw className="h-3 w-3" />
//                     Resend Code
//                   </span>
//                 ) : (
//                   <span className="flex items-center gap-1">
//                     <Clock className="h-3 w-3" />
//                     Resend in {formatTimeRemaining(timeRemaining)}
//                   </span>
//                 )}
//               </Button>
//             </div>

//             {serverResponse?.message && (
//               <Alert
//                 variant={serverResponse.success ? "default" : "destructive"}
//                 className="mt-4"
//               >
//                 {serverResponse.success ? (
//                   <CheckCircle2 className="h-4 w-4" />
//                 ) : (
//                   <AlertCircle className="h-4 w-4" />
//                 )}
//                 <AlertDescription>{serverResponse.message}</AlertDescription>
//               </Alert>
//             )}
//           </div>
//           {/* </ScrollArea> */}
//         </CardContent>
//         <CardFooter className="pt-4 border-t">
//           <Button
//             variant="outline"
//             className="w-full"
//             onClick={() => setStep("send")}
//           >
//             Back
//           </Button>
//         </CardFooter>
//       </Card>
//     );
//   }

//   // Render the success step
//   if (step === "success") {
//     return (
//       <Card className="border-border/40 shadow-lg w-full max-w-md mx-auto h-[600px] flex flex-col">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl flex items-center gap-2 text-green-600">
//             <CheckCircle2 className="h-6 w-6" />
//             Verification Successful
//           </CardTitle>
//           <CardDescription>
//             Your identity has been successfully verified
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="flex-grow">
//           <div className="flex flex-col items-center justify-center py-8 text-center h-full">
//             <div className="rounded-full bg-green-100 p-4 mb-4">
//               <CheckCircle2 className="h-16 w-16 text-green-600" />
//             </div>
//             <h3 className="text-2xl font-medium mb-2">All Set!</h3>
//             <p className="text-muted-foreground mb-6 max-w-sm">
//               Your identity has been verified successfully. You can now continue
//               with your secure access.
//             </p>
//             <div className="bg-muted/50 rounded-lg p-4 w-full max-w-xs">
//               <p className="text-sm font-medium">Verification Details</p>
//               <div className="mt-2 text-sm">
//                 <div className="flex justify-between py-1">
//                   <span className="text-muted-foreground">Method:</span>
//                   <span className="font-medium capitalize">
//                     {contactInfo?.method}
//                   </span>
//                 </div>
//                 <div className="flex justify-between py-1">
//                   <span className="text-muted-foreground">Contact:</span>
//                   <span className="font-medium">{contactInfo?.value}</span>
//                 </div>
//                 <div className="flex justify-between py-1">
//                   <span className="text-muted-foreground">Status:</span>
//                   <span className="font-medium text-green-600">Verified</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className="pt-4 border-t">
//           <Button
//             className="w-full"
//             onClick={() => {
//               setStep("send");
//               setServerResponse(null);
//               sendOtpForm.reset();
//               otpSingleFieldForm.reset();
//               otpDigitsForm.reset();
//               setContactInfo(null);
//               setTimeRemaining(0);
//               setCanResend(false);
//               setUseSingleField(false);
//             }}
//           >
//             Continue
//           </Button>
//         </CardFooter>
//       </Card>
//     );
//   }

//   // Default fallback (should never happen)
//   return null;
// }
