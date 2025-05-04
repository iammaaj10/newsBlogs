// routes/ai.js
import express from "express";
import askGemini from "../gemini.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    const result = await askGemini(question);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

export default router;
