import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/authApi";

const AdminLoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginAdmin(form.email, form.password);
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eae0d6] flex items-center justify-center px-4 font-['Poppins']">
      <div className="relative bg-white w-full max-w-sm rounded-3xl border border-[#d7c9b8] shadow-[0_20px_60px_rgba(59,48,42,0.12)] p-10">
        <Link
          to="/"
          aria-label="Back to home"
          className="absolute left-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7c9b8] text-[#5f564d] transition hover:bg-[#eae0d6] hover:text-[#2c2b28]"
        >
          <ArrowLeft size={20} strokeWidth={1.6} />
        </Link>

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#2c2b28] tracking-wide">KAMARI</h1>
          <p className="text-base text-[#8f8376] mt-2">Admin Portal</p>
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
              className="w-full px-4 py-3 bg-white border border-[#e5ddd5] rounded-xl text-base focus:ring-1 focus:ring-[#c2b2a6] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#8f8376] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-white border border-[#d7c9b8] rounded-xl text-base focus:ring-1 focus:ring-[#c2b2a6] outline-none"
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
            className="w-full py-3.5 rounded-xl bg-[#2c2b28] text-white text-base font-semibold hover:bg-[#544c43] disabled:opacity-60 mt-2 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
