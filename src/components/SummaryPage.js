import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { article } = location.state || {};

  const [summary, setSummary] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [expandedParagraphs, setExpandedParagraphs] = useState({});

  // Function to clean text from HTML tags, special markers, and extra spaces
  const cleanText = (text) => {
    if (!text) return "No content available.";
    return text
      .replace(/<[^>]*>/g, "")
      .replace(/\[\+\d+ chars\]/g, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Generate elaborative summary
  useEffect(() => {
    if (!article) {
      navigate("/");
    } else {
      const rawText = `${article.title || ""}. ${article.description || ""}. ${article.content || ""}`;
      const cleanedText = cleanText(rawText);

      // Split into sentences
      const sentences = cleanedText.split(/(?<=[.!?])\s+/);

      // Group 3-5 sentences per paragraph
      const paragraphs = [];
      let tempPara = [];
      sentences.forEach((sentence, idx) => {
        tempPara.push(sentence);
        if ((idx + 1) % 4 === 0 || idx === sentences.length - 1) {
          paragraphs.push(tempPara.join(" "));
          tempPara = [];
        }
      });

      // Add context labels
      if (paragraphs.length > 0) paragraphs[0] = `Title: ${article.title}. ${paragraphs[0]}`;
      if (paragraphs.length > 1) paragraphs[1] = `Overview: ${paragraphs[1]}`;
      if (paragraphs.length > 2) paragraphs[2] = `Details & Insights: ${paragraphs[2]}`;

      setSummary(paragraphs);
    }
  }, [article, navigate]);

  // Handle adding new comment
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments([...comments, commentText]);
    setCommentText("");
  };

  // Toggle individual paragraph expansion
  const toggleExpand = (index) => {
    setExpandedParagraphs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
        backgroundColor: "#f0f4f8",
        minHeight: "100vh",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: "20px",
          padding: "10px 18px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#1a73e8",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Back to News
      </button>

      {/* Title and Author */}
      <h1 style={{ marginBottom: "10px", color: "#0d2f5f" }}>{article?.title}</h1>
      <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
        {article?.author ? `By ${article.author}` : ""} | {new Date(article?.publishedAt).toLocaleString()}
      </p>

      {/* Article Image */}
      {article?.urlToImage && (
        <img
          src={article.urlToImage}
          alt="news"
          style={{
            width: "100%",
            maxHeight: "350px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "25px",
          }}
        />
      )}

      {/* Summary Section */}
      <div>
        <h3 style={{ color: "#1a3c6e", marginBottom: "15px" }}>Summary</h3>
        {summary.map((para, i) => {
          const isExpanded = expandedParagraphs[i] || false;
          const shouldShowToggle = para.length > 200; // Show toggle if paragraph is long
          return (
            <p
              key={i}
              style={{
                marginBottom: "20px",
                lineHeight: "1.7",
                fontSize: "16px",
                color: "#333",
                maxHeight: isExpanded ? "none" : "180px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {para}
              {shouldShowToggle && !isExpanded && (
                <span
                  style={{ color: "#1a73e8", cursor: "pointer", fontWeight: "bold" }}
                  onClick={() => toggleExpand(i)}
                >
                  {" "}Read More
                </span>
              )}
              {shouldShowToggle && isExpanded && (
                <span
                  style={{ color: "#1a73e8", cursor: "pointer", fontWeight: "bold" }}
                  onClick={() => toggleExpand(i)}
                >
                  {" "}Read Less
                </span>
              )}
            </p>
          );
        })}

        {/* Like & Dislike Buttons */}
        <div style={{ marginTop: "25px", display: "flex", gap: "15px" }}>
          <button
            onClick={() => setLikes(likes + 1)}
            style={{
              padding: "10px 22px",
              backgroundColor: "#17a2b8",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Like ({likes})
          </button>
          <button
            onClick={() => setDislikes(dislikes + 1)}
            style={{
              padding: "10px 22px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Dislike ({dislikes})
          </button>
        </div>

        {/* Comments Section */}
        <div style={{ marginTop: "35px" }}>
          <h4 style={{ color: "#0d2f5f", marginBottom: "15px" }}>Comments</h4>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleAddComment}
              style={{
                padding: "10px 18px",
                backgroundColor: "#1a73e8",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Add
            </button>
          </div>

          {comments.map((c, i) => (
            <div
              key={i}
              style={{
                background: "#e3f2fd",
                padding: "12px 15px",
                borderRadius: "10px",
                marginBottom: "12px",
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#0d2f5f",
                wordBreak: "break-word",
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
