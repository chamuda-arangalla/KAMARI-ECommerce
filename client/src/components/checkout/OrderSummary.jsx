import OrderTotalRow from "./OrderTotalRow";

export default function OrderSummary({
  createdOrder,
  createdOrderSummary,
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
  const displayItems = createdOrderSummary?.items || items;
  const displaySubtotal = createdOrderSummary?.subtotal ?? subtotal;
  const displayDiscount = createdOrderSummary?.discount ?? discount;
  const displayDeliveryFee = createdOrderSummary?.deliveryFee ?? deliveryFee;
  const displayPromoApplied = createdOrderSummary?.promoApplied ?? promoApplied;
  const displayTotal = createdOrderSummary?.total ?? (createdOrder ? orderTotal : total);

  return (
    <div className="checkout-right">
      <p className="order-summary-title">Order Summary</p>

      {displayItems.length === 0 && !createdOrder ? (
        <p className="checkout-empty-summary">Your cart is empty.</p>
      ) : (
        displayItems.map((item) => (
          <div key={item.id} className="order-item">
            <div className="order-item-img-wrap">
              <img src={item.img} alt={item.name} className="order-item-img" />
              <span className="order-item-qty">{item.qty}</span>
            </div>
            <div className="order-item-details">
              <p className="order-item-name">{item.name}</p>
              <p className="order-item-meta">{item.variant} - Size {item.size}</p>
            </div>
            <span className="order-item-price">Rs {(item.price * item.qty).toLocaleString()}</span>
          </div>
        ))
      )}

      <div className="discount-row">
        <input className="discount-input" type="text" placeholder="Discount code" value={discountCode} onChange={(event) => onDiscountCodeChange(event.target.value)} />
        <button className="discount-btn" type="button">Apply</button>
      </div>

      <div className="order-divider" />

      <OrderTotalRow label="Subtotal" value={`Rs ${displaySubtotal.toLocaleString()}`} />

      {displayPromoApplied && (
        <OrderTotalRow label="Discount (KAMARI10)" value={`- Rs ${displayDiscount.toLocaleString()}`} valueClassName="order-discount-value" />
      )}

      {/* Free delivery disabled: value was freeDelivery ? "Free" : deliveryFee. */}
      <OrderTotalRow label="Delivery" value={displayDeliveryFee === 0 ? "Free" : `Rs ${displayDeliveryFee.toLocaleString()}`} valueClassName="order-total-value" />

      <div className="order-divider" />

      <div className="order-total-row total">
        <span>Total</span>
        <span>Rs {displayTotal.toLocaleString()}</span>
      </div>
    </div>
  );
}
