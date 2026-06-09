import { Grid2x2, Grid3x3 } from "lucide-react";
import { SORT_OPTIONS } from "./collectionsConstants";

export default function CollectionsTopbar({
  cols,
  productCount,
  loadingProducts,
  sortBy,
  onColsChange,
  onSortChange,
}) {
  return (
    <div className="collections-topbar">
      <span className="collections-count">
        {loadingProducts
          ? ""
          : `${productCount} ${productCount === 1 ? "product" : "products"}`}
      </span>

      <div className="collections-topbar-right">
        <select
          className="sort-select"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          className={`grid-toggle-btn ${cols === 2 ? "active" : ""}`}
          onClick={() => onColsChange(2)}
          title="2 columns"
        >
          <Grid2x2 size={16} />
        </button>
        <button
          className={`grid-toggle-btn ${cols === 3 ? "active" : ""}`}
          onClick={() => onColsChange(3)}
          title="3 columns"
        >
          <Grid3x3 size={16} />
        </button>
      </div>
    </div>
  );
}
