import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CollectionsPagination from "../components/collections/CollectionsPagination";
import CollectionsSidebar from "../components/collections/CollectionsSidebar";
import CollectionsTopbar from "../components/collections/CollectionsTopbar";
import ProductCard from "../components/collections/ProductCard";
import ProductCardSkeleton from "../components/collections/ProductCardSkeleton";
import {
  PRODUCTS_PER_PAGE,
  SIZE_ORDER,
} from "../components/collections/collectionsConstants";
import {
  getProducts,
  mapBackendProductToCollectionProduct,
} from "../services/productApi";
import "../styles/CollectionsPage.css";

export default function CollectionsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState("featured");
  const [cols, setCols] = useState(3);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductsError("");

        const response = await getProducts();
        setProducts(
          (response.data || []).map(mapBackendProductToCollectionProduct),
        );
      } catch (error) {
        setProductsError(
          error.response?.data?.message || "Could not load latest products",
        );
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const maxProductPrice = useMemo(() => {
    if (!products.length) return 100000;
    return Math.ceil(Math.max(...products.map((p) => p.price || 0)) / 1000) * 1000;
  }, [products]);

  useEffect(() => {
    if (!products.length) return undefined;

    const timeoutId = setTimeout(() => {
      setMaxPrice(maxProductPrice);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [maxProductPrice, products.length]);

  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlSort = searchParams.get("sort");

    const timeoutId = setTimeout(() => {
      if (urlCategory) {
        setCategory(urlCategory);
        setPage(1);
      }
      if (urlSort) {
        setSortBy(urlSort);
        setPage(1);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  const categoryOptions = useMemo(
    () => [
      "All",
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ],
    [products],
  );

  const colorOptions = useMemo(() => {
    const uniqueColors = new Map();
    products.flatMap((product) => product.colors || []).forEach((color) => {
      if (color.name && !uniqueColors.has(color.name)) {
        uniqueColors.set(color.name, color);
      }
    });
    return [...uniqueColors.values()];
  }, [products]);

  const sizeOptions = useMemo(() => {
    const seen = new Set();
    products.flatMap((product) => product.sizes || []).forEach((size) => {
      seen.add(size);
    });

    return [...seen].sort((a, b) => {
      const aIndex = SIZE_ORDER.indexOf(a);
      const bIndex = SIZE_ORDER.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (category !== "All") {
      list = list.filter((product) => product.category === category);
    }
    if (inStockOnly) {
      list = list.filter((product) => product.inStock);
    }
    if (selectedSizes.length) {
      list = list.filter((product) =>
        product.sizes.some((size) => selectedSizes.includes(size)),
      );
    }
    if (selectedColors.length) {
      list = list.filter((product) =>
        product.colors.some((color) => selectedColors.includes(color.name)),
      );
    }

    list = list.filter((product) => product.price <= maxPrice);

    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.badge === "NEW") - (a.badge === "NEW"));
    } else if (sortBy === "best-selling") {
      list.sort(
        (a, b) =>
          (b.badge === "BEST SELLER") - (a.badge === "BEST SELLER"),
      );
    }

    return list;
  }, [
    products,
    category,
    inStockOnly,
    selectedSizes,
    selectedColors,
    maxPrice,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE,
  );

  const resetPage = () => setPage(1);

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((selected) => selected !== size)
        : [...prev, size],
    );
    resetPage();
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((selected) => selected !== color)
        : [...prev, color],
    );
    resetPage();
  };

  const clearFilters = () => {
    setCategory("All");
    setSelectedSizes([]);
    setSelectedColors([]);
    setInStockOnly(false);
    setMaxPrice(maxProductPrice);
    setSortBy("featured");
    resetPage();
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="collections-page">
      <div className="collections-header">
        <h1 className="collections-header-title">All Collections</h1>
        <p className="collections-header-sub">
          Curated pieces for the modern woman, designed to be worn, lived in,
          and loved.
        </p>
      </div>

      <div className="collections-body">
        <CollectionsSidebar
          category={category}
          categoryOptions={categoryOptions}
          colorOptions={colorOptions}
          inStockOnly={inStockOnly}
          maxPrice={maxPrice}
          maxProductPrice={maxProductPrice}
          selectedColors={selectedColors}
          selectedSizes={selectedSizes}
          sizeOptions={sizeOptions}
          onCategoryChange={(value) => {
            setCategory(value);
            resetPage();
          }}
          onClearFilters={clearFilters}
          onColorToggle={toggleColor}
          onInStockToggle={() => {
            setInStockOnly((value) => !value);
            resetPage();
          }}
          onMaxPriceChange={(value) => {
            setMaxPrice(value);
            resetPage();
          }}
          onSizeToggle={toggleSize}
        />

        <main className="collections-main">
          <CollectionsTopbar
            cols={cols}
            productCount={filteredProducts.length}
            loadingProducts={loadingProducts}
            sortBy={sortBy}
            onColsChange={setCols}
            onSortChange={(value) => {
              setSortBy(value);
              resetPage();
            }}
          />

          {productsError && (
            <div className="collections-empty" style={{ marginBottom: "24px" }}>
              <p className="collections-empty-title">Products unavailable</p>
              <p className="collections-empty-sub">{productsError}</p>
            </div>
          )}

          {loadingProducts ? (
            <div className={`product-grid cols-${cols}`}>
              {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="collections-empty">
              <p className="collections-empty-title">No products found</p>
              <p className="collections-empty-sub">Try adjusting your filters.</p>
              <button className="filter-clear-btn" onClick={clearFilters}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className={`product-grid cols-${cols}`}>
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={() => navigate(`/products/${product.id}`)}
                />
              ))}
            </div>
          )}

          <CollectionsPagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
}
