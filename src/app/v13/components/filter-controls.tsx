import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction } from "react";

// Types
type SortOption =
  | "date-desc"
  | "date-asc"
  | "name-asc"
  | "name-desc"
  | "size-asc"
  | "size-desc"
  | "";
type FileTypeFilter =
  | "all"
  | "images"
  | "videos"
  | "external-videos"
  | "3d-models"
  | "";
type UsageFilter = "all" | "Supports multimédias du produit" | "Autre";

// 1. Composant pour le tri
interface SortSelectorProps {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
}

export const SortSelector = ({ sortBy, setSortBy }: SortSelectorProps) => {
  return (
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger>
        <SelectValue placeholder="Trier par" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date-desc">
          Date d&apos;ajout (le plus récent en premier)
        </SelectItem>
        <SelectItem value="date-asc">
          Date d&apos;ajout (le plus ancien en premier)
        </SelectItem>
        <SelectItem value="name-asc">Nom du fichier (A-Z)</SelectItem>
        <SelectItem value="name-desc">Nom du fichier (Z-A)</SelectItem>
        <SelectItem value="size-asc">
          Taille du fichier (le plus petit en premier)
        </SelectItem>
        <SelectItem value="size-desc">
          Taille du fichier (le plus grand en premier)
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

// 2. Composant pour le filtre de type de fichier
interface FileTypeFilterSelectorProps {
  fileTypeFilter: FileTypeFilter;
  setFileTypeFilter: (value: FileTypeFilter) => void;
}

export const FileTypeFilterSelector = ({
  fileTypeFilter,
  setFileTypeFilter,
}: FileTypeFilterSelectorProps) => {
  return (
    <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
      <SelectTrigger>
        <SelectValue placeholder="Type de fichier" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les types</SelectItem>
        <SelectItem value="images">Images</SelectItem>
        <SelectItem value="videos">Vidéos</SelectItem>
        <SelectItem value="external-videos">Vidéos externes</SelectItem>
        <SelectItem value="3d-models">Modèles 3D</SelectItem>
      </SelectContent>
    </Select>
  );
};

// 3. Composant pour le filtre d'usage
interface UsageFilterSelectorProps {
  usageFilter: UsageFilter;
  setUsageFilter: (value: UsageFilter) => void;
}

export const UsageFilterSelector = ({
  usageFilter,
  setUsageFilter,
}: UsageFilterSelectorProps) => {
  return (
    <Select value={usageFilter} onValueChange={setUsageFilter}>
      <SelectTrigger>
        <SelectValue placeholder="Utilisé dans" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous</SelectItem>
        <SelectItem value="Supports multimédias du produit">
          Supports multimédias du produit
        </SelectItem>
        <SelectItem value="Autre">Autre</SelectItem>
      </SelectContent>
    </Select>
  );
};

// 4. Composant pour le filtre de produits
interface ProductFilterSelectorProps {
  selectedProducts: Set<string>;
  setSelectedProducts: (products: Set<string>) => void;
  filteredProducts: string[];
  productSearchQuery: string;
  setProductSearchQuery: (query: string) => void;
  toggleProductFilter: (product: string) => void;
}

export const ProductFilterSelector = ({
  selectedProducts,
  setSelectedProducts,
  filteredProducts,
  productSearchQuery,
  setProductSearchQuery,
  toggleProductFilter,
}: ProductFilterSelectorProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between">
          Produits {selectedProducts.size > 0 && `(${selectedProducts.size})`}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-3 border-b">
          <Input
            placeholder="Rechercher des produits..."
            value={productSearchQuery}
            onChange={(e) => setProductSearchQuery(e.target.value)}
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-2">
          {filteredProducts.map((product) => (
            <div
              key={product}
              className="flex items-center space-x-2 p-2 hover:bg-muted rounded"
            >
              <Checkbox
                checked={selectedProducts.has(product)}
                onCheckedChange={() => toggleProductFilter(product)}
              />
              <label
                className="text-sm cursor-pointer flex-1"
                onClick={() => toggleProductFilter(product)}
              >
                {product}
              </label>
            </div>
          ))}
        </div>
        {selectedProducts.size > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedProducts(new Set())}
              className="w-full"
            >
              Effacer la sélection
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

// 5. Composant pour le filtre de taille
interface FileSizeFilterSelectorProps {
  minSize: string;
  setMinSize: (size: string) => void;
  maxSize: string;
  setMaxSize: (size: string) => void;
}

export const FileSizeFilterSelector = ({
  minSize,
  setMinSize,
  maxSize,
  setMaxSize,
}: FileSizeFilterSelectorProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between">
          Taille {(minSize || maxSize) && "(Filtré)"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-2">
          <div className="flex flex-col gap-y-3">
            <div>
              <Label className="text-sm font-medium">
                Taille minimale (Mo)
              </Label>
              <Input
                placeholder="Min"
                value={minSize}
                onChange={(e) => setMinSize(e.target.value)}
                type="number"
                className="flex-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                Taille maximale (Mo)
              </Label>
              <Input
                placeholder="Max"
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
                type="number"
                className="flex-1"
              />
            </div>
          </div>
          {(minSize || maxSize) && (
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                setMinSize("");
                setMaxSize("");
              }}
              className="w-max h-max p-0"
            >
              Effacer
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// 6. Composant combiné avec tous les filtres
interface FilterControlsProps {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  fileTypeFilter: FileTypeFilter;
  setFileTypeFilter: (value: FileTypeFilter) => void;
  usageFilter: UsageFilter;
  setUsageFilter: (value: UsageFilter) => void;
  selectedProducts: Set<string>;
  setSelectedProducts: (products: Set<string>) => void;
  filteredProducts: string[];
  productSearchQuery: string;
  setProductSearchQuery: (query: string) => void;
  toggleProductFilter: (product: string) => void;
  minSize: string;
  setMinSize: (size: string) => void;
  maxSize: string;
  setMaxSize: (size: string) => void;
  openFilter: string | null;
  setOpenFilter: Dispatch<SetStateAction<string | null>>;
}

export const FilterControls = ({
  sortBy,
  setSortBy,
  fileTypeFilter,
  setFileTypeFilter,
  usageFilter,
  setUsageFilter,
  selectedProducts,
  setSelectedProducts,
  filteredProducts,
  productSearchQuery,
  setProductSearchQuery,
  toggleProductFilter,
  minSize,
  setMinSize,
  maxSize,
  setMaxSize,
  openFilter,
  setOpenFilter,
}: FilterControlsProps) => {
  //   const handleFilterOpen = (filterId: string) => {
  //     setOpenFilter(openFilter === filterId ? null : filterId);
  //   };

  return (
    // div className="flex gap-4 flex-wrap"
    <>
      <Select
        value={sortBy}
        onValueChange={setSortBy}
        open={openFilter === "sort"}
        onOpenChange={(open) => setOpenFilter(open ? "sort" : null)}
      >
        <SelectTrigger className="w-max">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-desc">
            Date d&apos;ajout (le plus récent en premier)
          </SelectItem>
          <SelectItem value="date-asc">
            Date d&apos;ajout (le plus ancien en premier)
          </SelectItem>
          <SelectItem value="name-asc">Nom du fichier (A-Z)</SelectItem>
          <SelectItem value="name-desc">Nom du fichier (Z-A)</SelectItem>
          <SelectItem value="size-asc">
            Taille du fichier (le plus petit en premier)
          </SelectItem>
          <SelectItem value="size-desc">
            Taille du fichier (le plus grand en premier)
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={fileTypeFilter}
        onValueChange={setFileTypeFilter}
        open={openFilter === "fileType"}
        onOpenChange={(open) => setOpenFilter(open ? "fileType" : null)}
      >
        {/* pl-2 pr-1 py-0 h-max*/}
        <SelectTrigger
          className="w-max"
          clearable={true}
          hasValue={fileTypeFilter !== ""}
          value={fileTypeFilter}
          defaultValue="File type"
          onClear={() => {
            // e.preventDefault();
            setOpenFilter("");
            setFileTypeFilter("");
          }}
          //   placeholder="File type"
        >
          {/* <SelectValue /> */}
          <SelectValue placeholder="File type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="cursor-pointer">
            Tous les types
          </SelectItem>
          <SelectItem value="images" className="cursor-pointer">
            Images
          </SelectItem>
          <SelectItem value="videos" className="cursor-pointer">
            Vidéos
          </SelectItem>
          <SelectItem value="external-videos" className="cursor-pointer">
            Vidéos externes
          </SelectItem>
          <SelectItem value="3d-models" className="cursor-pointer">
            Modèles 3D
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={usageFilter}
        onValueChange={setUsageFilter}
        open={openFilter === "usage"}
        onOpenChange={(open) => setOpenFilter(open ? "usage" : null)}
      >
        <SelectTrigger className="w-max">
          <SelectValue placeholder="Utilisé dans" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="Supports multimédias du produit">
            Supports multimédias du produit
          </SelectItem>
          <SelectItem value="Autre">Autre</SelectItem>
        </SelectContent>
      </Select>

      <Popover
        open={openFilter === "products"}
        onOpenChange={(open) => setOpenFilter(open ? "products" : null)}
      >
        <PopoverTrigger asChild className="w-max">
          <Button variant="outline" className="justify-between h-10">
            Produits {selectedProducts.size > 0 && `(${selectedProducts.size})`}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-0"
          align="start"
          side="bottom"
          //   sideOffset={40}
          //   alignOffset={280}
          //   avoidCollisions={false} // Désactive la détection de collision
          //   hideWhenDetached={false}
        >
          <div className="p-3 border-b">
            <Input
              placeholder="Rechercher des produits..."
              value={productSearchQuery}
              onChange={(e) => setProductSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-2">
            {filteredProducts.map((product) => (
              <div
                key={product}
                className="flex items-center space-x-2 p-2 hover:bg-muted rounded"
              >
                <Checkbox
                  checked={selectedProducts.has(product)}
                  onCheckedChange={() => toggleProductFilter(product)}
                />
                <label
                  className="text-sm cursor-pointer flex-1"
                  onClick={() => toggleProductFilter(product)}
                >
                  {product}
                </label>
              </div>
            ))}
          </div>
          {selectedProducts.size > 0 && (
            <div className="p-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProducts(new Set())}
                className="w-full"
              >
                Effacer la sélection
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      <Popover
        open={openFilter === "fileSize"}
        onOpenChange={(open) => setOpenFilter(open ? "fileSize" : null)}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between">
            Taille {(minSize || maxSize) && "(Filtré)"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="space-y-2">
            <div className="flex flex-col gap-y-3">
              <div>
                <Label className="text-sm font-medium">
                  Taille minimale (Mo)
                </Label>
                <Input
                  placeholder="Min"
                  value={minSize}
                  onChange={(e) => setMinSize(e.target.value)}
                  type="number"
                  className="flex-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Taille maximale (Mo)
                </Label>
                <Input
                  placeholder="Max"
                  value={maxSize}
                  onChange={(e) => setMaxSize(e.target.value)}
                  type="number"
                  className="flex-1"
                />
              </div>
            </div>
            {(minSize || maxSize) && (
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setMinSize("");
                  setMaxSize("");
                }}
                className="w-max h-max p-0"
              >
                Effacer
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

// 6. Composant combiné avec tous les filtres

// interface FilterControlsProps {
//   sortBy: SortOption;
//   setSortBy: (value: SortOption) => void;
//   fileTypeFilter: FileTypeFilter;
//   setFileTypeFilter: (value: FileTypeFilter) => void;
//   usageFilter: UsageFilter;
//   setUsageFilter: (value: UsageFilter) => void;
//   selectedProducts: Set<string>;
//   setSelectedProducts: (products: Set<string>) => void;
//   filteredProducts: string[];
//   productSearchQuery: string;
//   setProductSearchQuery: (query: string) => void;
//   toggleProductFilter: (product: string) => void;
//   minSize: string;
//   setMinSize: (size: string) => void;
//   maxSize: string;
//   setMaxSize: (size: string) => void;
// }

// export const FilterControls = ({
//   sortBy,
//   setSortBy,
//   fileTypeFilter,
//   setFileTypeFilter,
//   usageFilter,
//   setUsageFilter,
//   selectedProducts,
//   setSelectedProducts,
//   filteredProducts,
//   productSearchQuery,
//   setProductSearchQuery,
//   toggleProductFilter,
//   minSize,
//   setMinSize,
//   maxSize,
//   setMaxSize,
// }: FilterControlsProps) => {

//   return (
//     // div className="flex gap-4 flex-wrap"
//     <>
//       <SortSelector sortBy={sortBy} setSortBy={setSortBy} />
//       <FileTypeFilterSelector
//         fileTypeFilter={fileTypeFilter}
//         setFileTypeFilter={setFileTypeFilter}
//       />
//       <UsageFilterSelector
//         usageFilter={usageFilter}
//         setUsageFilter={setUsageFilter}
//       />
//       <ProductFilterSelector
//         selectedProducts={selectedProducts}
//         setSelectedProducts={setSelectedProducts}
//         filteredProducts={filteredProducts}
//         productSearchQuery={productSearchQuery}
//         setProductSearchQuery={setProductSearchQuery}
//         toggleProductFilter={toggleProductFilter}
//       />
//       <FileSizeFilterSelector
//         minSize={minSize}
//         setMinSize={setMinSize}
//         maxSize={maxSize}
//         setMaxSize={setMaxSize}
//       />
//     </>
//   );
// };

// Export des types pour utilisation externe
//   export type { SortOption, FileTypeFilter, UsageFilter }

// Export des types pour utilisation externe
export type { SortOption, FileTypeFilter, UsageFilter };
