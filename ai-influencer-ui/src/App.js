import React, { useState, useEffect, useRef } from "react";
import ReactGA from "react-ga4";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";

// ✅ Google Analytics Setup
const TRACKING_ID = "G-GCEKZZL7Y3"; 
ReactGA.initialize(TRACKING_ID);

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    background-color: ${(props) => (props.darkMode ? "#121212" : "#f9f9f9")};
    color: ${(props) => (props.darkMode ? "#ffffff" : "#000000")};
    transition: 0.3s;
  }
`;

const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
  text-align: center;
`;

const ChatBox = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  min-height: 300px;
  max-height: 400px;
  overflow-y: auto;
  background: ${(props) => (props.darkMode ? "#1e1e1e" : "#ffffff")};
  border-radius: 10px;
`;

const Message = styled.div`
  padding: 8px;
  border-radius: 8px;
  margin: 5px 0;
  max-width: 75%;
  text-align: ${(props) => (props.sender === "User" ? "right" : "left")};
  align-self: ${(props) => (props.sender === "User" ? "flex-end" : "flex-start")};
  background-color: ${(props) =>
    props.sender === "User" ? "#dcf8c6" : "#f1f0f0"};
  color: ${(props) => (props.sender === "User" ? "#000" : "#000")};
`;

const Input = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ToggleButton = styled.button`
  margin-bottom: 10px;
  padding: 5px;
  background-color: #ffcc00;
  border: none;
  cursor: pointer;
  border-radius: 5px;
`;

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    ReactGA.send("pageview");
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
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
      setMessage("");
    }
  };

  return (
    <Container>
      <GlobalStyle darkMode={darkMode} />
      <h2>AI Influencer Chatbot</h2>
      <ToggleButton onClick={toggleDarkMode}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </ToggleButton>
      <ChatBox darkMode={darkMode}>
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender}>
            <strong>{msg.sender}:</strong> {msg.text}
          </Message>
        ))}
        {loading && <Message sender="AI">AI is typing...</Message>}
        <div ref={chatEndRef} />
      </ChatBox>
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <Button onClick={sendMessage} disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </Container>
  );
}

export default App;
