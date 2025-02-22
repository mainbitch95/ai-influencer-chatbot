import React, { useState, useEffect, useRef } from "react";
import ReactGA from "react-ga";
import axios from "axios";

// ✅ Google Analytics Setup
const TRACKING_ID = "G-GCEKZZL7Y3"; 
ReactGA.initialize(TRACKING_ID);
ReactGA.pageview(window.location.pathname);

function App() {
  const [message, setMessage] = useState(""); // User input
  const [messages, setMessages] = useState([]); // Chat history
  const [loading, setLoading] = useState(false); // Typing indicator
  const [darkMode, setDarkMode] = useState(false); // Dark mode toggle
  const chatEndRef = useRef(null); // Scroll to bottom

  useEffect(() => {
    // Scroll to the latest message when messages update
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent empty messages
    setLoading(true);

    const userMessage = { text: message, sender: "User" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://ai-influencer-chatbot.onrender.com";
      const res = await axios.post(`${BACKEND_URL}/chat`, { message });

      const aiMessage = { text: res.data.response, sender: "AI" };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "❌ Failed to get a response. Ensure the backend is running.", sender: "AI" }
      ]);
    } finally {
      setLoading(false);
      setMessage(""); // Clear input field
    }
  };

  return (
    <div className={`chat-container ${darkMode ? "dark" : ""}`} style={styles.container}>
      <h2>AI Influencer Chatbot</h2>
      <button onClick={toggleDarkMode} style={styles.toggleButton}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={{ ...styles.message, ...(msg.sender === "User" ? styles.userMessage : styles.aiMessage) }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        {loading && <div style={styles.typingIndicator}>AI is typing...</div>}
        <div ref={chatEndRef} />
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={styles.input}
      />
      <button onClick={sendMessage} disabled={loading} style={styles.sendButton}>
        {loading ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
}

// ✅ CSS-in-JS for styling
const styles = {
  container: { maxWidth: "600px", margin: "auto", padding: "20px", textAlign: "center" },
  chatBox: { border: "1px solid #ddd", padding: "10px", minHeight: "300px", marginBottom: "10px", overflowY: "auto" },
  message: { padding: "8px", borderRadius: "8px", margin: "5px 0", maxWidth: "80%" },
  userMessage: { backgroundColor: "#dcf8c6", alignSelf: "flex-end", textAlign: "right" },
  aiMessage: { backgroundColor: "#f1f0f0", alignSelf: "flex-start", textAlign: "left" },
  typingIndicator: { fontStyle: "italic", color: "#888" },
  input: { width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc" },
  sendButton: { width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" },
  toggleButton: { marginBottom: "10px", padding: "5px", backgroundColor: "#ffcc00", border: "none", cursor: "pointer" }
};

export default App;
