import { SHOP_SORT_OPTIONS, SHOP_TABS } from "./shopUtils";

export default function ShopFilters({
  collection,
  collections,
  sort,
  tab,
  onCollectionChange,
  onSortChange,
  onTabChange,
}) {
  return (
    <div>
      <div className="filter-section">
        <p className="filter-title">Sort By</p>
        <select
          className="pg-sort-select"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {SHOP_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <p className="filter-title">Show</p>
        <div className="filter-category-list">
          {SHOP_TABS.map(([key, label]) => (
            <button
              key={key}
              className={`filter-category-btn ${tab === key ? "active" : ""}`}
              onClick={() => onTabChange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <p className="filter-title">Collection</p>
        <select
          className="pg-sort-select"
          value={collection}
          onChange={(event) => onCollectionChange(event.target.value)}
        >
          {collections.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
