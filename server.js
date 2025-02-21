require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());
app.use(cors());

console.log("✅ Server is starting..."); // Debugging log

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This loads your API key from .env
});

// Debugging log: Check if API key is loading
console.log("API Key Loaded:", process.env.OPENAI_API_KEY ? "✅ Yes" : "❌ No");

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log("✅ Received request:", message);

        // Send request to OpenAI
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [{ role: 'user', content: message }],
        });

        // Log the response for debugging
        console.log("✅ Full OpenAI Response:", response);
console.log("✅ AI Response:", response.choices[0]?.message?.content || "❌ No response from OpenAI");

        // Send AI response to client
        res.json({ reply: response.choices[0].message.content });

    } catch (error) {
        console.error("❌ OpenAI Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Error generating response", details: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 10000; // Ensure this line exists

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
