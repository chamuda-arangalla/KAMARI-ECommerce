import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomerLoginCard from "../components/auth/CustomerLoginCard";
import { API_URL, REDIRECT_MAP } from "../components/auth/authConstants";
import { login } from "../services/authApi";
import { setCustomerSession } from "../utils/customerSession";

const CustomerLoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const redirectTo = REDIRECT_MAP[redirectParam] || "/";

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(form.email, form.password);
      if (data.user.role === "admin") {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        navigate("/");
        return;
      }

      setCustomerSession(data.token, data.user);
      window.dispatchEvent(new Event("kamari:user-updated"));
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EAE0D6] px-4 font-['Poppins']">
      <CustomerLoginCard
        apiUrl={API_URL}
        error={error}
        form={form}
        loading={loading}
        redirectParam={redirectParam}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CustomerLoginPage;
