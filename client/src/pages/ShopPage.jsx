import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterSortDrawer from "../components/common/FilterSortDrawer";
import ProductGridTopbar from "../components/common/ProductGridTopbar";
import ShopFilters from "../components/shop/ShopFilters";
import ShopHero from "../components/shop/ShopHero";
import ShopPagination from "../components/shop/ShopPagination";
import ShopProductGrid from "../components/shop/ShopProductGrid";
import { SHOP_PRODUCTS_PER_PAGE } from "../components/shop/shopUtils";
import { getProducts } from "../services/productApi";
import "../styles/ProductGridMimosa.css";
import "../styles/ShopPage.css";

export default function ShopPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [collection, setCollection] = useState("All");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [cols, setCols] = useState(4);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getProducts();
        setProducts(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const collections = useMemo(
    () => [
      "All",
      ...new Set(
        products
          .map((product) => product.setName || product.collection)
          .filter(Boolean),
      ),
    ],
    [products],
  );

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (tab === "new") list = list.filter((product) => product.isNewArrival);
    if (tab === "best") list = list.filter((product) => product.isFeatured);
    if (collection !== "All") {
      list = list.filter(
        (product) => (product.setName || product.collection) === collection,
      );
    }

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "newest") {
      list.sort(
        (a, b) =>
          (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0),
      );
    }

    return list;
  }, [products, tab, collection, sort]);

  const totalPages = Math.ceil(filteredProducts.length / SHOP_PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * SHOP_PRODUCTS_PER_PAGE,
    page * SHOP_PRODUCTS_PER_PAGE,
  );

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (nextTab) => {
    setTab(nextTab);
    setPage(1);
  };

  const handleCollectionChange = (nextCollection) => {
    setCollection(nextCollection);
    setPage(1);
  };

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    setPage(1);
  };

  const clearFilters = () => {
    setTab("all");
    handleCollectionChange("All");
  };

  return (
    <main className="shop-page">
      <ShopHero />

      <ProductGridTopbar
        cols={cols}
        count={filteredProducts.length}
        loading={loading}
        onColsChange={setCols}
        onFilterClick={() => setFilterOpen(true)}
      />

      <ShopProductGrid
        cols={cols}
        error={error}
        loading={loading}
        products={paginatedProducts}
        onClearFilters={clearFilters}
        onOpenProduct={(product) => navigate(`/products/${product._id}`)}
      />

      <ShopPagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <FilterSortDrawer open={filterOpen} onClose={() => setFilterOpen(false)}>
        <ShopFilters
          collection={collection}
          collections={collections}
          sort={sort}
          tab={tab}
          onCollectionChange={handleCollectionChange}
          onSortChange={handleSortChange}
          onTabChange={handleTabChange}
        />
      </FilterSortDrawer>
    </main>
  );
}
