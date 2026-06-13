import { Minus, Plus } from "lucide-react";
import { hasStock, isColorSoldOut } from "./productDetailsUtils";

export default function ProductOptions({
  product,
  selColor,
  selColorIdx,
  selSize,
  selStock,
  qty,
  inStock,
  onColorSelect,
  onQtyChange,
  onSizeChartOpen,
  onSizeSelect,
}) {
  return (
    <>
      <div className="pd-option">
        <div className="pd-option-label">
          <span>Colour:</span>
          <strong>{selColor?.colorName}</strong>
        </div>
        <div className="pd-swatches">
          {product.colors?.map((color, index) => (
            <button
              key={color._id || color.colorName}
              type="button"
              title={
                isColorSoldOut(color)
                  ? `${color.colorName} - Sold Out`
                  : color.colorName
              }
              className={`pd-swatch ${
                selColorIdx === index ? "active" : ""
              } ${isColorSoldOut(color) ? "sold-out" : ""}`}
              style={{ backgroundColor: color.colorCode || "#ccc" }}
              onClick={() => !isColorSoldOut(color) && onColorSelect(index)}
            />
          ))}
        </div>
      </div>

      <div className="pd-option">
        <div className="pd-option-label">
          <span>Size:</span>
          {selStock > 0 && selStock <= 3 && (
            <strong className="pd-low-stock-warn">Only {selStock} left!</strong>
          )}
          {product.sizeChartImage && (
            <button
              type="button"
              className="pd-size-chart-link"
              onClick={onSizeChartOpen}
            >
              Size Chart
            </button>
          )}
        </div>
        <div className="pd-sizes">
          {selColor?.sizes?.map((size) => (
            <button
              key={size.size}
              type="button"
              disabled={!hasStock(size)}
              className={`pd-size-btn ${selSize === size.size ? "active" : ""}`}
              onClick={() => onSizeSelect(size.size)}
            >
              {size.size}
            </button>
          ))}
        </div>
      </div>

      {inStock && selStock > 0 && (
        <div className="pd-option">
          <div className="pd-option-label">
            <span>Quantity:</span>
          </div>
          <div className="pd-qty">
            <button
              type="button"
              onClick={() => onQtyChange(Math.max(1, qty - 1))}
              disabled={qty <= 1}
            >
              <Minus size={14} />
            </button>
            <span>{qty}</span>
            <button
              type="button"
              onClick={() => onQtyChange(Math.min(selStock, qty + 1))}
              disabled={qty >= selStock}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
