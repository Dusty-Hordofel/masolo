import ProductEditorElements from "./product-editor-elements";
import { ProductEditorSharedProps } from "@/@types/admin/product";

export const ProductEditor = (props: ProductEditorSharedProps) => {
  return <ProductEditorElements {...props} />;
};
