export const getStoredCustomer = () =>
  JSON.parse(localStorage.getItem("customerUser") || "{}");

export const formatCurrency = (value) =>
  `LKR ${Number(value || 0).toLocaleString()}`;

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";

export const STATUS_MAP = {
  pending: {
    label: "Pending",
    bg: "bg-[#eae0d6]",
    text: "text-[#5f564d]",
    border: "border-[#b7aa9a]",
    dot: "bg-[#8f8376]",
  },
  complete: {
    label: "Complete",
    bg: "bg-[#ead9c4]",
    text: "text-[#544c43]",
    border: "border-[#d7c9b8]",
    dot: "bg-[#544c43]",
  },
  cod: {
    label: "COD",
    bg: "bg-[#f3ebe2]",
    text: "text-[#5f564d]",
    border: "border-[#d7c9b8]",
    dot: "bg-[#8f8376]",
  },
  paid: {
    label: "Paid",
    bg: "bg-[#ead9c4]",
    text: "text-[#544c43]",
    border: "border-[#d7c9b8]",
    dot: "bg-[#544c43]",
  },
  failed: {
    label: "Failed",
    bg: "bg-[#ead9c4]",
    text: "text-[#544c43]",
    border: "border-[#b7aa9a]",
    dot: "bg-[#544c43]",
  },
};

export const getStatus = (status = "") =>
  STATUS_MAP[status.toLowerCase()] || STATUS_MAP.pending;
