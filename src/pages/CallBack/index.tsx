// /src/pages/Callback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {navigate("/")};

    (async () => {
      try {
        const res = await fetch("/api/get-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();

        if (data.access_token) {
          localStorage.setItem("wp_token", data.access_token);
          if (data.refresh_token) {
            localStorage.setItem("wp_refresh_token", data.refresh_token);
          }
          navigate("/");
        } else {
          console.error("WP token error:", data);
          alert(`Login failed: ${data.error_description || data.error || "Unknown error"}`);
          navigate("/");
        }
      } catch (e) {
        console.error(e);
        navigate("/");
      }
    })();
  }, [navigate]);

  return <p>Đang xử lý đăng nhập...</p>;
}
