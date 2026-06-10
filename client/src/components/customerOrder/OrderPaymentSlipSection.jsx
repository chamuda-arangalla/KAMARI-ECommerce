import { CheckCircle2, Loader2, Upload, X } from "lucide-react";

export default function OrderPaymentSlipSection({
  order,
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
  if (isCodOrder) {
    return (
      <div className="rounded-2xl border border-[#d7c9b8] bg-[#ead9c4] px-4 py-3 text-sm text-[#5f564d]">
        This order is Cash on Delivery. Please pay when your order arrives.
      </div>
    );
  }

  return (
    <div>
      {slipUploaded && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#d7c9b8] bg-[#ead9c4] px-4 py-3 text-sm font-medium text-[#544c43]">
          <CheckCircle2 size={15} className="flex-shrink-0" />
          Payment slip uploaded successfully!
        </div>
      )}

      {isPaymentComplete && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#d7c9b8] bg-[#ead9c4] px-4 py-3 text-sm font-medium text-[#544c43]">
          <CheckCircle2 size={15} className="flex-shrink-0" />
          Payment verified.
        </div>
      )}

      {order.paymentSlip?.url && (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#544c43]">
              {isPaymentComplete ? "" : "Slip uploaded"}
            </span>
            {!isPaymentComplete && (
              <button
                type="button"
                onClick={() => slipInputRef.current?.click()}
                className="cursor-pointer border-none bg-transparent p-0 font-inherit text-xs text-[#8f8376] underline underline-offset-2 transition-colors hover:text-[#2c2b28]"
              >
                Replace
              </button>
            )}
          </div>
          <a
            href={order.paymentSlip.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-xl border border-[#d7c9b8]"
          >
            <img
              src={order.paymentSlip.url}
              alt="Payment slip"
              className="max-h-52 w-full bg-[#eae0d6] object-contain"
            />
          </a>
        </div>
      )}

      {slipPreview && (
        <div className="mb-4">
          <img
            src={slipPreview}
            alt="Preview"
            className="max-h-48 w-full rounded-xl border border-[#d7c9b8] bg-[#eae0d6] object-contain"
          />
          <button
            type="button"
            onClick={onSlipRemove}
            className="mt-2 inline-flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 font-inherit text-xs text-[#8f8376] transition-colors hover:text-[#544c43]"
          >
            <X size={11} /> Remove
          </button>
        </div>
      )}

      {!slipPreview && !isPaymentComplete && (
        <button
          type="button"
          onClick={() => slipInputRef.current?.click()}
          className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#b7aa9a] bg-[#eae0d6] py-7 font-inherit transition-all hover:border-[#2c2b28] hover:bg-[#ead9c4]"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7c9b8] bg-[#ead9c4]">
            <Upload size={18} className="text-[#8f8376]" />
          </div>
          <span className="text-sm font-medium text-[#2c2b28]">
            {order.paymentSlip?.url ? "Upload new slip" : "Upload payment slip"}
          </span>
          <span className="text-xs text-[#8f8376]">JPG, PNG or WEBP - Max 5MB</span>
        </button>
      )}

      {!isPaymentComplete && (
        <input
          ref={slipInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onSlipSelect}
        />
      )}

      {slipError && (
        <p className="mt-3 rounded-xl border border-[#b7aa9a] bg-[#ead9c4] px-4 py-2.5 text-xs text-[#544c43]">
          {slipError}
        </p>
      )}

      {slipFile && !slipUploaded && !isPaymentComplete && (
        <button
          type="button"
          onClick={onSlipUpload}
          disabled={slipUploading}
          className="mt-4 w-full rounded-xl bg-[#2c2b28] py-3.5 text-sm font-semibold text-[#f3ebe2] transition-all hover:bg-[#544c43] disabled:opacity-60"
        >
          {slipUploading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Uploading...
            </span>
          ) : (
            "Submit Payment Slip"
          )}
        </button>
      )}
    </div>
  );
}
