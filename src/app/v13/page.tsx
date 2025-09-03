// import { getStoreImages } from "@/actions/store";
// import { MultiImageUploader } from "./components/multi-image-uploader1";
// import { MultiImageUploader2 } from "./components/multi-image-uploader2";
// import { MultiImageUploader3 } from "./components/multi-image-uploader3";
import { MultiImageUploader5 } from "./components/multi-image-uploader5";
import { MultiImageUploader7 } from "./components/multi-image-uploader7";
// import ProductImageManager from "./components/single/product-image-manager";

export default async function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Gestionnaire d&apos;Images Avancé
      </h1>
      <div className="space-y-10">
        {/* <MultiImageUploader /> */}
        {/* <MultiImageUploader2 /> */}
        {/* <MultiImageUploader7
          storeId="cee0cf56-b4f1-4451-969f-509b2b9ef2e0"
          productId="022defbc-e4e8-471a-a084-1c86030516e1"
        /> */}
        <MultiImageUploader5 />
      </div>
      {/* <ProductImageManager
        storeId="cee0cf56-b4f1-4451-969f-509b2b9ef2e0"
        productId="022defbc-e4e8-471a-a084-1c86030516e1"
      /> */}
    </main>
  );
}
