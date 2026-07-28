import { useCallback, useState } from "react";
// import KokoInstallment from "../common/KokoInstallment"; // Koko disabled

export default function ProductCard({ product, onOpen }) {
  const [hoveredColorIndex, setHoveredColorIndex] = useState(null);

  const activeColor =
    hoveredColorIndex !== null ? product.colors[hoveredColorIndex] : null;
  const frontImg = activeColor?.img || product.img;
  const backImg = activeColor?.img2 || product.img2;

  const badges = [
    !product.inStock && "Sold Out",
    product.inStock && product.badge,
  ].filter(Boolean);

  const handleColorEnter = useCallback((event, index) => {
    event.stopPropagation();
    setHoveredColorIndex(index);
  }, []);

  const handleColorLeave = useCallback((event) => {
    event.stopPropagation();
    setHoveredColorIndex(null);
  }, []);

  return (
    <div className="pg-card" onClick={onOpen}>
      <div className="pg-card-img-wrap">
        <img src={frontImg} alt={product.name} className="pg-card-img front" />
        <img src={backImg} alt={product.name} className="pg-card-img back" />

        {badges.length > 0 && (
          <div className="pg-badges">
            {badges.map((badge) => (
              <span key={badge} className="pg-badge">
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pg-card-info">
        <p className="pg-card-name">{product.name}</p>
        <p className="pg-card-price">Rs {product.price.toLocaleString()}</p>
        {/* <KokoInstallment price={product.price} /> */}

        <div className="pg-card-colors">
          {product.colors.slice(0, 4).map((color, index) => (
            <span
              key={color.name}
              className={`pg-color-dot ${
                hoveredColorIndex === index ? "active" : ""
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              onMouseEnter={(event) => handleColorEnter(event, index)}
              onMouseLeave={handleColorLeave}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="pg-color-more">
              +{product.colors.length - 4}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
