import { AlertTriangle, Loader2, LogOut, Trash2, X } from "lucide-react";

const iconByType = {
  delete:  Trash2,
  logout:  LogOut,
  warning: AlertTriangle,
};

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel  = "Cancel",
  type    = "warning",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const Icon = iconByType[type] || AlertTriangle;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close confirmation"
        className="absolute inset-0 bg-[#3b302a]/30 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white border border-[#eadfd7] shadow-[0_24px_70px_rgba(59,48,42,0.18)]">
        <div className="flex items-start gap-4 px-7 py-6 border-b border-[#eadfd7] bg-[#fcfaf7]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 border border-rose-100">
            <Icon size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-[#3b302a]">{title}</h2>
            <p className="mt-1.5 text-base leading-6 text-[#7b6d64]">{message}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Cancel"
            className="p-2 rounded-full text-[#8c7d73] hover:bg-white hover:text-[#3b302a] disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col-reverse gap-3 px-7 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 rounded-xl border border-[#d8ccc2] bg-white text-base font-semibold text-[#5f5149] hover:bg-[#f8f5f2] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-rose-600 text-base font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
