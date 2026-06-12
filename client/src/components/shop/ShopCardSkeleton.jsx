export default function ShopCardSkeleton() {
  return (
    <article className="pg-card pg-card-skeleton">
      <div className="pg-card-img-wrap">
        <div className="skeleton pg-skeleton-img" />
      </div>
      <div className="pg-card-info">
        <div className="skeleton pg-skeleton-text medium" />
        <div className="skeleton pg-skeleton-text short" />
        <div className="skeleton pg-skeleton-text short" />
        <div className="pg-skeleton-dots">
          <div className="skeleton pg-skeleton-dot" />
          <div className="skeleton pg-skeleton-dot" />
          <div className="skeleton pg-skeleton-dot" />
        </div>
      </div>
    </article>
  );
}
