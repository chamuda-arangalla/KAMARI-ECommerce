import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerRegisterForm from "../components/auth/CustomerRegisterForm";
import RegisterSidePanel from "../components/auth/RegisterSidePanel";
import { API_URL } from "../components/auth/authConstants";
import { registerCustomer } from "../services/authApi";

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

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      void confirmPassword;
      await registerCustomer(payload);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-['Poppins']">
      <RegisterSidePanel />
      <CustomerRegisterForm
        apiUrl={API_URL}
        error={error}
        form={form}
        loading={loading}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CustomerRegisterPage;
