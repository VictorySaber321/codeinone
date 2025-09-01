import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateWithGemini(prompt) {
  try {
    // Use the correct model name - gemini-pro might be deprecated or need a different approach
    // Try using the latest model name
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest"  // Updated model name
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Extract text from response
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generating with Gemini:', error);
    
    // Provide more specific error messages
    if (error.message.includes("API_KEY")) {
      throw new Error("Invalid Gemini API key. Please check your API key configuration.");
    } else if (error.message.includes("quota")) {
      throw new Error("API quota exceeded. Please check your Gemini API usage limits.");
    } else if (error.message.includes("permission")) {
      throw new Error("Permission denied. Please check your Gemini API access permissions.");
    } else if (error.message.includes("model")) {
      throw new Error("Model not found. Please check if the model name is correct.");
    }
    
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}