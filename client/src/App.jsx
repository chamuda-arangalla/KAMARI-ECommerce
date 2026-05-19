import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import CustomerProfilePage from "./pages/CustomerProfilePage";
import CustomerRegisterPage from "./pages/CustomerRegisterPage";
import AdminLayout from "./components/admin/AdminLayout";
import OrdersPage from "./pages/admin/OrdersPage";
import OrderTracking from "./pages/admin/OrderTracking";
import InventoryPage from "./pages/admin/InventoryPage";
import CustomersPage from "./pages/admin/CustomersPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import ProductManagement from "./pages/admin/ProductManagement";
import ProductDetailsPage from "./pages/admin/ProductDetailsPage";
import CollectionsManagement from "./pages/admin/CollectionsManagement";
import AdminLoginPage from "./pages/admin/AdminLoginPage";

const AdminGuard = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<><Header /><CartDrawer /><Home /></>} />
          <Route path="/shop" element={<><Header /><CartDrawer /><ShopPage /></>} />
          <Route path="/products/:id" element={<><Header /><CartDrawer /><ProductDetails /></>} />
          <Route path="/cart" element={<><Header /><CartDrawer /><Cart /></>} />
          <Route path="/checkout" element={<><Header /><CartDrawer /><CheckoutPage /></>} />
          <Route path="/collections" element={<><Header /><CartDrawer /><CollectionsPage /></>} />
          <Route path="/profile" element={<><Header /><CartDrawer /><CustomerProfilePage /></>} />
          <Route path="/login" element={<CustomerLoginPage />} />
          <Route path="/register" element={<CustomerRegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<Navigate to="/admin/orders" replace />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="tracking" element={<OrderTracking />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id" element={<ProductDetailsPage />} />
            <Route path="collections" element={<CollectionsManagement />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
