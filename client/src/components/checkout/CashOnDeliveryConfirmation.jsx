export default function CashOnDeliveryConfirmation({ orderTotal }) {
  return (
    <div className="cod-confirmation-card">
      <span className="bank-transfer-badge">Cash on Delivery</span>
      <h3 className="bank-transfer-title">Pay When Your Order Arrives</h3>
      <p className="bank-transfer-note">
        Your order has been placed with Cash on Delivery. Please keep
        <strong> LKR {orderTotal.toLocaleString()} </strong>
        ready and our team will contact you before delivery.
      </p>
    </div>
  );
}
