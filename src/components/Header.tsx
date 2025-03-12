import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "./Logo";

// Update the navigation items in the Header component to include a Friends link
const Header = () => {
  const { session, handleSignOut } = useAuth();
  
  return (
    <header className="border-b">
      <div className="flex items-center justify-between p-3 container">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8" />
          <span className="font-bold">Splitr</span>
        </Link>

        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <Link 
                to="/" 
                className="text-sm hover:text-primary transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/friends" 
                className="text-sm hover:text-primary transition-colors"
              >
                Friends
              </Link>
            </li>
            {session ? (
              <>
                <li>
                  <Link 
                    to="/profile" 
                    className="text-sm hover:text-primary transition-colors"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export { Header };
