import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      fetch("/api/get-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            console.log("Token:", data);
            localStorage.setItem("wp_token", data.access_token);
            navigate("/");
          } else {
            console.error("Lỗi khi lấy token:", data);
            navigate("/");
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, [navigate]);

  return <p>Đang xử lý đăng nhập...</p>;
}
