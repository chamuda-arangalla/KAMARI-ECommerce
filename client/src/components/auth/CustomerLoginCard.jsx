import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthTextField from "./AuthTextField";
import FacebookIcon from "./FacebookIcon";
import GoogleIcon from "./GoogleIcon";
import SocialAuthLink from "./SocialAuthLink";
import BrandLogo from "../common/BrandLogo";

export default function CustomerLoginCard({
  apiUrl,
  error,
  form,
  loading,
  redirectParam,
  onChange,
  onSubmit,
}) {
  const redirectQuery = redirectParam ? `?redirect=${redirectParam}` : "";

  return (
    <div className="relative w-full max-w-sm rounded-3xl border border-[#d7c9b8] bg-white p-10 shadow-[0_20px_60px_rgba(59,48,42,0.12)]">
      <Link
        to="/"
        aria-label="Back to home"
        className="absolute left-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7c9b8] text-[#5f564d] transition hover:bg-[#eae0d6] hover:text-[#2c2b28]"
      >
        <ArrowLeft size={20} strokeWidth={1.6} />
      </Link>

      <div className="mb-10 text-center">
        <Link to="/" className="inline-flex justify-center" aria-label="KAMARI home">
          <BrandLogo className="h-10 w-auto object-contain" />
        </Link>
        <p className="mt-2 text-base text-[#8f8376]">Sign in to your account</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <AuthTextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          autoComplete="email"
        />
        <AuthTextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          autoComplete="current-password"
        />

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#2c2b28] py-3.5 text-base font-semibold tracking-wide text-white transition hover:bg-[#544c43] disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-base text-[#8f8376]">
          New to KAMARI?{" "}
          <Link
            to="/register"
            className="font-medium text-[#2c2b28] underline underline-offset-2"
          >
            Create an account
          </Link>
        </p>

        <div className="my-1 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#d7c9b8]" />
          <span className="text-sm text-[#8f8376]">or</span>
          <div className="h-px flex-1 bg-[#d7c9b8]" />
        </div>

        <SocialAuthLink
          href={`${apiUrl}/api/auth/google${redirectQuery}`}
          icon={<GoogleIcon />}
        >
          Continue with Google
        </SocialAuthLink>
        <SocialAuthLink
          href={`${apiUrl}/api/auth/facebook${redirectQuery}`}
          icon={<FacebookIcon />}
        >
          Continue with Facebook
        </SocialAuthLink>
      </form>
    </div>
  );
}
