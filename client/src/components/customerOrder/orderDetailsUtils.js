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
    dot: "bg-[#a8774d]",
    text: "text-[#7a5838]",
    bg: "bg-[#f3eadf]",
    border: "border-[#dcc8b4]",
    bar: "bg-[#a8774d]",
  },
  complete: {
    label: "Complete",
    dot: "bg-[#6f4f37]",
    text: "text-[#4f3b2d]",
    bg: "bg-[#efe6dc]",
    border: "border-[#d2bba4]",
    bar: "bg-[#6f4f37]",
  },
  cod: {
    label: "COD",
    dot: "bg-[#8a7667]",
    text: "text-[#5c4b3f]",
    bg: "bg-[#f8f5f2]",
    border: "border-[#e5ddd5]",
    bar: "bg-[#8a7667]",
  },
  paid: {
    label: "Paid",
    dot: "bg-[#6f4f37]",
    text: "text-[#4f3b2d]",
    bg: "bg-[#efe6dc]",
    border: "border-[#d2bba4]",
    bar: "bg-[#6f4f37]",
  },
  failed: {
    label: "Failed",
    dot: "bg-[#7d4a3a]",
    text: "text-[#5a3026]",
    bg: "bg-[#eaded4]",
    border: "border-[#c9a797]",
    bar: "bg-[#7d4a3a]",
  },
};

export const getStatus = (status = "") =>
  STATUS_MAP[status.toLowerCase()] || STATUS_MAP.pending;
