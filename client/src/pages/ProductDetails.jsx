import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronRight, Minus, Plus, ShoppingBag, Zap, Package, RotateCcw, Shield } from "lucide-react";
import { getProductById, getProducts } from "../services/productApi";
import { useCart } from "../context/useCart";
import "../styles/ProductDetails.css";

const FALLBACK = "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80";

const getImages  = (product) => product?.colors?.flatMap((c) => c.images || []) || [];
const hasStock   = (size)    => Number(size?.stock || 0) > 0;
const stockCount = (product) =>
  product?.colors?.reduce((t, c) => t + (c.sizes?.reduce((s, sz) => s + Number(sz.stock || 0), 0) || 0), 0) || 0;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleAddItem } = useCart();

  const [product, setProduct]               = useState(null);
  const [related, setRelated]               = useState([]);
  const [selColorIdx, setSelColorIdx]       = useState(0);
  const [selSize, setSelSize]               = useState("");
  const [qty, setQty]                       = useState(1);
  const [mainIdx, setMainIdx]               = useState(0);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const [addedMsg, setAddedMsg]             = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [prodRes, allRes] = await Promise.all([getProductById(id), getProducts()]);
        const loaded = prodRes.data;
        setProduct(loaded);
        setRelated(
          (allRes.data || [])
            .filter((p) => p._id !== loaded._id && (p.setName || p.collection) === (loaded.setName || loaded.collection))
            .slice(0, 4),
        );
        setSelColorIdx(0);
        setSelSize(loaded.colors?.[0]?.sizes?.find(hasStock)?.size || loaded.colors?.[0]?.sizes?.[0]?.size || "");
        setQty(1);
        setMainIdx(0);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const selColor   = product?.colors?.[selColorIdx];
  const images     = useMemo(() => {
    const ci = selColor?.images || [];
    return ci.length ? ci : getImages(product);
  }, [product, selColor]);
  const mainImages = images.length ? images : [{ url: FALLBACK }];

  const selSizeItem  = selColor?.sizes?.find((s) => s.size === selSize);
  const selStock     = Number(selSizeItem?.stock || 0);
  const inStock      = !product?.isSoldOut && stockCount(product) > 0;

  const colorSoldOut = (c) => c.sizes?.every((s) => Number(s.stock || 0) === 0);

  const selectColor = (i) => {
    setSelColorIdx(i);
    setMainIdx(0);
    setQty(1);
    const c = product.colors[i];
    setSelSize(c.sizes?.find(hasStock)?.size || c.sizes?.[0]?.size || "");
  };

  const addToCart = () => {
    if (!product || !selColor || !selSize || !selStock) return;
    handleAddItem({
      id: `${product._id}-${selColor.colorName}-${selSize}`,
      productId: product._id,
      name: product.name,
      variant: selColor.colorName,
      size: selSize,
      price: Number(product.price || 0),
      qty,
      img: mainImages[0]?.url || FALLBACK,
    });
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2500);
  };

  const buyNow = () => { addToCart(); navigate("/checkout"); };

  if (loading) {
    return (
      <main className="pd-page">
        <div className="pd-loading"><div className="pd-spinner" /><p>Loading product...</p></div>
      </main>
    );
  }
  if (error || !product) {
    return (
      <main className="pd-page">
        <div className="pd-loading">
          <p className="pd-error">{error || "Product not found"}</p>
          <button className="pd-back-btn" onClick={() => navigate(-1)}>← Go Back</button>
        </div>
      </main>
    );
  }

  const totalSt = stockCount(product);

  return (
    <main className="pd-page">

      {/* Breadcrumb */}
      <nav className="pd-breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={13} />
        <Link to="/shop">Shop</Link>
        <ChevronRight size={13} />
        <Link to={`/collections?category=${encodeURIComponent(product.setName || product.collection)}`}>
          {product.setName || product.collection}
        </Link>
        <ChevronRight size={13} />
        <span>{product.name}</span>
      </nav>

      {/* ── 3-column grid: thumbs | image | panel ── */}
      <div className="pd-container">

        {/* Thumbnail strip */}
        <div className="pd-thumbs">
          {mainImages.map((img, i) => (
            <button
              key={img.publicId || img.url || i}
              className={`pd-thumb ${i === mainIdx ? "active" : ""}`}
              onClick={() => setMainIdx(i)}
            >
              <img src={img.url || FALLBACK} alt={`${product.name} view ${i + 1}`} />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className="pd-main-img-wrap">
          <img
            src={mainImages[mainIdx]?.url || FALLBACK}
            alt={product.name}
            className="pd-main-img"
          />
          {!inStock && (
            <div className="pd-sold-out-overlay"><span>Sold Out</span></div>
          )}
          {product.isNewArrival && inStock && <span className="pd-badge new">New Arrival</span>}
          {product.isFeatured  && inStock && <span className="pd-badge best">Best Seller</span>}
        </div>

        {/* Product panel */}
        <aside className="pd-panel">

          <p
            className="pd-collection"
            onClick={() => navigate(`/collections?category=${encodeURIComponent(product.setName || product.collection)}`)}
          >
            {product.setName || product.collection}
          </p>

          <h1 className="pd-title">{product.name}</h1>

          <div className="pd-divider" />

          {/* Price */}
          <div className="pd-price-wrap">
            <p className="pd-price">
              LKR {Number(product.price || 0).toLocaleString()}
            </p>
            <p className="pd-installment">
              or 3 × LKR {Math.round(Number(product.price || 0) / 3).toLocaleString()} with Koko / Mintpay
            </p>
          </div>

          {/* Stock */}
          <p className={`pd-stock-badge ${!inStock ? "out" : totalSt <= 10 ? "low" : "in"}`}>
            {!inStock ? "Currently unavailable" : totalSt <= 10 ? `Only ${totalSt} left in stock — order soon` : "In Stock"}
          </p>

          <div className="pd-divider" />

          {/* Colour */}
          <div className="pd-option">
            <div className="pd-option-label">
              <span>Colour:</span>
              <strong>{selColor?.colorName}</strong>
            </div>
            <div className="pd-swatches">
              {product.colors?.map((c, i) => (
                <button
                  key={c._id || c.colorName}
                  type="button"
                  title={colorSoldOut(c) ? `${c.colorName} — Sold Out` : c.colorName}
                  className={`pd-swatch ${selColorIdx === i ? "active" : ""} ${colorSoldOut(c) ? "sold-out" : ""}`}
                  style={{ backgroundColor: c.colorCode || "#ccc" }}
                  onClick={() => !colorSoldOut(c) && selectColor(i)}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="pd-option">
            <div className="pd-option-label">
              <span>Size:</span>
              {selStock > 0 && selStock <= 3 && (
                <strong className="pd-low-stock-warn">Only {selStock} left!</strong>
              )}
            </div>
            <div className="pd-sizes">
              {selColor?.sizes?.map((s) => (
                <button
                  key={s.size}
                  type="button"
                  disabled={!hasStock(s)}
                  className={`pd-size-btn ${selSize === s.size ? "active" : ""}`}
                  onClick={() => { setSelSize(s.size); setQty(1); }}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          {inStock && selStock > 0 && (
            <div className="pd-option">
              <div className="pd-option-label"><span>Quantity:</span></div>
              <div className="pd-qty">
                <button type="button" onClick={() => setQty((v) => Math.max(1, v - 1))} disabled={qty <= 1}>
                  <Minus size={14} />
                </button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty((v) => Math.min(selStock, v + 1))} disabled={qty >= selStock}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="pd-divider" />

          {/* CTA */}
          <div className="pd-cta">
            <button
              type="button"
              className={`pd-add-btn ${addedMsg ? "added" : ""}`}
              disabled={!selStock || !inStock}
              onClick={addToCart}
            >
              <ShoppingBag size={16} />
              {addedMsg ? "Added to Bag ✓" : "Add to Cart"}
            </button>
            <button
              type="button"
              className="pd-buy-btn"
              disabled={!selStock || !inStock}
              onClick={buyNow}
            >
              <Zap size={16} />
              Buy Now
            </button>
          </div>

          {/* Trust */}
          <div className="pd-trust">
            <div className="pd-trust-item"><Package  size={15} /><span>Free delivery island-wide over LKR 5,000</span></div>
            <div className="pd-trust-item"><RotateCcw size={15} /><span>Easy 7-day exchange policy</span></div>
            <div className="pd-trust-item"><Shield   size={15} /><span>Secure & encrypted checkout</span></div>
          </div>

        </aside>
      </div>

      {/* ── Product details below ── */}
      <div className="pd-details">
        <div className="pd-details-main">
          <h2>Product Details</h2>

          <details className="pd-accordion" open>
            <summary>Description</summary>
            <div className="pd-accordion-body">
              <p>{product.description || "No description available."}</p>
            </div>
          </details>

          <details className="pd-accordion">
            <summary>Fabric & Design</summary>
            <div className="pd-accordion-body">
              {product.fabric  && <p><strong>Fabric: </strong>{product.fabric}</p>}
              {product.design  && <p><strong>Design: </strong>{product.design}</p>}
            </div>
          </details>

          <details className="pd-accordion">
            <summary>Care Instructions</summary>
            <div className="pd-accordion-body">
              <p>{product.productCare || "Follow standard garment care."}</p>
            </div>
          </details>

          <details className="pd-accordion">
            <summary>Returns & Exchanges</summary>
            <div className="pd-accordion-body">
              <p>Exchange requests are accepted within 7 days of delivery. Items must be unworn, unwashed and in original condition. Contact our support team to initiate an exchange.</p>
            </div>
          </details>
        </div>
      </div>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <div className="pd-related">
          <div className="pd-related-box">
            <h2 className="pd-related-title">Customers Also Viewed</h2>
            <div className="pd-related-grid">
              {related.map((item) => (
                <RelatedCard key={item._id} product={item} onClick={() => navigate(`/products/${item._id}`)} />
              ))}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

function RelatedCard({ product, onClick }) {
  const images  = getImages(product);
  const img1    = images[0]?.url || FALLBACK;
  const img2    = images[1]?.url || img1;
  const inStock = !product.isSoldOut && (product.colors?.some((c) => c.sizes?.some((s) => Number(s.stock || 0) > 0)));

  return (
    <button type="button" className="pd-related-card" onClick={onClick}>
      <div className="pd-related-img-wrap">
        <img src={img1} alt={product.name} className="pd-related-img front" />
        <img src={img2} alt={product.name} className="pd-related-img back" />
        {!inStock && <span className="pd-related-sold-out">Sold Out</span>}
      </div>
      <div className="pd-related-info">
        <p className="pd-related-collection">{product.setName || product.collection}</p>
        <p className="pd-related-name">{product.name}</p>
        <p className="pd-related-price">LKR {Number(product.price || 0).toLocaleString()}</p>
      </div>
    </button>
  );
}
