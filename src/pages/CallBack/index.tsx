import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CLIENT_ID = "123712";
const CLIENT_SECRET = "vaQj2mW8OiJB7nvgrvIliJo7IpRJEs06GOLFy8d0aRSN571XfQGhCfUTVcXFubIS";
const REDIRECT_URI = "https://pharmanews.vercel.app/oauth/callback";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      fetch("https://public-api.wordpress.com/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
          code,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            console.log(data);
            localStorage.setItem("wp_token", data.access_token);
            navigate("/"); // quay về trang chính
          }
        });
    } else {
      // Không có code => chuyển về trang chính
      navigate("/");
    }
  }, [navigate]);

  return <p>Đang xử lý đăng nhập...</p>;
}
