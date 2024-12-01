import ProductEditorElements from "./product-editor-elements";
import { ProductEditorSharedProps } from "@/@types/admin/admin.products.interface";

export const ProductEditor = (props: ProductEditorSharedProps) => {
  return <ProductEditorElements {...props} />;
};
