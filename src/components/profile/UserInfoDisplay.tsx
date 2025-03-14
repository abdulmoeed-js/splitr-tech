
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface UserInfoDisplayProps {
  name: string;
  onEditClick: () => void;
}

export const UserInfoDisplay = ({ name, onEditClick }: UserInfoDisplayProps) => {
  return (
    <div className="flex items-center space-x-2">
      <h2 className="text-xl font-semibold">{name || "User"}</h2>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={onEditClick}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );
};
