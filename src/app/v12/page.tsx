// import { MultiImageUploader } from "@/components/multi-image-uploader"

import Component from "./components/media-url-dropdown";
import MultiImageUploader12 from "./components/multi-image-uploader";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Gestionnaire d'Images Avancé</h1>
      <MultiImageUploader12 />
      {/* <Component /> */}
    </main>
  );
}
