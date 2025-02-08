import { Text } from "../ui/text";
import Link from "next/link";
import { currencyFormatter } from "@/lib/currency";
import { Button } from "../ui/button";
import { ProductImage } from "../product-image";
import { routes } from "@/app/data/routes";
import { ProductForm } from "./product-form";
import { StoreAndProduct } from "@/@types/admin/admin.products.interface";

export const ProductCard = (props: {
  storeAndProduct: StoreAndProduct;
  hideButtonActions?: boolean;
}) => {
  // console.log("🚀 ~ storeAndProduct:", props.storeAndProduct.id);
  const productPageLink = `${routes.products}/${props.storeAndProduct.id}`;

  return (
    <div key={props.storeAndProduct.id}>
      <Link href={productPageLink}>
        <ProductImage
          src={props.storeAndProduct.images[0]?.secureUrl}
          alt={props.storeAndProduct.images[0]?.alt}
          height="h-48"
          width="w-full"
        />
      </Link>
      <Link href={productPageLink}>
        <Text className="line-clamp-1 w-full mt-2">
          {props.storeAndProduct.name}
        </Text>
        <Text>{currencyFormatter(Number(props.storeAndProduct.price))}</Text>
      </Link>
      {!props.hideButtonActions && (
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-4 mb-8">
          <Link
            href={`${routes.productQuickView}/${[props.storeAndProduct.id]}`}
            className="w-full"
          >
            <Button variant="outline" size="sm" className="flex gap-2 w-full">
              <span>Quick View</span>
            </Button>
          </Link>
          <ProductForm
          // addToCartAction={addToCart}
          // disableQuantitySelector={true}
          // availableInventory={props.storeAndProduct.inventory}
          // productId={props.storeAndProduct.id}
          // productName={props.storeAndProduct.name}
          // buttonSize="sm"
          />
        </div>
      )}
    </div>
  );
};
