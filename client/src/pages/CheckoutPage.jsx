import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { VisaIcon, MastercardIcon, AmexIcon, KokoIcon, MintpayIcon, CodIcon } from "../components/checkout/PaymentIcons";
import "../styles/CheckoutPage.css";

const STEPS = ["Information", "Shipping", "Payment"];

const PROVINCES = [
  "Central Province", "Eastern Province", "North Central Province",
  "Northern Province", "North Western Province", "Sabaragamuwa Province",
  "Southern Province", "Uva Province", "Western Province",
];

export default function CheckoutPage() {
  const { items, subtotal, discount, deliveryFee, total, freeDelivery, promoApplied } = useCart();

  const [step, setStep] = useState(0);
  const [discountCode, setDiscountCode] = useState("");

  const [contact, setContact] = useState({ email: "", newsletter: false });
  const [delivery, setDelivery] = useState({
    country: "Sri Lanka",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [payment, setPayment] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
    sameAsBilling: true,
  });

  const formatCard = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  };

  return (
    <div className="checkout-page">
    <div className="checkout-wrapper">

      {/* ── Left Column ─────────────────────────── */}
      <div className="checkout-left">

        {/* Logo */}
        <Link to="/" className="checkout-logo">KAMARI</Link>

        {/* Breadcrumb */}
        <nav className="checkout-breadcrumb">
          <Link to="/cart">Cart</Link>
          {STEPS.map((s, i) => (
            <span key={s} className="checkout-breadcrumb-step">
              <ChevronRight size={12} className="step-separator" />
              <span
                className={
                  i === step ? "step-active"
                  : i < step ? "step-past"
                  : "step-upcoming"
                }
                onClick={() => i < step && setStep(i)}
              >
                {s}
              </span>
            </span>
          ))}
        </nav>

        {/* ── Step 0 — Information ────────────── */}
        {step === 0 && (
          <>
            <h2 className="checkout-section-title">Contact</h2>

            <div className="checkout-field">
              <input
                className="checkout-input"
                type="email"
                placeholder="Email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
              />
            </div>

            <label className="checkout-checkbox">
              <input
                type="checkbox"
                checked={contact.newsletter}
                onChange={(e) => setContact({ ...contact, newsletter: e.target.checked })}
              />
              <span>Email me with news and offers</span>
            </label>

            <h2 className="checkout-section-title">Delivery</h2>

            <div className="checkout-field">
              <select
                className="checkout-select"
                value={delivery.country}
                onChange={(e) => setDelivery({ ...delivery, country: e.target.value })}
              >
                <option>Sri Lanka</option>
                <option>Maldives</option>
                <option>India</option>
                <option>Australia</option>
                <option>United Kingdom</option>
                <option>United States</option>
              </select>
            </div>

            <div className="checkout-row">
              <div className="checkout-field">
                <input
                  className="checkout-input"
                  type="text"
                  placeholder="First name"
                  value={delivery.firstName}
                  onChange={(e) => setDelivery({ ...delivery, firstName: e.target.value })}
                />
              </div>
              <div className="checkout-field">
                <input
                  className="checkout-input"
                  type="text"
                  placeholder="Last name"
                  value={delivery.lastName}
                  onChange={(e) => setDelivery({ ...delivery, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="checkout-field">
              <input
                className="checkout-input"
                type="text"
                placeholder="Address"
                value={delivery.address}
                onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
              />
            </div>

            <div className="checkout-field">
              <input
                className="checkout-input"
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                value={delivery.apartment}
                onChange={(e) => setDelivery({ ...delivery, apartment: e.target.value })}
              />
            </div>

            <div className="checkout-row">
              <div className="checkout-field">
                <input
                  className="checkout-input"
                  type="text"
                  placeholder="City"
                  value={delivery.city}
                  onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                />
              </div>
              <div className="checkout-field">
                <select
                  className="checkout-select"
                  value={delivery.province}
                  onChange={(e) => setDelivery({ ...delivery, province: e.target.value })}
                >
                  <option value="">Province</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="checkout-field">
              <input
                className="checkout-input"
                type="text"
                placeholder="Postal code (optional)"
                value={delivery.postalCode}
                onChange={(e) => setDelivery({ ...delivery, postalCode: e.target.value })}
              />
            </div>

            <div className="checkout-field">
              <input
                className="checkout-input"
                type="tel"
                placeholder="Phone (optional)"
                value={delivery.phone}
                onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })}
              />
            </div>

            <button className="checkout-btn-primary" onClick={() => setStep(1)}>
              Continue to shipping
            </button>
            <Link to="/cart" className="checkout-btn-secondary">Return to cart</Link>
          </>
        )}

        {/* ── Step 1 — Shipping ───────────────── */}
        {step === 1 && (
          <>
            {/* Contact + Delivery summary */}
            <div className="checkout-info-card">
              <div className="checkout-info-row">
                <span className="checkout-info-label">Contact</span>
                <span className="checkout-info-value">{contact.email || "—"}</span>
                <button className="checkout-info-edit" onClick={() => setStep(0)}>Edit</button>
              </div>
              <div className="checkout-info-row">
                <span className="checkout-info-label">Ship to</span>
                <span className="checkout-info-value">
                  {[delivery.address, delivery.city, delivery.province, delivery.country]
                    .filter(Boolean).join(", ") || "—"}
                </span>
                <button className="checkout-info-edit" onClick={() => setStep(0)}>Edit</button>
              </div>
            </div>

            <h2 className="checkout-section-title">Shipping method</h2>

            <div
              className={`shipping-option ${shippingMethod === "standard" ? "selected" : ""}`}
              onClick={() => setShippingMethod("standard")}
            >
              <div className="shipping-option-left">
                <input
                  type="radio"
                  readOnly
                  checked={shippingMethod === "standard"}
                  onChange={() => setShippingMethod("standard")}
                />
                <div className="shipping-option-info">
                  <span className="shipping-option-name">Standard Shipping</span>
                  <span className="shipping-option-days">3–5 business days</span>
                </div>
              </div>
              <span className="shipping-option-price">
                {freeDelivery ? "Free" : `LKR ${deliveryFee.toLocaleString()}`}
              </span>
            </div>

            <div
              className={`shipping-option ${shippingMethod === "express" ? "selected" : ""}`}
              onClick={() => setShippingMethod("express")}
            >
              <div className="shipping-option-left">
                <input
                  type="radio"
                  readOnly
                  checked={shippingMethod === "express"}
                  onChange={() => setShippingMethod("express")}
                />
                <div className="shipping-option-info">
                  <span className="shipping-option-name">Express Shipping</span>
                  <span className="shipping-option-days">1–2 business days</span>
                </div>
              </div>
              <span className="shipping-option-price">LKR 750</span>
            </div>

            <button className="checkout-btn-primary" onClick={() => setStep(2)}>
              Continue to payment
            </button>
            <button className="checkout-btn-secondary" onClick={() => setStep(0)}>
              Return to information
            </button>
          </>
        )}

        {/* ── Step 2 — Payment ────────────────── */}
        {step === 2 && (
          <>
            {/* Contact + Delivery + Shipping summary */}
            <div className="checkout-info-card">
              <div className="checkout-info-row">
                <span className="checkout-info-label">Contact</span>
                <span className="checkout-info-value">{contact.email || "—"}</span>
                <button className="checkout-info-edit" onClick={() => setStep(0)}>Edit</button>
              </div>
              <div className="checkout-info-row">
                <span className="checkout-info-label">Ship to</span>
                <span className="checkout-info-value">
                  {[delivery.address, delivery.city, delivery.province, delivery.country]
                    .filter(Boolean).join(", ") || "—"}
                </span>
                <button className="checkout-info-edit" onClick={() => setStep(0)}>Edit</button>
              </div>
              <div className="checkout-info-row">
                <span className="checkout-info-label">Shipping</span>
                <span className="checkout-info-value">
                  {shippingMethod === "express" ? "Express Shipping · LKR 750" : "Standard Shipping · 3–5 days"}
                </span>
                <button className="checkout-info-edit" onClick={() => setStep(1)}>Edit</button>
              </div>
            </div>

            <h2 className="checkout-section-title">Payment</h2>

            <div className="payment-secure-note">
              <Lock size={12} />
              <span>All transactions are secure and encrypted.</span>
            </div>

            {/* Payment method options */}
            <div className="payment-methods">

              {/* Credit / Debit Card */}
              <div
                className={`payment-method-option ${paymentMethod === "card" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="payment-method-top">
                  <div className="payment-method-left">
                    <input type="radio" readOnly checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                    <span className="payment-method-name">Credit / Debit Card</span>
                  </div>
                  <div className="payment-card-icons">
                    <VisaIcon />
                    <MastercardIcon />
                    <AmexIcon />
                  </div>
                </div>

                {paymentMethod === "card" && (
                  <div className="payment-method-body" onClick={(e) => e.stopPropagation()}>
                    <div className="checkout-field">
                      <input
                        className="checkout-input"
                        type="text"
                        placeholder="Card number"
                        maxLength={19}
                        value={payment.cardNumber}
                        onChange={(e) => setPayment({ ...payment, cardNumber: formatCard(e.target.value) })}
                      />
                    </div>
                    <div className="checkout-row">
                      <div className="checkout-field">
                        <input
                          className="checkout-input"
                          type="text"
                          placeholder="Expiration date (MM / YY)"
                          maxLength={7}
                          value={payment.expiry}
                          onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                        />
                      </div>
                      <div className="checkout-field">
                        <input
                          className="checkout-input"
                          type="text"
                          placeholder="Security code"
                          maxLength={4}
                          value={payment.cvv}
                          onChange={(e) =>
                            setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
                          }
                        />
                      </div>
                    </div>
                    <div className="checkout-field">
                      <input
                        className="checkout-input"
                        type="text"
                        placeholder="Name on card"
                        value={payment.nameOnCard}
                        onChange={(e) => setPayment({ ...payment, nameOnCard: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cash on Delivery */}
              <div
                className={`payment-method-option ${paymentMethod === "cod" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className="payment-method-top">
                  <div className="payment-method-left">
                    <input type="radio" readOnly checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                    <span className="payment-method-name">Cash on Delivery</span>
                  </div>
                  <CodIcon />
                </div>
                {paymentMethod === "cod" && (
                  <div className="payment-method-body">
                    <p className="payment-method-note">Pay with cash when your order is delivered. Available island-wide.</p>
                  </div>
                )}
              </div>

              {/* Koko */}
              <div
                className={`payment-method-option ${paymentMethod === "koko" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("koko")}
              >
                <div className="payment-method-top">
                  <div className="payment-method-left">
                    <input type="radio" readOnly checked={paymentMethod === "koko"} onChange={() => setPaymentMethod("koko")} />
                    <span className="payment-method-name">Koko</span>
                    <span className="payment-method-tag">Installments</span>
                  </div>
                  <KokoIcon />
                </div>
                {paymentMethod === "koko" && (
                  <div className="payment-method-body">
                    <p className="payment-method-note">Split into 3 easy payments with Koko. No interest, no hidden fees.</p>
                  </div>
                )}
              </div>

              {/* Mintpay */}
              <div
                className={`payment-method-option ${paymentMethod === "mintpay" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("mintpay")}
              >
                <div className="payment-method-top">
                  <div className="payment-method-left">
                    <input type="radio" readOnly checked={paymentMethod === "mintpay"} onChange={() => setPaymentMethod("mintpay")} />
                    <span className="payment-method-name">Mintpay</span>
                    <span className="payment-method-tag">Installments</span>
                  </div>
                  <MintpayIcon />
                </div>
                {paymentMethod === "mintpay" && (
                  <div className="payment-method-body">
                    <p className="payment-method-note">Pay in 3 monthly installments with Mintpay. Zero interest for eligible cards.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Billing address — only relevant for card */}
            {paymentMethod === "card" && (
              <>
                <h2 className="checkout-section-title">Billing address</h2>
                <label className="checkout-checkbox checkout-checkbox--mb">
                  <input
                    type="checkbox"
                    checked={payment.sameAsBilling}
                    onChange={(e) => setPayment({ ...payment, sameAsBilling: e.target.checked })}
                  />
                  <span>Same as shipping address</span>
                </label>
              </>
            )}

            <button className="checkout-btn-primary">
              {paymentMethod === "cod"
                ? `Place Order · LKR ${total.toLocaleString()}`
                : `Pay now · LKR ${total.toLocaleString()}`}
            </button>
            <button className="checkout-btn-secondary" onClick={() => setStep(1)}>
              Return to shipping
            </button>
          </>
        )}

      </div>{/* end checkout-left */}

      {/* ── Right Column — Order Summary ─────── */}
      <div className="checkout-right">
        <p className="order-summary-title">Order Summary</p>

        {/* Items */}
        {items.map((item) => (
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
        ))}

        {/* Discount code */}
        <div className="discount-row">
          <input
            className="discount-input"
            type="text"
            placeholder="Discount code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button className="discount-btn">Apply</button>
        </div>

        <div className="order-divider" />

        {/* Totals */}
        <div className="order-total-row">
          <span>Subtotal</span>
          <span className="order-total-value">LKR {subtotal.toLocaleString()}</span>
        </div>

        {promoApplied && (
          <div className="order-total-row">
            <span>Discount (KAMARI10)</span>
            <span className="order-discount-value">
              − LKR {discount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="order-total-row">
          <span>Shipping</span>
          <span className={freeDelivery ? "order-free-badge" : "order-total-value"}>
            {freeDelivery ? "Free" : `LKR ${deliveryFee.toLocaleString()}`}
          </span>
        </div>

        <div className="order-divider" />

        <div className="order-total-row total">
          <span>Total</span>
          <span>LKR {total.toLocaleString()}</span>
        </div>
      </div>{/* end checkout-right */}

    </div>{/* end checkout-wrapper */}
    </div>
  );
}
