// import { getStoreImages } from "@/actions/store";
// import { MultiImageUploader } from "./components/multi-image-uploader1";
// import { MultiImageUploader2 } from "./components/multi-image-uploader2";
// import { MultiImageUploader3 } from "./components/multi-image-uploader3";
import { MultiImageUploader5 } from "./components/multi-image-uploader5";

export default async function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Gestionnaire d&apos;Images Avancé
      </h1>
      <div className="space-y-10">
        {/* <MultiImageUploader /> */}
        {/* <MultiImageUploader2 /> */}
        <MultiImageUploader5 />
      </div>
    </main>
  );
}
