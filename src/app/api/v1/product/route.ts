// import { createProduct } from "@/server-actions/products";
import { createProduct } from "@/server-actions/products";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await createProduct(body);
  return NextResponse.json(response);
}
