import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import Header from "./components/layout/Header";
import CartDrawer from "./components/cart/CartDrawer";
import HomeFooter from "./components/home/HomeFooter";
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
import { clearLegacyCustomerSession } from "./utils/customerSession";

clearLegacyCustomerSession();

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

const CustomerShell = ({ children }) => (
  <div className="customer-theme flex min-h-screen flex-col">
    <Header />
    <CartDrawer />
    <div className="flex-1">{children}</div>
    <HomeFooter />
  </div>
);

const CustomerAuthShell = ({ children }) => (
  <div className="customer-theme">
    {children}
    <HomeFooter />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<CustomerShell><Home /></CustomerShell>} />
          <Route path="/shop" element={<CustomerShell><ShopPage /></CustomerShell>} />
          <Route path="/products/:id" element={<CustomerShell><ProductDetails /></CustomerShell>} />
          <Route path="/cart" element={<CustomerShell><Cart /></CustomerShell>} />
          <Route path="/checkout" element={<CustomerShell><CheckoutPage /></CustomerShell>} />
          <Route path="/collections" element={<CustomerShell><CollectionsPage /></CustomerShell>} />
          <Route path="/profile" element={<CustomerShell><CustomerProfilePage /></CustomerShell>} />
          <Route path="/about" element={<CustomerShell><AboutPage /></CustomerShell>} />
          <Route path="/contact" element={<CustomerShell><ContactPage /></CustomerShell>} />
          <Route path="/orders" element={<CustomerShell><CustomerOrdersPage /></CustomerShell>} />
          <Route path="/orders/:id" element={<CustomerShell><CustomerOrderDetailsPage /></CustomerShell>} />
          <Route path="/login" element={<CustomerAuthShell><CustomerLoginPage /></CustomerAuthShell>} />
          <Route path="/register" element={<CustomerAuthShell><CustomerRegisterPage /></CustomerAuthShell>} />
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
