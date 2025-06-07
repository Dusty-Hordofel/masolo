import React from "react";
import { MultiImageUploader12 } from "./components/multi-image-uploader12";

const page = () => {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Gestionnaire d'Images Avancé</h1>
      <MultiImageUploader12 />
    </main>
  );
};

export default page;
