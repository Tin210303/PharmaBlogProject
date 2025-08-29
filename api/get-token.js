export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const { code } = req.body;
  
      const response = await fetch("https://public-api.wordpress.com/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          redirect_uri: "https://pharmanews.vercel.app/oauth/callback", // REDIRECT_URI đã đăng ký
          grant_type: "authorization_code",
          code,
        }),
      });
  
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error exchanging token:", error);
      return res.status(500).json({ error: "Failed to fetch token" });
    }
  }
  