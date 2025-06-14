import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currencyFormatter } from "@/lib/currency";
import Link from "next/link";
import { Button } from "../ui/button";
import { ProductImage } from "../product-image";
// import { CartItem } from "@/@types/cart/cart.item.interface";
import { routes } from "@/app/data/routes";
import { getCartTest } from "@/server-actions/add-to-cart";
import EditCartLineItem from "./edit-cart-line-item";
import { CartItem } from "@prisma/client";

export const CartLineItems = (props: {
  cartItems: CartItem[];
  products: getCartTest[];
  variant: "cart" | "checkout";
}) => {
  // console.log("🚀 ~ cartItems:CART", props.cartItems);
  // console.log("🚀 ~ cartItems:PROD", props.products);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead>Name</TableHead>
          {props.variant === "cart" ? (
            <>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
            </>
          ) : (
            <>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </>
          )}
          {props.variant === "cart" ? <TableHead>Total</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.products.map((product) => {
          const currentProductInCart = props.cartItems.find(
            (item) => item.productId === product.id
          );

          return (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                <ProductImage
                  src={product.images[0]?.secureUrl}
                  alt={product.images[0]?.alt}
                  sizes="50px"
                  height="h-[50px]"
                  width="w-[50px]"
                />
              </TableCell>
              <TableCell className="max-w-[200px] w-[200px] truncate">
                {props.variant === "cart" ? (
                  <Link href={`${routes.product}/${product.id}`}>
                    <Button className="m-0 p-0 h-auto" variant="link">
                      {product.name}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="m-0 p-0 h-auto hover:no-underline hover:cursor-auto"
                    variant="link"
                  >
                    {product.name}
                  </Button>
                )}
              </TableCell>
              {props.variant === "cart" ? (
                <>
                  <TableCell>
                    {currencyFormatter(Number(product.price))}
                  </TableCell>
                  <TableCell>{currentProductInCart?.qty}</TableCell>
                </>
              ) : (
                <>
                  <TableCell>{currentProductInCart?.qty}</TableCell>
                  <TableCell className="text-right">
                    {currencyFormatter(Number(product.price))}
                  </TableCell>
                </>
              )}
              {props.variant === "cart" ? (
                <TableCell>
                  {currencyFormatter(
                    Number(currentProductInCart?.qty) * Number(product.price)
                  )}
                </TableCell>
              ) : null}
              {props.variant === "cart" ? (
                <TableCell className="text-right">
                  <EditCartLineItem
                    productInCart={currentProductInCart}
                    product={product}
                  />
                </TableCell>
              ) : null}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
