import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import Header from "./components/layout/Header";
import CartDrawer from "./components/cart/CartDrawer";
import Home from "./pages/Home";
import ShopPage from "./pages/ShopPage";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import CheckoutPage from "./pages/CheckoutPage";
import CollectionsPage from "./pages/CollectionsPage";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import CustomerOrderDetailsPage from "./pages/CustomerOrderDetailsPage";
import CustomerOrdersPage from "./pages/CustomerOrdersPage";
import CustomerProfilePage from "./pages/CustomerProfilePage";
import CustomerRegisterPage from "./pages/CustomerRegisterPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminLayout from "./components/admin/AdminLayout";
import OrdersPage from "./pages/admin/OrdersPage";
import OrderTracking from "./pages/admin/OrderTracking";
import InventoryPage from "./pages/admin/InventoryPage";
import CustomersPage from "./pages/admin/CustomersPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import ProductDetailsPage from "./pages/admin/ProductDetailsPage";
import CollectionsManagement from "./pages/admin/CollectionsManagement";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";

const AdminGuard = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" replace />;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<><Header /><CartDrawer /><Home /></>} />
          <Route path="/shop" element={<><Header /><CartDrawer /><ShopPage /></>} />
          <Route path="/products/:id" element={<><Header /><CartDrawer /><ProductDetails /></>} />
          <Route path="/cart" element={<><Header /><CartDrawer /><Cart /></>} />
          <Route path="/checkout" element={<><Header /><CartDrawer /><CheckoutPage /></>} />
          <Route path="/collections" element={<><Header /><CartDrawer /><CollectionsPage /></>} />
          <Route path="/profile" element={<><Header /><CartDrawer /><CustomerProfilePage /></>} />
          <Route path="/about"      element={<><Header /><CartDrawer /><AboutPage /></>} />
          <Route path="/contact"    element={<><Header /><CartDrawer /><ContactPage /></>} />
          <Route path="/orders"     element={<><Header /><CartDrawer /><CustomerOrdersPage /></>} />
          <Route path="/orders/:id" element={<><Header /><CartDrawer /><CustomerOrderDetailsPage /></>} />
          <Route path="/login" element={<CustomerLoginPage />} />
          <Route path="/register" element={<CustomerRegisterPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<Navigate to="/admin/orders" replace />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="tracking" element={<OrderTracking />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="products" element={<Navigate to="/admin/inventory" replace />} />
            <Route path="products/:id" element={<ProductDetailsPage />} />
            <Route path="collections" element={<CollectionsManagement />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
