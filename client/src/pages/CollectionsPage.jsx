import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid2x2, Grid3x3 } from "lucide-react";
import { PRODUCTS, CATEGORIES, SIZES, COLORS } from "../data/collectionsData";
import "../styles/CollectionsPage.css";

const PRODUCTS_PER_PAGE = 9;

export default function CollectionsPage() {
  const [searchParams] = useSearchParams();

  const [category, setCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(12000);
  const [sortBy, setSortBy] = useState("featured");
  const [cols, setCols] = useState(3);
  const [page, setPage] = useState(1);

  // Read category/sort from URL params set by the header dropdown
  useEffect(() => {
    const cat = searchParams.get("category");
    const sort = searchParams.get("sort");
    if (cat && CATEGORIES.includes(cat)) { setCategory(cat); setPage(1); }
    if (sort) { setSortBy(sort); setPage(1); }
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
    setMaxPrice(12000);
    setSortBy("featured");
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

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
  }, [category, inStockOnly, selectedSizes, selectedColors, maxPrice, sortBy]);

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
              {CATEGORIES.map((cat) => (
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
                min={2000}
                max={12000}
                step={500}
                value={maxPrice}
                onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }}
              />
              <div className="price-range-values">
                <span>LKR 2,000</span>
                <span>Up to LKR {maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Size */}
          <div className="filter-section">
            <p className="filter-title">Size</p>
            <div className="filter-sizes">
              {SIZES.map((s) => (
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
              {COLORS.map((c) => (
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
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
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

          {/* Grid */}
          {paginated.length === 0 ? (
            <div className="collections-empty">
              <p className="collections-empty-title">No products found</p>
              <p className="collections-empty-sub">Try adjusting your filters.</p>
              <button className="filter-clear-btn" onClick={clearFilters}>Clear all filters</button>
            </div>
          ) : (
            <div className={`product-grid cols-${cols}`}>
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} />
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

function ProductCard({ product }) {
  const installment = Math.round(product.price / 3).toLocaleString();

  return (
    <div className="product-card">
      <div className="product-card-img-wrap">

        {/* Images */}
        <img src={product.img} alt={product.name} className="product-card-img front" />
        <img src={product.img2} alt={product.name} className="product-card-img back" />

        {/* Badge */}
        {product.badge && !product.inStock === false && (
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
          <button className="product-quick-add">Add to Bag</button>
        )}
      </div>

      {/* Info */}
      <div className="product-card-info">
        <p className="product-card-name">{product.name}</p>

        <div className="product-card-colors">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c.name}
              className="product-color-dot"
              style={{ backgroundColor: c.hex }}
              title={c.name}
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
