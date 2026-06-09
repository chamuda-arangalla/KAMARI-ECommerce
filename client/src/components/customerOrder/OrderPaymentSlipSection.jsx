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
      <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
        This order is Cash on Delivery. Please pay when your order arrives.
      </div>
    );
  }

  return (
    <div>
      {slipUploaded && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={15} className="flex-shrink-0" />
          Payment slip uploaded successfully!
        </div>
      )}

      {isPaymentComplete && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={15} className="flex-shrink-0" />
          Payment verified.
        </div>
      )}

      {order.paymentSlip?.url && (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              {isPaymentComplete ? "" : "Slip uploaded"}
            </span>
            {!isPaymentComplete && (
              <button
                type="button"
                onClick={() => slipInputRef.current?.click()}
                className="cursor-pointer border-none bg-transparent p-0 font-inherit text-xs text-[#a3948b] underline underline-offset-2 transition-colors hover:text-[#3b302a]"
              >
                Replace
              </button>
            )}
          </div>
          <a
            href={order.paymentSlip.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-xl border border-[#e5ddd5]"
          >
            <img
              src={order.paymentSlip.url}
              alt="Payment slip"
              className="max-h-52 w-full bg-[#f8f5f2] object-contain"
            />
          </a>
        </div>
      )}

      {slipPreview && (
        <div className="mb-4">
          <img
            src={slipPreview}
            alt="Preview"
            className="max-h-48 w-full rounded-xl border border-[#e5ddd5] bg-[#f8f5f2] object-contain"
          />
          <button
            type="button"
            onClick={onSlipRemove}
            className="mt-2 inline-flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 font-inherit text-xs text-[#a3948b] transition-colors hover:text-rose-600"
          >
            <X size={11} /> Remove
          </button>
        </div>
      )}

      {!slipPreview && !isPaymentComplete && (
        <button
          type="button"
          onClick={() => slipInputRef.current?.click()}
          className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#ddd8d2] bg-[#fdfcfb] py-7 font-inherit transition-all hover:border-[#3b302a] hover:bg-[#faf8f6]"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e5ddd5] bg-[#f0ebe5]">
            <Upload size={18} className="text-[#a3948b]" />
          </div>
          <span className="text-sm font-medium text-[#3b302a]">
            {order.paymentSlip?.url ? "Upload new slip" : "Upload payment slip"}
          </span>
          <span className="text-xs text-[#a3948b]">JPG, PNG or WEBP - Max 5MB</span>
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
        <p className="mt-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-xs text-rose-600">
          {slipError}
        </p>
      )}

      {slipFile && !slipUploaded && !isPaymentComplete && (
        <button
          type="button"
          onClick={onSlipUpload}
          disabled={slipUploading}
          className="mt-4 w-full rounded-xl bg-[#3b302a] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#2e2622] disabled:opacity-60"
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
