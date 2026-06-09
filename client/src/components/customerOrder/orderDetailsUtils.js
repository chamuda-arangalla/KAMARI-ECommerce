export const formatCurrency = (value) =>
  `LKR ${Number(value || 0).toLocaleString()}`;

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

export const STATUS_MAP = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    bar: "bg-amber-400",
  },
  complete: {
    label: "Complete",
    dot: "bg-emerald-400",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    bar: "bg-emerald-400",
  },
  cod: {
    label: "COD",
    dot: "bg-sky-400",
    text: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    bar: "bg-sky-400",
  },
  paid: {
    label: "Paid",
    dot: "bg-emerald-400",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    bar: "bg-emerald-400",
  },
  failed: {
    label: "Failed",
    dot: "bg-rose-400",
    text: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    bar: "bg-rose-400",
  },
};

export const getStatus = (status = "") =>
  STATUS_MAP[status.toLowerCase()] || STATUS_MAP.pending;
