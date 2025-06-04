import React from "react";
import { ProductCard } from "./product-card";
import { StoreAndProduct } from "@/@types/admin/product";

type ProductListProps = {
  storeAndProduct: StoreAndProduct[];
};

const ProductList = ({ storeAndProduct }: ProductListProps) => {
  return (
    <div className="grid col-span-12 lg:col-span-9 grid-cols-12 gap-6 h-fit">
      {storeAndProduct.map((product) => (
        <div
          key={product.id}
          className="col-span-12 sm:col-span-6 md:col-span-4"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
