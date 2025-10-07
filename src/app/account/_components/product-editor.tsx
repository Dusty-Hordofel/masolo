
import { ProductEditorSharedProps } from "@/@types/admin/product";
import ProductEditorElements from "./product-editor-elements";

export const ProductEditor = (props: ProductEditorSharedProps) => {
  return <ProductEditorElements  {...props}/>;
};


/* {...props} */