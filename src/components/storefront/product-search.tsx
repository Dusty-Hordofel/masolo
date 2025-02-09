"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Image, Product } from "@prisma/client";
import Link from "next/link";
import { routes } from "@/app/data/routes";
import { Button } from "../ui/button";
import { ProductImage } from "../ui/product-image";
import { LoadingSkeleton } from "../ui/loading-skeleton";

const useProductSearch = (initialSearch = "") => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [results, setResults] = useState<
    (Pick<Product, "id" | "name" | "price"> & { images: Image[] })[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setNoResults(false);
      try {
        // const response = await getProductsBySearchTerm(searchTerm);
        // setResults(response);
        // if (!response.length) setNoResults(true);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchData, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return { searchTerm, setSearchTerm, results, isLoading, noResults };
};

// Gestion du raccourci clavier (Cmd+K)
const useKeyboardShortcut = (callback: () => void, key = "k") => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === key && e.metaKey) {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [callback, key]);
};

export function ProductSearch() {
  // const [searchTerm, setSearchTerm] = useState("");
  // console.log("🚀 ~ ProductSearch ~ searchTerm:", searchTerm);
  // const [results, setResults] = useState<
  //   (Pick<Product, "id" | "name" | "price"> & { images: ProductImages[] })[]
  // >([]);
  // const [isLoadingResults, setIsLoadingResults] = useState(false);
  // const [confirmedHasNoResults, setConfirmedHasNoResults] = useState(false);

  // const [open, setOpen] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { searchTerm, setSearchTerm, results, isLoading, noResults } =
    useProductSearch();

  const toggleDialog = useCallback(() => setIsDialogOpen((prev) => !prev), []);

  // Active le raccourci Cmd+K
  useKeyboardShortcut(toggleDialog);

  // Mémorise les résultats pour éviter des recalculs inutiles
  const renderedResults = useMemo(() => {
    if (isLoading) {
      return <LoadingSkeleton className="w-full h-12" />;
    }

    if (noResults && searchTerm.trim()) {
      return <p>No results found.</p>;
    }

    return results.map((product) => (
      <Link
        href={`${routes.product}/${product.id}`}
        onClick={() => setIsDialogOpen(false)}
        key={product.id}
        className="w-full bg-secondary p-2 rounded-md"
      >
        <div className="flex items-center gap-2">
          <ProductImage
            src={product.images[0]?.secureUrl}
            alt={product.images[0]?.alt || "Product Image"}
            sizes="50px"
            height="h-12"
            width="w-14"
          />
          <div className="flex justify-between w-full pr-4">
            <Button
              variant="link"
              className="flex w-full text-left items-center"
            >
              {product.name}
            </Button>
            {/* <p className="text-muted-foreground text-sm">
              {currencyFormatter(Number(product.price))}
            </p> */}
          </div>
        </div>
      </Link>
    ));
  }, [results, isLoading, noResults, searchTerm]);

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <button
          className="border border-border px-4 py-2 rounded-md w-full flex items-center justify-between gap-2"
          // onClick={() => setOpen((prev) => !prev)}

          onClick={toggleDialog}
        >
          <p className="text-muted-foreground text-sm">Search...</p>
          <p className="text-sm text-muted-foreground hidden md:block">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </p>
        </button>
      </div>
      <Dialog
        // open={open}
        // onOpenChange={(isOpen) => {
        //   setOpen(isOpen);
        // }}
        open={isDialogOpen}
        onOpenChange={(isOpen) => setIsDialogOpen(isOpen)}
      >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
          {/* <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader> */}
          <DialogHeader>
            <DialogTitle>Search for a product</DialogTitle>
            <DialogDescription>
              Search our entire product catalogue
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-col gap-2 items-start justify-start mt-4">
            {renderedResults}
          </div>
          {/* <div className="flex flex-col gap-2 items-start justify-start">
            {isLoadingResults && <LoadingSkeleton className="w-full h-12" />}
            {!results.length &&
              searchTerm !== "" &&
              !isLoadingResults &&
              confirmedHasNoResults && <p>No results found.</p>}
            {results.map((product) => (
              <Link
                href={`${routes.product}/${product.id}`}
                onClick={() => setOpen(false)}
                key={product.id}
                className="w-full bg-secondary p-2 rounded-md"
              >
                <div className="flex items-center justify-start gap-2">
                  <ProductImage
                    src={product.images[0]?.url}
                    alt={product.images[0]?.alt}
                    sizes="50px"
                    height="h-12"
                    width="w-14"
                  />
                  <div className="flex items-center justify-between w-full pr-4">
                    <Button
                      variant="link"
                      className="flex items-center justify-start w-full text-left"
                    >
                      {product.name}
                    </Button>
                    <p className="text-muted-foreground text-sm">
                      {currencyFormatter(Number(product.price))}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
