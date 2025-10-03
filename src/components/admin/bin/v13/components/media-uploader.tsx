import { Button } from "@/components/ui/button";
import MediaUrlDropdown from "../../../../../app/account/_components/media-url-dropdown";
import { cn } from "@/lib/utils";
import { MutableRefObject } from "react";

interface MediaUploaderProps {
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  ignoreNextClick: MutableRefObject<boolean>;
  setShowAllImages: React.Dispatch<React.SetStateAction<boolean>>;
  showAllImages: boolean;
  hasImages: boolean;
}

export function MediaUploader({
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  fileInputRef,
  ignoreNextClick,
  showAllImages,
  hasImages,
  setShowAllImages,
}: MediaUploaderProps) {
  return (
    <div className="mt-4 mb-5">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (ignoreNextClick.current) {
            ignoreNextClick.current = false; // reset
            return; // ignorer ce clic
          }
          fileInputRef.current?.click();
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="space-y-2">
            <div className="relative flex justify-center items-center">
              <p className="border w-max px-3 py-[6px] rounded-lg hover:bg-gray-100">
                <span>Upload new</span>
              </p>

              {hasImages && (
                <div
                // className="_Activator_17fbw_1 absolute right-3 top-0"
                >
                  <MediaUrlDropdown ignoreNextClick={ignoreNextClick} />
                </div>
              )}
              {!hasImages && !showAllImages && (
                <div
                // className="_Activator_17fbw_1 absolute right-3 top-0"
                >
                  <Button
                    variant="link"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAllImages(true);
                    }}
                  >
                    Sélect existing
                  </Button>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Glisser-déposer des images, des vidéos, des modèles 3D et des
              fichiers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
