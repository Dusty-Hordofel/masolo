import React from "react";
import { MultiImageUploader } from "./components/multi-image-uploader";

const page = () => {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Gestionnaire d'Images Avancé</h1>
      <MultiImageUploader />
    </main>
  );
};

export default page;
