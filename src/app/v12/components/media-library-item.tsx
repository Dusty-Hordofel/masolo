import { ImageData } from "@/@types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Eye, X } from "lucide-react";

interface MediaLibraryItemProps {
  image: ImageData;
  isSelected: boolean;
  isActive: boolean;
  onToggleSelection: () => void;
  onDelete: () => void;
  onView: () => void;
}

export default function MediaLibraryItem({
  image,
  isSelected,
  isActive,
  onToggleSelection,
  onDelete,
  onView,
}: MediaLibraryItemProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden group transition-all duration-200",
        isActive ? "ring-2 ring-primary scale-105" : "hover:scale-102"
      )}
      data-image-id={image.id}
    >
      <picture>
        <img
          src={image.url || image.preview}
          alt={image.name}
          className="w-full aspect-square object-cover"
        />
      </picture>

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />

      {/* Controls */}
      <div
        className="absolute top-2 right-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelection}
          className="h-5 w-5 bg-white border-2 shadow-sm"
        />
      </div>

      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex gap-1">
          <Button
            variant={isActive ? "default" : "secondary"}
            size="icon"
            className="h-8 w-8 bg-black/70 hover:bg-black/90"
            onClick={onView}
          >
            <Eye className="h-4 w-4 text-white" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
