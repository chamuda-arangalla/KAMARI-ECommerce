export default function PaymentMethodOption({
  checked,
  children,
  name,
  tag,
  value,
  onChange,
}) {
  return (
    <label className={`payment-method-option ${checked ? "selected" : ""}`}>
      <div className="payment-method-top">
        <div className="payment-method-left">
          <input type="radio" name="paymentMethod" value={value} checked={checked} onChange={() => onChange(value)} />
          <span className="payment-method-name">{name}</span>
        </div>
        <span className="payment-method-tag">{tag}</span>
      </div>

      {checked && (
        <div className="payment-method-body">
          <p className="payment-method-note">{children}</p>
        </div>
      )}
    </label>
  );
}
