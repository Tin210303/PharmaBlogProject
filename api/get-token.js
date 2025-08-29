// /api/get-token.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const { code } = req.body || {};
      if (!code) return res.status(400).json({ error: "Missing authorization code" });
  
      const resp = await fetch("https://public-api.wordpress.com/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          redirect_uri: process.env.WP_REDIRECT_URI,
          grant_type: "authorization_code",
          code,
        }),
      });
  
      const data = await resp.json();
      // Trả thẳng data để dễ debug (sẽ có access_token hoặc lỗi từ WP)
      return res.status(resp.ok ? 200 : 400).json(data);
    } catch (e) {
      console.error("get-token error:", e);
      return res.status(500).json({ error: "Server error" });
    }
  }
  