"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function Component() {
  const [url, setUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const isValidUrl = (urlString: string) => {
    if (!urlString.trim()) return false;
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleAddFile = () => {
    if (isValidUrl(url)) {
      console.log("Ajout du fichier avec l'URL:", url);
      // Ici vous pouvez ajouter la logique pour traiter l'URL
      setUrl("");
      setIsOpen(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <div className="p-8">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter à partir d&apos;une URL
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="media-url" className="text-sm font-medium">
                URL d&apos;image, YouTube ou Vimeo
              </Label>
              <Input
                id="media-url"
                type="url"
                placeholder="https://"
                value={url}
                onChange={handleUrlChange}
                autoComplete="off"
                className="w-full"
              />
            </div>
            <Button
              onClick={handleAddFile}
              disabled={!isValidUrl(url)}
              size="sm"
              variant="secondary"
              className="w-auto"
            >
              Ajouter le fichier
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
