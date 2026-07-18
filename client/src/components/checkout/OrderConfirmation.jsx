import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
// import BankTransferDetails from "./BankTransferDetails";
import CashOnDeliveryConfirmation from "./CashOnDeliveryConfirmation";
import OnePayRedirecting from "./OnePayRedirecting";
// import PaymentSlipUpload from "./PaymentSlipUpload";
import { PAYMENT_METHODS } from "./constants";

export default function OrderConfirmation({
  createdOrder,
  paymentMethod,
  orderTotal,
  // Bank-transfer payment-slip props are temporarily disabled.
}) {
  const orderId = createdOrder.orderId || createdOrder._id;

  return (
    <div>
      <div className="checkout-order-confirmed">
        <div className="checkout-confirmed-icon">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="checkout-confirmed-title">Order Confirmed</h2>
        <p className="checkout-confirmed-sub">Thank you! Your order has been placed successfully.</p>
        <p className="checkout-confirmed-id">
          Order ID: <strong>{orderId}</strong>
        </p>
      </div>

      {paymentMethod === PAYMENT_METHODS.COD ? (
        <CashOnDeliveryConfirmation orderTotal={orderTotal} />
      ) : paymentMethod === PAYMENT_METHODS.ONEPAY ? (
        <OnePayRedirecting status="success" />
      ) : null}

      {/* Bank-transfer confirmation and payment-slip upload are temporarily disabled.
      <BankTransferDetails orderId={orderId} orderTotal={orderTotal} />
      <PaymentSlipUpload ... />
      */}

      <Link to="/" className="checkout-btn-primary checkout-btn-link" style={{ marginTop: "24px" }}>
        Continue Shopping
      </Link>
    </div>
  );
}
