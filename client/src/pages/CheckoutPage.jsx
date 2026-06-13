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
import { createOrder, uploadPaymentSlip } from "../services/orderApi";
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
  const slipInputRef = useRef(null);

  const token = getCustomerToken();
  const isPaymentStep = checkoutStep === CHECKOUT_STEPS.PAYMENT;
  const isCodOrder = createdOrder?.paymentStatus === "COD";

  useEffect(() => {
    return () => {
      if (slipPreview) URL.revokeObjectURL(slipPreview);
    };
  }, [slipPreview]);

  if (!token) return <Navigate to="/login" replace />;

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

      setOrderTotal(total);
      setCreatedOrder(order);
      updateCustomerSessionUser(updatedCustomer);
      window.dispatchEvent(new Event("kamari:user-updated"));
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
              isCodOrder={isCodOrder}
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
