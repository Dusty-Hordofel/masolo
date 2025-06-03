"use client";
import React from "react";
import ImageUpload from "./Image-upload";
import ImageUpload2 from "./Image-upload2";
import ImageUpload3 from "./Image-upload3";
import ImageUpload4 from "./Image-upload4";

type Props = {};

const page = (props: Props) => {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      {/* <ImageUpload /> */}
      <ImageUpload4 />
    </main>
  );
};

export default page;
