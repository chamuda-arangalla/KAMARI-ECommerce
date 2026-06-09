export default function ProductInfoAccordions({
  product,
  sizeChartOpen,
  sizeChartRef,
  onSizeChartToggle,
}) {
  return (
    <div className="pd-details">
      <div className="pd-details-main">
        <h2>Product Details</h2>

        <details className="pd-accordion" open>
          <summary>Description</summary>
          <div className="pd-accordion-body">
            <p>{product.description || "No description available."}</p>
          </div>
        </details>

        <details className="pd-accordion">
          <summary>Fabric & Design</summary>
          <div className="pd-accordion-body">
            {product.fabric && (
              <p>
                <strong>Fabric: </strong>
                {product.fabric}
              </p>
            )}
            {product.design && (
              <p>
                <strong>Design: </strong>
                {product.design}
              </p>
            )}
          </div>
        </details>

        {product.sizeChartImage && (
          <details
            ref={sizeChartRef}
            className="pd-accordion"
            id="size-chart"
            open={sizeChartOpen}
            onToggle={(event) => onSizeChartToggle(event.currentTarget.open)}
          >
            <summary>Size Chart</summary>
            <div className="pd-accordion-body">
              <img
                src={product.sizeChartImage}
                alt={`${product.name} size chart`}
                className="pd-size-chart-img"
              />
            </div>
          </details>
        )}

        <details className="pd-accordion">
          <summary>Care Instructions</summary>
          <div className="pd-accordion-body">
            <p>{product.productCare || "Follow standard garment care."}</p>
          </div>
        </details>

        <details className="pd-accordion">
          <summary>Returns & Exchanges</summary>
          <div className="pd-accordion-body">
            <p>
              Exchange requests are accepted within 7 days of delivery. Items
              must be unworn, unwashed and in original condition. Contact our
              support team to initiate an exchange.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
