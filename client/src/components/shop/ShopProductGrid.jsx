import ShopCard from "./ShopCard";
import ShopCardSkeleton from "./ShopCardSkeleton";
import { SHOP_PRODUCTS_PER_PAGE } from "./shopUtils";

export default function ShopProductGrid({
  cols,
  error,
  loading,
  products,
  onClearFilters,
  onOpenProduct,
}) {
  if (loading) {
    return (
      <div className={`pg-grid cols-${cols}`}>
        {Array.from({ length: SHOP_PRODUCTS_PER_PAGE }).map((_, index) => (
          <ShopCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-state">
        <p className="shop-error">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="shop-state">
        <p className="shop-empty-title">No products found</p>
        <p className="shop-empty-sub">
          Try selecting a different tab or collection.
        </p>
        <button className="shop-reset-btn" onClick={onClearFilters}>
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className={`pg-grid cols-${cols}`}>
      {products.map((product) => (
        <ShopCard
          key={product._id}
          product={product}
          onOpen={() => onOpenProduct(product)}
        />
      ))}
    </div>
  );
}
