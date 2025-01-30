"use client";
import { Button } from "@/components/ui/button";
// import { currencyFormatter } from "@/lib/currency";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
// import { routes, secondLevelNestedRoutes } from "@/lib/routes";
// import { ProductImages } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns = [
  {
    accessorKey: "name",
  },
];
