
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useFriends } from "@/hooks/useFriends";
import { useExpenses } from "@/hooks/useExpenses";

export default function AddExpense() {
  const navigate = useNavigate();
  const { friends } = useFriends();
  const { expenses, handleAddExpense, handleAddFriend, handleInviteFriend } = useExpenses();

  // Automatically open the AddExpenseDialog and navigate back when closed
  useEffect(() => {
    const dialog = document.querySelector("[data-add-expense-dialog]");
    if (dialog) {
      const dialogElement = dialog as HTMLDialogElement;
      dialogElement.setAttribute("open", "true");
      
      // Use MutationObserver to detect when the dialog is closed
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "open" && 
              !dialogElement.hasAttribute("open")) {
            navigate("/");
          }
        });
      });
      
      observer.observe(dialogElement, { attributes: true });
      
      return () => {
        observer.disconnect();
      };
    } else {
      // If dialog element not found, navigate back
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <AddExpenseDialog 
        autoOpen={true} 
        onClose={() => navigate("/")} 
        friends={friends}
        onAddExpense={handleAddExpense}
        onAddFriend={handleAddFriend}
        onInviteFriend={handleInviteFriend}
      />
    </div>
  );
}
