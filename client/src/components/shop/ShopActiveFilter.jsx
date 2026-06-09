import { X } from "lucide-react";

export default function ShopActiveFilter({ collection, onClear }) {
  if (collection === "All") return null;

  return (
    <div className="shop-active-filter">
      <span>
        Collection: <strong>{collection}</strong>
      </span>
      <button onClick={onClear}>
        <X size={14} />
      </button>
    </div>
  );
}
