import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function OnePayRedirecting({ status, initiating, error, onRetry, onReopen }) {
  if (error) {
    return (
      <div className="bank-transfer-card">
        <div className="bank-transfer-header">
          <span className="bank-transfer-badge">OnePay</span>
          <h3 className="bank-transfer-title">Couldn't start OnePay checkout</h3>
          <p className="bank-transfer-note">{error}</p>
        </div>
        <button type="button" className="checkout-btn-primary" onClick={onRetry} disabled={initiating}>
          {initiating ? (
            <span className="checkout-btn-loading">
              <Loader2 size={16} className="checkout-spinner" />
              Retrying...
            </span>
          ) : (
            "Try again"
          )}
        </button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="bank-transfer-card">
        <div className="bank-transfer-header">
          <span className="bank-transfer-badge">OnePay</span>
          <h3 className="bank-transfer-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 size={20} /> Payment successful
          </h3>
          <p className="bank-transfer-note">
            We've confirmed your OnePay payment. Your order is now being processed.
          </p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="bank-transfer-card">
        <div className="bank-transfer-header">
          <span className="bank-transfer-badge">OnePay</span>
          <h3 className="bank-transfer-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <XCircle size={20} /> Payment failed
          </h3>
          <p className="bank-transfer-note">
            Your OnePay payment didn't go through. You can try again below.
          </p>
        </div>
        <button type="button" className="checkout-btn-primary" onClick={onRetry} disabled={initiating}>
          {initiating ? (
            <span className="checkout-btn-loading">
              <Loader2 size={16} className="checkout-spinner" />
              Retrying...
            </span>
          ) : (
            "Try again"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bank-transfer-card">
      <div className="bank-transfer-header">
        <span className="bank-transfer-badge">OnePay</span>
        <h3 className="bank-transfer-title">Complete your payment</h3>
        <p className="bank-transfer-note">
          A secure OnePay payment window should have opened. Complete your payment there —
          this page will update automatically once it's done. Please don't close this tab.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
        <span className="checkout-btn-loading">
          <Loader2 size={20} className="checkout-spinner" />
        </span>
        {onReopen && (
          <button
            type="button"
            onClick={onReopen}
            disabled={initiating}
            style={{
              background: "none",
              border: "none",
              color: "#544c43",
              cursor: "pointer",
              fontSize: "13px",
              textDecoration: "underline",
            }}
          >
            Didn't see the payment window? Reopen it
          </button>
        )}
      </div>
    </div>
  );
}
