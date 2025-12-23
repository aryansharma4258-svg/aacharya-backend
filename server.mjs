import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getAIResponse } from "./logic.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🧠 TEMP MEMORY (per server, hackathon-friendly)
let conversationContext = {
  lastQuestion: null
};

// health check
app.get("/", (req, res) => {
  res.send("Server is running");
});

// chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  // 🔹 TRY GEMINI FIRST
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userMessage }] }]
        })
      }
    );

    const data = await response.json();

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.json({
        reply: data.candidates[0].content.parts[0].text,
        source: "gemini"
      });
    }
  } catch (err) {
    console.log("Gemini failed → using fallback");
  }

  // 🔹 FALLBACK WITH CONTEXT
  const fallbackReply = getAIResponse(userMessage, conversationContext);

  // 🧠 update memory if question asked
  if (fallbackReply.includes("❓")) {
    conversationContext.lastQuestion = fallbackReply;
  } else {
    conversationContext.lastQuestion = null;
  }

  res.json({
    reply: fallbackReply,
    source: "fallback"
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});





