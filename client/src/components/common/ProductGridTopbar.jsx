import { Grid2x2, LayoutGrid, SlidersHorizontal } from "lucide-react";

export default function ProductGridTopbar({
  count,
  loading,
  cols,
  onColsChange,
  onFilterClick,
}) {
  return (
    <div className="pg-topbar">
      <span className="pg-count">
        {loading ? "" : `${count} ${count === 1 ? "PRODUCT" : "PRODUCTS"}`}
      </span>

      <div className="pg-topbar-right">
        <button
          type="button"
          className={`pg-grid-toggle desktop-only ${cols === 2 ? "active" : ""}`}
          onClick={() => onColsChange(2)}
          aria-label="2 columns"
        >
          <Grid2x2 size={17} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          className={`pg-grid-toggle desktop-only ${cols === 4 ? "active" : ""}`}
          onClick={() => onColsChange(4)}
          aria-label="4 columns"
        >
          <LayoutGrid size={17} strokeWidth={1.5} />
        </button>

        <button type="button" className="pg-filter-btn" onClick={onFilterClick}>
          <SlidersHorizontal size={14} strokeWidth={1.5} />
          Filter &amp; Sort
        </button>
      </div>
    </div>
  );
}
