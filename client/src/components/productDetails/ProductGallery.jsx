import { PRODUCT_FALLBACK_IMAGE } from "./productDetailsUtils";

export default function ProductGallery({
  product,
  images,
  mainIdx,
  inStock,
  onMainImageChange,
}) {
  return (
    <>
      <div className="pd-thumbs">
        {images.map((img, index) => (
          <button
            key={img.publicId || img.url || index}
            className={`pd-thumb ${index === mainIdx ? "active" : ""}`}
            onClick={() => onMainImageChange(index)}
          >
            <img
              src={img.url || PRODUCT_FALLBACK_IMAGE}
              alt={`${product.name} view ${index + 1}`}
            />
          </button>
        ))}
      </div>

      <div className="pd-main-img-wrap">
        <img
          src={images[mainIdx]?.url || PRODUCT_FALLBACK_IMAGE}
          alt={product.name}
          className="pd-main-img"
        />
        {!inStock && (
          <div className="pd-sold-out-overlay">
            <span>Sold Out</span>
          </div>
        )}
        {product.isNewArrival && inStock && (
          <span className="pd-badge new">New Arrival</span>
        )}
        {product.isFeatured && inStock && (
          <span className="pd-badge best">Best Seller</span>
        )}
      </div>
    </>
  );
}
