// import { NavBar } from "@/components/navbar";
// import "../../../styles/globals.css";
// import { Footer } from "@/components/footer";
import { FloatingStar } from "@/components/floating-star";
import { Footer } from "@/components/footer";
import NavBar from "@/components/ui/navbar";
import React from "react";
// import { FloatingStar } from "@/components/floating-star";

export const metadata = {
  title: "Mosala - Online marketplace",
  description: "Online marketplace",
};

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <FloatingStar />
      <NavBar showSecondAnnouncementBar={true} />
      <div className="h-full flex-1 mb-8">{children}</div>
      <Footer />
    </div>
  );
}
