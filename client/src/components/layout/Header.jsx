import { useMemo, useRef, useState, useEffect } from "react";
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
import {
  clearCustomerSession,
  getCustomerUser,
} from "../../utils/customerSession";

const Header = () => {
  const { totalItems, setIsDrawerOpen, clearCart } = useCart();
  const [collections, setCollections] = useState([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchProducts, setSearchProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [collectionsExpanded, setCollectionsExpanded] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [customer, setCustomer] = useState(() => {
    const stored = getCustomerUser();
    const adminStored = localStorage.getItem("adminUser");
    return stored || (adminStored ? JSON.parse(adminStored) : null);
  });
  const accountRef = useRef(null);
  const headerRef = useRef(null);
  const searchInputRef = useRef(null);
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
      const stored = getCustomerUser();
      const adminStored = localStorage.getItem("adminUser");
      setCustomer(stored || (adminStored ? JSON.parse(adminStored) : null));
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("kamari:user-updated", handleUserUpdate);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("kamari:user-updated", handleUserUpdate);
    };
  }, []);

  useEffect(() => {
    if (!searchOpen) return undefined;

    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 100);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSearchOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen || searchProducts.length > 0 || searchLoading) return;

    const loadSearchProducts = async () => {
      try {
        setSearchLoading(true);
        setSearchError("");
        const response = await getProducts();
        setSearchProducts(response.data || []);
      } catch (error) {
        setSearchError(error.response?.data?.message || "Unable to load products");
      } finally {
        setSearchLoading(false);
      }
    };

    loadSearchProducts();
  }, [searchLoading, searchOpen, searchProducts.length]);

  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];

    return searchProducts
      .filter((product) =>
        [product.name, product.collection, product.setName]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query)),
      )
      .slice(0, 8);
  }, [searchProducts, searchTerm]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
    } finally {
      clearCustomerSession();
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      clearCart();
      window.dispatchEvent(new Event("kamari:user-updated"));
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

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchTerm("");
  };

  const openSearchProduct = (productId) => {
    closeSearch();
    navigate(`/products/${productId}`);
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
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="flex cursor-pointer items-center justify-center"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
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

      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close search"
              className="fixed inset-0 z-[70] bg-[#2c2b28]/35 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSearch}
            />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label="Search products"
              className="fixed inset-x-0 top-0 z-[71] max-h-[85vh] overflow-y-auto bg-[#fcfaf7] shadow-2xl"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 sm:py-9">
                <div className="flex items-center gap-3 border-b border-[#b8a99f] pb-3">
                  <Search size={22} className="shrink-0 text-[#5f564d]" />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search products or collections"
                    className="min-w-0 flex-1 bg-transparent text-lg text-[#2c2b28] outline-none placeholder:text-[#9c9087] sm:text-2xl"
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    aria-label="Close search"
                    className="rounded-full p-2 text-[#5f564d] transition hover:bg-[#eae0d6]"
                  >
                    <X size={22} />
                  </button>
                </div>

                <div className="pt-5">
                  {searchLoading && (
                    <p className="py-8 text-center text-sm text-[#8f8376]">Loading products...</p>
                  )}
                  {!searchLoading && searchError && (
                    <p className="py-8 text-center text-sm text-rose-600">{searchError}</p>
                  )}
                  {!searchLoading && !searchError && !searchTerm.trim() && (
                    <p className="py-8 text-center text-sm text-[#8f8376]">
                      Start typing to find a product.
                    </p>
                  )}
                  {!searchLoading && !searchError && searchTerm.trim() && searchResults.length === 0 && (
                    <p className="py-8 text-center text-sm text-[#8f8376]">
                      No products found for &quot;{searchTerm.trim()}&quot;.
                    </p>
                  )}
                  {!searchLoading && searchResults.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {searchResults.map((product) => (
                        <button
                          key={product._id}
                          type="button"
                          onClick={() => openSearchProduct(product._id)}
                          className="flex items-center gap-4 rounded-xl p-3 text-left transition hover:bg-[#eae0d6]"
                        >
                          <img
                            src={getProductImages(product)[0]?.url || "/Kamari-logo.png"}
                            alt=""
                            className="h-16 w-14 shrink-0 rounded-lg border border-[#d7c9b8] bg-white object-cover"
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-base font-semibold text-[#2c2b28]">
                              {product.name}
                            </span>
                            <span className="mt-1 block truncate text-sm text-[#8f8376]">
                              {product.setName || product.collection}
                            </span>
                            <span className="mt-1 block text-sm font-medium text-[#5f564d]">
                              LKR {Number(product.price || 0).toLocaleString()}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.section>
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
