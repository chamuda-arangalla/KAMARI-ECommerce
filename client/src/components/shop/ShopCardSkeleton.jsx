export default function ShopCardSkeleton() {
  return (
    <article className="shop-card shop-card-skeleton">
      <div className="shop-card-img-wrap">
        <div className="skeleton skeleton-img" />
      </div>
      <div className="shop-card-info">
        <div className="skeleton skeleton-text short" />
        <div className="skeleton skeleton-text medium" />
        <div className="skeleton-swatches">
          <div className="skeleton skeleton-swatch" />
          <div className="skeleton skeleton-swatch" />
          <div className="skeleton skeleton-swatch" />
        </div>
        <div className="skeleton skeleton-text short" />
        <div className="skeleton skeleton-text medium" />
      </div>
    </article>
  );
}
