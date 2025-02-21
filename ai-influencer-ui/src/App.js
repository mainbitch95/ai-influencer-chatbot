import React, { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState(""); // User input
  const [messages, setMessages] = useState([]); // Stores conversation history
  const [loading, setLoading] = useState(false); // Loading state

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent empty messages
    setLoading(true);

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://ai-influencer-chatbot.onrender.com";
      const res = await axios.post(`${BACKEND_URL}/chat`, { message });

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: "User" },
        { text: res.data.response, sender: "AI" }
      ]);

      setMessage(""); // Clear input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "❌ Failed to get a response. Ensure the backend is running.", sender: "AI" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>AI Influencer Chatbot</h2>
      <div style={{ border: "1px solid #ddd", padding: "10px", minHeight: "200px", marginBottom: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "User" ? "right" : "left", margin: "5px 0" }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <button onClick={sendMessage} disabled={loading} style={{ width: "100%", padding: "10px" }}>
        {loading ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
}

export default App;
