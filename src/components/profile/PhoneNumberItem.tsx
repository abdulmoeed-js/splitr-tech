
import { Button } from "@/components/ui/button";
import { Phone, Trash2 } from "lucide-react";

interface PhoneNumberItemProps {
  phone: string;
  onRemove: () => void;
}

export const PhoneNumberItem = ({ phone, onRemove }: PhoneNumberItemProps) => {
  return (
    <div className="flex items-center justify-between p-2 bg-accent/20 rounded-lg">
      <div className="flex items-center">
        <Phone className="h-4 w-4 mr-2 text-primary/70" />
        <span>{phone}</span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 text-destructive hover:text-destructive/80" 
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
