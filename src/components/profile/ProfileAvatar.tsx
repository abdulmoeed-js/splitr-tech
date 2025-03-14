
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  imageUrl?: string | null;
  fallbackText: string;
}

export const ProfileAvatar = ({ imageUrl, fallbackText }: ProfileAvatarProps) => {
  return (
    <Avatar className="h-16 w-16">
      <AvatarImage src={imageUrl || ""} alt="Profile" />
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
        {fallbackText.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
