
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const Header = () => {
  return (
    <header className="border-b border-primary/10">
      <div className="flex items-center justify-center p-3 container">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8" />
          <span className="font-bold text-primary">Splitr</span>
        </Link>
      </div>
    </header>
  );
};

export { Header };
