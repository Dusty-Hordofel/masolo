"use client";

import type React from "react";

import { useState, MutableRefObject } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "lucide-react";

type MediaUrlDropdownProps = {
  ignoreNextClick: MutableRefObject<boolean>;
};
export default function MediaUrlDropdown({
  ignoreNextClick,
}: MediaUrlDropdownProps) {
  const [mediaUrl, setMediaUrl] = useState("");
  const [isAddMediaUrlDropdownOpen, setIsAddMediaUrlDropdownOpen] =
    useState(false);
  console.log(
    "🚀 ~ MediaUrlDropdown ~ isAddMediaUrlDropdownOpen:",
    isAddMediaUrlDropdownOpen
  );

  const isValidMediaUrl = (urlString: string) => {
    if (!urlString.trim()) return false;
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleAddMediaFile = () => {
    if (isValidMediaUrl(mediaUrl)) {
      console.log("Ajout du fichier avec l'URL:", mediaUrl);
      // Ici vous pouvez ajouter la logique pour traiter l'URL
      setMediaUrl("");
      setIsAddMediaUrlDropdownOpen(false);
    }
  };

  const handleMediaUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaUrl(e.target.value);
  };

  const handleOpenChange = (open: boolean) => {
    // Si on ferme le popover, on ignore le clic suivant
    if (!open) {
      ignoreNextClick.current = true;
    }
    setIsAddMediaUrlDropdownOpen(open);
  };

  return (
    <Popover
      open={isAddMediaUrlDropdownOpen}
      onOpenChange={handleOpenChange}
      // onOpenChange={setIsAddMediaUrlDropdownOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="link"
          className="gap-2"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="hidden sm:inline-block">Add media from URL</span>
          <Link className="sm:hidden" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-max"
        align="start"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="space-y-3 flex flex-col justify-start items-start">
          <p className="text-sm font-bold text-start">Add from URL</p>
          <div className="w-full space-y-1">
            <Label
              htmlFor="media-url"
              className="text-sm font-medium text-start block"
            >
              URL d&apos;image, YouTube ou Vimeo
            </Label>
            <Input
              id="media-url"
              type="url"
              placeholder="https://"
              value={mediaUrl}
              onChange={handleMediaUrlChange}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              autoComplete="off"
              className="w-full"
              autoFocus
            />
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddMediaFile();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={!isValidMediaUrl(mediaUrl)}
            size="sm"
            variant="secondary"
            className="w-max m-O"
          >
            Add file
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
