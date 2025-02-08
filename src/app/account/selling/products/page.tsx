import { HeadingAndSubheading } from "@/components/admin/heading-and-subheading";
// import { InfoCard } from "@/components/admin/info-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import DataTable from "./data-table";
import { columns } from "./columns";
import { getProducts } from "@/server-actions/products";

const ProductsPage = async () => {
  const products = await getProducts();

  return (
    <>
      <div className="flex items-start justify-between">
        <HeadingAndSubheading
          heading="Products"
          subheading="View and manage your products"
        />
        <Link href="/account/selling/product/new">
          <Button>
            New Product <Plus size={18} className="ml-2" />
          </Button>
        </Link>
      </div>

      {/* {productsList.length === 0 ? (
        <InfoCard
          heading="You don't have any products yet"
          subheading="Create your first product to get started"
          icon={<Store size={36} className="text-gray-600" />}
          button={
            <Link href={secondLevelNestedRoutes.product.new}>
              <Button size="sm">Create</Button>
            </Link>
          }
        />
      ) : ( */}
      <>
        {/* <div className="pt-4">
          <DataTable columns={columns} data={productsList} />
        </div> */}
      </>
      {/* )} */}
      <DataTable data={products} columns={columns} />
    </>
  );
};

export default ProductsPage;
