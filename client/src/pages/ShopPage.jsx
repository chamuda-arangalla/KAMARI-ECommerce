import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts } from "../services/productApi";
import { useCart } from "../context/CartContext";
import "../styles/ShopPage.css";

const fallbackImage =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&q=80";

const getImages = (product) =>
  product.colors?.flatMap((color) => color.images || []) || [];

const hasStock = (product) =>
  product.colors?.some((color) =>
    color.sizes?.some((size) => Number(size.stock || 0) > 0),
  );

const getFirstAvailableVariant = (product) => {
  const color =
    product.colors?.find((item) =>
      item.sizes?.some((size) => Number(size.stock || 0) > 0),
    ) || product.colors?.[0];
  const size =
    color?.sizes?.find((item) => Number(item.stock || 0) > 0) ||
    color?.sizes?.[0];

  return {
    colorName: color?.colorName || "Default",
    size: size?.size || "One Size",
  };
};

const ShopPage = () => {
  const navigate = useNavigate();
  const { handleAddItem } = useCart();
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("new");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();
        setProducts(response.data || []);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const visibleProducts = useMemo(() => {
    const filtered =
      activeTab === "best"
        ? products.filter((product) => product.isFeatured)
        : products.filter((product) => product.isNewArrival);

    return filtered.length ? filtered : products;
  }, [activeTab, products]);

  const paginatedProducts = visibleProducts.slice(page * 4, page * 4 + 4);
  const canGoBack = page > 0;
  const canGoNext = page * 4 + 4 < visibleProducts.length;

  useEffect(() => {
    setPage(0);
  }, [activeTab]);

  const quickAdd = (product, selectedColor) => {
    if (!hasStock(product)) return;

    const images = selectedColor?.images?.length
      ? selectedColor.images
      : getImages(product);
    const variant = selectedColor
      ? {
          colorName: selectedColor.colorName || "Default",
          size:
            selectedColor.sizes?.find((item) => Number(item.stock || 0) > 0)
              ?.size ||
            selectedColor.sizes?.[0]?.size ||
            "One Size",
        }
      : getFirstAvailableVariant(product);

    handleAddItem({
      id: `${product._id}-${variant.colorName}-${variant.size}`,
      productId: product._id,
      name: product.name,
      variant: variant.colorName,
      size: variant.size,
      price: Number(product.price || 0),
      img: images[0]?.url || fallbackImage,
    });
  };

  return (
    <main className="shop-page">
      <section className="shop-tabs" aria-label="Product filters">
        <button
          className={`shop-tab ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          New Arrivals
        </button>
        <button
          className={`shop-tab ${activeTab === "best" ? "active" : ""}`}
          onClick={() => setActiveTab("best")}
        >
          Best Sellers
        </button>
      </section>

      <section className="shop-carousel-wrap">
        <button
          className="shop-arrow left"
          disabled={!canGoBack}
          onClick={() => setPage((value) => Math.max(0, value - 1))}
          aria-label="Previous products"
        >
          <ChevronLeft size={18} />
        </button>

        {loading ? (
          <p className="shop-message">Loading products...</p>
        ) : error ? (
          <p className="shop-message">{error}</p>
        ) : paginatedProducts.length === 0 ? (
          <p className="shop-message">No products available yet.</p>
        ) : (
          <div className="shop-product-grid">
            {paginatedProducts.map((product) => (
              <ShopProductCard
                key={product._id}
                product={product}
                onQuickAdd={(selectedColor) => quickAdd(product, selectedColor)}
                onOpen={() => navigate(`/products/${product._id}`)}
              />
            ))}
          </div>
        )}

        <button
          className="shop-arrow right"
          disabled={!canGoNext}
          onClick={() => setPage((value) => value + 1)}
          aria-label="Next products"
        >
          <ChevronRight size={18} />
        </button>
      </section>
    </main>
  );
};

const ShopProductCard = ({ product, onQuickAdd, onOpen }) => {
  const images = getImages(product);
  const colors = product.colors || [];
  const inStock = hasStock(product);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const displayImages = colors[activeColorIndex]?.images?.length
    ? colors[activeColorIndex].images
    : images;
  const displayImage = displayImages[activeImageIndex]?.url || fallbackImage;

  useEffect(() => {
    setActiveColorIndex(0);
    setActiveImageIndex(0);
  }, [product._id]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeColorIndex]);

  const startImageRotation = () => {
    if (displayImages.length <= 1 && colors.length <= 1) return undefined;

    return window.setInterval(() => {
      setActiveImageIndex((currentImageIndex) => {
        const nextImageIndex = currentImageIndex + 1;

        if (nextImageIndex < displayImages.length) {
          return nextImageIndex;
        }

        setActiveColorIndex((currentColorIndex) =>
          colors.length ? (currentColorIndex + 1) % colors.length : 0,
        );
        return 0;
      });
    }, 3000);
  };

  return (
    <article className="shop-product-card">
      <div
        className="shop-product-image-wrap"
        onClick={onOpen}
        onMouseEnter={(event) => {
          const intervalId = startImageRotation();
          if (intervalId) event.currentTarget.dataset.intervalId = intervalId;
        }}
        onMouseLeave={(event) => {
          const intervalId = Number(event.currentTarget.dataset.intervalId);
          if (intervalId) window.clearInterval(intervalId);
          delete event.currentTarget.dataset.intervalId;
        }}
      >
        <img
          src={displayImage}
          alt={product.name}
          className="shop-product-image"
        />
        {inStock ? (
          <button
            className="shop-quick-add"
            onClick={(event) => {
              event.stopPropagation();
              onQuickAdd(colors[activeColorIndex]);
            }}
          >
            Quick Add
          </button>
        ) : (
          <span className="shop-sold-out">Sold Out</span>
        )}
      </div>

      <div className="shop-product-info">
        <button type="button" className="shop-product-name" onClick={onOpen}>
          {product.name}
        </button>
        <p className="shop-product-price">
          Rs {Number(product.price || 0).toLocaleString()}
        </p>
        <p className="shop-product-payments">
          Koko <span>or</span> Mintpay
        </p>
        <p className="shop-color-count">
          {colors.length} {colors.length === 1 ? "color" : "colors"} available
        </p>
        <div className="shop-swatches">
          {colors.slice(0, 4).map((color) => (
            <button
              key={color._id || color.colorName}
              type="button"
              className={`shop-swatch ${colors[activeColorIndex] === color ? "active" : ""}`}
              style={{ backgroundColor: color.colorCode || "#f8f5f2" }}
              title={color.colorName}
              aria-label={`View ${color.colorName}`}
              onClick={() => setActiveColorIndex(colors.indexOf(color))}
            />
          ))}
        </div>
      </div>
    </article>
  );
};

export default ShopPage;
