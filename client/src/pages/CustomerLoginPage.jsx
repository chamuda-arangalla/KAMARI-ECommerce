import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CustomerLoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.user.role === "admin") {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        navigate("/");
      } else {
        localStorage.setItem("customerToken", data.token);
        localStorage.setItem("customerUser", JSON.stringify(data.user));
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center px-4 font-['Poppins']">
      <div className="relative bg-white w-full max-w-sm rounded-3xl border border-[#e5ddd5] shadow-[0_20px_60px_rgba(59,48,42,0.12)] p-10">
        <Link
          to="/"
          aria-label="Back to home"
          className="absolute left-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e5ddd5] text-[#6b5e55] transition hover:bg-[#f8f5f2] hover:text-[#3b302a]"
        >
          <ArrowLeft size={20} strokeWidth={1.6} />
        </Link>

        <div className="mb-10 text-center">
          <Link to="/" className="text-3xl font-light tracking-[0.25em] text-[#3B302A]">
            KAMARI
          </Link>
          <p className="text-base text-[#a3948b] mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#a3948b] uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-white border border-[#e5ddd5] rounded-xl text-base text-[#3b302a] focus:ring-1 focus:ring-[#c2b2a6] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#a3948b] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-white border border-[#e5ddd5] rounded-xl text-base text-[#3b302a] focus:ring-1 focus:ring-[#c2b2a6] outline-none"
            />
          </div>

          {error && (
            <p className="text-base text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#3b302a] text-white text-base font-semibold tracking-wide hover:bg-[#2e2622] disabled:opacity-60 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-base text-[#a3948b]">
            New to KAMARI?{" "}
            <Link to="/register" className="text-[#3b302a] underline underline-offset-2 font-medium">
              Create an account
            </Link>
          </p>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-[#e5ddd5]" />
            <span className="text-sm text-[#a3948b]">or</span>
            <div className="flex-1 h-px bg-[#e5ddd5]" />
          </div>

          <a
            href={`${API_URL}/api/auth/google`}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-[#e5ddd5] bg-white text-[#3b302a] text-sm font-medium hover:bg-[#f8f5f2] transition"
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36.5 24 36.5c-5.2 0-9.6-3.5-11.2-8.2l-6.5 5C9.5 39.5 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.2 5.2C36.9 39.7 44 34.5 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>
            Continue with Google
          </a>

          <a
            href={`${API_URL}/api/auth/facebook`}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-[#e5ddd5] bg-white text-[#3b302a] text-sm font-medium hover:bg-[#f8f5f2] transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            Continue with Facebook
          </a>
        </form>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
