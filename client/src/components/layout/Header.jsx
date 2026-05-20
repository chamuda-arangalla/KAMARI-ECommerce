import { useRef, useState, useEffect } from "react";
import { Search, ShoppingBag, User, LogOut, ChevronDown, LayoutDashboard, PackageSearch } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/useCart";
import ConfirmDialog from "../common/ConfirmDialog";
import { logout } from "../../services/authApi";
import "../../styles/Header.css";

const COLLECTION_ITEMS = [
  { name: "Flow Set",   sub: "Light & effortless",  img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80" },
  { name: "Ease Set",   sub: "Relaxed & refined",   img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80" },
  { name: "Bold Set",   sub: "Confident & sleek",   img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=300&q=80" },
  { name: "Breeze Set", sub: "Soft & airy",         img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&q=80" },
  { name: "Luxe Set",   sub: "Premium & polished",  img: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=300&q=80" },
  { name: "Dusk Set",   sub: "Evening elegance",    img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&q=80" },
  { name: "Dawn Set",   sub: "Morning comfort",     img: "https://images.unsplash.com/photo-1616627988047-1f1a28aa25a9?w=300&q=80" },
  { name: "Muse Set",   sub: "Artistic & free",     img: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=300&q=80" },
  { name: "Grace Set",  sub: "Timeless & tailored", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80" },
  { name: "Lush Set",   sub: "Rich & vibrant",      img: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300&q=80" },
];

const Header = () => {
  const { totalItems, setIsDrawerOpen } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [customer, setCustomer] = useState(() => {
    const stored = localStorage.getItem("customerUser");
    const adminStored = localStorage.getItem("adminUser");
    return stored ? JSON.parse(stored) : adminStored ? JSON.parse(adminStored) : null;
  });
  const closeTimer = useRef(null);
  const accountRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    const handleUserUpdate = () => {
      const stored = localStorage.getItem("customerUser");
      const adminStored = localStorage.getItem("adminUser");
      setCustomer(stored ? JSON.parse(stored) : adminStored ? JSON.parse(adminStored) : null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("kamari:user-updated", handleUserUpdate);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("kamari:user-updated", handleUserUpdate);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
    } finally {
      localStorage.removeItem("customerToken");
      localStorage.removeItem("customerUser");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      setCustomer(null);
      setAccountOpen(false);
      setLogoutOpen(false);
      setLoggingOut(false);
      navigate("/");
    }
  };

  const openDropdown = () => {
    clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };

  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 120);
  };

  const handleCollectionClick = (categoryName) => {
    setDropdownOpen(false);
    navigate(`/collections?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-[#F8F5F2]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link to="/" className="text-xl font-light tracking-[0.25em] text-[#3B302A]">
            KAMARI
          </Link>

          <nav className="hidden items-center gap-10 text-[11px] uppercase tracking-[0.18em] text-[#3B302A] md:flex">
            <Link to="/shop">Shop</Link>

            {/* Collections with dropdown */}
            <div
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
              className="relative"
            >
              <button
                className="uppercase tracking-[0.18em] text-[11px] text-[#3B302A] bg-transparent border-none cursor-pointer font-[inherit] p-0"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                Collections
              </button>
            </div>

            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="flex items-center gap-5 text-[#3B302A]">
            <Search size={16} strokeWidth={1.5} className="cursor-pointer" />
            {customer ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-1.5 text-[#3B302A]"
                >
                  <div className="w-7 h-7 rounded-full bg-[#3B302A] text-[#F8F5F2] flex items-center justify-center text-[10px] font-semibold">
                    {customer.firstName?.[0]?.toUpperCase() || customer.email?.[0]?.toUpperCase()}
                  </div>
                  <ChevronDown size={13} strokeWidth={1.5} className={`transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-10 w-52 bg-white border border-[#e5ddd5] rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-[#e5ddd5]">
                      <p className="text-sm font-semibold text-[#3b302a]">
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p className="text-xs text-[#a3948b] truncate mt-0.5">{customer.email}</p>
                    </div>

                    {customer.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setAccountOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#3b302a] hover:bg-[#f8f5f2] transition"
                      >
                        <LayoutDashboard size={15} />
                        Admin Dashboard
                      </Link>
                    )}

                    {customer.role === "customer" && (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setAccountOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#3b302a] hover:bg-[#f8f5f2] transition"
                        >
                          <User size={15} />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setAccountOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#3b302a] hover:bg-[#f8f5f2] transition"
                        >
                          <PackageSearch size={15} />
                          My Orders
                        </Link>
                      </>
                    )}

                    <button
                      onClick={() => {
                        setAccountOpen(false);
                        setLogoutOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" aria-label="Sign in">
                <User size={16} strokeWidth={1.5} />
              </Link>
            )}
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open cart"
              className="relative cursor-pointer"
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

      {/* ── Collections Dropdown ─────────────────── */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            className="collections-dropdown"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
          >
            <div className="collections-dropdown-inner">

              {/* Left — 2-col link grid */}
              <div className="collections-dropdown-left">
                <p className="collections-dropdown-heading">Collections</p>

                <Link
                  to="/collections"
                  className="collections-dropdown-all"
                  onClick={() => setDropdownOpen(false)}
                >
                  All Collections →
                </Link>

                <div className="collections-dropdown-divider" />

                {/* All 10 categories in 2 columns */}
                <div className="collections-dropdown-links">
                  {COLLECTION_ITEMS.map((col) => (
                    <button
                      key={col.name}
                      className="collections-dropdown-link"
                      onClick={() => handleCollectionClick(col.name)}
                    >
                      {col.name}
                      <span className="collections-dropdown-link-arrow">→</span>
                    </button>
                  ))}
                </div>

                <div className="collections-dropdown-divider" />

                {/* Quick links */}
                <div className="collections-dropdown-links-extra">
                  <button
                    className="collections-dropdown-link"
                    onClick={() => { setDropdownOpen(false); navigate("/collections?sort=newest"); }}
                  >
                    New Arrivals
                    <span className="collections-dropdown-link-arrow">→</span>
                  </button>
                  <button
                    className="collections-dropdown-link"
                    onClick={() => { setDropdownOpen(false); navigate("/collections?sort=best-selling"); }}
                  >
                    Best Sellers
                    <span className="collections-dropdown-link-arrow">→</span>
                  </button>
                </div>
              </div>

              {/* Right — 4 featured image cards */}
              <div className="collections-dropdown-right">
                {COLLECTION_ITEMS.slice(0, 4).map((col) => (
                  <div
                    key={col.name}
                    className="collections-dropdown-card"
                    onClick={() => handleCollectionClick(col.name)}
                  >
                    <div className="collections-dropdown-card-img-wrap">
                      <img
                        src={col.img}
                        alt={col.name}
                        className="collections-dropdown-card-img"
                      />
                    </div>
                    <p className="collections-dropdown-card-name">{col.name}</p>
                    <p className="collections-dropdown-card-sub">{col.sub}</p>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={logoutOpen}
        title="Sign out?"
        message="You will be signed out of your current KAMARI session."
        confirmLabel="Sign Out"
        type="logout"
        loading={loggingOut}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Header;
