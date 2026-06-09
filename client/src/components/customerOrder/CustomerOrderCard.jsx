import OrderDeliverySection from "./OrderDeliverySection";
import OrderDivider from "./OrderDivider";
import OrderHeader from "./OrderHeader";
import OrderItemsSection from "./OrderItemsSection";
import OrderPaymentSlipSection from "./OrderPaymentSlipSection";
import OrderPricingSection from "./OrderPricingSection";

export default function CustomerOrderCard({
  order,
  status,
  isCodOrder,
  isPaymentComplete,
  slipFile,
  slipInputRef,
  slipPreview,
  slipUploaded,
  slipUploading,
  slipError,
  onSlipRemove,
  onSlipSelect,
  onSlipUpload,
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e5ddd5] bg-white shadow-[0_8px_40px_rgba(59,48,42,0.10)]">
      <div className={`h-1.5 w-full ${status.bar}`} />

      <div className="space-y-6 px-7 py-7">
        <OrderHeader order={order} status={status} />

        <OrderDivider label="Items" />
        <OrderItemsSection items={order.productDetails} />

        <OrderDivider label="Pricing" />
        <OrderPricingSection pricing={order.pricing} />

        <OrderDivider label="Delivery" />
        <OrderDeliverySection receiver={order.receiverDetails} />

        <OrderDivider label={isCodOrder ? "Payment" : "Payment Slip"} />
        <OrderPaymentSlipSection
          order={order}
          isCodOrder={isCodOrder}
          isPaymentComplete={isPaymentComplete}
          slipFile={slipFile}
          slipInputRef={slipInputRef}
          slipPreview={slipPreview}
          slipUploaded={slipUploaded}
          slipUploading={slipUploading}
          slipError={slipError}
          onSlipRemove={onSlipRemove}
          onSlipSelect={onSlipSelect}
          onSlipUpload={onSlipUpload}
        />
      </div>
    </div>
  );
}
