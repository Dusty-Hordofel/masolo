import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface AddImageCardProps {
  onOpenModal: () => void;
}

export default function AddImageCard({ onOpenModal }: AddImageCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative h-full">
        <div
          className={cn(
            "aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors border-2 border-dashed  hover:bg-gray-200/65 bg-gray-200/30 "
          )}
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
        >
          <Plus className="h-6 w-6 mx-auto mb-1" />
        </div>
      </CardContent>
    </Card>
  );
}
