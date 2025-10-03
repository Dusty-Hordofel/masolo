import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Image } from "@prisma/client";

interface ImageCardProps {
  image: Image;
  isSelected: boolean;
  onToggleSelection: () => void;
  onView: () => void;
  className?: string;
}

export default function ImageCard({
  image,
  isSelected,
  onToggleSelection,
  onView,
  className,
}: ImageCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0 relative h-full">
        <div className="relative h-full cursor-pointer" onClick={onView}>
          <picture>
            <img
              src={image.secureUrl}
              alt="Upload"
              className="w-full h-full object-cover"
            />
          </picture>

          {/* Checkbox */}
          <div
            className="absolute top-2 right-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelection}
              className="h-5 w-5 bg-white border shadow-sm"
            />
          </div>

          {/* Selection Overlay */}
          {isSelected && (
            <div className="absolute inset-0 bg-primary/20 border border-primary rounded-lg pointer-events-none" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
