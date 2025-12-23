import { getAIResponse } from "./logic.mjs";

const userInput = "I feel tired and eat junk food";

console.log("USER:", userInput);
console.log("\nAI RESPONSE:");
console.log(getAIResponse(userInput));