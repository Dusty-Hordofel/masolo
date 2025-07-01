import { MultiImageUploader } from "./components/multi-image-uploader1";
import { MultiImageUploader2 } from "./components/multi-image-uploader2";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Gestionnaire d&apos;Images Avancé
      </h1>
      <MultiImageUploader />
      <MultiImageUploader2 />
    </main>
  );
}
