import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import CheckoutBreadcrumb from "../components/checkout/CheckoutBreadcrumb";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OnePayRedirecting from "../components/checkout/OnePayRedirecting";
import OrderConfirmation from "../components/checkout/OrderConfirmation";
import OrderSummary from "../components/checkout/OrderSummary";
import {
  CHECKOUT_STEPS,
  PAYMENT_METHODS,
} from "../components/checkout/constants";
import {
  buildOnePayCheckoutPayload,
  buildOrderPayload,
  buildUpdatedCustomer,
  createReceiverDraft,
} from "../components/checkout/checkoutHelpers";
import { useCart } from "../context/useCart";
import {
  createOrder,
  initiateOnePayPayment,
  // uploadPaymentSlip,
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
  // Bank-transfer payment-slip state is temporarily disabled.
  const [paymentMethod, setPaymentMethod] = useState(
    PAYMENT_METHODS.KOKO,
  );
  const [checkoutStep, setCheckoutStep] = useState(CHECKOUT_STEPS.RECEIVER);
  const [onepayCheckoutStarted, setOnepayCheckoutStarted] = useState(false);
  const [onepayInitiating, setOnepayInitiating] = useState(false);
  const [onepayError, setOnepayError] = useState("");
  const [onepayStatus, setOnepayStatus] = useState("idle");
  const [onepayReference, setOnepayReference] = useState("");
  const [onepayTransactionId, setOnepayTransactionId] = useState("");
  const [onepayRedirectUrl, setOnepayRedirectUrl] = useState("");

  const token = getCustomerToken();
  const isPaymentStep = checkoutStep === CHECKOUT_STEPS.PAYMENT;
  const confirmedPaymentMethod = createdOrder?.paymentMethod || paymentMethod;

  useEffect(() => {
    if (!onepayTransactionId || !onepayReference) return undefined;

    const handleResult = (event, transactionId) => {
      if (event.detail?.transaction_id !== transactionId) return;

      verifyOnePayPayment(onepayReference, token)
        .then((response) => {
          const result = response?.data || {};

          if (result.status === "success" && result.order) {
            const order = result.order;
            const pricing = order.pricing || {};

            setCreatedOrderSummary({
              items,
              subtotal: pricing.subTotal ?? subtotal,
              discount,
              deliveryFee: pricing.shippingFee ?? deliveryFee,
              total: pricing.grandTotal ?? total,
              promoApplied,
            });
            setOrderTotal(pricing.grandTotal ?? total);
            setCreatedOrder(order);
            clearCart();
            setOnepayStatus("success");
          } else {
            setOnepayStatus("failed");
          }
        })
        .catch(() => setOnepayStatus("failed"));
    };

    const onSuccess = (event) => handleResult(event, onepayTransactionId);
    const onFail = (event) => handleResult(event, onepayTransactionId);

    window.addEventListener("onePaySuccess", onSuccess);
    window.addEventListener("onePayFail", onFail);

    return () => {
      window.removeEventListener("onePaySuccess", onSuccess);
      window.removeEventListener("onePayFail", onFail);
    };
  }, [
    onepayTransactionId,
    onepayReference,
    token,
    items,
    subtotal,
    discount,
    deliveryFee,
    total,
    promoApplied,
    clearCart,
  ]);

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

    if (paymentMethod === PAYMENT_METHODS.ONEPAY) {
      await handleInitiateOnePay();
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

  /* Bank-transfer payment-slip handlers are temporarily disabled.
  const handleSlipSelect = () => {};
  const handleSlipUpload = async () => {};
  const handleSlipRemove = () => {};
  */

  const openOnePayIframe = (redirectUrl, transactionId) => {
    if (typeof window.openPaymentIframe !== "function") {
      setOnepayError("Payment widget failed to load. Please refresh and try again.");
      return;
    }

    window.openPaymentIframe(redirectUrl, transactionId);
  };

  const handleInitiateOnePay = async () => {
    if (items.length === 0) return;

    setOnepayCheckoutStarted(true);
    setOnepayInitiating(true);
    setOnepayError("");
    setOnepayStatus("awaiting");

    try {
      const payload = buildOnePayCheckoutPayload(items, receiverDetails);
      const response = await initiateOnePayPayment(payload, token);
      const { redirectUrl, transactionId, reference } = response?.data || {};

      if (!redirectUrl || !transactionId || !reference) {
        throw new Error("Missing checkout details from server");
      }

      setOnepayRedirectUrl(redirectUrl);
      setOnepayTransactionId(transactionId);
      setOnepayReference(reference);
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
            />
          ) : paymentMethod === PAYMENT_METHODS.ONEPAY && onepayCheckoutStarted ? (
            <OnePayRedirecting
              status={onepayStatus}
              initiating={onepayInitiating}
              error={onepayError}
              onRetry={handleInitiateOnePay}
              onReopen={handleReopenOnePay}
            />
          ) : (
            <CheckoutForm
              error={error}
              isPaymentStep={isPaymentStep}
              paymentMethod={paymentMethod}
              receiverDetails={receiverDetails}
              submitting={submitting || onepayInitiating}
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
