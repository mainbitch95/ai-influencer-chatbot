import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";

const BACKEND_URL = "https://ai-influencer-chatbot.onrender.com"; // Update with your Render backend URL

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => (props.darkMode ? "#121212" : "#f5f5f5")};
    color: ${(props) => (props.darkMode ? "#fff" : "#000")};
    font-family: Arial, sans-serif;
    text-align: center;
  }
`;

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: ${(props) => (props.darkMode ? "#1e1e1e" : "#fff")};
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const ChatBox = styled.div`
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ddd;
  background: ${(props) => (props.darkMode ? "#282c34" : "#fafafa")};
  border-radius: 5px;
`;

const Message = styled.div`
  text-align: ${(props) => (props.sender === "AI" ? "left" : "right")};
  padding: 8px;
  margin: 5px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.sender === "AI" ? "#e0e0e0" : "#007bff"};
  color: ${(props) => (props.sender === "AI" ? "#000" : "#fff")};
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px;
  margin-left: 10px;
  border: none;
  background: #007bff;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
`;

const ToggleButton = styled.button`
  margin: 10px;
  padding: 8px;
  border-radius: 5px;
  border: none;
  background: #444;
  color: white;
  cursor: pointer;
`;

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, sender: "You", timestamp: new Date().toLocaleTimeString() }
    ]);

    try {
      const res = await axios.post(`${BACKEND_URL}/chat`, { message });
      const aiMessage = { text: res.data.response, sender: "AI", timestamp: new Date().toLocaleTimeString() };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "❌ Failed to get a response. Ensure the backend is running.", sender: "AI" }
      ]);
    }
    setLoading(false);
  };

  const saveChat = async () => {
    const chatContent = messages.map(msg => `${msg.sender}: ${msg.text}`).join("\n");
    await axios.post(`${BACKEND_URL}/save`, { content: chatContent });
    alert("Chat saved!");
  };

  return (
    <Container darkMode={darkMode}>
      <GlobalStyle darkMode={darkMode} />
      <h2>AI Influencer Chatbot</h2>
      <ToggleButton onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </ToggleButton>
      <ChatBox darkMode={darkMode}>
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender}>
            <strong>{msg.sender}:</strong> {msg.text} <br />
            <small>{msg.timestamp}</small>
          </Message>
        ))}
        {loading && <Message sender="AI">AI is typing...</Message>}
        <div ref={chatEndRef} />
      </ChatBox>
      <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
      <Button onClick={sendMessage} disabled={loading}>{loading ? "Sending..." : "Send"}</Button>
      <Button onClick={saveChat}>Save Chat</Button>
    </Container>
  );
}

export default App;
