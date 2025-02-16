"use client";

import { routes } from "@/app/data/routes";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

import Link from "next/link";

export default function CheckoutError(props: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center flex-col mt-24">
      <Heading size="h2">Sorry, an error occured loading this page.</Heading>

      <p className="mt-2 text-gray-600">
        Please try again, or contact our customer support team at{" "}
        <a href="tel:+1234567890" className="text-blue-600 underline">
          +1 (234) 567-890
        </a>{" "}
        if this issue persists.
      </p>
      <div className="flex gap-4 mt-6">
        <Button variant="outline" onClick={props.reset}>
          Try Again
        </Button>
        <Link href={routes.cart}>
          <Button>Return to Cart</Button>
        </Link>
      </div>
      {/* <div className="flex gap-2 items-center mt-4">
        <Link href={routes.cart}>
          <Button>Return to Cart</Button>
        </Link>
      </div> */}
    </div>
  );
}
