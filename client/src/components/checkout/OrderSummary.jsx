import OrderTotalRow from "./OrderTotalRow";

export default function OrderSummary({
  createdOrder,
  deliveryFee,
  // freeDelivery,
  discount,
  discountCode,
  items,
  orderTotal,
  promoApplied,
  subtotal,
  total,
  onDiscountCodeChange,
}) {
  return (
    <div className="checkout-right">
      <p className="order-summary-title">Order Summary</p>

      {items.length === 0 && !createdOrder ? (
        <p className="checkout-empty-summary">Your cart is empty.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="order-item">
            <div className="order-item-img-wrap">
              <img src={item.img} alt={item.name} className="order-item-img" />
              <span className="order-item-qty">{item.qty}</span>
            </div>
            <div className="order-item-details">
              <p className="order-item-name">{item.name}</p>
              <p className="order-item-meta">{item.variant} - Size {item.size}</p>
            </div>
            <span className="order-item-price">LKR {(item.price * item.qty).toLocaleString()}</span>
          </div>
        ))
      )}

      <div className="discount-row">
        <input className="discount-input" type="text" placeholder="Discount code" value={discountCode} onChange={(event) => onDiscountCodeChange(event.target.value)} />
        <button className="discount-btn" type="button">Apply</button>
      </div>

      <div className="order-divider" />

      <OrderTotalRow label="Subtotal" value={`LKR ${subtotal.toLocaleString()}`} />

      {promoApplied && (
        <OrderTotalRow label="Discount (KAMARI10)" value={`- LKR ${discount.toLocaleString()}`} valueClassName="order-discount-value" />
      )}

      {/* Free delivery disabled: value was freeDelivery ? "Free" : deliveryFee. */}
      <OrderTotalRow label="Delivery" value={`LKR ${deliveryFee.toLocaleString()}`} valueClassName="order-total-value" />

      <div className="order-divider" />

      <div className="order-total-row total">
        <span>Total</span>
        <span>LKR {(createdOrder ? orderTotal : total).toLocaleString()}</span>
      </div>
    </div>
  );
}
