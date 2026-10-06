import {
  getProductImages,
  isProductInStock,
  PRODUCT_FALLBACK_IMAGE,
} from "./productDetailsUtils";
import KokoInstallment from "../common/KokoInstallment";

export default function RelatedProductCard({ product, onClick }) {
  const images = getProductImages(product);
  const img1 = images[0]?.url || PRODUCT_FALLBACK_IMAGE;
  const img2 = images[1]?.url || img1;
  const inStock = isProductInStock(product);

  return (
    <button type="button" className="pd-related-card" onClick={onClick}>
      <div className="pd-related-img-wrap">
        <img src={img1} alt={product.name} className="pd-related-img front" />
        <img src={img2} alt={product.name} className="pd-related-img back" />
        {!inStock && <span className="pd-related-sold-out">Sold Out</span>}
      </div>
      <div className="pd-related-info">
        <p className="pd-related-collection">
          {product.setName || product.collection}
        </p>
        <p className="pd-related-name">{product.name}</p>
        <p className="pd-related-price">
          Rs {Number(product.price || 0).toLocaleString()}
        </p>
        <KokoInstallment price={product.price} className="pd-related-installment" />
      </div>
    </button>
  );
}
