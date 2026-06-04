import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import BankTransferDetails from "./BankTransferDetails";
import CashOnDeliveryConfirmation from "./CashOnDeliveryConfirmation";
import PaymentSlipUpload from "./PaymentSlipUpload";

export default function OrderConfirmation({
  createdOrder,
  isCodOrder,
  orderTotal,
  slipFile,
  slipInputRef,
  slipPreview,
  slipUploaded,
  slipUploading,
  slipError,
  onSlipRemove,
  onSlipSelect,
  onSlipUpload,
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

      {isCodOrder ? (
        <CashOnDeliveryConfirmation orderTotal={orderTotal} />
      ) : (
        <>
          <BankTransferDetails orderId={orderId} orderTotal={orderTotal} />
          <PaymentSlipUpload slipFile={slipFile} slipInputRef={slipInputRef} slipPreview={slipPreview} slipUploaded={slipUploaded} slipUploading={slipUploading} slipError={slipError} onSlipRemove={onSlipRemove} onSlipSelect={onSlipSelect} onSlipUpload={onSlipUpload} />
        </>
      )}

      <Link to="/" className="checkout-btn-primary checkout-btn-link" style={{ marginTop: "24px" }}>
        Continue Shopping
      </Link>
    </div>
  );
}
