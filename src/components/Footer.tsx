
import { Home, Wallet, User, PlusCircle, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Footer = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-t border-white/10 p-4 z-10">
      <div className="flex items-center justify-around">
        <FooterItem 
          icon={<Home className="h-6 w-6" />} 
          label="Home" 
          to="/" 
          isActive={currentPath === '/'} 
        />
        <FooterItem 
          icon={<Users className="h-6 w-6" />} 
          label="Friends" 
          to="/friends" 
          isActive={currentPath === '/friends'} 
        />
        <div className="flex flex-col items-center">
          <Link to="/add-expense" className="h-14 w-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center -mt-8 shadow-lg border-4 border-black">
            <PlusCircle className="h-8 w-8 text-white" />
          </Link>
        </div>
        <FooterItem 
          icon={<Wallet className="h-6 w-6" />} 
          label="Wallet" 
          to="/wallet" 
          isActive={currentPath === '/wallet'} 
        />
        <FooterItem 
          icon={<User className="h-6 w-6" />} 
          label="Profile" 
          to="/profile" 
          isActive={currentPath === '/profile'} 
        />
      </div>
    </div>
  );
};

interface FooterItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
}

const FooterItem = ({ icon, label, to, isActive }: FooterItemProps) => {
  return (
    <Link to={to} className="flex flex-col items-center">
      <div className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
        {icon}
      </div>
      <span className={`text-xs mt-1 ${isActive ? 'text-white' : 'text-gray-400'}`}>{label}</span>
    </Link>
  );
};
