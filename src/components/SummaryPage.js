import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { article } = location.state || {};

  const [summary, setSummary] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [expandedParagraphs, setExpandedParagraphs] = useState({});

  // --- Discussion platform state ---
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [sortMode, setSortMode] = useState("top"); // "top" | "latest"

  // --- Utility to clean text ---
  const cleanText = (text) => {
    if (!text) return "No content available.";
    return text
      .replace(/<[^>]*>/g, "")
      .replace(/\[\+\d+ chars\]/g, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // --- Generate summary paragraphs ---
  useEffect(() => {
    if (!article) {
      navigate("/");
    } else {
      const rawText = `${article.title || ""}. ${article.description || ""}. ${
        article.content || ""
      }`;
      const cleanedText = cleanText(rawText);
      const sentences = cleanedText.split(/(?<=[.!?])\s+/);
      const paragraphs = [];
      let temp = [];
      sentences.forEach((s, i) => {
        temp.push(s);
        if ((i + 1) % 5 === 0 || i === sentences.length - 1) {
          paragraphs.push(temp.join(" "));
          temp = [];
        }
      });
      if (paragraphs.length > 0)
        paragraphs[0] = `Title: ${article.title}. ${paragraphs[0]}`;
      if (paragraphs.length > 1) paragraphs[1] = `Overview: ${paragraphs[1]}`;
      if (paragraphs.length > 2)
        paragraphs[2] = `Details & Insights: ${paragraphs[2]}`;
      setSummary(paragraphs);
    }
  }, [article, navigate]);

  // --- Expand/Collapse summary paragraphs ---
  const toggleExpand = (index) => {
    setExpandedParagraphs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // --- Add a new discussion post ---
  const handleAddPost = () => {
    if (!newPostText.trim()) return;
    const newPost = {
      id: Date.now(),
      text: newPostText,
      votes: 0,
      replies: [],
      timestamp: new Date(),
    };
    setPosts((prev) => [newPost, ...prev]);
    setNewPostText("");
  };

  // --- Handle upvote/downvote ---
  const handleVote = (id, delta, parentId = null) => {
    const updateVotes = (arr) =>
      arr.map((p) => {
        if (p.id === id) return { ...p, votes: p.votes + delta };
        if (p.replies.length)
          return { ...p, replies: updateVotes(p.replies) };
        return p;
      });
    setPosts((prev) => updateVotes(prev));
  };

  // --- Handle replying to a comment ---
  const handleReply = (id, replyText) => {
    if (!replyText.trim()) return;
    const newReply = {
      id: Date.now(),
      text: replyText,
      votes: 0,
      replies: [],
      timestamp: new Date(),
    };
    const addReply = (arr) =>
      arr.map((p) => {
        if (p.id === id) return { ...p, replies: [...p.replies, newReply] };
        if (p.replies.length) return { ...p, replies: addReply(p.replies) };
        return p;
      });
    setPosts((prev) => addReply(prev));
  };

  // --- Recursive threaded post component ---
  const Post = ({ post, depth = 0 }) => {
    const [replyText, setReplyText] = useState("");
    const [showReplyBox, setShowReplyBox] = useState(false);

    return (
      <div
        style={{
          marginLeft: depth * 25,
          marginTop: "15px",
          background: "#ffffff",
          padding: "12px 15px",
          borderRadius: "8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ fontSize: "15px", marginBottom: "8px", color: "#0d2f5f" }}>
          {post.text}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => handleVote(post.id, 1)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#28a745",
              fontWeight: "bold",
            }}
          >
            ▲
          </button>
          <span style={{ fontSize: "14px", color: "#333" }}>{post.votes}</span>
          <button
            onClick={() => handleVote(post.id, -1)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#dc3545",
              fontWeight: "bold",
            }}
          >
            ▼
          </button>
          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            style={{
              marginLeft: "10px",
              color: "#1a73e8",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Reply
          </button>
        </div>

        {showReplyBox && (
          <div style={{ marginTop: "10px" }}>
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              style={{
                width: "80%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
            <button
              onClick={() => {
                handleReply(post.id, replyText);
                setReplyText("");
                setShowReplyBox(false);
              }}
              style={{
                marginLeft: "10px",
                padding: "8px 12px",
                backgroundColor: "#1a73e8",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Post
            </button>
          </div>
        )}

        {post.replies.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            {post.replies.map((r) => (
              <Post key={r.id} post={r} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- Sort posts ---
  const sortedPosts =
    sortMode === "top"
      ? [...posts].sort((a, b) => b.votes - a.votes)
      : [...posts].sort((a, b) => b.timestamp - a.timestamp);

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

      {/* Title */}
      <h1 style={{ marginBottom: "10px", color: "#0d2f5f" }}>
        {article?.title}
      </h1>
      <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
        {article?.author ? `By ${article.author}` : ""} |{" "}
        {new Date(article?.publishedAt).toLocaleString()}
      </p>

      {/* Image */}
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

      {/* Summary */}
      <div>
        <h3 style={{ color: "#1a3c6e", marginBottom: "15px" }}>Summary</h3>
        {summary.map((para, i) => {
          const isExpanded = expandedParagraphs[i] || false;
          const shouldShowToggle = para.length > 300;
          return (
            <div key={i} style={{ marginBottom: "25px", fontSize: "16px" }}>
              <p
                style={{
                  margin: 0,
                  overflow: "hidden",
                  maxHeight: isExpanded ? "none" : "180px",
                  transition: "max-height 0.4s ease",
                }}
              >
                {para}
              </p>
              {shouldShowToggle && (
                <span
                  onClick={() => toggleExpand(i)}
                  style={{
                    color: "#1a73e8",
                    cursor: "pointer",
                    fontWeight: "bold",
                    display: "inline-block",
                    marginTop: "8px",
                  }}
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Like/Dislike */}
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

      {/* Discussion Platform */}
      <div style={{ marginTop: "50px" }}>
        <h3 style={{ color: "#0d2f5f", marginBottom: "15px" }}>Discussion</h3>

        {/* Sort Controls */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ marginRight: "10px" }}>Sort by:</label>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="top">Top</option>
            <option value="latest">Latest</option>
          </select>
        </div>

        {/* New Post Input */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Start a discussion..."
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
          <button
            onClick={handleAddPost}
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
            Post
          </button>
        </div>

        {/* Threaded Posts */}
        {sortedPosts.length === 0 ? (
          <p style={{ color: "#666" }}>No discussions yet. Be the first!</p>
        ) : (
          sortedPosts.map((p) => <Post key={p.id} post={p} />)
        )}
      </div>
    </div>
  );
};

export default SummaryPage;
