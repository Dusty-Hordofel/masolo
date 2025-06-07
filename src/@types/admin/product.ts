import { Image, Prisma, Product } from "@prisma/client";

export type ProductWithImages = Product & {
  images: Image[];
};

export type ImageProps = Pick<Image, "secureUrl" | "alt" | "publicId">;

export type ProductEditorSharedProps = {
  displayType?: "page" | "modal";
  productStatus: "new-product" | "existing-product";
  initialValues?: ProductWithImages;
};

export type StoreAndProduct = Prisma.ProductGetPayload<{
  include: {
    images: true;
    store: true;
  };
}>;

// we can use the following properties to configure the editor instead of using ProductEditorSharedProps

// type ProductEditorProps =  {
//   displayType?: "page" | "modal";
//   productStatus: "new-product" | "existing-product";
//   initialValues?: Product;
// }

// type ProductEditorElementsProps = {
//   displayType?: "page" | "modal";
//   productStatus: "new-product" | "existing-product";
//   initialValues?: Product;
// };
