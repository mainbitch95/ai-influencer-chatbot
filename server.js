// ✅ Load Environment Variables
require("dotenv").config();

// ✅ Import Dependencies
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(express.json());
app.use(cors());

console.log("✅ Server is starting...");

// ✅ Initialize OpenAI API (Correct Method)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure API key is correctly set in Render
});

// ✅ API Endpoint for Chat Requests
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log(`✅ Received request: ${message}`);

    // ✅ Use the correct OpenAI API function
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    });

    // ✅ Extract and Format AI Response
    let aiResponse = response.choices[0].message.content;

    // 🔹 Ensure proper formatting (adds spacing for numbered lists)
    aiResponse = aiResponse.replace(/(\d\.)/g, "\n\n$1");
    aiResponse = aiResponse.replace(/\n/g, "<br/>");

    console.log("✅ AI Response:", aiResponse);
    res.json({ response: aiResponse });

  } catch (error) {
    console.error("❌ Error generating response:", error);
    res.status(500).json({ error: "Error generating response" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
