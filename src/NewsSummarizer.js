import React, { useState } from "react";
import axios from "axios";
const apiKey = process.env.REACT_APP_NEWS_API_KEY;

const NewsSummarizer = () => {
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState("technology");
  const [loading, setLoading] = useState(false);
  const [summarizingIndex, setSummarizingIndex] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${query}&language=en&pageSize=10&apiKey=${apiKey}`
      );

      console.log("📰 API Response:", response.data);
      if (response.data.articles.length === 0) {
        alert("No articles found. Try a different topic!");
      }

      setNews(
        response.data.articles.map((article) => ({
          ...article,
          summary: "", // Initially empty
        }))
      );
    } catch (error) {
      console.error("❌ Error fetching news:", error);
      alert("Failed to fetch news. Please check your API key or internet.");
    } finally {
      setLoading(false);
    }
  };

  // Basic summarization logic
  const summarizeArticle = (index) => {
    setSummarizingIndex(index);

    setTimeout(() => {
      const updatedNews = [...news];
      const article = updatedNews[index];
      if (article.description) {
        const summary =
          article.description
            .split(". ")
            .slice(0, 2)
            .join(". ") + ".";
        updatedNews[index].summary = summary;
      } else {
        updatedNews[index].summary = "No summary available.";
      }
      setNews(updatedNews);
      setSummarizingIndex(null);
    }, 1000); // Simulate processing delay
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🗞️ AI News Summarizer</h1>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Enter topic (e.g., AI, politics, sports)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchNews} style={styles.button}>
          {loading ? "Loading..." : "Fetch News"}
        </button>
      </div>

      <div style={styles.newsContainer}>
        {news.map((article, index) => (
          <div key={index} style={styles.card}>
            {article.urlToImage && (
              <img src={article.urlToImage} alt="news" style={styles.image} />
            )}
            <h3 style={styles.headline}>{article.title}</h3>
            <p style={styles.author}>
              {article.author ? `By ${article.author}` : ""}
            </p>
            <p style={styles.date}>
              {new Date(article.publishedAt).toLocaleString()}
            </p>

            {!article.summary ? (
              <button
                style={styles.summarizeButton}
                onClick={() => summarizeArticle(index)}
                disabled={summarizingIndex === index}
              >
                {summarizingIndex === index ? "Summarizing..." : "Summarize"}
              </button>
            ) : (
              <div style={styles.summaryBox}>
                <h4>🧠 Summary:</h4>
                <p style={styles.summary}>{article.summary}</p>
              </div>
            )}

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              Read full article →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🎨 Styles
const styles = {
  container: {
    textAlign: "center",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  title: {
    color: "#222",
    fontSize: "32px",
    marginBottom: "20px",
  },
  searchBar: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    width: "300px",
    border: "1px solid #ccc",
    borderRadius: "8px 0 0 8px",
    outline: "none",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "0 8px 8px 0",
    cursor: "pointer",
  },
  newsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    padding: "15px",
    textAlign: "left",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  headline: {
    fontSize: "18px",
    color: "#333",
    margin: "10px 0",
  },
  author: {
    fontSize: "14px",
    color: "#666",
    fontStyle: "italic",
  },
  date: {
    fontSize: "13px",
    color: "#999",
    marginBottom: "10px",
  },
  summarizeButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "10px",
  },
  summaryBox: {
    backgroundColor: "#f1f3f4",
    borderRadius: "8px",
    padding: "10px",
    marginTop: "10px",
  },
  summary: {
    fontSize: "15px",
    color: "#444",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default NewsSummarizer;
