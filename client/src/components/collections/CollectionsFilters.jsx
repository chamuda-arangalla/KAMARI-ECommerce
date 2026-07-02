import { SORT_OPTIONS } from "./collectionsConstants";

export default function CollectionsFilters({
  category,
  categoryOptions,
  colorOptions,
  inStockOnly,
  maxPrice,
  maxProductPrice,
  selectedColors,
  selectedSizes,
  sizeOptions,
  sortBy,
  onCategoryChange,
  onClearFilters,
  onColorToggle,
  onInStockToggle,
  onMaxPriceChange,
  onSizeToggle,
  onSortChange,
}) {
  return (
    <div>
      <div className="filter-section">
        <p className="filter-title">Sort By</p>
        <select
          className="pg-sort-select"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <p className="filter-title">Category</p>
        <div className="filter-category-list">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              className={`filter-category-btn ${category === cat ? "active" : ""}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-toggle">
          <span className="filter-toggle-label">In stock only</span>
          <button
            className={`toggle-switch ${inStockOnly ? "on" : ""}`}
            onClick={onInStockToggle}
            aria-label="Toggle in stock"
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </div>

      <div className="filter-section">
        <p className="filter-title">Price</p>
        <div className="filter-price-range">
          <input
            type="range"
            className="price-range-slider"
            min={0}
            max={maxProductPrice}
            step={1000}
            value={Math.min(maxPrice, maxProductPrice)}
            onChange={(event) => onMaxPriceChange(Number(event.target.value))}
          />
          <div className="price-range-values">
            <span>Rs 0</span>
            <span>
              Up to Rs {Math.min(maxPrice, maxProductPrice).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <p className="filter-title">Size</p>
        <div className="filter-sizes">
          {sizeOptions.map((size) => (
            <button
              key={size}
              className={`filter-size-btn ${
                selectedSizes.includes(size) ? "active" : ""
              }`}
              onClick={() => onSizeToggle(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <p className="filter-title">Color</p>
        <div className="filter-colors">
          {colorOptions.map((color) => (
            <button
              key={color.name}
              className={`filter-color-btn ${
                selectedColors.includes(color.name) ? "active" : ""
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              onClick={() => onColorToggle(color.name)}
            />
          ))}
        </div>
      </div>

      <button className="filter-clear-btn" onClick={onClearFilters}>
        Clear all filters
      </button>
    </div>
  );
}
