import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthLoadingScreen from "../components/auth/AuthLoadingScreen";
import { REDIRECT_MAP } from "../components/auth/authConstants";
import { setCustomerSession } from "../utils/customerSession";

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
        setCustomerSession(token, user);
        window.dispatchEvent(new Event("kamari:user-updated"));
      }

      navigate(user.role === "admin" ? "/" : redirectTo, { replace: true });
    } catch {
      navigate("/login?error=oauth_failed", { replace: true });
    }
  }, [navigate]);

  return <AuthLoadingScreen />;
};

export default OAuthCallbackPage;
