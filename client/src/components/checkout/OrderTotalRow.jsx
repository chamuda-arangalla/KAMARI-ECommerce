export default function OrderTotalRow({
  label,
  value,
  valueClassName = "order-total-value",
}) {
  return (
    <div className="order-total-row">
      <span>{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}
