// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

console.log("✅ Server is starting...");

// Ensure API key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing in .env file!");
  process.exit(1);
}

// OpenAI Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Handle chat request
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log(`✅ Received request: ${message}`);

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    });

    let aiResponse = response.data.choices[0].message.content || "❌ No response received.";

    // Format AI response to ensure better readability
    const formattedResponse = response.data.choices[0].message.content
    .replace(/(\d+\.)\s?/g, "<br/><br/>$1 ") // Adds HTML line breaks before each number
    .trim();  
  
  console.log("✅ AI Response (Formatted):", formattedResponse);
  res.json({ response: formattedResponse });  

  } catch (error) {
    console.error("❌ Error generating response:", error);
    res.status(500).json({ error: "Error generating response" });
  }
});

// Start server
const PORT = process.env.PORT || 5070;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
