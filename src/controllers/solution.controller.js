import {
  generateHintsWithRAG,
  generateAlgorithmsWithRAG,
  generateCodeWithRAG,
} from "../services/ragService.js";
import Problem from "../models/problem.model.js";

export const generateHints = async (req, res) => {
  try {
    const { problem } = req.body;
    if (!problem) {
      return res.status(400).json({ error: "Problem statement is required." });
    }

    const hints = await generateHintsWithRAG(problem);
    res.status(200).json({ hints });
  } catch (error) {
    console.error("Error generating hints:", error);
    res.status(500).json({ error: "Failed to generate hints." });
  }
};

export const generateAlgorithms = async (req, res) => {
  try {
    const { problem } = req.body;
    if (!problem) {
      return res.status(400).json({ error: "Problem statement is required." });
    }

    const algorithms = await generateAlgorithmsWithRAG(problem);
    res.status(200).json({ algorithms });
  } catch (error) {
    console.error("Error generating algorithms:", error);
    res.status(500).json({ error: "Failed to generate algorithms." });
  }
};

export const generateCode = async (req, res) => {
  try {
    const { problem, language } = req.body;
    if (!problem || !language) {
      return res
        .status(400)
        .json({
          error: "Problem statement and programming language are required.",
        });
    }

    const code = await generateCodeWithRAG(problem, language);
    res.status(200).json({ code });
  } catch (error) {
    console.error("Error generating code:", error);
    res.status(500).json({ error: "Failed to generate code." });
  }
};

export const addProblem = async (req, res) => {
  try {
    const { title, description, difficulty, tags } = req.body;
    if (!title || !description || !difficulty) {
      return res
        .status(400)
        .json({ error: "Title, description, and difficulty are required." });
    }

    const newProblem = new Problem({
      title,
      description,
      difficulty,
      tags: tags || [],
    });

    await newProblem.save();
    res
      .status(201)
      .json({ message: "Problem added successfully", problem: newProblem });
  } catch (error) {
    console.error("Error adding problem:", error);
    res.status(500).json({ error: "Failed to add problem." });
  }
};
