import { ImageData } from "@/@types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ImageCardProps {
  image: ImageData;
  isSelected: boolean;
  onToggleSelection: () => void;
  onDelete: () => void;
  onView: () => void;
  className?: string;
}

export default function ImageCard({
  image,
  isSelected,
  onToggleSelection,
  onDelete,
  onView,
  className,
}: ImageCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0 relative h-full">
        <div className="relative h-full cursor-pointer" onClick={onView}>
          <picture>
            <img
              src={image.url || image.preview}
              alt="Upload"
              className="w-full h-full object-cover"
            />
          </picture>

          {/* Upload Progress Overlay */}
          {image.isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-3 min-w-[120px]">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload...</span>
                    <span>{Math.round(image.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${image.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          {image.isUploaded && (
            <>
              {/* Checkbox */}
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

              {/* Delete Button */}
              <div
                className="absolute top-2 left-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-7 w-7 rounded-full shadow-sm"
                  onClick={onDelete}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </>
          )}

          {/* Selection Overlay */}
          {isSelected && (
            <div className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-lg pointer-events-none" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
