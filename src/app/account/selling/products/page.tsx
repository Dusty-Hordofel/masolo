import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const ProductsPage = (props: Props) => {
  return (
    <div>
      <Link
        href="/account/selling/product/new"
        className={cn(buttonVariants({ variant: "default" }), "font-medium")}
      >
        {/* <Button> */}
        New Product <Plus size={18} className="ml-2" />
        {/* </Button> */}
      </Link>
    </div>
  );
};

export default ProductsPage;
