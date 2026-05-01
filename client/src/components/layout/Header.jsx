import { Search, ShoppingBag, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const { totalItems, setIsDrawerOpen } = useCart();
  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-[#F8F5F2]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-light tracking-[0.25em] text-[#3B302A]">
          KAMARI
        </Link>

        <nav className="hidden items-center gap-10 text-[11px] uppercase tracking-[0.18em] text-[#3B302A] md:flex">
          <Link to="/shop">Shop</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-5 text-[#3B302A]">
          <Search size={16} strokeWidth={1.5} className="cursor-pointer" />
          <User size={16} strokeWidth={1.5} className="cursor-pointer" />
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open cart"
            className="cursor-pointer" 
          >
            <ShoppingBag size={16} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#3B302A] text-[9px] text-[#F8F5F2]">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;