// import { ProductImages } from "@/components/storefront/product-search";
import { Product } from "@prisma/client";
import { ProductWithImages } from "../admin/admin.products.interface";

export type CartItem = { id: string; qty: number };

export type CheckoutItem = {
  id: number;
  price: number;
  qty: number;
};

export type CartLineItemDetails = Omit<Product, "description" | "images"> & {
  storeName: string | null;
  images: ProductWithImages[];
};
