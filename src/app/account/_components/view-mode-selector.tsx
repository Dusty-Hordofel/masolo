"use client";

import type React from "react";

import { Dispatch, SetStateAction,  } from "react";
import {
 
  Grid3X3,
  List,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


type ViewMode = "grid" | "list";

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

interface ViewModeSelectorProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  openFilter: string | null;
  setOpenFilter: Dispatch<SetStateAction<string | null>>;
}

export function ViewModeSelector({
  viewMode,
  setViewMode,
  openFilter,
  setOpenFilter,
}: ViewModeSelectorProps) {
  return (
    <Popover
      open={openFilter === "viewMode"}
      onOpenChange={(open) => setOpenFilter(open ? "viewMode" : null)}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="p-2"
          aria-label="Change display mode"
        >
          {viewMode === "grid" ? (
            <Grid3X3 className="h-4 w-4" />
          ) : (
            <List className="h-4 w-4" />
          )}
          <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-48 p-1"
        align="end"
        side="bottom"
        // sideOffset={10}
        alignOffset={80}
        avoidCollisions={false} // Désactive la détection de collision
        hideWhenDetached={false}
      >
        <div className="space-y-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            className="w-full justify-start cursor-pointer"
            onClick={() => {
              setViewMode("grid");
              setOpenFilter(null); // Ferme le popover après sélection
            }}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Affichage en grille
            {viewMode === "grid" && <Check className="h-4 w-4 ml-auto" />}
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            className="w-full justify-start cursor-pointer"
            onClick={() => {
              setViewMode("list");
              setOpenFilter(null); // Ferme le popover après sélection
            }}
          >
            <List className="h-4 w-4 mr-2" />
            Affichage en liste
            {viewMode === "list" && <Check className="h-4 w-4 ml-auto" />}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
