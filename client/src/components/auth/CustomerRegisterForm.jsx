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
    <div className="flex-1 overflow-y-auto bg-[#EAE0D6]">
      <div className="flex min-h-full items-center justify-center px-8 py-12 xl:px-14">
        <div className="w-full max-w-xl">
          <div className="mb-8 text-center lg:hidden">
            <Link
              to="/"
              className="text-3xl font-light tracking-[0.25em] text-[#2C2B28]"
            >
              KAMARI
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2c2b28]">
              Create your account
            </h1>
            <p className="mt-2 text-base text-[#8f8376]">
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
                className="w-full rounded-xl bg-[#2c2b28] py-3.5 text-base font-semibold tracking-wide text-white transition hover:bg-[#544c43] disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <p className="text-center text-base text-[#8f8376]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#2c2b28] underline underline-offset-2"
                >
                  Sign in
                </Link>
              </p>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#d7c9b8]" />
                <span className="text-sm text-[#8f8376]">or sign up with</span>
                <div className="h-px flex-1 bg-[#d7c9b8]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`${apiUrl}/api/auth/google`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#d7c9b8] bg-white py-3 text-sm font-medium text-[#2c2b28] transition hover:bg-[#eae0d6]"
                >
                  <GoogleIcon />
                  Google
                </a>
                <a
                  href={`${apiUrl}/api/auth/facebook`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#d7c9b8] bg-white py-3 text-sm font-medium text-[#2c2b28] transition hover:bg-[#eae0d6]"
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
