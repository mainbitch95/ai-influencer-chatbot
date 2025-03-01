// ✅ Load Environment Variables (Must be at the Top)
require("dotenv").config();

// ✅ Import Dependencies
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai"); // ✅ Corrected OpenAI Import

// ✅ Initialize Express App
const app = express();
app.use(express.json());
app.use(cors());

// ✅ Debugging Logs
console.log("✅ Server is starting...");

// ✅ Initialize OpenAI API (Fixed Configuration Error)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ Ensure this is set in Render Environment Variables
});

// ✅ Default Route to Check Server Status
app.get("/", (req, res) => {
  res.send("✅ AI Influencer Chatbot Backend is Running!");
});

// ✅ API Endpoint for AI Chat Requests
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message in request body" });
    }

    console.log(`✅ Received request: ${message}`);

    // ✅ Send Request to OpenAI
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    });

   // ✅ Extract AI Response and Format Output
let aiResponse = response.data.choices[0].message.content;

// 🔹 Ensure numbered lists have correct spacing
aiResponse = aiResponse.replace(/(\d\.)/g, "<br/><br/>$1");
aiResponse = aiResponse.replace(/\n/g, "<br/>"); // Convert new lines to HTML breaks

console.log("✅ AI Response:", aiResponse);
res.json({ response: aiResponse });
  } catch (error) {
    console.error("❌ Error generating response:", error);
    res.status(500).json({ error: "Error generating response" });
  }
});

// ✅ Set Server Port (Change if needed)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});