import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductBreadcrumb from "../components/productDetails/ProductBreadcrumb";
import {
  ProductDetailsError,
  ProductDetailsLoading,
} from "../components/productDetails/ProductDetailsState";
import ProductGallery from "../components/productDetails/ProductGallery";
import ProductInfoAccordions from "../components/productDetails/ProductInfoAccordions";
import ProductPanel from "../components/productDetails/ProductPanel";
import RelatedProducts from "../components/productDetails/RelatedProducts";
import {
  getDefaultSize,
  getProductImages,
  getProductStockCount,
  hasStock,
  isProductInStock,
  PRODUCT_FALLBACK_IMAGE,
} from "../components/productDetails/productDetailsUtils";
import { useCart } from "../context/useCart";
import { getProductById, getProducts } from "../services/productApi";
import "../styles/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleAddItem, setIsDrawerOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selColorIdx, setSelColorIdx] = useState(0);
  const [selSize, setSelSize] = useState("");
  const [qty, setQty] = useState(1);
  const [mainIdx, setMainIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addedMsg, setAddedMsg] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const sizeChartRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const [productResponse, allProductsResponse] = await Promise.all([
          getProductById(id),
          getProducts(),
        ]);
        const loadedProduct = productResponse.data;
        const loadedCollection =
          loadedProduct.setName || loadedProduct.collection;

        setProduct(loadedProduct);
        setRelated(
          (allProductsResponse.data || [])
            .filter(
              (item) =>
                item._id !== loadedProduct._id &&
                (item.setName || item.collection) === loadedCollection,
            )
            .slice(0, 4),
        );
        setSelColorIdx(0);
        setSelSize(getDefaultSize(loadedProduct.colors?.[0]));
        setQty(1);
        setMainIdx(0);
        setSizeChartOpen(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const selColor = product?.colors?.[selColorIdx];
  const images = useMemo(() => {
    const colorImages = selColor?.images || [];
    return colorImages.length ? colorImages : getProductImages(product);
  }, [product, selColor]);
  const mainImages = images.length ? images : [{ url: PRODUCT_FALLBACK_IMAGE }];

  const selSizeItem = selColor?.sizes?.find((size) => size.size === selSize);
  const selStock = Number(selSizeItem?.stock || 0);
  const totalStock = getProductStockCount(product);
  const inStock = isProductInStock(product);

  const selectColor = (index) => {
    const color = product.colors[index];
    setSelColorIdx(index);
    setMainIdx(0);
    setQty(1);
    setSelSize(getDefaultSize(color));
  };

  const selectSize = (size) => {
    setSelSize(size);
    setQty(1);
  };

  const isLoggedIn = () => Boolean(localStorage.getItem("customerToken"));

  const selectedCartItem = () => ({
    id: `${product._id}-${selColor.colorName}-${selSize}`,
    productId: product._id,
    name: product.name,
    variant: selColor.colorName,
    size: selSize,
    price: Number(product.price || 0),
    qty,
    img: mainImages[0]?.url || PRODUCT_FALLBACK_IMAGE,
  });

  const canAddSelectedItem = product && selColor && selSize && hasStock(selSizeItem);

  const addToCart = () => {
    if (!canAddSelectedItem) return;

    handleAddItem(selectedCartItem());
    if (!isLoggedIn()) {
      navigate("/login?redirect=cart");
      return;
    }

    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2500);
  };

  const buyNow = () => {
    if (!canAddSelectedItem) return;

    handleAddItem(selectedCartItem());
    setIsDrawerOpen(false);
    if (!isLoggedIn()) {
      navigate("/login?redirect=checkout");
      return;
    }
    navigate("/checkout");
  };

  const showSizeChart = () => {
    setSizeChartOpen(true);
    window.setTimeout(() => {
      sizeChartRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  if (loading) return <ProductDetailsLoading />;
  if (error || !product) {
    return (
      <ProductDetailsError
        error={error}
        onBack={() => navigate(-1)}
      />
    );
  }

  return (
    <main className="pd-page">
      <ProductBreadcrumb product={product} />

      <div className="pd-container">
        <ProductGallery
          product={product}
          images={mainImages}
          mainIdx={mainIdx}
          inStock={inStock}
          onMainImageChange={setMainIdx}
        />

        <ProductPanel
          product={product}
          selColor={selColor}
          selColorIdx={selColorIdx}
          selSize={selSize}
          selStock={selStock}
          qty={qty}
          totalStock={totalStock}
          inStock={inStock}
          addedMsg={addedMsg}
          onAddToCart={addToCart}
          onBuyNow={buyNow}
          onCollectionOpen={() =>
            navigate(
              `/collections?category=${encodeURIComponent(
                product.setName || product.collection,
              )}`,
            )
          }
          onColorSelect={selectColor}
          onQtyChange={setQty}
          onSizeChartOpen={showSizeChart}
          onSizeSelect={selectSize}
        />
      </div>

      <ProductInfoAccordions
        product={product}
        sizeChartOpen={sizeChartOpen}
        sizeChartRef={sizeChartRef}
        onSizeChartToggle={setSizeChartOpen}
      />

      <RelatedProducts
        products={related}
        onOpenProduct={(item) => navigate(`/products/${item._id}`)}
      />
    </main>
  );
}
