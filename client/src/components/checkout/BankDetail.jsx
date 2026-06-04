export default function BankDetail({ label, value, valueClassName = "" }) {
  return (
    <div className="bank-detail-row">
      <span className="bank-detail-label">{label}</span>
      <span className={`bank-detail-value ${valueClassName}`}>{value}</span>
    </div>
  );
}
