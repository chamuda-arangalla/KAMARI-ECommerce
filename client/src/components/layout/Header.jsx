import { Search, ShoppingBag, User } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-transparent transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link to="/">
        <div className="text-xl tracking-widest font-light">
          KAMARI
        </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 text-sm">
          <a href="#">Shop</a>
          <a href="#">Collections</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <Search size={18} />
          <User size={18} />
          <Link to="/cart">
            <ShoppingBag size={18} />
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;