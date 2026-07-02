import BankDetail from "./BankDetail";

export default function BankTransferDetails({ orderId, orderTotal }) {
  return (
    <div className="bank-transfer-card">
      <div className="bank-transfer-header">
        <span className="bank-transfer-badge">Bank Transfer</span>
        <h3 className="bank-transfer-title">Complete Your Payment</h3>
        <p className="bank-transfer-note">
          Please transfer the exact order amount to the bank account below and send your payment slip to confirm your order.
        </p>
      </div>

      <div className="bank-details">
        <BankDetail label="Bank" value="HNB Malabe" />
        <BankDetail label="Account Number" value="156020128784" valueClassName="bank-detail-account" />
        <BankDetail label="Account Name" value="Nimesha Dhananjanee" />
        <div className="bank-detail-row bank-detail-amount">
          <span className="bank-detail-label">Amount to Pay</span>
          <span className="bank-detail-value bank-detail-total">Rs {orderTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="bank-transfer-steps">
        <p className="bank-steps-title">Next Steps</p>
        <ol className="bank-steps-list">
          <li>Transfer <strong>Rs {orderTotal.toLocaleString()}</strong> to the account above.</li>
          <li>Use your Order ID <strong>{orderId}</strong> as the payment reference.</li>
          <li>Send your payment slip via WhatsApp or email to confirm your order.</li>
        </ol>
      </div>
    </div>
  );
}
