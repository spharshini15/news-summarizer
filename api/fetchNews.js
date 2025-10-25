// api/fetchNews.js
import axios from "axios";

export default async function handler(req, res) {
  const q = req.query.q || "technology";

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

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
