import { secondLevelNestedRoutes } from "@/app/data/routes";
import { HeadingAndSubheading } from "@/components/admin/heading-and-subheading";
import { InfoCard } from "@/components/admin/info-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Store } from "lucide-react";
import Link from "next/link";
import React from "react";
import DataTable from "./data-table";
import { columns } from "./columns";
import { getProducts } from "@/server-actions/products";

type Props = {};

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

// async function getData() {
//   return getProducts;
// }

const ProductsPage = async (props: Props) => {
  // const productsList = [];
  const products = await getProducts();
  console.log("🚀 ~ ProductsPage ~ products:", products);

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
