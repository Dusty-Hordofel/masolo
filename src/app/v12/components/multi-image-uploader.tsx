"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown, Grid3X3, List, Search } from "lucide-react";
import React, { useState } from "react";

interface ImageData {
  id: string;
  file: File;
  preview: string;
  url?: string;
  publicId?: string;
  isUploaded: boolean;
  isUploading: boolean;
  progress: number;
  isSelected: boolean;
  name: string;
  size: number;
  uploadDate: Date;
  type: string;
  usedIn: string[];
  products: string[];
  width?: number;
  height?: number;
}

type ViewMode = "grid" | "list";
type SortOption =
  | "date-desc"
  | "date-asc"
  | "name-asc"
  | "name-desc"
  | "size-asc"
  | "size-desc";
type FileTypeFilter =
  | "all"
  | "images"
  | "videos"
  | "external-videos"
  | "3d-models";

const PRODUCTS = [
  "Ocean Blue Shirt",
  "Classic Varsity Top",
  "Yellow Wool Jumper",
  "Floral White Top",
  "Striped Silk Blouse",
  "Classic Leather Jacket",
  "Dark Denim Top",
  "Navy Sports Jacket",
  "Soft Winter Jacket",
  "Black Leather Bag",
  "Zipped Jacket",
  "Silk Summer Top",
  "Long Sleeve Cotton Top",
  "Chequered Red Shirt",
  "White Cotton Shirt",
  "Olive Green Jacket",
  "Blue Silk Tuxedo",
  "Red Sports Tee",
  "Striped Skirt and Top",
  "LED High Tops",
];

const MultiImageUploader12 = () => {
  // Modal states
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  console.log("🚀 ~ MultiImageUploader12 ~ searchQuery:", searchQuery);

  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 sm:rounded-2xl"
            onInteractOutside={(e) => {
              const target = e.target as Element;
              if (target.closest("[data-radix-popover-content]")) {
                e.preventDefault();
              }
            }}
          >
            <DialogHeader>
              <DialogTitle className="p-4 border-b bg-gray-100 border-[rgba(227, 227, 227, 1)]">
                Bibliothèque multimédia
              </DialogTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="leading-none font-medium">Dimensions</h4>
                      <p className="text-muted-foreground text-sm">
                        Set the dimensions for the layer.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="width">Width</Label>
                        <Input
                          id="width"
                          defaultValue="100%"
                          className="col-span-2 h-8"
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="maxWidth">Max. width</Label>
                        <Input
                          id="maxWidth"
                          defaultValue="300px"
                          className="col-span-2 h-8"
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          defaultValue="25px"
                          className="col-span-2 h-8"
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="maxHeight">Max. height</Label>
                        <Input
                          id="maxHeight"
                          defaultValue="none"
                          className="col-span-2 h-8"
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Search and Controls */}
              <div className="space-y-4 bg-yellow-100 px-5 py-3">
                <div className="flex justify-between items-center bg-purple-300">
                  {/* <div className="relative max-w-[517px] w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher des fichiers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div> */}
                  {/* View Mode Dropdown */}
                  {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      {viewMode === "grid" ? (
                        <Grid3X3 className="h-4 w-4" />
                      ) : (
                        <List className="h-4 w-4" />
                      )}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setViewMode("grid")}
                      className="cursor-pointer"
                    >
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      Affichage en grille
                      {viewMode === "grid" && (
                        <Check className="h-4 w-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setViewMode("list")}
                      className="cursor-pointer"
                    >
                      <List className="h-4 w-4 mr-2" />
                      Affichage en liste
                      {viewMode === "list" && (
                        <Check className="h-4 w-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
                </div>
              </div>
            </DialogHeader>

            {/* <div className="grid gap-4 p-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div> */}
            <DialogFooter className="p-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Dimensions</h4>
              <p className="text-muted-foreground text-sm">
                Set the dimensions for the layer.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  defaultValue="100%"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxWidth">Max. width</Label>
                <Input
                  id="maxWidth"
                  defaultValue="300px"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  defaultValue="25px"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxHeight">Max. height</Label>
                <Input
                  id="maxHeight"
                  defaultValue="none"
                  className="col-span-2 h-8"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default MultiImageUploader12;
