
import { useState } from "react";
import { UserInfoDisplay } from "./UserInfoDisplay";
import { EditNameForm } from "./EditNameForm";

interface UserInfoProps {
  name: string;
  email?: string | null;
  createdAt?: string;
  setName: (name: string) => void;
}

export const UserInfo = ({ name, email, createdAt, setName }: UserInfoProps) => {
  const [isEditingName, setIsEditingName] = useState(false);

  const handleSaveName = (newName: string) => {
    setName(newName);
    setIsEditingName(false);
  };

  return (
    <div className="flex-1">
      {isEditingName ? (
        <EditNameForm
          initialName={name}
          onSave={handleSaveName}
          onCancel={() => setIsEditingName(false)}
        />
      ) : (
        <UserInfoDisplay
          name={name}
          onEditClick={() => setIsEditingName(true)}
        />
      )}
      
      <p className="text-sm text-primary/70">{email}</p>
      
      {createdAt && (
        <p className="text-xs text-primary/50 mt-1">
          Joined {new Date(createdAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};
