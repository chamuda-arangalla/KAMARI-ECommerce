import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import ShopCard from "../components/shop/ShopCard";
import { getProducts } from "../services/productApi";
import { useCart } from "../context/useCart";
import {
  getFirstAvailableVariant,
  getProductImages,
  isProductInStock,
  SHOP_IMAGE_FALLBACK,
} from "../utils/shopProduct";
import "../styles/ShopPage.css";

const PER_PAGE = 8;

export default function ShopPage() {
  const navigate = useNavigate();
  const { handleAddItem } = useCart();

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [tab, setTab]               = useState("all");       // all | new | best
  const [collection, setCollection] = useState("All");
  const [sort, setSort]             = useState("featured");
  const [page, setPage]             = useState(1);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getProducts();
        setProducts(res.data || []);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const collections = useMemo(
    () => ["All", ...new Set(products.map((p) => p.setName || p.collection).filter(Boolean))],
    [products],
  );

  const filtered = useMemo(() => {
    let list = [...products];
    if (tab === "new")  list = list.filter((p) => p.isNewArrival);
    if (tab === "best") list = list.filter((p) => p.isFeatured);
    if (collection !== "All") list = list.filter((p) => (p.setName || p.collection) === collection);
    if (sort === "price-asc")  list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name-asc")   list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "newest")     list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    return list;
  }, [products, tab, collection, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const heroTiles = useMemo(() => {
    const source = products.filter((p) => p.isNewArrival);
    const featured = (source.length ? source : products).slice(0, 4);
    return Array.from({ length: 4 }, (_, i) => featured[i] || null);
  }, [products]);

  const handleTabChange = (t) => { setTab(t); setPage(1); };
  const handleCollectionChange = (c) => { setCollection(c); setPage(1); };
  const handleSortChange = (s) => { setSort(s); setPage(1); };

  const quickAdd = (product, color) => {
    if (!isProductInStock(product)) return;
    const imgs = color?.images?.length ? color.images : getProductImages(product);
    const variant = color
      ? { colorName: color.colorName, size: color.sizes?.find((s) => Number(s.stock || 0) > 0)?.size || color.sizes?.[0]?.size || "S" }
      : getFirstAvailableVariant(product);
    handleAddItem({
      id: `${product._id}-${variant.colorName}-${variant.size}`,
      productId: product._id,
      name: product.name,
      variant: variant.colorName,
      size: variant.size,
      price: Number(product.price || 0),
      qty: 1,
      img: imgs[0]?.url || SHOP_IMAGE_FALLBACK,
    });
  };

  return (
    <main className="shop-page">

      {/* ── Page Header ──────────────────────────────── */}
      <section className="shop-hero" aria-label="New arrivals">
        {heroTiles.map((product, index) => {
          const images = product ? getProductImages(product) : [];
          const img = images[index % Math.max(images.length, 1)]?.url || images[0]?.url || SHOP_IMAGE_FALLBACK;
          return (
            <button
              type="button"
              key={product?._id || `hero-${index}`}
              className="shop-hero-tile"
              onClick={() => (product ? navigate(`/products/${product._id}`) : handleTabChange("new"))}
            >
              <img src={img} alt={product?.name || "New arrival"} />
              {index === 0 && (
                <span className="shop-hero-copy">
                  <span className="shop-hero-title">New Arrival</span>
                  <span className="shop-hero-link">View All</span>
                </span>
              )}
            </button>
          );
        })}
      </section>

      {/* ── Tabs + Controls ──────────────────────────── */}
      <div className="shop-controls">
        {/* Tabs */}
        <div className="shop-tabs">
          {[["all","All"], ["new","New Arrivals"], ["best","Best Sellers"]].map(([key, label]) => (
            <button
              key={key}
              className={`shop-tab ${tab === key ? "active" : ""}`}
              onClick={() => handleTabChange(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="shop-controls-right">
          <span className="shop-count">
            {loading ? "Loading..." : `${filtered.length} ${filtered.length === 1 ? "product" : "products"}`}
          </span>

          {/* Collection filter */}
          <select
            className="shop-select"
            value={collection}
            onChange={(e) => handleCollectionChange(e.target.value)}
          >
            {collections.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            className="shop-select"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="newest">New Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Active collection pill */}
      {collection !== "All" && (
        <div className="shop-active-filter">
          <span>Collection: <strong>{collection}</strong></span>
          <button onClick={() => handleCollectionChange("All")}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Product Grid ─────────────────────────────── */}
      {loading ? (
        <div className="shop-state">
          <div className="shop-spinner" />
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="shop-state">
          <p className="shop-error">{error}</p>
        </div>
      ) : paginated.length === 0 ? (
        <div className="shop-state">
          <p className="shop-empty-title">No products found</p>
          <p className="shop-empty-sub">Try selecting a different tab or collection.</p>
          <button className="shop-reset-btn" onClick={() => { setTab("all"); handleCollectionChange("All"); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="shop-grid">
          {paginated.map((product) => (
            <ShopCard
              key={product._id}
              product={product}
              onOpen={() => navigate(`/products/${product._id}`)}
              onQuickAdd={(color) => quickAdd(product, color)}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ───────────────────────────────── */}
      {totalPages > 1 && (
        <div className="shop-pagination">
          <button
            className="shop-page-btn"
            disabled={page === 1}
            onClick={() => { setPage((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`shop-page-btn ${p === page ? "active" : ""}`}
              onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            >
              {p}
            </button>
          ))}
          <button
            className="shop-page-btn"
            disabled={page === totalPages}
            onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}

