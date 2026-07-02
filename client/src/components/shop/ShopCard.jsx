import { useState } from "react";
import {
  FALLBACK_IMAGE,
  getProductImages,
  isColorSoldOut,
  isProductInStock,
} from "./shopUtils";

export default function ShopCard({ product, onOpen }) {
  const colors = product.colors || [];
  const inStock = isProductInStock(product);
  const images = getProductImages(product);
  const [hoveredColor, setHoveredColor] = useState(null);

  const activeColor = hoveredColor ?? colors[0];
  const displayImg =
    activeColor?.images?.[0]?.url || images[0]?.url || FALLBACK_IMAGE;
  const displayImg2 =
    activeColor?.images?.[1]?.url || images[1]?.url || displayImg;

  const badges = [
    !inStock && "Sold Out",
    inStock && product.isFeatured && "Best Seller",
    inStock && product.isNewArrival && "New",
  ].filter(Boolean);

  return (
    <article className="pg-card" onClick={onOpen}>
      <div className="pg-card-img-wrap">
        <img src={displayImg} alt={product.name} className="pg-card-img front" />
        <img src={displayImg2} alt={product.name} className="pg-card-img back" />

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
        <p className="pg-card-price">
          Rs {Number(product.price || 0).toLocaleString()}
        </p>
        {/* Koko installment message currently disabled:
        <p className="pg-card-installment">
          or 3 x Rs{" "}
          {Math.round(Number(product.price || 0) / 3).toLocaleString()} with
          Koko
        </p>
        */}

        <div className="pg-card-colors">
          {colors.slice(0, 5).map((color) => {
            const soldOut = isColorSoldOut(color);

            return (
              <button
                key={color._id || color.colorName}
                type="button"
                className={`pg-color-dot ${soldOut ? "sold-out" : ""} ${
                  activeColor === color ? "active" : ""
                }`}
                style={{ backgroundColor: color.colorCode || "#ccc" }}
                title={soldOut ? `${color.colorName} - Sold Out` : color.colorName}
                onClick={(event) => {
                  event.stopPropagation();
                  setHoveredColor(color);
                }}
                onMouseEnter={() => setHoveredColor(color)}
                onMouseLeave={() => setHoveredColor(null)}
              />
            );
          })}
          {colors.length > 5 && (
            <span className="pg-color-more">+{colors.length - 5}</span>
          )}
        </div>
      </div>
    </article>
  );
}
