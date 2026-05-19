import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authApi";

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
        </form>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
