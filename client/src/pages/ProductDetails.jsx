import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { getProductById, getProducts } from "../services/productApi";
import { useCart } from "../context/useCart";
import "../styles/ProductDetails.css";

const fallbackImage =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80";

const getImages = (product) =>
  product?.colors?.flatMap((color) => color.images || []) || [];

const hasStock = (size) => Number(size?.stock || 0) > 0;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleAddItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const [productResponse, productsResponse] = await Promise.all([
          getProductById(id),
          getProducts(),
        ]);

        const loadedProduct = productResponse.data;
        const loadedRelated = (productsResponse.data || []).filter(
          (item) => item._id !== loadedProduct._id,
        );

        setProduct(loadedProduct);
        setRelated(loadedRelated.slice(0, 4));
        setSelectedColorIndex(0);
        setSelectedSize(
          loadedProduct.colors?.[0]?.sizes?.find(hasStock)?.size ||
            loadedProduct.colors?.[0]?.sizes?.[0]?.size ||
            "",
        );
        setQty(1);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const selectedColor = product?.colors?.[selectedColorIndex];
  const images = useMemo(() => {
    const colorImages = selectedColor?.images || [];
    return colorImages.length ? colorImages : getImages(product);
  }, [product, selectedColor]);
  const mainImages = images.length ? images : [{ url: fallbackImage }];
  const selectedSizeItem = selectedColor?.sizes?.find(
    (item) => item.size === selectedSize,
  );
  const selectedStock = Number(selectedSizeItem?.stock || 0);

  const addSelectedToCart = () => {
    if (!product || !selectedColor || !selectedSize) return;

    handleAddItem({
      id: `${product._id}-${selectedColor.colorName}-${selectedSize}`,
      productId: product._id,
      name: product.name,
      variant: selectedColor.colorName,
      size: selectedSize,
      price: Number(product.price || 0),
      qty,
      img: mainImages[0]?.url || fallbackImage,
    });
  };

  const buyNow = () => {
    addSelectedToCart();
    navigate("/checkout");
  };

  if (loading) {
    return <main className="product-detail-page"><p className="product-detail-message">Loading product...</p></main>;
  }

  if (error || !product) {
    return <main className="product-detail-page"><p className="product-detail-message">{error || "Product not found"}</p></main>;
  }

  return (
    <main className="product-detail-page">
      <section className="product-detail-layout">
        <div className="product-detail-gallery">
          {mainImages.slice(0, 4).map((image, index) => (
            <img
              key={image.publicId || image.url || index}
              src={image.url || fallbackImage}
              alt={`${product.name} ${index + 1}`}
              className="product-detail-image"
            />
          ))}
        </div>

        <aside className="product-detail-panel">
          <p className="product-detail-sku">SKU: {product.slug}</p>
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-detail-price">
            Rs {Number(product.price || 0).toLocaleString()}
          </p>
          <p className="product-detail-payments">
            or pay in 3 x Rs {Math.round(Number(product.price || 0) / 3).toLocaleString()} with Koko or Mintpay
          </p>

          <div className="product-detail-option">
            <div className="product-detail-label-row">
              <span>Color</span>
              <strong>{selectedColor?.colorName}</strong>
            </div>
            <div className="product-detail-swatches">
              {product.colors?.map((color, index) => (
                <button
                  key={color._id || color.colorName}
                  type="button"
                  className={`product-detail-swatch ${selectedColorIndex === index ? "active" : ""}`}
                  style={{ backgroundColor: color.colorCode || "#f8f5f2" }}
                  onClick={() => {
                    setSelectedColorIndex(index);
                    setSelectedSize(
                      color.sizes?.find(hasStock)?.size ||
                        color.sizes?.[0]?.size ||
                        "",
                    );
                    setQty(1);
                  }}
                  aria-label={`Select ${color.colorName}`}
                />
              ))}
            </div>
          </div>

          <div className="product-detail-option">
            <div className="product-detail-label-row">
              <span>Size</span>
              {selectedStock > 0 && selectedStock <= 3 && (
                <strong>Only {selectedStock} left in stock</strong>
              )}
            </div>
            <div className="product-detail-sizes">
              {selectedColor?.sizes?.map((size) => (
                <button
                  key={size.size}
                  type="button"
                  disabled={!hasStock(size)}
                  className={`product-detail-size ${selectedSize === size.size ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSize(size.size);
                    setQty(1);
                  }}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-detail-qty">
            <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))}>
              <Minus size={12} />
            </button>
            <span>{qty}</span>
            <button
              type="button"
              onClick={() => setQty((value) => Math.min(selectedStock || 1, value + 1))}
            >
              <Plus size={12} />
            </button>
          </div>

          <button
            type="button"
            disabled={!selectedStock}
            className="product-detail-add"
            onClick={addSelectedToCart}
          >
            Add to Cart - LKR {Number(product.price || 0).toLocaleString()}
          </button>
          <button
            type="button"
            disabled={!selectedStock}
            className="product-detail-buy"
            onClick={buyNow}
          >
            Buy It Now
          </button>

          <ProductAccordion title="Description" open>
            <p>{product.description}</p>
            <p>{product.fabric}</p>
            <p>{product.design}</p>
            <p>{product.productCare}</p>
          </ProductAccordion>

          <ProductAccordion title="Exchanges">
            <p>Exchange requests are accepted according to KAMARI policy.</p>
          </ProductAccordion>

          {related[0] && <RelatedProduct product={related[0]} />}
        </aside>
      </section>

      {related.length > 1 && (
        <section className="product-related-section">
          <h2>You Might Also Like</h2>
          <div className="product-related-grid">
            {related.slice(1).map((item) => (
              <RelatedCard
                key={item._id}
                product={item}
                onClick={() => navigate(`/products/${item._id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

const ProductAccordion = ({ title, children, open = false }) => (
  <details className="product-detail-accordion" open={open}>
    <summary>
      {title}
      <ChevronDown size={13} />
    </summary>
    <div>{children}</div>
  </details>
);

const RelatedProduct = ({ product }) => {
  const image = getImages(product)[0]?.url || fallbackImage;

  return (
    <div className="product-buy-with">
      <p className="product-buy-with-heading">Buy It With</p>
      <img src={image} alt={product.name} />
      <div>
        <p>{product.name}</p>
        <span>Rs {Number(product.price || 0).toLocaleString()}</span>
      </div>
    </div>
  );
};

const RelatedCard = ({ product, onClick }) => {
  const image = getImages(product)[0]?.url || fallbackImage;

  return (
    <button type="button" className="product-related-card" onClick={onClick}>
      <img src={image} alt={product.name} />
      <span>{product.name}</span>
    </button>
  );
};

export default ProductDetails;
