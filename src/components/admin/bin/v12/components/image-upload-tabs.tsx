// components/image-upload-tabs.tsx
"use client";

import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type ImageUploadTabsProps = {
  urlInput: string;
  setUrlInput: (value: string) => void;
  addImageFromUrl: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ImageUploadTabs = ({
  urlInput,
  setUrlInput,
  addImageFromUrl,
  handleFileChange,
}: ImageUploadTabsProps) => {
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border-b">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList>
          <TabsTrigger value="upload">Télécharger des fichiers</TabsTrigger>
          <TabsTrigger value="url">Ajouter par URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-2">
          <Button
            onClick={() => modalFileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Sélectionner des fichiers
          </Button>
          <input
            ref={modalFileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </TabsContent>

        <TabsContent value="url" className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="URL de l'image..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <Button onClick={addImageFromUrl}>Ajouter</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
