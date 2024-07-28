import mongoose from "mongoose";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// Define the Problem schema and model
const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
});

const Problem = mongoose.model("Problem", ProblemSchema);

const generatePrompt = (type, problemStatement, language = "") => {
  switch (type) {
    case "hints":
      return `Problem: ${problemStatement}

Task: Generate 3 detailed and helpful hints for solving this problem. Each hint should provide a specific insight or strategy without revealing the full solution.

Format your response exactly as follows:
Hint 1: [Provide a detailed first hint here]
Hint 2: [Provide a different, detailed second hint here]
Hint 3: [Provide a final, detailed third hint here]

Ensure each hint is unique and provides valuable guidance.`;
    // ... other cases remain the same
  }
};

// Add a problem to the database
const addProblem = async (req, res) => {
  const { title, description, difficulty } = req.body;

  try {
    const newProblem = new Problem({ title, description, difficulty });
    await newProblem.save();
    res.status(201).json(newProblem);
  } catch (error) {
    console.error("Error adding problem:", error);
    res.status(500).json({
      error: "An error occurred while adding the problem",
      details: error.message,
    });
  }
};
const generateResponse = async (req, res, type) => {
  const { problemStatement, language } = req.body;

  if (!problemStatement) {
    return res.status(400).json({ error: "Problem statement is required" });
  }

  if (!process.env.HUGGING_FACE_API_KEY) {
    console.error("Hugging Face API key is missing");
    return res.status(500).json({ error: "API key configuration error" });
  }

  const prompt = `Problem: ${problemStatement}\n\nProvide 3 detailed hints to solve this problem without revealing the full solution.`;
  console.log("Generated prompt:", prompt);

  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds

  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i + 1} to generate response...`);
      const response = await fetch(
        "https://api-inference.huggingface.co/models/gpt2-xl",
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_length: 500,
              temperature: 0.7,
              top_p: 0.95,
              do_sample: true,
            },
          }),
        },
      );

      const result = await response.json();
      console.log("Hugging Face API response:", result);

      if (result.error && result.error.includes("currently loading")) {
        const waitTime = result.estimated_time
          ? Math.ceil(result.estimated_time) * 1000
          : retryDelay;
        console.log(
          `Model is loading. Waiting for ${waitTime / 1000} seconds before retrying...`,
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      if (result.error) {
        throw new Error(result.error);
      }

      // Extract the generated text
      const generatedText = result[0]?.generated_text || "";

      // Extract hints using a more flexible approach
      const hints = extractHints(generatedText);

      return res.json({ result: hints });
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      if (i === maxRetries - 1) {
        return res.status(500).json({
          error: "An error occurred while generating the response",
          details: error.message,
        });
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  return res.status(500).json({
    error: "Failed to generate response after multiple attempts",
    details: "Model loading timeout",
  });
};

// Helper function to extract hints
function extractHints(text) {
  // Split the text into sentences
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Select up to 3 sentences that are likely to be hints
  const hints = sentences
    .filter(
      (s) =>
        s.length > 20 &&
        !s.toLowerCase().includes("problem:") &&
        !s.toLowerCase().includes("solution:"),
    )
    .slice(0, 3)
    .map((hint, index) => `Hint ${index + 1}: ${hint}`);

  return hints.length > 0 ? hints : ["No valid hints could be generated."];
}

// Export functions for route handling
const generateHints = (req, res) => generateResponse(req, res, "hints");
const generateAlgorithms = (req, res) =>
  generateResponse(req, res, "algorithm");
const generateCode = (req, res) => generateResponse(req, res, "code");

export { addProblem, generateHints, generateAlgorithms, generateCode };
