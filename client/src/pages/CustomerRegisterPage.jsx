import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomer } from "../services/authApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialForm = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
};

const CustomerRegisterPage = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form };
      delete payload.confirmPassword;
      await registerCustomer(payload);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-['Poppins']">

      {/* ── Left: model image panel ── */}
      <div className="hidden lg:block lg:w-[40%] xl:w-[45%] sticky top-0 h-screen flex-shrink-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1000&q=90"
          alt="KAMARI model"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" />
        <div className="absolute top-0 right-0 w-28 h-28 border-t-2 border-r-2 border-white/20" />
        <div className="absolute bottom-0 left-0 w-28 h-28 border-b-2 border-l-2 border-white/20" />

        <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-10">
          <Link to="/" className="text-xl font-light tracking-[0.35em] text-white">KAMARI</Link>
          <span className="text-xs tracking-[0.22em] text-white/50 uppercase">Est. 2024</span>
        </div>

        <div className="absolute bottom-8 left-8 right-8 z-10 space-y-3">
          <div className="w-8 h-px bg-white/50" />
          <p className="text-3xl font-light text-white leading-snug tracking-wide">
            Glow even<br />in the dark.
          </p>
          <p className="text-sm text-white/50 tracking-[0.18em] uppercase">
            Effortless · Elegant · Yours
          </p>
          <div className="inline-flex items-center border border-white/20 rounded-lg px-4 py-2 bg-white/5 backdrop-blur-sm">
            <span className="text-sm text-white/60 tracking-wide">Free delivery across Sri Lanka</span>
          </div>
        </div>
      </div>

      {/* ── Right: scrollable form panel ── */}
      <div className="flex-1 bg-[#F8F5F2] overflow-y-auto">
        <div className="min-h-full flex items-center justify-center px-8 xl:px-14 py-12">
          <div className="w-full max-w-xl">

            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="text-3xl font-light tracking-[0.25em] text-[#3B302A]">KAMARI</Link>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#3b302a]">Create your account</h1>
              <p className="text-base text-[#a3948b] mt-2">Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">

              <section className="space-y-4">
                <SectionTitle>Account Info</SectionTitle>
                <Field label="Email *" name="email" type="email" value={form.email} onChange={handleChange} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Password *" name="password" type="password" value={form.password} onChange={handleChange} required />
                  <Field label="Confirm Password *" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
                </div>
              </section>

              <section className="space-y-4">
                <SectionTitle>Personal Info</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
                  <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
                </div>
              </section>

              {error && (
                <p className="text-base text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <div className="space-y-4 pb-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#3b302a] text-white text-base font-semibold tracking-wide hover:bg-[#2e2622] disabled:opacity-60 transition"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
                <p className="text-center text-base text-[#a3948b]">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#3b302a] underline underline-offset-2 font-medium">Sign in</Link>
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#e5ddd5]" />
                  <span className="text-sm text-[#a3948b]">or sign up with</span>
                  <div className="flex-1 h-px bg-[#e5ddd5]" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`${API_URL}/api/auth/google`}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#e5ddd5] bg-white text-[#3b302a] text-sm font-medium hover:bg-[#f8f5f2] transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36.5 24 36.5c-5.2 0-9.6-3.5-11.2-8.2l-6.5 5C9.5 39.5 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.2 5.2C36.9 39.7 44 34.5 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>
                    Google
                  </a>
                  <a
                    href={`${API_URL}/api/auth/facebook`}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#e5ddd5] bg-white text-[#3b302a] text-sm font-medium hover:bg-[#f8f5f2] transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                    Facebook
                  </a>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <h3 className="text-sm font-semibold text-[#a3948b] uppercase tracking-wider border-b border-[#e5ddd5] pb-2">
    {children}
  </h3>
);

const Field = ({ label, required = false, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-[#a3948b] uppercase tracking-wider mb-2">
      {label}
    </label>
    <input
      required={required}
      {...props}
      className="w-full px-4 py-3 bg-white border border-[#e5ddd5] rounded-xl text-base text-[#3b302a] focus:ring-1 focus:ring-[#c2b2a6] outline-none"
    />
  </div>
);

export default CustomerRegisterPage;
