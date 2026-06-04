import { SHOP_SORT_OPTIONS, SHOP_TABS } from "./shopUtils";

export default function ShopControls({
  collection,
  collections,
  filteredCount,
  loading,
  sort,
  tab,
  onCollectionChange,
  onSortChange,
  onTabChange,
}) {
  return (
    <div className="shop-controls">
      <div className="shop-tabs">
        {SHOP_TABS.map(([key, label]) => (
          <button
            key={key}
            className={`shop-tab ${tab === key ? "active" : ""}`}
            onClick={() => onTabChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="shop-controls-right">
        <span className="shop-count">
          {loading
            ? "Loading..."
            : `${filteredCount} ${filteredCount === 1 ? "product" : "products"}`}
        </span>

        <select
          className="shop-select"
          value={collection}
          onChange={(event) => onCollectionChange(event.target.value)}
        >
          {collections.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className="shop-select"
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
    </div>
  );
}
