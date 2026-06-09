import { getStatus } from "./customerOrdersUtils";

export default function OrderStatusBadge({ status }) {
  const statusConfig = getStatus(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
      {statusConfig.label}
    </span>
  );
}
