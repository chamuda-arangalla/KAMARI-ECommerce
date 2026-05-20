import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { useCart } from "../context/useCart";
import { createOrder } from "../services/orderApi";
import "../styles/CheckoutPage.css";

const PROVINCES = [
  "Central Province",
  "Eastern Province",
  "North Central Province",
  "Northern Province",
  "North Western Province",
  "Sabaragamuwa Province",
  "Southern Province",
  "Uva Province",
  "Western Province",
];

const createReceiverDraft = () => {
  const customer = JSON.parse(localStorage.getItem("customerUser") || "{}");
  const address = customer.addresses?.find((item) => item.isDefault) || customer.addresses?.[0];

  return {
    firstName: customer.firstName || "",
    lastName: customer.lastName || "",
    address: address?.addressLine1 || "",
    district: address?.district || address?.city || "",
    province: address?.province || "",
    country: address?.country || "Sri Lanka",
    postalCode: address?.postalCode || "",
    phoneNumber: customer.phone || address?.phone || "",
    secondaryPhoneNumber: "",
  };
};

const buildOrderPayload = (items, receiverDetails) => ({
  productDetails: items.map((item) => ({
    productId: item.productId || item.id,
    colour: item.variant,
    size: item.size,
    quantity: Number(item.qty || 1),
  })),
  receiverDetails: {
    firstName: receiverDetails.firstName.trim(),
    lastName: receiverDetails.lastName.trim(),
    location: {
      address: receiverDetails.address.trim(),
      district: receiverDetails.district.trim(),
      province: receiverDetails.province.trim(),
      country: receiverDetails.country.trim() || "Sri Lanka",
      postalCode: receiverDetails.postalCode.trim(),
    },
    phoneNumber: receiverDetails.phoneNumber.trim(),
    secondaryPhoneNumber: receiverDetails.secondaryPhoneNumber.trim(),
  },
});

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    discount,
    deliveryFee,
    total,
    freeDelivery,
    promoApplied,
    clearCart,
  } = useCart();

  const [receiverDetails, setReceiverDetails] = useState(createReceiverDraft);
  const [discountCode, setDiscountCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);

  const token = localStorage.getItem("customerToken");
  const productDetails = useMemo(
    () =>
      items.map((item) => ({
        productId: item.productId || item.id,
        colour: item.variant,
        size: item.size,
        quantity: Number(item.qty || 1),
      })),
    [items],
  );

  if (!token) return <Navigate to="/login" replace />;

  const handleReceiverChange = (event) => {
    const { name, value } = event.target;
    setReceiverDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await createOrder(
        buildOrderPayload(items, receiverDetails),
        token,
      );

      setCreatedOrder(response.data);
      clearCart();
    } catch (submitError) {
      setError(
        submitError.response?.data?.error ||
          submitError.response?.data?.message ||
          "Failed to create order",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-wrapper">
        <div className="checkout-left">
          <Link to="/" className="checkout-logo">KAMARI</Link>

          <nav className="checkout-breadcrumb">
            <Link to="/cart">Cart</Link>
            <span className="checkout-breadcrumb-step">
              <ChevronRight size={12} className="step-separator" />
              <span className="step-active">Receiver Details</span>
            </span>
          </nav>

          {createdOrder ? (
            <div className="checkout-success-card">
              <h2 className="checkout-section-title">Order Created</h2>
              <p className="checkout-success-message">
                Your order has been created successfully.
              </p>
              <p className="checkout-success-order">
                Order ID: {createdOrder.orderId || createdOrder._id}
              </p>
              <Link to="/" className="checkout-btn-primary checkout-btn-link">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="checkout-section-title">Receiver Details</h2>

              <div className="checkout-row">
                <div className="checkout-field">
                  <input
                    className="checkout-input"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    value={receiverDetails.firstName}
                    onChange={handleReceiverChange}
                    required
                  />
                </div>
                <div className="checkout-field">
                  <input
                    className="checkout-input"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={receiverDetails.lastName}
                    onChange={handleReceiverChange}
                    required
                  />
                </div>
              </div>

              <div className="checkout-field">
                <input
                  className="checkout-input"
                  name="address"
                  type="text"
                  placeholder="Address"
                  value={receiverDetails.address}
                  onChange={handleReceiverChange}
                  required
                />
              </div>

              <div className="checkout-row">
                <div className="checkout-field">
                  <input
                    className="checkout-input"
                    name="district"
                    type="text"
                    placeholder="District"
                    value={receiverDetails.district}
                    onChange={handleReceiverChange}
                    required
                  />
                </div>
                <div className="checkout-field">
                  <select
                    className="checkout-select"
                    name="province"
                    value={receiverDetails.province}
                    onChange={handleReceiverChange}
                    required
                  >
                    <option value="">Province</option>
                    {PROVINCES.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="checkout-row">
                <div className="checkout-field">
                  <input
                    className="checkout-input"
                    name="country"
                    type="text"
                    placeholder="Country"
                    value={receiverDetails.country}
                    onChange={handleReceiverChange}
                    required
                  />
                </div>
                <div className="checkout-field">
                  <input
                    className="checkout-input"
                    name="postalCode"
                    type="text"
                    placeholder="Postal code"
                    value={receiverDetails.postalCode}
                    onChange={handleReceiverChange}
                    required
                  />
                </div>
              </div>

              <div className="checkout-row">
                <div className="checkout-field">
                  <input
                    className="checkout-input"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Phone number"
                    value={receiverDetails.phoneNumber}
                    onChange={handleReceiverChange}
                    required
                  />
                </div>
                <div className="checkout-field">
                  <input
                    className="checkout-input"
                    name="secondaryPhoneNumber"
                    type="tel"
                    placeholder="Secondary phone number (optional)"
                    value={receiverDetails.secondaryPhoneNumber}
                    onChange={handleReceiverChange}
                  />
                </div>
              </div>

              {error && <p className="checkout-error">{error}</p>}

              <button
                className="checkout-btn-primary"
                type="submit"
                disabled={submitting || productDetails.length === 0}
              >
                {submitting ? (
                  <span className="checkout-btn-loading">
                    <Loader2 size={16} className="checkout-spinner" />
                    Creating Order
                  </span>
                ) : (
                  `Create Order - LKR ${total.toLocaleString()}`
                )}
              </button>
              <Link to="/cart" className="checkout-btn-secondary">
                Return to cart
              </Link>
            </form>
          )}
        </div>

        <div className="checkout-right">
          <p className="order-summary-title">Order Summary</p>

          {items.length === 0 && !createdOrder ? (
            <p className="checkout-empty-summary">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="order-item-img-wrap">
                  <img src={item.img} alt={item.name} className="order-item-img" />
                  <span className="order-item-qty">{item.qty}</span>
                </div>
                <div className="order-item-details">
                  <p className="order-item-name">{item.name}</p>
                  <p className="order-item-meta">{item.variant} · Size {item.size}</p>
                </div>
                <span className="order-item-price">
                  LKR {(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))
          )}

          <div className="discount-row">
            <input
              className="discount-input"
              type="text"
              placeholder="Discount code"
              value={discountCode}
              onChange={(event) => setDiscountCode(event.target.value)}
            />
            <button className="discount-btn" type="button">Apply</button>
          </div>

          <div className="order-divider" />

          <div className="order-total-row">
            <span>Subtotal</span>
            <span className="order-total-value">LKR {subtotal.toLocaleString()}</span>
          </div>

          {promoApplied && (
            <div className="order-total-row">
              <span>Discount (KAMARI10)</span>
              <span className="order-discount-value">
                - LKR {discount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="order-total-row">
            <span>Delivery</span>
            <span className={freeDelivery ? "order-free-badge" : "order-total-value"}>
              {freeDelivery ? "Free" : `LKR ${deliveryFee.toLocaleString()}`}
            </span>
          </div>

          <div className="order-divider" />

          <div className="order-total-row total">
            <span>Total</span>
            <span>LKR {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
