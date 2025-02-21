require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());

// ✅ Fix CORS to Allow Frontend Requests
app.use(cors({
    origin: "*", // You can change "*" to your Vercel frontend URL later for security
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

console.log("✅ Server is starting..."); // Debugging log

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This loads your API key from .env
});

// ✅ Add a simple route to check if the server is running
app.get("/", (req, res) => {
    res.send("✅ AI Chatbot Server is Running!");
});

// ✅ Your existing chatbot route
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        console.log(`✅ Received request: ${message}`);

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: message }],
        });

        console.log("✅ AI Response:", response.choices[0].message.content);
        res.json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error("❌ Error generating response:", error);
        res.status(500).json({ error: "Error generating response" });
    }
});

// ✅ Fix Port Handling for Render Deployment
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
});
