import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userRaw = params.get("user");
    const error = params.get("error");
    const redirect = params.get("redirect");
    const REDIRECT_MAP = { checkout: "/checkout", cart: "/cart" };
    const redirectTo = REDIRECT_MAP[redirect] || "/";

    if (error || !token || !userRaw) {
      navigate(`/login?error=${error || "oauth_failed"}`, { replace: true });
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userRaw));

      if (user.role === "admin") {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUser", JSON.stringify(user));
      } else {
        localStorage.setItem("customerToken", token);
        localStorage.setItem("customerUser", JSON.stringify(user));
      }

      navigate(user.role === "admin" ? "/" : redirectTo, { replace: true });
    } catch {
      navigate("/login?error=oauth_failed", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center font-['Poppins']">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#3b302a] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[#a3948b] text-sm tracking-wide">Signing you in...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
