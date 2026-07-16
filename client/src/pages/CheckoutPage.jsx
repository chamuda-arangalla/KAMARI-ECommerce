import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import CheckoutBreadcrumb from "../components/checkout/CheckoutBreadcrumb";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderConfirmation from "../components/checkout/OrderConfirmation";
import OrderSummary from "../components/checkout/OrderSummary";
import {
  CHECKOUT_STEPS,
  PAYMENT_METHODS,
} from "../components/checkout/constants";
import {
  buildOrderPayload,
  buildUpdatedCustomer,
  createReceiverDraft,
} from "../components/checkout/checkoutHelpers";
import { useCart } from "../context/useCart";
import {
  createOrder,
  uploadPaymentSlip,
  initiateOnePayPayment,
  uploadPaymentSlip,
  verifyOnePayPayment,
} from "../services/orderApi";
import {
  getCustomerToken,
  updateCustomerSessionUser,
} from "../utils/customerSession";
import "../styles/CheckoutPage.css";

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    discount,
    deliveryFee,
    total,
    // freeDelivery,
    promoApplied,
    clearCart,
  } = useCart();

  const [receiverDetails, setReceiverDetails] = useState(createReceiverDraft);
  const [discountCode, setDiscountCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);
  const [createdOrderSummary, setCreatedOrderSummary] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [slipUploading, setSlipUploading] = useState(false);
  const [slipUploaded, setSlipUploaded] = useState(false);
  const [slipError, setSlipError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(
    PAYMENT_METHODS.BANK_TRANSFER,
  );
  const [checkoutStep, setCheckoutStep] = useState(CHECKOUT_STEPS.RECEIVER);
  const [onepayInitiating, setOnepayInitiating] = useState(false);
  const [onepayError, setOnepayError] = useState("");
  const [onepayStatus, setOnepayStatus] = useState("idle");
  const [onepayTransactionId, setOnepayTransactionId] = useState("");
  const [onepayRedirectUrl, setOnepayRedirectUrl] = useState("");
  const slipInputRef = useRef(null);

  const token = getCustomerToken();
  const isPaymentStep = checkoutStep === CHECKOUT_STEPS.PAYMENT;
  const confirmedPaymentMethod = createdOrder?.paymentMethod || paymentMethod;

  useEffect(() => {
    return () => {
      if (slipPreview) URL.revokeObjectURL(slipPreview);
    };
  }, [slipPreview]);

  // The OnePay iframe overlay reports its own outcome via these window-level custom
  // events (fired by the onepayjs SDK once it observes the transaction settle).
  // That signal is only ever used to know *when* to check — the actual paymentStatus
  // update always comes from verifyOnePayPayment, which independently re-confirms
  // the outcome with our server (which in turn re-checks with OnePay directly).
  useEffect(() => {
    if (!onepayTransactionId || !createdOrder) return undefined;

    const handleResult = (finalStatus) => (event) => {
      if (event.detail?.transaction_id !== onepayTransactionId) return;

      verifyOnePayPayment(createdOrder._id, token)
        .catch(() => {})
        .finally(() => setOnepayStatus(finalStatus));
    };

    const onSuccess = handleResult("success");
    const onFail = handleResult("failed");

    window.addEventListener("onePaySuccess", onSuccess);
    window.addEventListener("onePayFail", onFail);

    return () => {
      window.removeEventListener("onePaySuccess", onSuccess);
      window.removeEventListener("onePayFail", onFail);
    };
  }, [onepayTransactionId, createdOrder, token]);

  if (!token) return <Navigate to="/login" replace />;

  const submitKokoPaymentForm = ({ action, method = "POST", fields }) => {
    const form = document.createElement("form");
    form.method = method;
    form.action = action;
    form.style.display = "none";

    Object.entries(fields || {}).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const goToReceiverStep = () => {
    setCheckoutStep(CHECKOUT_STEPS.RECEIVER);
  };

  const handleReceiverChange = (event) => {
    const { name, value } = event.target;
    setReceiverDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleReceiverSelectChange = (name, value) => {
    setReceiverDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleReceiverNext = () => {
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!receiverDetails.district || !receiverDetails.province) {
      setError("Please select your district and province.");
      return;
    }

    setError("");
    setCheckoutStep(CHECKOUT_STEPS.PAYMENT);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isPaymentStep) {
      handleReceiverNext();
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await createOrder(
        buildOrderPayload(items, receiverDetails, paymentMethod),
        token,
      );
      const order = response?.data || response;
      const updatedCustomer = buildUpdatedCustomer(receiverDetails, response?.user);
      const pricing = order?.pricing || {};
      const summarySnapshot = {
        items,
        subtotal: pricing.subTotal ?? subtotal,
        discount,
        deliveryFee: pricing.shippingFee ?? deliveryFee,
        total: pricing.grandTotal ?? total,
        promoApplied,
      };

      if (paymentMethod === PAYMENT_METHODS.KOKO) {
        if (!response?.payment?.fields || !response?.payment?.action) {
          throw new Error("Koko payment could not be initialized. Please try another payment method.");
        }

        updateCustomerSessionUser(updatedCustomer);
        window.dispatchEvent(new Event("kamari:user-updated"));
        submitKokoPaymentForm(response.payment);
        return;
      }

      setOrderTotal(summarySnapshot.total);
      setCreatedOrderSummary(summarySnapshot);
      setCreatedOrder(order);
      updateCustomerSessionUser(updatedCustomer);
      window.dispatchEvent(new Event("kamari:user-updated"));
      clearCart();
    } catch (submitError) {
      setError(
        submitError.response?.data?.error ||
          submitError.response?.data?.message ||
          submitError.message ||
          "Failed to create order",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSlipSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (slipPreview) URL.revokeObjectURL(slipPreview);
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
    if (slipPreview) URL.revokeObjectURL(slipPreview);
    setSlipFile(null);
    setSlipPreview(null);
    setSlipUploaded(false);
    setSlipError("");
    if (slipInputRef.current) slipInputRef.current.value = "";
  };

  // Opens OnePay's own hosted-payment iframe overlay (from the onepayjs SDK script
  // tag in index.html) directly with a server-issued redirect URL + transaction ID.
  // This bypasses the SDK's own client-side hash computation entirely, so the App
  // Token and Hash Salt never need to reach the browser.
  const openOnePayIframe = (redirectUrl, transactionId) => {
    if (typeof window.openPaymentIframe !== "function") {
      setOnepayError("Payment widget failed to load. Please refresh and try again.");
      return;
    }

    window.openPaymentIframe(redirectUrl, transactionId);
  };

  const handleInitiateOnePay = async () => {
    if (!createdOrder) return;

    setOnepayInitiating(true);
    setOnepayError("");
    setOnepayStatus("awaiting");

    try {
      const response = await initiateOnePayPayment(createdOrder._id, token);
      const { redirectUrl, transactionId } = response?.data || {};

      if (!redirectUrl || !transactionId) {
        throw new Error("Missing redirect URL or transaction ID");
      }

      setOnepayRedirectUrl(redirectUrl);
      setOnepayTransactionId(transactionId);
      openOnePayIframe(redirectUrl, transactionId);
    } catch (initiateError) {
      setOnepayStatus("idle");
      setOnepayError(
        initiateError.response?.data?.message ||
          "Couldn't start OnePay checkout. Please try again.",
      );
    } finally {
      setOnepayInitiating(false);
    }
  };

  const handleReopenOnePay = () => {
    if (!onepayRedirectUrl || !onepayTransactionId) return;
    openOnePayIframe(onepayRedirectUrl, onepayTransactionId);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-wrapper">
        <div className="checkout-left">
          <Link to="/" className="checkout-logo">
            KAMARI
          </Link>

          <CheckoutBreadcrumb
            isPaymentStep={isPaymentStep}
            onReceiverClick={goToReceiverStep}
          />

          {createdOrder ? (
            <OrderConfirmation
              createdOrder={createdOrder}
              paymentMethod={confirmedPaymentMethod}
              orderTotal={orderTotal}
              slipFile={slipFile}
              slipInputRef={slipInputRef}
              slipPreview={slipPreview}
              slipUploaded={slipUploaded}
              slipUploading={slipUploading}
              slipError={slipError}
              onSlipRemove={handleSlipRemove}
              onSlipSelect={handleSlipSelect}
              onSlipUpload={handleSlipUpload}
              onepayInitiating={onepayInitiating}
              onepayError={onepayError}
              onepayStatus={onepayStatus}
              onInitiateOnePay={handleInitiateOnePay}
              onReopenOnePay={handleReopenOnePay}
            />
          ) : (
            <CheckoutForm
              error={error}
              isPaymentStep={isPaymentStep}
              paymentMethod={paymentMethod}
              receiverDetails={receiverDetails}
              submitting={submitting}
              total={total}
              hasItems={items.length > 0}
              onBack={goToReceiverStep}
              onPaymentMethodChange={setPaymentMethod}
              onReceiverChange={handleReceiverChange}
              onReceiverSelectChange={handleReceiverSelectChange}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        {/* Free delivery disabled: OrderSummary previously received freeDelivery. */}
        <OrderSummary
          createdOrder={createdOrder}
          createdOrderSummary={createdOrderSummary}
          deliveryFee={deliveryFee}
          discount={discount}
          discountCode={discountCode}
          items={items}
          orderTotal={orderTotal}
          promoApplied={promoApplied}
          subtotal={subtotal}
          total={total}
          onDiscountCodeChange={setDiscountCode}
        />
      </div>
    </div>
  );
}
