import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";

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

function MultiSelectPopover2({
  options,
  placeholder = "Sélectionnez des options...",
  className,
  onSelectionChange,
}: MultiSelectPopoverProps) {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Fermer le popover quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];

    setSelectedValues(newSelected);
    onSelectionChange?.(newSelected);
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedValues([]);
    onSelectionChange?.([]);
    setOpen(false); // Fermer le popover après avoir tout effacé
  };

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  return (
    <div className={`w-full ${className || ""}`} ref={popoverRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full justify-between min-h-10 h-auto p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center"
        >
          <div className="flex-1 min-w-0 text-left">
            {selectedValues.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              <span className="text-sm truncate block">
                {selectedOptions.map((option) => option.label).join(", ")}
              </span>
            )}
          </div>
          {selectedValues.length > 0 ? (
            <X
              className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer"
              onClick={clearAll}
            />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </button>

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="max-h-60 overflow-auto">
              {options.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 text-center">
                  Aucune option disponible.
                </div>
              ) : (
                <div className="p-1">
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                        selectedValues.includes(option.value)
                          ? "bg-gray-100"
                          : ""
                      }`}
                      onClick={() => handleSelect(option.value)}
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-sm border border-blue-600 ${
                          selectedValues.includes(option.value)
                            ? "bg-blue-600 text-white"
                            : "opacity-50"
                        }`}
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
          </div>
        )}
      </div>
    </div>
  );
}

const Index = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const options = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue.js" },
    { value: "angular", label: "Angular" },
    { value: "svelte", label: "Svelte" },
    { value: "solid", label: "SolidJS" },
    { value: "qwik", label: "Qwik" },
    { value: "alpine", label: "Alpine.js" },
    { value: "lit", label: "Lit" },
    { value: "nextjs", label: "Next.js" },
    { value: "nuxt", label: "Nuxt.js" },
    { value: "gatsby", label: "Gatsby" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Multi-Select Popover</h1>
          <p className="text-xl text-gray-600 mb-8">
            Sélectionnez vos frameworks préférés
          </p>
        </div>

        <MultiSelectPopover2
          options={options}
          placeholder="Choisissez des frameworks..."
          onSelectionChange={setSelectedValues}
          className="w-full"
        />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Sélectionné: {selectedValues.length} élément(s)
          </p>
          {selectedValues.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {selectedValues.join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
