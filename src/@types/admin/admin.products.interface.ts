import { Product } from "@prisma/client";

export interface ProductEditorSharedProps {
  displayType?: "page" | "modal";
  productStatus: "new-product" | "existing-product";
  initialValues?: Product;
}

// we can use the following properties to configure the editor instead of using ProductEditorSharedProps

// interface ProductEditorProps {
//   displayType?: "page" | "modal";
//   productStatus: "new-product" | "existing-product";
//   initialValues?: Product;
// }

// type ProductEditorElementsProps = {
//   displayType?: "page" | "modal";
//   productStatus: "new-product" | "existing-product";
//   initialValues?: Product;
// };
