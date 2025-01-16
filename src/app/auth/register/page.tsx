// import AuthFooter from "@/components/forms/auth/auth-footer";
// import AuthHeader from "@/components/forms/auth/auth-header";
// import { signIn } from "../../../auth";
// import AuthRegisterForm from "@/components/forms/auth/auth-register-form";
// import DemoComponent from "@/components/demo/demo-component";
// import path from "path";

// export const metadata = {
//   title: "Create an account",
//   description: "Create an account to get started.",
// };

// const inputDir = "inputs";
// const inputFiles = [
//   "input-01",
//   "input-02",
//   "input-03",
//   "input-04",
//   "input-05",
//   "input-06",
//   // "input-07",
//   // "input-08",
//   // "input-09",
//   // "input-10",
//   // "input-11",
//   // "input-12",
//   // "input-13",
//   // "input-14",
//   // "input-15",
//   // "input-16",
//   // "input-17",
//   // "input-18",
//   // "input-19",
//   // "input-20",
//   // "input-21",
//   // "input-22",
//   // "input-23",
//   // "input-24",
//   // "input-25",
//   // "input-26",
//   // "input-27",
//   // "input-28",
//   // "input-29",
//   // "input-30",
//   // "input-31",
//   // "input-32",
//   // "input-33",
//   // "input-34",
//   // "input-35",
//   // "input-36",
//   // "input-37",
//   // "input-38",
//   // "input-39",
//   // "input-40",
//   // "input-41",
//   // "input-42",
//   // "input-43",
//   // "input-44",
//   // "input-45",
//   // "input-58",
//   // "input-46",
//   // "input-47",
//   // "input-48",
//   // "input-49",
//   // "input-50",
//   // "input-51",
//   // "input-52",
//   // "input-53",
//   // "input-54",
//   // "input-55",
//   // "input-56",
//   // "input-57",
// ];

// export default function RegisterPage() {
//   const filePath = path.join(
//     process.cwd(),
//     "components",
//     "inputs",
//     `input-01.tsx`
//   );

//   console.log("🚀 ~ RegisterPage ~ filePath:", filePath);

//   return (
//     <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
//       {/* <Link
//         href="/login"
//         className={cn(
//           buttonVariants({ variant: "ghost" }),
//           "absolute right-4 top-4 md:right-8 md:top-8"
//         )}
//       >
//         Login
//       </Link> */}
//       <div className="hidden h-full bg-muted lg:block" />
//       <div className="lg:p-8">
//         <div className="mx-auto px-9 flex w-full flex-col justify-center space-y-6 max-w-[480px]">
//           <AuthHeader
//             title="Your journey begins here - Register."
//             description=""
//           />
//           <AuthRegisterForm />
//           <AuthFooter type="register" />

//           <DemoComponent
//             // key={componentName}
//             directory="forms/auth"
//             componentName="auth-register-form"
//           />
//           <DemoComponent
//             // key={componentName}
//             directory="forms/demo"
//             componentName="auth-register-form"
//           />

//           {inputFiles.map((componentName) => {
//             return (
//               <DemoComponent
//                 key={componentName}
//                 directory={inputDir}
//                 componentName={componentName}
//               />
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }
