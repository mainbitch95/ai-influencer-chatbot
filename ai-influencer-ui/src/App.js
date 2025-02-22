import React, { useState, useEffect } from "react";
import ReactGA from "react-ga4"; // ✅ Use react-ga4 instead
import axios from "axios";

const TRACKING_ID = "G-GCEKZZL7Y3"; 
ReactGA.initialize(TRACKING_ID);

function App() {
  useEffect(() => {
    ReactGA.send("pageview");
  }, []);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://ai-influencer-chatbot.onrender.com";
      const res = await axios.post(`${BACKEND_URL}/chat`, { message });

      setMessages([...messages, { text: res.data.response, sender: "AI" }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([...messages, { text: "❌ Failed to get a response. Ensure the backend is running.", sender: "AI" }]);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <div>
      <h2>AI Influencer Chatbot</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </button>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.sender}: {msg.text}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
