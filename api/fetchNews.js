// api/fetchNews.js
import axios from "axios";

export default async function handler(req, res) {
  const q = req.query.q || req.query.query || "technology";

  if (!process.env.NEWS_API_KEY) {
    return res.status(500).json({ error: "Server missing NEWS_API_KEY env var" });
  }

  try {
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q,
        language: "en",
        pageSize: 10,
        apiKey: process.env.NEWS_API_KEY,
      },
      timeout: 10000,
    });

    return res.status(200).json(response.data);
  } catch (err) {
    console.error("fetchNews error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    return res.status(status).json({ error: "Failed to fetch news from upstream" });
  }
}
