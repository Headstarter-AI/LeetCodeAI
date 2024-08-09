import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

// Polyfill fetch for Node.js environments
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateContent(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function generateHintsWithRAG(problem) {
  const prompt = `Given the following LeetCode problem, provide 3 helpful hints without giving away the full solution:

Problem: ${problem}

Provide 3 hints that guide the user towards the solution without revealing it completely.`;

  const hints = await generateContent(prompt);
  return hints.split("\n").filter((hint) => hint.trim() !== "");
}

export async function generateAlgorithmsWithRAG(problem) {
  const prompt = `Given the following LeetCode problem, describe 2-3 possible algorithms to solve it:

Problem: ${problem}

Provide a brief overview of 2-3 algorithms that could be used to solve this problem, including their time and space complexity.`;

  return await generateContent(prompt);
}

export async function generateCodeWithRAG(problem, language) {
  const prompt = `Given the following LeetCode problem, generate a solution in ${language}:

Problem: ${problem}

Provide a complete, working solution in ${language}. Include comments explaining the key parts of the code.`;

  return await generateContent(prompt);
}
