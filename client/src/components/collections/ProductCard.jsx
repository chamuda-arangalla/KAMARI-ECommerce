import { useCallback, useState } from "react";

export default function ProductCard({ product, onOpen }) {
  const [hoveredColorIndex, setHoveredColorIndex] = useState(null);
  const installment = Math.round(product.price / 3).toLocaleString();

  const activeColor =
    hoveredColorIndex !== null ? product.colors[hoveredColorIndex] : null;
  const frontImg = activeColor?.img || product.img;
  const backImg = activeColor?.img2 || product.img2;

  const handleColorEnter = useCallback((event, index) => {
    event.stopPropagation();
    setHoveredColorIndex(index);
  }, []);

  const handleColorLeave = useCallback((event) => {
    event.stopPropagation();
    setHoveredColorIndex(null);
  }, []);

  return (
    <div className="product-card" onClick={onOpen}>
      <div className="product-card-img-wrap">
        <img src={frontImg} alt={product.name} className="product-card-img front" />
        <img src={backImg} alt={product.name} className="product-card-img back" />

        {product.badge && product.inStock && (
          <span
            className={`product-badge ${
              product.badge === "BEST SELLER" ? "best-seller" : "new"
            }`}
          >
            {product.badge}
          </span>
        )}

        {!product.inStock && (
          <div className="product-sold-out-overlay">
            <span className="product-sold-out-tag">Sold Out</span>
          </div>
        )}

        {product.inStock && (
          <button
            className="product-quick-add"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
          >
            View Product
          </button>
        )}
      </div>

      <div className="product-card-info">
        {product.category && (
          <p className="product-card-category">{product.category}</p>
        )}
        <p className="product-card-name">{product.name}</p>

        <div className="product-card-colors">
          {product.colors.slice(0, 4).map((color, index) => (
            <span
              key={color.name}
              className={`product-color-dot ${
                hoveredColorIndex === index ? "active" : ""
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              onMouseEnter={(event) => handleColorEnter(event, index)}
              onMouseLeave={handleColorLeave}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="product-color-count">
              +{product.colors.length - 4}
            </span>
          )}
        </div>

        <p className="product-card-price">LKR {product.price.toLocaleString()}</p>
        <p className="product-card-installment">
          or 3 x LKR {installment} with Koko
        </p>
      </div>
    </div>
  );
}
