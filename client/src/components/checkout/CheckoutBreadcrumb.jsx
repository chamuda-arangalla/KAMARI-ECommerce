import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function CheckoutBreadcrumb({ isPaymentStep, onReceiverClick }) {
  return (
    <nav className="checkout-breadcrumb">
      <Link to="/cart">Cart</Link>
      <span className="checkout-breadcrumb-step">
        <ChevronRight size={12} className="step-separator" />
        {isPaymentStep ? (
          <button
            type="button"
            className="step-link checkout-step-button"
            onClick={onReceiverClick}
          >
            Receiver Details
          </button>
        ) : (
          <span className="step-active">Receiver Details</span>
        )}
      </span>
      <span className="checkout-breadcrumb-step">
        <ChevronRight size={12} className="step-separator" />
        <span className={isPaymentStep ? "step-active" : "step-upcoming"}>
          Payment
        </span>
      </span>
    </nav>
  );
}
