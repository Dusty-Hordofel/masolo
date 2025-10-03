import React, { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { Badge } from "@/components/ui/badge";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectPopoverProps {
  options: Option[];
  placeholder?: string;
  className?: string;
  onSelectionChange?: (selectedValues: string[]) => void;
}

export function MultiSelectPopover({
  options,
  placeholder = "Sélectionnez des options...",
  className,
  onSelectionChange,
}: MultiSelectPopoverProps) {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleSelect = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];

    setSelectedValues(newSelected);
    onSelectionChange?.(newSelected);
  };

  const clearAll = () => {
    setSelectedValues([]);
    onSelectionChange?.([]);
  };

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-10 h-auto p-2"
          >
            <div className="flex-1 min-w-0">
              {selectedValues.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <span className="text-sm truncate block">
                  {selectedOptions.map((option) => option.label).join(", ")}
                </span>
              )}
            </div>
            {selectedValues.length > 0 ? (
              <X
                className="ml-2 h-4 w-4 shrink-0 opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
                }}
              />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Aucune option disponible.
              </div>
            ) : (
              <div className="p-1">
                {options.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "flex items-center space-x-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                      selectedValues.includes(option.value) && "bg-accent"
                    )}
                    onClick={() => handleSelect(option.value)}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedValues.includes(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {selectedValues.includes(option.value) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    <span className="flex-1">{option.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
