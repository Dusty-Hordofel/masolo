import { ParagraphFormatter } from "@/components/paragraph-formatter";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { currencyFormatter } from "@/lib/currency";
import Image from "next/image";
import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { addToCart, getCart } from "@/server-actions/add-to-cart";
import { getProductDetails } from "@/server-actions/products";
import { ProductWithImages } from "@/@types/admin/admin.products.interface";
import { getStoreByProductId } from "@/server-actions/store";
import { routes, productsQueryParams } from "@/app/data/routes";
import { FeatureIcons } from "@/components/storefront/feature-icons";
import { ProductCartActions } from "@/components/storefront/product-card";

export default async function StorefrontProductDetails({
  params,
}: {
  params: { productId: string };
}) {
  const product = (await getProductDetails(
    params.productId
  )) as ProductWithImages;

  const store = await getStoreByProductId(product.id);

  // const cart = await getCart("6e181af9-083e-4a44-ac56-e9228a024463");
  // // console.log("🚀 ~ test:LOKO", cart);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center md:items-start justify-start md:grid md:grid-cols-9 gap-8">
        <div className="col-span-4 w-full">
          <ProductImage
            src={product.images[0]?.secureUrl}
            alt={product.images[0]?.alt}
            height="h-96"
            width="w-full"
          />
          {product.images.length > 1 && (
            <>
              <div className="flex items-center justify-start gap-2 mt-2 overflow-auto flex-nowrap">
                {product.images.slice(1).map((image) => (
                  <div key={image.id} className="relative h-24 w-24">
                    <Image
                      src={image.secureUrl}
                      alt={image.alt}
                      fill
                      className="object-cover h-24 w-24"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="md:col-span-5 w-full">
          <Heading size="h2">{product.name}</Heading>
          <Text className="text-sm mt-2">
            Sold by{" "}
            <Link
              href={`${routes.products}?${productsQueryParams.seller}${store.slug}`}
            >
              <span className="text-muted-foreground hover:underline">
                {store.name}
              </span>
            </Link>
          </Text>
          <Text className="text-xl my-4">
            {currencyFormatter(Number(product.price))}
          </Text>

          <ProductCartActions
            addToCartAction={addToCart}
            availableInventory={product.inventory}
            isPreOrderAvailable={product.isPreOrderAvailable}
            productId={product.id}
            productName={product.name}
            disableQuantitySelector
          />
          <FeatureIcons className="mt-8" />
        </div>
      </div>
      <Tabs defaultValue="product">
        <div className="overflow-auto">
          <TabsList>
            <TabsTrigger value="product">Product Description</TabsTrigger>
            <TabsTrigger value="seller">About the Seller</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="product" className="pt-2">
          <ParagraphFormatter paragraphs={product.description} />
        </TabsContent>
        <TabsContent value="seller" className="pt-2">
          {store.description}
        </TabsContent>
      </Tabs>
    </div>
  );
}
