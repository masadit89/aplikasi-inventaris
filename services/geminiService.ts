import { GoogleGenAI } from "@google/genai";

// A function to safely get the AI instance.
// This prevents the app from crashing if the API key is not set.
function getAiInstance(): GoogleGenAI | null {
  // The shim in index.html ensures `process.env` exists.
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.warn("API_KEY for Gemini is not set. AI features will be disabled.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    return ai;
  } catch (error) {
    console.error("Error initializing Gemini AI. AI features will be disabled.", error);
    return null;
  }
}

// Get the instance once at the module level.
const ai = getAiInstance();

export const generateDescription = async (itemName: string): Promise<string> => {
  if (!ai) {
    return "Fitur AI tidak aktif. Mohon atur API Key.";
  }

  try {
    const prompt = `Buat deskripsi singkat dan informatif untuk item inventaris kantor dengan nama "${itemName}". Fokus pada fungsi utamanya di lingkungan kantor. Maksimal 2 kalimat.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    return "Gagal menghasilkan deskripsi. Silakan coba lagi.";
  }
};