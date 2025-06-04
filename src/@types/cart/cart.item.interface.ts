// import { ProductImages } from "@/components/storefront/product-search";
import { Product } from "@prisma/client";
import { ProductWithImages } from "../admin/product";

// export type CartItem = { id: string; qty: number };

export type CheckoutItem = {
  id: string;
  price: number;
  qty: number;
};

export type CartLineItemDetails = Omit<Product, "description" | "images"> & {
  storeName: string | null;
  images: ProductWithImages[];
};
