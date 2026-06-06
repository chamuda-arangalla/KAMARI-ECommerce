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
    bg: "bg-[#f3eadf]",
    text: "text-[#7a5838]",
    border: "border-[#dcc8b4]",
    dot: "bg-[#a8774d]",
  },
  complete: {
    label: "Complete",
    bg: "bg-[#efe6dc]",
    text: "text-[#4f3b2d]",
    border: "border-[#d2bba4]",
    dot: "bg-[#6f4f37]",
  },
  cod: {
    label: "COD",
    bg: "bg-[#f8f5f2]",
    text: "text-[#5c4b3f]",
    border: "border-[#e5ddd5]",
    dot: "bg-[#8a7667]",
  },
  paid: {
    label: "Paid",
    bg: "bg-[#efe6dc]",
    text: "text-[#4f3b2d]",
    border: "border-[#d2bba4]",
    dot: "bg-[#6f4f37]",
  },
  failed: {
    label: "Failed",
    bg: "bg-[#eaded4]",
    text: "text-[#5a3026]",
    border: "border-[#c9a797]",
    dot: "bg-[#7d4a3a]",
  },
};

export const getStatus = (status = "") =>
  STATUS_MAP[status.toLowerCase()] || STATUS_MAP.pending;
