import { ProductWithImages } from "@/@types/admin/admin.products.interface";
import { ProductEditor } from "@/components/admin/product-editor";
import { getProductDetails } from "@/server-actions/products";

interface ProductPageParams {
  productId: string;
}

const ProductPage = async ({ params }: { params: ProductPageParams }) => {
  const productDetails = (await getProductDetails(
    params.productId
  )) as ProductWithImages;
  console.log("🚀 ~ ProductPage ~ productDetails:", productDetails);

  return (
    <ProductEditor
      productStatus="existing-product"
      initialValues={productDetails}
    />
  );
};

export default ProductPage;
