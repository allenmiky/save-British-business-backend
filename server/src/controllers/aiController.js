import { InferenceClient } from "@huggingface/inference"; // Import Hugging Face SDK
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

// Initialize Hugging Face Client
const hfToken = process.env.HUGGINGFACE_API_KEY || process.env.HF_ACCESS_TOKEN;
if (!hfToken) {
  console.error("❌ HUGGINGFACE_API_KEY / HF_ACCESS_TOKEN is missing!");
  process.exit(1);
}

const hfClient = new InferenceClient(hfToken);

// Controller to handle AI email regeneration
export const regenerateEmailController = async (req, res) => {
  const { topic, mpName, userName, emailContent } = req.body;

  // Validate inputs
  if (!topic || !mpName || !userName || !emailContent) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: topic, mpName, userName, or emailContent.",
    });
  }

  try {
    // Construct the prompt to ask the AI to improve the existing email
    const prompt = `
      You are a helpful assistant that revises professional political emails.
      Given the following email content, improve it while keeping the same structure and tone. Make it more professional or relevant to the topic.
      
      Current email content:
      ${emailContent}
      
      Topic: ${topic}
      MP Name: ${mpName}
      User Name: ${userName}
      
      Please provide:
      Subject: <subject line>
      Message: <email body>
    `;

    const model = process.env.HF_MODEL_ID || "meta-llama/Llama-3.1-8B-Instruct"; // Example model

    // Make the API request to Hugging Face
    const output = await hfClient.chatCompletion({
      model: model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512,  // Increased max tokens for a more detailed response
      temperature: 0.7,  // Adjust the creativity of the response
    });

    // Extract the AI-generated content from the response
    const aiText = output.choices[0].message.content || "";

    // Check if the subject and message are extracted correctly from the AI response
    const subjectMatch = aiText.match(/Subject:\s*(.+)/i);
    const messageMatch = aiText.match(/Message:\s*([\s\S]+)/i);

    // Fallback if the subject or message isn't parsed correctly
    const subject = subjectMatch ? subjectMatch[1].trim() : `Re: ${topic}`;
    const message = messageMatch ? messageMatch[1].trim() : aiText.trim();

    // Return the generated subject and message
    res.json({
      success: true,
      subject,
      message,
    });
  } catch (error) {
    console.error("❌ AI Error:", error);
    res.json({
      success: false,
      error: error.message || "Unknown error",
    });
  }
};