export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  
    try {
      const { refresh_token } = req.body || {};
      if (!refresh_token) return res.status(400).json({ error: "Missing refresh_token" });
  
      const resp = await fetch("https://public-api.wordpress.com/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token,
        }),
      });
  
      const data = await resp.json();
      return res.status(resp.ok ? 200 : 400).json(data);
    } catch (e) {
      console.error("refresh-token error:", e);
      return res.status(500).json({ error: "Server error" });
    }
  }
  