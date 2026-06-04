export default function ProductCardSkeleton() {
  return (
    <div className="product-card product-card-skeleton">
      <div className="product-card-img-wrap">
        <div className="skeleton skeleton-img" />
      </div>
      <div className="product-card-info">
        <div className="skeleton skeleton-text short" />
        <div className="skeleton skeleton-text medium" />
        <div className="skeleton-colors">
          <div className="skeleton skeleton-dot" />
          <div className="skeleton skeleton-dot" />
          <div className="skeleton skeleton-dot" />
        </div>
        <div className="skeleton skeleton-text short" />
        <div className="skeleton skeleton-text medium" />
      </div>
    </div>
  );
}
