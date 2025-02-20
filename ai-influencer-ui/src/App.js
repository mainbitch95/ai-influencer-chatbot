import React, { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState(""); // User input
  const [response, setResponse] = useState(""); // AI response
  const [loading, setLoading] = useState(false); // Loading state

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent empty messages
    setLoading(true);
    
    try {
      const res = await axios.post("http://localhost:5050/chat", { message });
      setResponse(res.data.reply); // Set AI response
    } catch (error) {
      console.error("❌ Error sending message:", error);
      setResponse("❌ Failed to get a response. Ensure the backend is running.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", textAlign: "center" }}>
      <h1>AI Influencer Chatbot</h1>
      <textarea 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your question..."
        rows="3"
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      />
      <button 
        onClick={sendMessage} 
        disabled={loading}
        style={{ marginTop: "10px", padding: "10px", fontSize: "16px", cursor: "pointer" }}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>
      {response && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", background: "#f9f9f9" }}>
          <h3>AI Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;
