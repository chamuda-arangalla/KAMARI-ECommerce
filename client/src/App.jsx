import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/layout/Header";
import CartDrawer from "./components/cart/CartDrawer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import CheckoutPage from "./pages/CheckoutPage";
import CollectionsPage from "./pages/CollectionsPage";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import CustomerRegisterPage from "./pages/CustomerRegisterPage";
import AdminLayout from "./components/admin/AdminLayout";
import OrdersPage from "./pages/admin/OrdersPage";
import OrderTracking from "./pages/admin/OrderTracking";
import InventoryPage from "./pages/admin/InventoryPage";
import CustomersPage from "./pages/admin/CustomersPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import ProductManagement from "./pages/admin/ProductManagement";

const AdminGuard = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<><Header /><CartDrawer /><Home /></>} />
          <Route path="/cart" element={<><Header /><CartDrawer /><Cart /></>} />
          <Route path="/checkout" element={<><Header /><CartDrawer /><CheckoutPage /></>} />
          <Route path="/collections" element={<><Header /><CartDrawer /><CollectionsPage /></>} />
          <Route path="/login" element={<CustomerLoginPage />} />
          <Route path="/register" element={<CustomerRegisterPage />} />
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<Navigate to="/admin/orders" replace />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="tracking" element={<OrderTracking />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="products" element={<ProductManagement />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
