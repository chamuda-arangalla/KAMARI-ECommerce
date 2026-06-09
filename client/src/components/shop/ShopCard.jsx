import { useState } from "react";
import {
  FALLBACK_IMAGE,
  getProductImages,
  isColorSoldOut,
  isProductInStock,
} from "./shopUtils";

export default function ShopCard({ product, onOpen, onQuickAdd }) {
  const colors = product.colors || [];
  const inStock = isProductInStock(product);
  const images = getProductImages(product);
  const [hoveredColor, setHoveredColor] = useState(null);

  const activeColor = hoveredColor ?? colors[0];
  const displayImg =
    activeColor?.images?.[0]?.url || images[0]?.url || FALLBACK_IMAGE;
  const displayImg2 =
    activeColor?.images?.[1]?.url || images[1]?.url || displayImg;
  const badge = product.isFeatured
    ? "Best Seller"
    : product.isNewArrival
      ? "New"
      : null;

  return (
    <article className="shop-card" onClick={onOpen}>
      <div className="shop-card-img-wrap">
        <img src={displayImg} alt={product.name} className="shop-card-img front" />
        <img src={displayImg2} alt={product.name} className="shop-card-img back" />

        {badge && inStock && (
          <span className={`shop-card-badge ${badge === "Best Seller" ? "best" : "new"}`}>
            {badge}
          </span>
        )}

        {!inStock && (
          <div className="shop-card-sold-out">
            <span>Sold Out</span>
          </div>
        )}

        {inStock && (
          <button
            className="shop-card-quick-add"
            onClick={(event) => {
              event.stopPropagation();
              onQuickAdd(activeColor);
            }}
          >
            Quick Add
          </button>
        )}
      </div>

      <div className="shop-card-info">
        <p className="shop-card-collection">
          {product.setName || product.collection}
        </p>
        <p className="shop-card-name">{product.name}</p>

        <div className="shop-card-swatches">
          {colors.slice(0, 5).map((color) => {
            const soldOut = isColorSoldOut(color);

            return (
              <button
                key={color._id || color.colorName}
                type="button"
                className={`shop-card-swatch ${soldOut ? "sold-out" : ""} ${
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
            <span className="shop-card-more-colors">+{colors.length - 5}</span>
          )}
        </div>

        <p className="shop-card-price">
          LKR {Number(product.price || 0).toLocaleString()}
        </p>
        <p className="shop-card-installment">
          or 3 x LKR{" "}
          {Math.round(Number(product.price || 0) / 3).toLocaleString()} with
          Koko
        </p>
      </div>
    </article>
  );
}
