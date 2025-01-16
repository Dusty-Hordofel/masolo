import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type SubmitButtonProps = {
  label: string;
  isSubmitting: boolean;
};

const SubmitButton = ({ label, isSubmitting }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="flex gap-2 items-center justify-center w-full h-11"
    >
      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : label}
    </Button>
  );
};

export default SubmitButton;
