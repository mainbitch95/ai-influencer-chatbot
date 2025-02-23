// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Debugging Logs
console.log("✅ Server is starting...");

// ✅ Initialize OpenAI with API Key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this key is set in your .env file
});

// ✅ API Endpoint for Chat Requests
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log(`✅ Received request: ${message}`);

    // ✅ Generate AI Response
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    });

    // ✅ Extract AI Response and Format Output
    let aiResponse = response.choices[0].message.content;

    // 🔹 Ensure Proper Formatting for Lists
    aiResponse = aiResponse.replace(/\n/g, "<br/>"); // Convert new lines to HTML breaks

    console.log("✅ AI Response:", aiResponse);
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("❌ Error generating response:", error);
    res.status(500).json({ error: "Error generating response" });
  }
});

// ✅ Start Server on Port 10000
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
