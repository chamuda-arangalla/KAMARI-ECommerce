export const formatCurrency = (value) =>
  `Rs ${Number(value || 0).toLocaleString()}`;

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
    dot: "bg-[#8f8376]",
    text: "text-[#5f564d]",
    bg: "bg-[#eae0d6]",
    border: "border-[#b7aa9a]",
    bar: "bg-[#8f8376]",
  },
  complete: {
    label: "Complete",
    dot: "bg-[#544c43]",
    text: "text-[#544c43]",
    bg: "bg-[#ead9c4]",
    border: "border-[#d7c9b8]",
    bar: "bg-[#544c43]",
  },
  cod: {
    label: "COD",
    dot: "bg-[#8f8376]",
    text: "text-[#5f564d]",
    bg: "bg-[#f3ebe2]",
    border: "border-[#d7c9b8]",
    bar: "bg-[#8f8376]",
  },
  paid: {
    label: "Paid",
    dot: "bg-[#544c43]",
    text: "text-[#544c43]",
    bg: "bg-[#ead9c4]",
    border: "border-[#d7c9b8]",
    bar: "bg-[#544c43]",
  },
  failed: {
    label: "Failed",
    dot: "bg-[#544c43]",
    text: "text-[#544c43]",
    bg: "bg-[#ead9c4]",
    border: "border-[#b7aa9a]",
    bar: "bg-[#544c43]",
  },
};

export const getStatus = (status = "") =>
  STATUS_MAP[status.toLowerCase()] || STATUS_MAP.pending;
