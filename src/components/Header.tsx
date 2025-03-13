
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const Header = () => {
  return (
    <header className="border-b">
      <div className="flex items-center justify-center p-3 container">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8" />
          <span className="font-bold">Splitr</span>
        </Link>
      </div>
    </header>
  );
};

export { Header };
