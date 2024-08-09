import dotenv from "dotenv";
import {
  generateHintsWithRAG,
  generateAlgorithmsWithRAG,
  generateCodeWithRAG,
} from "./services/ragService.js";

dotenv.config();

async function testGeminiIntegration() {
  try {
    const problem =
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.";

    console.log("Testing hint generation:");
    const hints = await generateHintsWithRAG(problem);
    console.log(hints);

    console.log("\nTesting algorithm generation:");
    const algorithms = await generateAlgorithmsWithRAG(problem);
    console.log(algorithms);

    console.log("\nTesting code generation:");
    const code = await generateCodeWithRAG(problem, "Python");
    console.log(code);
  } catch (error) {
    console.error("Error testing Gemini integration:", error);
  }
}

testGeminiIntegration();
