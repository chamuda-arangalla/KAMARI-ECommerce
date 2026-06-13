import { Link } from "react-router-dom";
import BrandLogo from "../common/BrandLogo";

const REGISTER_IMAGE =
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1000&q=90";

export default function RegisterSidePanel() {
  return (
    <div className="sticky top-0 hidden h-screen flex-shrink-0 overflow-hidden lg:block lg:w-[40%] xl:w-[45%]">
      <img
        src={REGISTER_IMAGE}
        alt="KAMARI model"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" />
      <div className="absolute right-0 top-0 h-28 w-28 border-r-2 border-t-2 border-white/20" />
      <div className="absolute bottom-0 left-0 h-28 w-28 border-b-2 border-l-2 border-white/20" />

      <div className="absolute left-8 right-8 top-8 z-10 flex items-center justify-between">
        <Link to="/" className="inline-flex" aria-label="KAMARI home">
          <BrandLogo tone="light" className="h-9 w-auto object-contain" />
        </Link>
        <span className="text-xs uppercase tracking-[0.22em] text-white/50">
          Est. 2024
        </span>
      </div>

      <div className="absolute bottom-8 left-8 right-8 z-10 space-y-3">
        <div className="h-px w-8 bg-white/50" />
        <p className="text-3xl font-light leading-snug tracking-wide text-white">
          Glow even
          <br />
          in the dark.
        </p>
        <p className="text-sm uppercase tracking-[0.18em] text-white/50">
          Effortless - Elegant - Yours
        </p>
        {/* Free delivery promotion currently disabled:
        <div className="inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-sm">
          <span className="text-sm tracking-wide text-white/60">
            Free delivery across Sri Lanka
          </span>
        </div>
        */}
      </div>
    </div>
  );
}
