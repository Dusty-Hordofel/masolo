import { MultiImageUploader } from "./components/multi-image-uploader";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Gestionnaire d&apos;Images Avancé
      </h1>
      <MultiImageUploader />
    </main>
  );
}
