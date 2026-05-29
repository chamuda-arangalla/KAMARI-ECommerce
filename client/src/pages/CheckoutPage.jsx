import { useMemo, useState, useRef, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { ChevronRight, Loader2, ChevronDown, Search, Upload, CheckCircle2, X } from "lucide-react";
import { useCart } from "../context/useCart";
import { createOrder, uploadPaymentSlip } from "../services/orderApi";
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

const DISTRICTS = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

function SearchableDropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const select = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className="district-dropdown" ref={ref}>
      <button
        type="button"
        className={`district-trigger ${!value ? "placeholder" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{value || placeholder}</span>
        <ChevronDown size={14} className={`district-chevron ${open ? "open" : ""}`} />
      </button>

      {open && (
        <div className="district-menu">
          <div className="district-search-wrap">
            <Search size={14} className="district-search-icon" />
            <input
              ref={searchRef}
              type="text"
              className="district-search"
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ul className="district-list">
            {filtered.length > 0 ? (
              filtered.map((o) => (
                <li
                  key={o}
                  className={`district-option ${value === o ? "selected" : ""}`}
                  onMouseDown={() => select(o)}
                >
                  {o}
                </li>
              ))
            ) : (
              <li className="district-no-result">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

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
  const [orderTotal, setOrderTotal] = useState(0);
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [slipUploading, setSlipUploading] = useState(false);
  const [slipUploaded, setSlipUploaded] = useState(false);
  const [slipError, setSlipError] = useState("");
  const slipInputRef = useRef(null);

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

      setOrderTotal(total);
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

  const handleSlipSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSlipFile(file);
    setSlipPreview(URL.createObjectURL(file));
    setSlipUploaded(false);
    setSlipError("");
  };

  const handleSlipUpload = async () => {
    if (!slipFile || !createdOrder) return;
    setSlipUploading(true);
    setSlipError("");
    try {
      await uploadPaymentSlip(createdOrder._id, slipFile, token);
      setSlipUploaded(true);
    } catch {
      setSlipError("Upload failed. Please try again.");
    } finally {
      setSlipUploading(false);
    }
  };

  const handleSlipRemove = () => {
    setSlipFile(null);
    setSlipPreview(null);
    setSlipUploaded(false);
    setSlipError("");
    if (slipInputRef.current) slipInputRef.current.value = "";
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
            <div>
              <div className="checkout-order-confirmed">
                <div className="checkout-confirmed-icon">✓</div>
                <h2 className="checkout-confirmed-title">Order Confirmed</h2>
                <p className="checkout-confirmed-sub">
                  Thank you! Your order has been placed successfully.
                </p>
                <p className="checkout-confirmed-id">
                  Order ID: <strong>{createdOrder.orderId || createdOrder._id}</strong>
                </p>
              </div>

              <div className="bank-transfer-card">
                <div className="bank-transfer-header">
                  <span className="bank-transfer-badge">Bank Transfer</span>
                  <h3 className="bank-transfer-title">Complete Your Payment</h3>
                  <p className="bank-transfer-note">
                    Please transfer the exact order amount to the bank account below
                    and send your payment slip to confirm your order.
                  </p>
                </div>

                <div className="bank-details">
                  <div className="bank-detail-row">
                    <span className="bank-detail-label">Bank</span>
                    <span className="bank-detail-value">HNB Malabe</span>
                  </div>
                  <div className="bank-detail-row">
                    <span className="bank-detail-label">Account Number</span>
                    <span className="bank-detail-value bank-detail-account">156020128784</span>
                  </div>
                  <div className="bank-detail-row">
                    <span className="bank-detail-label">Account Name</span>
                    <span className="bank-detail-value">Nimesha Dhananjanee</span>
                  </div>
                  <div className="bank-detail-row bank-detail-amount">
                    <span className="bank-detail-label">Amount to Pay</span>
                    <span className="bank-detail-value bank-detail-total">
                      LKR {orderTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bank-transfer-steps">
                  <p className="bank-steps-title">Next Steps</p>
                  <ol className="bank-steps-list">
                    <li>Transfer <strong>LKR {orderTotal.toLocaleString()}</strong> to the account above.</li>
                    <li>Use your Order ID <strong>{createdOrder.orderId || createdOrder._id}</strong> as the payment reference.</li>
                    <li>Send your payment slip via WhatsApp or email to confirm your order.</li>
                  </ol>
                </div>
              </div>

              {/* ── Payment Slip Upload ── */}
              <div className="slip-upload-card">
                <div className="slip-upload-header">
                  <p className="slip-upload-title">Upload Payment Slip</p>
                  <p className="slip-upload-sub">
                    Attach your bank transfer receipt to speed up order confirmation.
                  </p>
                </div>

                {slipUploaded ? (
                  <div className="slip-success">
                    <CheckCircle2 size={20} className="slip-success-icon" />
                    <span>Payment slip uploaded successfully!</span>
                  </div>
                ) : (
                  <>
                    {slipPreview ? (
                      <div className="slip-preview-wrap">
                        <img src={slipPreview} alt="Payment slip preview" className="slip-preview-img" />
                        <button type="button" className="slip-remove-btn" onClick={handleSlipRemove}>
                          <X size={14} /> Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="slip-drop-zone"
                        onClick={() => slipInputRef.current?.click()}
                      >
                        <Upload size={22} className="slip-upload-icon" />
                        <span className="slip-drop-label">Click to select your payment slip</span>
                        <span className="slip-drop-hint">JPG, PNG or WEBP · Max 5MB</span>
                      </button>
                    )}

                    <input
                      ref={slipInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: "none" }}
                      onChange={handleSlipSelect}
                    />

                    {slipError && <p className="slip-error">{slipError}</p>}

                    {slipFile && !slipUploaded && (
                      <button
                        type="button"
                        className="slip-submit-btn"
                        onClick={handleSlipUpload}
                        disabled={slipUploading}
                      >
                        {slipUploading ? (
                          <span className="checkout-btn-loading">
                            <Loader2 size={15} className="checkout-spinner" /> Uploading...
                          </span>
                        ) : (
                          "Submit Payment Slip"
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>

              <Link to="/" className="checkout-btn-primary checkout-btn-link" style={{ marginTop: "24px" }}>
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
                  <SearchableDropdown
                    value={receiverDetails.district}
                    onChange={(val) =>
                      setReceiverDetails((prev) => ({ ...prev, district: val }))
                    }
                    options={DISTRICTS}
                    placeholder="District"
                  />
                </div>
                <div className="checkout-field">
                  <SearchableDropdown
                    value={receiverDetails.province}
                    onChange={(val) =>
                      setReceiverDetails((prev) => ({ ...prev, province: val }))
                    }
                    options={PROVINCES}
                    placeholder="Province"
                  />
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
            <span>LKR {orderTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
