import { Info } from "lucide-react";

const KOKO_LOGO_SRC = "/Koko-logo.png";

const formatInstallment = (price) =>
  (Number(price || 0) / 3).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function KokoInstallment({ price, className = "" }) {
  if (!Number(price)) return null;

  return (
    <p className={`koko-installment ${className}`.trim()}>
      <span>OR 3 X Rs {formatInstallment(price)}</span>
      <strong className="koko-installment-with">with</strong>
      <img src={KOKO_LOGO_SRC} alt="Koko" className="koko-installment-logo" />
      <Info className="koko-installment-info" aria-hidden="true" />
    </p>
  );
}
