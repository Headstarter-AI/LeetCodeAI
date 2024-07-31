// File: services/ragService.js

import { MongoClient } from "mongodb";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);

async function connectToDatabase() {
  await mongoClient.connect();
  return mongoClient.db("leetcode_problems");
}

async function searchSimilarProblems(problem, db) {
  const problems = db.collection("problems");
  const result = await problems
    .aggregate([
      {
        $search: {
          index: "problem_search",
          text: {
            query: problem,
            path: {
              wildcard: "*",
            },
          },
        },
      },
      {
        $limit: 5,
      },
    ])
    .toArray();

  return result;
}

async function generateHintsWithRAG(problem) {
  const db = await connectToDatabase();
  const similarProblems = await searchSimilarProblems(problem, db);

  const context = similarProblems
    .map((p) => `${p.title}: ${p.description}`)
    .join("\n\n");

  const prompt = `Given the following similar LeetCode problems:\n\n${context}\n\nGenerate 3 helpful hints for solving this problem:\n${problem}\n\nHints:`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 300,
    temperature: 0.7,
  });

  const hints = response.data.choices[0].text.trim().split("\n");
  return hints;
}

export { generateHintsWithRAG };
