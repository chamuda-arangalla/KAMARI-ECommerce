import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PaymentStep from "./PaymentStep";
import ReceiverDetailsStep from "./ReceiverDetailsStep";
import { PAYMENT_METHODS } from "./constants";

export default function CheckoutForm({
  error,
  isPaymentStep,
  paymentMethod,
  receiverDetails,
  submitting,
  total,
  hasItems,
  onBack,
  onPaymentMethodChange,
  onReceiverChange,
  onReceiverSelectChange,
  onSubmit,
}) {
  const paymentAction =
    paymentMethod === PAYMENT_METHODS.KOKO
      ? "Continue with Koko"
      : paymentMethod === PAYMENT_METHODS.ONEPAY
        ? "Continue with OnePay"
        : "Create Order";

  return (
    <form onSubmit={onSubmit}>
      {isPaymentStep ? (
        <PaymentStep paymentMethod={paymentMethod} onPaymentMethodChange={onPaymentMethodChange} />
      ) : (
        <ReceiverDetailsStep receiverDetails={receiverDetails} onInputChange={onReceiverChange} onSelectChange={onReceiverSelectChange} />
      )}

      {error && <p className="checkout-error">{error}</p>}

      <button className="checkout-btn-primary" type="submit" disabled={submitting || !hasItems}>
        {submitting ? (
          <span className="checkout-btn-loading">
            <Loader2 size={16} className="checkout-spinner" />
            Processing
          </span>
        ) : isPaymentStep ? (
          `${paymentAction} - Rs ${total.toLocaleString()}`
        ) : (
          "Proceed to Payment"
        )}
      </button>

      {isPaymentStep ? (
        <button type="button" className="checkout-btn-secondary" onClick={onBack}>
          Back to receiver details
        </button>
      ) : (
        <Link to="/cart" className="checkout-btn-secondary">
          Return to cart
        </Link>
      )}
    </form>
  );
}
