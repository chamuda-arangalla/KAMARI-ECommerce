import { CheckCircle2, Loader2, Upload, X } from "lucide-react";

export default function PaymentSlipUpload({
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
    <div className="slip-upload-card">
      <div className="slip-upload-header">
        <p className="slip-upload-title">Upload Payment Slip</p>
        <p className="slip-upload-sub">Attach your bank transfer receipt to speed up order confirmation.</p>
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
              <button type="button" className="slip-remove-btn" onClick={onSlipRemove}>
                <X size={14} /> Remove
              </button>
            </div>
          ) : (
            <button type="button" className="slip-drop-zone" onClick={() => slipInputRef.current?.click()}>
              <Upload size={22} className="slip-upload-icon" />
              <span className="slip-drop-label">Click to select your payment slip</span>
              <span className="slip-drop-hint">JPG, PNG or WEBP - Max 5MB</span>
            </button>
          )}

          <input ref={slipInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={onSlipSelect} />

          {slipError && <p className="slip-error">{slipError}</p>}

          {slipFile && !slipUploaded && (
            <button type="button" className="slip-submit-btn" onClick={onSlipUpload} disabled={slipUploading}>
              {slipUploading ? (
                <span className="checkout-btn-loading">
                  <Loader2 size={15} className="checkout-spinner" />
                  Uploading...
                </span>
              ) : (
                "Submit Payment Slip"
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}
