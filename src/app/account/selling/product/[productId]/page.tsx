import { ProductWithImages } from "@/@types/admin/product";
import { ProductEditor } from "@/components/admin/product-editor";
import { getProduct } from "@/server-actions/products";

interface ProductPageParams {
  productId: string;
}

const ProductPage = async ({ params }: { params: ProductPageParams }) => {
  const product = (await getProduct(params.productId)) as ProductWithImages;
  console.log("🚀 ~ ProductPage ~ productDetails:", product);

  return (
    <ProductEditor productStatus="existing-product" initialValues={product} />
  );
};

export default ProductPage;
