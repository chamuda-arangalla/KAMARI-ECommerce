import { Link } from "react-router-dom";
import AuthTextField from "./AuthTextField";
import FacebookIcon from "./FacebookIcon";
import GoogleIcon from "./GoogleIcon";
import RegisterSectionTitle from "./RegisterSectionTitle";

export default function CustomerRegisterForm({
  apiUrl,
  error,
  form,
  loading,
  onChange,
  onSubmit,
}) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F5F2]">
      <div className="flex min-h-full items-center justify-center px-8 py-12 xl:px-14">
        <div className="w-full max-w-xl">
          <div className="mb-8 text-center lg:hidden">
            <Link
              to="/"
              className="text-3xl font-light tracking-[0.25em] text-[#3B302A]"
            >
              KAMARI
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#3b302a]">
              Create your account
            </h1>
            <p className="mt-2 text-base text-[#a3948b]">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-7">
            <section className="space-y-4">
              <RegisterSectionTitle>Account Info</RegisterSectionTitle>
              <AuthTextField
                label="Email *"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AuthTextField
                  label="Password *"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  autoComplete="new-password"
                />
                <AuthTextField
                  label="Confirm Password *"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={onChange}
                  autoComplete="new-password"
                />
              </div>
            </section>

            <section className="space-y-4">
              <RegisterSectionTitle>Personal Info</RegisterSectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AuthTextField
                  label="First Name"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={onChange}
                  autoComplete="given-name"
                />
                <AuthTextField
                  label="Last Name"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={onChange}
                  autoComplete="family-name"
                />
              </div>
            </section>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-500">
                {error}
              </p>
            )}

            <div className="space-y-4 pb-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#3b302a] py-3.5 text-base font-semibold tracking-wide text-white transition hover:bg-[#2e2622] disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <p className="text-center text-base text-[#a3948b]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#3b302a] underline underline-offset-2"
                >
                  Sign in
                </Link>
              </p>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e5ddd5]" />
                <span className="text-sm text-[#a3948b]">or sign up with</span>
                <div className="h-px flex-1 bg-[#e5ddd5]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`${apiUrl}/api/auth/google`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#e5ddd5] bg-white py-3 text-sm font-medium text-[#3b302a] transition hover:bg-[#f8f5f2]"
                >
                  <GoogleIcon />
                  Google
                </a>
                <a
                  href={`${apiUrl}/api/auth/facebook`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#e5ddd5] bg-white py-3 text-sm font-medium text-[#3b302a] transition hover:bg-[#f8f5f2]"
                >
                  <FacebookIcon />
                  Facebook
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
