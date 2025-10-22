import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState("technology");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchNews = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      // ✅ Calls your Vercel backend instead of NewsAPI directly
      const response = await axios.get(`/api/fetchNews?q=${encodeURIComponent(query)}`);
      setNews(response.data.articles || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      alert("Failed to fetch news. Please check your server or API key configuration.");
    } finally {
      setLoading(false);
    }
  };

  const goToSummary = (article) => {
    navigate("/summary", { state: { article } });
  };

  const openFullArticle = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#1a3c6e", marginBottom: "25px" }}>
        AI News Summarizer
      </h1>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter topic..."
          style={{
            padding: "12px 15px",
            width: "300px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "15px",
          }}
        />
        <button
          onClick={fetchNews}
          style={{
            padding: "12px 20px",
            marginLeft: "10px",
            backgroundColor: "#1a73e8",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Loading..." : "Fetch News"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gap: "25px",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {news.map((article, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt="news"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
            )}
            <div style={{ padding: "15px", flex: 1, display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "#0d2f5f" }}>
                {article.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#555", flex: 1, marginBottom: "10px" }}>
                {article.description || "No description available."}
              </p>
              <p style={{ fontSize: "12px", color: "#888", marginBottom: "12px" }}>
                {article.author ? `By ${article.author} | ` : ""}
                {new Date(article.publishedAt).toLocaleString()}
              </p>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={() => goToSummary(article)}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#17a2b8",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Read Summary
                </button>
                <button
                  onClick={() => openFullArticle(article.url)}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Read Full Article
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsList;
