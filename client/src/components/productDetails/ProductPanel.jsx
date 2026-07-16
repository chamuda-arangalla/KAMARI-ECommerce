import { RotateCcw, Shield } from "lucide-react";
import KokoInstallment from "../common/KokoInstallment";
import ProductOptions from "./ProductOptions";

export default function ProductPanel({
  product,
  selColor,
  selColorIdx,
  selSize,
  selStock,
  qty,
  totalStock,
  inStock,
  addedMsg,
  onAddToCart,
  onBuyNow,
  onCollectionOpen,
  onColorSelect,
  onQtyChange,
  onSizeChartOpen,
  onSizeSelect,
}) {
  return (
    <aside className="pd-panel">
      <p className="pd-collection" onClick={onCollectionOpen}>
        {product.setName || product.collection}
      </p>

      <h1 className="pd-title">{product.name}</h1>

      <div className="pd-divider" />

      <div className="pd-price-wrap">
        <p className="pd-price">
          Rs {Number(product.price || 0).toLocaleString()}
        </p>
        <KokoInstallment price={product.price} className="pd-installment" />
      </div>

      <p
        className={`pd-stock-badge ${
          !inStock ? "out" : totalStock <= 10 ? "low" : "in"
        }`}
      >
        {!inStock
          ? "Currently unavailable"
          : totalStock <= 10
            ? `Only ${totalStock} left in stock - order soon`
            : "In Stock"}
      </p>

      <div className="pd-divider" />

      <ProductOptions
        product={product}
        selColor={selColor}
        selColorIdx={selColorIdx}
        selSize={selSize}
        selStock={selStock}
        qty={qty}
        inStock={inStock}
        onColorSelect={onColorSelect}
        onQtyChange={onQtyChange}
        onSizeChartOpen={onSizeChartOpen}
        onSizeSelect={onSizeSelect}
      />

      <div className="pd-divider" />

      <div className="pd-cta">
        <button
          type="button"
          className={`pd-add-btn ${addedMsg ? "added" : ""}`}
          disabled={!selStock || !inStock}
          onClick={onAddToCart}
        >
          {addedMsg ? "Added to Bag" : "Add to Cart"}
        </button>
        <button
          type="button"
          className="pd-buy-btn"
          disabled={!selStock || !inStock}
          onClick={onBuyNow}
        >
          Buy Now
        </button>
      </div>

      <div className="pd-trust">
        {/* Free delivery message currently disabled:
        <div className="pd-trust-item">
          <Package size={15} />
          <span>Free delivery island-wide over Rs 5,000</span>
        </div>
        */}
        <div className="pd-trust-item">
          <RotateCcw size={15} />
          <span>Easy 7-day exchange policy</span>
        </div>
        <div className="pd-trust-item">
          <Shield size={15} />
          <span>Secure and encrypted checkout</span>
        </div>
      </div>
    </aside>
  );
}
