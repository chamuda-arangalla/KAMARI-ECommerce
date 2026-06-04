import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopActiveFilter from "../components/shop/ShopActiveFilter";
import ShopControls from "../components/shop/ShopControls";
import ShopHero from "../components/shop/ShopHero";
import ShopPagination from "../components/shop/ShopPagination";
import ShopProductGrid from "../components/shop/ShopProductGrid";
import {
  FALLBACK_IMAGE,
  getFirstAvailableVariant,
  getProductImages,
  isProductInStock,
  SHOP_PRODUCTS_PER_PAGE,
} from "../components/shop/shopUtils";
import { useCart } from "../context/useCart";
import { getProducts } from "../services/productApi";
import "../styles/ShopPage.css";

export default function ShopPage() {
  const navigate = useNavigate();
  const { handleAddItem } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [collection, setCollection] = useState("All");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

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

  const quickAdd = (product, color) => {
    if (!isProductInStock(product)) return;

    const images = color?.images?.length ? color.images : getProductImages(product);
    const variant = color
      ? {
          colorName: color.colorName,
          size:
            color.sizes?.find((size) => Number(size.stock || 0) > 0)?.size ||
            color.sizes?.[0]?.size ||
            "S",
        }
      : getFirstAvailableVariant(product);

    handleAddItem({
      id: `${product._id}-${variant.colorName}-${variant.size}`,
      productId: product._id,
      name: product.name,
      variant: variant.colorName,
      size: variant.size,
      price: Number(product.price || 0),
      qty: 1,
      img: images[0]?.url || FALLBACK_IMAGE,
    });
  };

  return (
    <main className="shop-page">
      <ShopHero />

      <ShopControls
        collection={collection}
        collections={collections}
        filteredCount={filteredProducts.length}
        loading={loading}
        sort={sort}
        tab={tab}
        onCollectionChange={handleCollectionChange}
        onSortChange={handleSortChange}
        onTabChange={handleTabChange}
      />

      <ShopActiveFilter
        collection={collection}
        onClear={() => handleCollectionChange("All")}
      />

      <ShopProductGrid
        error={error}
        loading={loading}
        products={paginatedProducts}
        onClearFilters={clearFilters}
        onOpenProduct={(product) => navigate(`/products/${product._id}`)}
        onQuickAdd={quickAdd}
      />

      <ShopPagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  );
}
