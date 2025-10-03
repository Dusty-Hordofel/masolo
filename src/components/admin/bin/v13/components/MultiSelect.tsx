import React, {
  Dispatch,
  SetStateAction,
  useState,
  useTransition,
} from "react";
import { Check, ChevronDown, Filter, X, Search } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  FILE_SORT_OPTIONS,
  FILE_TYPE_OPTIONS,
  MEDIA_USAGE_FILTER_OPTIONS,
  PRODUCT_OPTIONS,
  SelectOption,
} from "./select-options";
import { FileTypeFilter, SortOption } from "./filter-controls";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface ListItem {
  id: string;
  name: string;
  framework: string;
  language: string;
  description: string;
  popularity: number;
}

interface MultiSelectProps {
  options: Option[];
  placeholder?: string;
  onSelectionChange?: (selectedValues: string[]) => void;
  selectedValues: string[];
}

function MultiSelect({
  options,
  placeholder = "Sélectionnez des options...",
  onSelectionChange,
  selectedValues,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSelect = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];

    onSelectionChange?.(newSelected);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange?.([]);
    setOpen(false);
  };

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-max justify-between h-auto min-h-10 p-2"
        >
          <div className="flex flex-wrap gap-1 flex-1 text-left">
            {selectedValues.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex gap-1">
                {selectedOptions.slice(0, 3).map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="text-xs"
                  >
                    {option.label}
                  </Badge>
                ))}
                {selectedOptions.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedOptions.length - 3} autres
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedValues.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            {selectedValues.length === 0 && (
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" side="bottom">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div className="max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              Aucune option trouvée.
            </div>
          ) : (
            <div className="p-1 pb-2">
              {filteredOptions.map((option) => {
                console.log("🚀 ~ option:MOMO", option);
                return (
                  <Button
                    key={option.value}
                    className="flex items-center space-x-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleSelect(option.value)}
                    variant="ghost"
                    disabled={
                      option.value === "videos" ||
                      option.value === "external-videos" ||
                      option.value === "3d-models"
                    }
                  >
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                        selectedValues.includes(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      }`}
                    >
                      {selectedValues.includes(option.value) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    <span className="flex-1">{option.label}</span>
                  </Button>
                );
              })}
              <Button
                variant="link"
                size="sm"
                onClick={handleClear}
                className="w-max h-max"
                disabled={selectedValues.length === 0}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface SingleSelectProps {
  options: Option[];
  placeholder?: string;
  onSelectionChange?: (value: string) => void;
  // onSelectionChange?: (value: string) => void;
  selectedValue: string;
}

function SingleSelect({
  options,
  placeholder = "Sélectionnez une option...",
  onSelectionChange,
  selectedValue,
}: SingleSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelectionChange?.(value);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange?.("");
    setOpen(false);
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-max justify-between h-10"
        >
          <div className="flex-1 text-left">
            {selectedValue ? (
              <span className="text-sm">{selectedOption?.label}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedValue ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="h-max overflow-auto">
          {options.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              Aucune option disponible.
            </div>
          ) : (
            <div className="p-1 pb-2">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                    selectedValue === option.value
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border border-primary ${
                      selectedValue === option.value
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50"
                    }`}
                  >
                    {selectedValue === option.value && (
                      <div className="h-2 w-2 bg-primary-foreground rounded-full" />
                    )}
                  </div>
                  <span className="flex-1">{option.label}</span>
                </div>
              ))}

              <Button
                variant="link"
                size="sm"
                onClick={handleClear}
                className="w-max h-max"
                disabled={!selectedValue}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// import React, { useState } from 'react';
// import { ChevronDown } from 'lucide-react';

type FileSizeFilterProps = {
  minSize: string;
  setMinSize: React.Dispatch<React.SetStateAction<string>>;
  setMaxSize: React.Dispatch<React.SetStateAction<string>>;
  // setMinSize: (size: string) => void;
  maxSize: string;
  // setMaxSize: (size: string) => void;
};

function FileSizeFilter({
  minSize,
  setMinSize,
  maxSize,
  setMaxSize,
}: FileSizeFilterProps) {
  //     {
  //   openFilter,
  //   setOpenFilter,
  //   minSize,
  //   setMinSize,
  //   maxSize,
  //   setMaxSize
  // }
  // const [minSize, setMinSize] = useState("");
  // const [maxSize, setMaxSize] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // console.log("🚀 ~ FileSizeFilter ~ minSize:", minSize);
  // console.log("🚀 ~ FileSizeFilter ~ maxSize:", maxSize);

  const clearFilters = () => {
    setMinSize("");
    setMaxSize("");
  };

  const hasFilters = minSize || maxSize;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between h-10">
          File Size
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full" align="start">
        <div className="space-y-2">
          <div className="flex flex-col gap-y-3">
            <div>
              <Label className="text-sm font-medium">Min size (MB)</Label>
              <Input
                placeholder="Min"
                value={minSize}
                onChange={(e) => setMinSize(e.target.value)}
                type="number"
                className="flex-1 mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Max size (MB)</Label>
              <Input
                placeholder="Max"
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
                type="number"
                className="flex-1 mt-1"
              />
            </div>
          </div>
          {(minSize || maxSize) && (
            <Button
              variant="link"
              size="sm"
              onClick={clearFilters}
              className="w-max h-max p-0"
            >
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface FilterControlsProps {
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  // setSortBy: Dispatch<SetStateAction<SortOption>>
  // setSortBy: (value: SortOption) => void;
  // fileTypeFilter: FileTypeFilter;
  // setFileTypeFilter: (value: FileTypeFilter) => void;
  // usageFilter: UsageFilter;
  // setUsageFilter: (value: UsageFilter) => void;
  // selectedProducts: Set<string>;
  // setSelectedProducts: (products: Set<string>) => void;
  // filteredProducts: string[];
  // productSearchQuery: string;
  // setProductSearchQuery: (query: string) => void;
  // toggleProductFilter: (product: string) => void;
  minSize: string;
  setMinSize: Dispatch<SetStateAction<string>>;
  // setMinSize: (size: string) => void;
  maxSize: string;
  setMaxSize: Dispatch<SetStateAction<string>>;
  fileTypeFilter: string[];
  setFileTypeFilter: Dispatch<SetStateAction<string[]>>;
  // setMaxSize: (size: string) => void;
  // openFilter: string | null;
  // setOpenFilter: Dispatch<SetStateAction<string | null>>;
}

const FilterControls = ({
  sortBy,
  setSortBy,
  minSize,
  setMinSize,
  maxSize,
  setMaxSize,
  fileTypeFilter,
  setFileTypeFilter,
}: FilterControlsProps) => {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  //   FileTypeFilter
  // const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  // const [sortBy, setSortBy] = useState<string>("date-desc");

  const [usageFilter, setUsageFilter] = useState("all");

  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const products = [
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

  //   const filteredItems = allItems.filter((item) => {
  //     const frameworkMatch =
  //       selectedFrameworks.length === 0 ||
  //       selectedFrameworks.includes(item.framework);
  //     const languageMatch =
  //       !selectedLanguage || item.language === selectedLanguage;
  //     return frameworkMatch && languageMatch;
  //   });

  //   const handleClearAllFilters = () => {
  //     setSelectedFrameworks([]);
  //     setSelectedLanguage("");
  //   };

  return (
    <div className="flex flex-nowrap overflow-x-auto w-full space-x-2 ">
      <SingleSelect
        options={FILE_SORT_OPTIONS}
        placeholder="Sort By"
        onSelectionChange={setSortBy}
        selectedValue={sortBy}
      />

      <MultiSelect
        options={FILE_TYPE_OPTIONS}
        placeholder="File type"
        onSelectionChange={setFileTypeFilter}
        selectedValues={fileTypeFilter}
        // onSelectionChange={setSelectedFileTypes}
        // selectedValues={selectedFileTypes}
      />

      {/* <SingleSelect
        options={MEDIA_USAGE_FILTER_OPTIONS}
        placeholder="All"
        onSelectionChange={setUsageFilter}
        selectedValue={usageFilter}
      /> */}

      {/* <MultiSelect
        options={PRODUCT_OPTIONS}
        placeholder="Products"
        onSelectionChange={setSelectedFrameworks}
        selectedValues={selectedFrameworks}
      /> */}
      <FileSizeFilter
        minSize={minSize}
        setMinSize={setMinSize}
        maxSize={maxSize}
        setMaxSize={setMaxSize}
      />
    </div>
  );
};

export default FilterControls;
