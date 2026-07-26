import { useState } from "react";
import { X } from "lucide-react";
import { PRODUCT_FALLBACK_IMAGE } from "./productDetailsUtils";

export default function ProductGallery({
  product,
  images,
  mainIdx,
  inStock,
  onMainImageChange,
}) {
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const selectedImage = images[mainIdx]?.url || PRODUCT_FALLBACK_IMAGE;

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

      <div className="pd-main-media">
        {inStock && (product.isNewArrival || product.isFeatured) && (
          <div className="pd-badges">
            {product.isNewArrival && (
              <span className="pd-badge new">New Arrival</span>
            )}
            {product.isFeatured && (
              <span className="pd-badge best">Best Seller</span>
            )}
          </div>
        )}

        <button
          type="button"
          className="pd-main-img-wrap"
          onClick={() => setFullImageOpen(true)}
          aria-label={`View full image of ${product.name}`}
        >
          <img
            src={selectedImage}
            alt={product.name}
            className="pd-main-img"
          />
          {!inStock && (
            <div className="pd-sold-out-overlay">
              <span>Sold Out</span>
            </div>
          )}
        </button>
      </div>

      {fullImageOpen && (
        <div
          className="pd-full-image-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} full image`}
          onClick={() => setFullImageOpen(false)}
        >
          <button
            type="button"
            className="pd-full-image-close"
            onClick={() => setFullImageOpen(false)}
            aria-label="Close full image"
          >
            <X size={24} />
          </button>
          <img
            src={selectedImage}
            alt={product.name}
            className="pd-full-image"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
