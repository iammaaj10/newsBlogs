// routes/ai.js
import express from "express";
import askGemini from "../gemini.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Question cannot be empty" });
    }

    const result = await askGemini(question);
    res.status(200).json({ result });
  } catch (error) {
    console.error("🚨 AI Route Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
