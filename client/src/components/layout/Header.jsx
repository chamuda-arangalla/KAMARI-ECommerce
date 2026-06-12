import { useRef, useState, useEffect } from "react";
import { Search, ShoppingBag, User, LogOut, ChevronDown, LayoutDashboard, PackageSearch, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/useCart";
import ConfirmDialog from "../common/ConfirmDialog";
import { logout } from "../../services/authApi";
import { getCollections } from "../../services/collectionApi";
import { getProducts } from "../../services/productApi";
import { getProductImages } from "../../utils/shopProduct";
import "../../styles/Header.css";

const Header = () => {
  const { totalItems, setIsDrawerOpen } = useCart();
  const [collections, setCollections] = useState([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsExpanded, setCollectionsExpanded] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [customer, setCustomer] = useState(() => {
    const stored = localStorage.getItem("customerUser");
    const adminStored = localStorage.getItem("adminUser");
    return stored ? JSON.parse(stored) : adminStored ? JSON.parse(adminStored) : null;
  });
  const accountRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const res = await getCollections();
        const collectionData = res.data || [];

        if (collectionData.length > 0) {
          setCollections(collectionData);
          return;
        }

        const productRes = await getProducts();
        const productCollections = new Map();

        (productRes.data || []).forEach((product) => {
          const name = product.setName || product.collection;
          if (!name || productCollections.has(name)) return;

          productCollections.set(name, {
            _id: `product-${name}`,
            name,
            subtitle: product.collection || "",
            image: { url: getProductImages(product)[0]?.url || "" },
          });
        });

        setCollections([...productCollections.values()]);
      } catch {
        setCollections([]);
      }
    };

    loadCollections();
  }, []);

  useEffect(() => {
    const lastScrollY = { current: window.scrollY };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0 || currentScrollY < lastScrollY.current) {
        setHeaderHidden(false);
      } else if (currentScrollY > 80 && currentScrollY > lastScrollY.current) {
        setHeaderHidden(true);
      }

      setScrolled(currentScrollY > 0 && currentScrollY < lastScrollY.current);

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleHomeClick = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const handleMenuCollectionClick = (categoryName) => {
    setMenuOpen(false);
    setCollectionsExpanded(false);
    navigate(`/collections?category=${encodeURIComponent(categoryName)}`);
  };

  const handleMenuLinkClick = (path) => {
    setMenuOpen(false);
    setCollectionsExpanded(false);
    navigate(path);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ease-in-out ${
          headerHidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "bg-white shadow-sm" : "bg-transparent"}`}
      >
        <div className="relative flex w-full items-center justify-between px-3 py-3 sm:px-6 sm:py-4">

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex cursor-pointer items-center gap-1.5 text-[#2C2B28] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] sm:gap-2"
          >
            <Menu size={24} strokeWidth={1.5} />
            <span className="hidden text-sm uppercase tracking-[0.18em] min-[430px]:inline">
              Menu
            </span>
          </button>

          <Link
            to="/"
            onClick={handleHomeClick}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
            aria-label="KAMARI home"
          >
            <img
              src="/Kamari-logo.png"
              alt="KAMARI"
              className="h-8 w-auto max-w-[148px] object-contain mix-blend-multiply contrast-125 min-[430px]:h-10 min-[430px]:max-w-[190px] sm:h-16 sm:max-w-none"
            />
          </Link>

          <div className="flex items-center gap-2 text-[#2C2B28] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] min-[430px]:gap-3 sm:gap-5">
            <Search size={20} strokeWidth={1.5} className="hidden cursor-pointer min-[430px]:block" />
            {customer ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-1.5 text-[#2C2B28]"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2C2B28] text-[11px] font-semibold text-white sm:h-8 sm:w-8 sm:text-xs">
                    {customer.firstName?.[0]?.toUpperCase() || customer.email?.[0]?.toUpperCase()}
                  </div>
                  <ChevronDown size={14} strokeWidth={1.5} className={`transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-10 w-52 bg-white border border-[#d7c9b8] rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-[#d7c9b8]">
                      <p className="text-sm font-semibold text-[#2c2b28]">
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p className="text-xs text-[#8f8376] truncate mt-0.5">{customer.email}</p>
                    </div>

                    {customer.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setAccountOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#2c2b28] hover:bg-[#eae0d6] transition"
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
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#2c2b28] hover:bg-[#eae0d6] transition"
                        >
                          <User size={15} />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setAccountOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#2c2b28] hover:bg-[#eae0d6] transition"
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
                <User size={20} strokeWidth={1.5} />
              </Link>
            )}
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open cart"
              className="relative cursor-pointer"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#2C2B28] text-[9px] text-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* ── Nav Drawer ───────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="nav-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setMenuOpen(false);
                setCollectionsExpanded(false);
              }}
            />
            <motion.div
              className="nav-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <button
                className="nav-drawer-close"
                aria-label="Close menu"
                onClick={() => {
                  setMenuOpen(false);
                  setCollectionsExpanded(false);
                }}
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              <nav className="nav-drawer-links">
                <button className="nav-drawer-link" onClick={() => handleMenuLinkClick("/shop")}>
                  Shop
                </button>

                <button
                  className="nav-drawer-link nav-drawer-link-toggle"
                  onClick={() => setCollectionsExpanded((v) => !v)}
                >
                  Collections
                  <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    className={`transition-transform ${collectionsExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {collectionsExpanded && (
                  <div className="nav-drawer-sublinks">
                    <button
                      className="nav-drawer-sublink"
                      onClick={() => handleMenuLinkClick("/collections")}
                    >
                      All Collections
                    </button>
                    {collections.map((col) => (
                      <button
                        key={col._id}
                        className="nav-drawer-sublink"
                        onClick={() => handleMenuCollectionClick(col.name)}
                      >
                        {col.name}
                      </button>
                    ))}
                    <button
                      className="nav-drawer-sublink"
                      onClick={() => handleMenuLinkClick("/collections?sort=newest")}
                    >
                      New Arrivals
                    </button>
                    <button
                      className="nav-drawer-sublink"
                      onClick={() => handleMenuLinkClick("/collections?sort=best-selling")}
                    >
                      Best Sellers
                    </button>
                  </div>
                )}

                <button className="nav-drawer-link" onClick={() => handleMenuLinkClick("/about")}>
                  About
                </button>
                <button className="nav-drawer-link" onClick={() => handleMenuLinkClick("/contact")}>
                  Contact
                </button>
              </nav>
            </motion.div>
          </>
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
