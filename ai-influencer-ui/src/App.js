import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
`;

const Container = styled.div`
  width: 400px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ChatBox = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Message = styled.div`
  background: ${(props) => (props.sender === "AI" ? "#e0f7fa" : "#dcf8c6")};
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 8px;
  width: fit-content;
  max-width: 80%;
  align-self: ${(props) => (props.sender === "AI" ? "flex-start" : "flex-end")};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  margin-top: 10px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #0056b3;
  }
`;

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { text: message, sender: "You" }]);
    setMessage("");
    setLoading(true);

    try {
      const BACKEND_URL = "https://ai-influencer-chatbot.onrender.com";
      const res = await axios.post(`${BACKEND_URL}/chat`, { message });
      
      setMessages((prev) => [...prev, { text: res.data.response.replace(/<br\/>/g, "\n"), sender: "AI" }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { text: "❌ Failed to get a response.", sender: "AI" }]);
    }
    
    setLoading(false);
  };

  return (
    <Container>
      <GlobalStyle />
      <h2>AI Influencer Chatbot</h2>
      <ChatBox>
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
};

export default App;
