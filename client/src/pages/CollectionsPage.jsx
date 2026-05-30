import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Grid2x2, Grid3x3 } from "lucide-react";
import { getProducts, mapBackendProductToCollectionProduct } from "../services/productApi";
import "../styles/CollectionsPage.css";

const PRODUCTS_PER_PAGE = 9;

export default function CollectionsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState("featured");
  const [cols, setCols] = useState(3);
  const [page, setPage] = useState(1);
  const [apiProducts, setApiProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductsError("");

        const response = await getProducts();
        setApiProducts(
          (response.data || []).map(mapBackendProductToCollectionProduct),
        );
      } catch (error) {
        setProductsError(
          error.response?.data?.message || "Could not load latest products",
        );
        setApiProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const products = apiProducts;

  const maxProductPrice = useMemo(() => {
    if (!products.length) return 100000;
    return Math.ceil(Math.max(...products.map((p) => p.price || 0)) / 1000) * 1000;
  }, [products]);

  useEffect(() => {
    if (!products.length) return undefined;

    const timeoutId = setTimeout(() => {
      setMaxPrice(maxProductPrice);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [maxProductPrice, products.length]);

  const categoryOptions = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category).filter(Boolean))],
    [products],
  );
  const colorOptions = useMemo(() => {
    const uniqueColors = new Map();
    products.flatMap((product) => product.colors || []).forEach((color) => {
      if (color.name && !uniqueColors.has(color.name)) {
        uniqueColors.set(color.name, color);
      }
    });
    return [...uniqueColors.values()];
  }, [products]);

  const sizeOptions = useMemo(() => {
    const ORDER = ["Free Size", "XS", "S", "M", "L", "XL", "XXL"];
    const seen = new Set();
    products.flatMap((p) => p.sizes || []).forEach((s) => seen.add(s));
    return [...seen].sort((a, b) => {
      const ai = ORDER.indexOf(a);
      const bi = ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [products]);

  // Read category/sort from URL params set by the header dropdown
  useEffect(() => {
    const cat = searchParams.get("category");
    const sort = searchParams.get("sort");

    const timeoutId = setTimeout(() => {
      if (cat) {
        setCategory(cat);
        setPage(1);
      }
      if (sort) {
        setSortBy(sort);
        setPage(1);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  const toggleSize = (s) =>
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const toggleColor = (c) =>
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const clearFilters = () => {
    setCategory("All");
    setSelectedSizes([]);
    setSelectedColors([]);
    setInStockOnly(false);
    setMaxPrice(maxProductPrice);
    setSortBy("featured");
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "All") list = list.filter((p) => p.category === category);
    if (inStockOnly) list = list.filter((p) => p.inStock);
    if (selectedSizes.length) list = list.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    if (selectedColors.length) list = list.filter((p) => p.colors.some((c) => selectedColors.includes(c.name)));
    list = list.filter((p) => p.price <= maxPrice);

    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "newest") list.sort((a, b) => (b.badge === "NEW") - (a.badge === "NEW"));
    else if (sortBy === "best-selling") list.sort((a, b) => (b.badge === "BEST SELLER") - (a.badge === "BEST SELLER"));

    return list;
  }, [products, category, inStockOnly, selectedSizes, selectedColors, maxPrice, sortBy]);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="collections-page">

      {/* Page Header */}
      <div className="collections-header">
        <h1 className="collections-header-title">All Collections</h1>
        <p className="collections-header-sub">
          Curated pieces for the modern woman — designed to be worn, lived in, and loved.
        </p>
      </div>

      <div className="collections-body">

        {/* ── Sidebar ─────────────────────────────── */}
        <aside className="collections-sidebar">

          {/* Category */}
          <div className="filter-section">
            <p className="filter-title">Category</p>
            <div className="filter-category-list">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  className={`filter-category-btn ${category === cat ? "active" : ""}`}
                  onClick={() => { setCategory(cat); setPage(1); }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock */}
          <div className="filter-section">
            <div className="filter-toggle">
              <span className="filter-toggle-label">In stock only</span>
              <button
                className={`toggle-switch ${inStockOnly ? "on" : ""}`}
                onClick={() => { setInStockOnly((v) => !v); setPage(1); }}
                aria-label="Toggle in stock"
              >
                <span className="toggle-knob" />
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="filter-section">
            <p className="filter-title">Price</p>
            <div className="filter-price-range">
              <input
                type="range"
                className="price-range-slider"
                min={0}
                max={maxProductPrice}
                step={1000}
                value={Math.min(maxPrice, maxProductPrice)}
                onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }}
              />
              <div className="price-range-values">
                <span>LKR 0</span>
                <span>Up to LKR {Math.min(maxPrice, maxProductPrice).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Size */}
          <div className="filter-section">
            <p className="filter-title">Size</p>
            <div className="filter-sizes">
              {sizeOptions.map((s) => (
                <button
                  key={s}
                  className={`filter-size-btn ${selectedSizes.includes(s) ? "active" : ""}`}
                  onClick={() => { toggleSize(s); setPage(1); }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="filter-section">
            <p className="filter-title">Color</p>
            <div className="filter-colors">
              {colorOptions.map((c) => (
                <button
                  key={c.name}
                  className={`filter-color-btn ${selectedColors.includes(c.name) ? "active" : ""}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  onClick={() => { toggleColor(c.name); setPage(1); }}
                />
              ))}
            </div>
          </div>

          {/* Clear */}
          <button className="filter-clear-btn" onClick={clearFilters}>
            Clear all filters
          </button>

        </aside>

        {/* ── Main ───────────────────────────────── */}
        <main className="collections-main">

          {/* Top bar */}
          <div className="collections-topbar">
            <span className="collections-count">
              {loadingProducts
                ? ""
                : `${filtered.length} ${filtered.length === 1 ? "product" : "products"}`}
            </span>

            <div className="collections-topbar-right">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best Selling</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical</option>
              </select>

              <button
                className={`grid-toggle-btn ${cols === 2 ? "active" : ""}`}
                onClick={() => setCols(2)}
                title="2 columns"
              >
                <Grid2x2 size={16} />
              </button>
              <button
                className={`grid-toggle-btn ${cols === 3 ? "active" : ""}`}
                onClick={() => setCols(3)}
                title="3 columns"
              >
                <Grid3x3 size={16} />
              </button>
            </div>
          </div>

          {productsError && (
            <div className="collections-empty" style={{ marginBottom: "24px" }}>
              <p className="collections-empty-title">Products unavailable</p>
              <p className="collections-empty-sub">{productsError}</p>
            </div>
          )}

          {/* Grid */}
          {loadingProducts ? (
            <div className={`product-grid cols-${cols}`}>
              {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="collections-empty">
              <p className="collections-empty-title">No products found</p>
              <p className="collections-empty-sub">Try adjusting your filters.</p>
              <button className="filter-clear-btn" onClick={clearFilters}>Clear all filters</button>
            </div>
          ) : (
            <div className={`product-grid cols-${cols}`}>
              {paginated.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={() => navigate(`/products/${product.id}`)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="collections-pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`pagination-btn ${p === page ? "active" : ""}`}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </button>
              ))}

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                ›
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="product-card product-card-skeleton">
      <div className="product-card-img-wrap">
        <div className="skeleton skeleton-img" />
      </div>
      <div className="product-card-info">
        <div className="skeleton skeleton-text short" />
        <div className="skeleton skeleton-text medium" />
        <div className="skeleton-colors">
          <div className="skeleton skeleton-dot" />
          <div className="skeleton skeleton-dot" />
          <div className="skeleton skeleton-dot" />
        </div>
        <div className="skeleton skeleton-text short" />
        <div className="skeleton skeleton-text medium" />
      </div>
    </div>
  );
}

function ProductCard({ product, onOpen }) {
  const [hoveredColorIndex, setHoveredColorIndex] = useState(null);
  const installment = Math.round(product.price / 3).toLocaleString();

  const activeColor = hoveredColorIndex !== null ? product.colors[hoveredColorIndex] : null;
  const frontImg = activeColor?.img || product.img;
  const backImg = activeColor?.img2 || product.img2;

  const handleColorEnter = useCallback((e, i) => {
    e.stopPropagation();
    setHoveredColorIndex(i);
  }, []);

  const handleColorLeave = useCallback((e) => {
    e.stopPropagation();
    setHoveredColorIndex(null);
  }, []);

  return (
    <div className="product-card" onClick={onOpen}>
      <div className="product-card-img-wrap">

        {/* Images */}
        <img src={frontImg} alt={product.name} className="product-card-img front" />
        <img src={backImg} alt={product.name} className="product-card-img back" />

        {/* Badge */}
        {product.badge && product.inStock && (
          <span className={`product-badge ${product.badge === "BEST SELLER" ? "best-seller" : "new"}`}>
            {product.badge}
          </span>
        )}

        {/* Sold out */}
        {!product.inStock && (
          <div className="product-sold-out-overlay">
            <span className="product-sold-out-tag">Sold Out</span>
          </div>
        )}

        {/* Quick add */}
        {product.inStock && (
          <button className="product-quick-add" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
            View Product
          </button>
        )}
      </div>

      {/* Info */}
      <div className="product-card-info">
        {product.category && (
          <p className="product-card-category">{product.category}</p>
        )}
        <p className="product-card-name">{product.name}</p>

        <div className="product-card-colors">
          {product.colors.slice(0, 4).map((c, i) => (
            <span
              key={c.name}
              className={`product-color-dot ${hoveredColorIndex === i ? "active" : ""}`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
              onMouseEnter={(e) => handleColorEnter(e, i)}
              onMouseLeave={handleColorLeave}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="product-color-count">+{product.colors.length - 4}</span>
          )}
        </div>

        <p className="product-card-price">LKR {product.price.toLocaleString()}</p>
        <p className="product-card-installment">or 3 × LKR {installment} with Koko</p>
      </div>
    </div>
  );
}
