import RelatedProductCard from "./RelatedProductCard";

export default function RelatedProducts({ products, onOpenProduct }) {
  if (!products.length) return null;

  return (
    <div className="pd-related">
      <div className="pd-related-box">
        <h2 className="pd-related-title">Customers Also Viewed</h2>
        <div className="pd-related-grid">
          {products.map((product) => (
            <RelatedProductCard
              key={product._id}
              product={product}
              onClick={() => onOpenProduct(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
