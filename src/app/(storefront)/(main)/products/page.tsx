import { ProductWithImages } from "@/@types/admin/product";
import { ProductBanner } from "@/components/storefront/product-banner";
import { getStoreAndProduct } from "@/server-actions/store";
import { Store } from "@prisma/client";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import ProductList from "@/components/storefront/product-list";
import ProductFiltersSidebar from "@/components/storefront/product-filters-sidebar";

export type ProductAndStore = ProductWithImages &
  Omit<Store, "description" | "industry">;

export default async function StorefrontProductsPage() {
  const storeAndProduct = await getStoreAndProduct();

  return (
    <div>
      <ProductBanner heading="Products">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis at
          tellus at urna. Sit amet porttitor eget dolor morbi non. Feugiat nibh
          sed pulvinar proin gravida hendrerit. Fermentum odio eu feugiat
          pretium nibh. Commodo ullamcorper a lacus vestibulum sed arcu non odio
          euismod. Auctor augue mauris augue neque gravida in fermentum.
        </p>
        <p>
          Consectetur libero id faucibus nisl tincidunt eget nullam non. Fames
          ac turpis egestas sed tempus urna et. Massa sed elementum tempus
          egestas sed sed risus pretium quam. Erat pellentesque adipiscing
          commodo elit at imperdiet. Blandit turpis cursus in hac habitasse
          platea dictumst. Rhoncus aenean vel elit scelerisque mauris
          pellentesque pulvinar pellentesque habitant.
        </p>
        <p>
          In mollis nunc sed id semper risus in hendrerit gravida. Imperdiet dui
          accumsan sit amet nulla facilisi morbi tempus. Quis vel eros donec ac
          odio tempor. Elementum pulvinar etiam non quam lacus suspendisse
          faucibus interdum.
        </p>
        <p>
          Urna cursus eget nunc scelerisque viverra mauris in. Eget nullam non
          nisi est sit amet facilisis magna etiam. Elit sed vulputate mi sit
          amet mauris commodo. Ut sem nulla pharetra diam sit amet nisl
          suscipit. Turpis tincidunt id aliquet risus feugiat. Maecenas pharetra
          convallis posuere morbi. Leo vel orci porta non pulvinar. Sodales
          neque sodales ut etiam sit. Lacinia quis vel eros donec. Massa sapien
          faucibus et molestie ac feugiat sed.
        </p>
      </ProductBanner>
      <div className="md:grid md:grid-cols-12 md:mt-0 lg:mt-12 mt-12 md:gap-12">
        <ProductFiltersSidebar />
        {storeAndProduct.length > 0 ? (
          <ProductList storeAndProduct={storeAndProduct} />
        ) : (
          <EmptyState height="h-[200px]">
            <Heading size="h4">No products match your filters</Heading>
            <p>Change your filters or try again later</p>
          </EmptyState>
        )}
      </div>
    </div>
  );
}
