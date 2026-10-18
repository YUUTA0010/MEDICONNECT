import { GoogleGenAI, Type } from "@google/genai";
import { Substitute } from "../types";

// NOTE: In a real app, never expose API keys on the client side.
// This is for demonstration using the provided environment variable pattern.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const getMedicineSubstitutes = async (medicineName: string, salt: string): Promise<Substitute[]> => {
  if (!apiKey) {
    console.warn("No API Key found. Returning mock substitutes.");
    return [
      { name: "Mock Generic A", manufacturer: "Generic Corp", priceEstimate: "50% cheaper", matchReason: "Same salt composition" },
      { name: "Mock Generic B", manufacturer: "Pharma Inc", priceEstimate: "30% cheaper", matchReason: "Alternative brand" }
    ];
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `Find 3 cheaper or popular substitutes for the medicine "${medicineName}" (Salt: ${salt}) available in India. Return JSON.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              manufacturer: { type: Type.STRING },
              priceEstimate: { type: Type.STRING, description: "Comparison to original e.g. '20% Cheaper'" },
              matchReason: { type: Type.STRING, description: "Why is it a substitute? e.g. 'Same salt'" }
            }
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as Substitute[];
    }
    return [];

  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const getSymptomRemedies = async (symptoms: string): Promise<{ suggestion: string, medicines: string[] }> => {
  if (!apiKey) return { suggestion: "Please consult a doctor.", medicines: ["Paracetamol"] };

  try {
    const model = "gemini-2.5-flash";
    const prompt = `User has symptoms: ${symptoms}. Suggest strictly OTC (Over The Counter) medicines commonly used in India. Provide a short advice and a list of medicine names. If symptoms sound serious, advise seeing a doctor immediately.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestion: { type: Type.STRING, description: "Medical advice disclaimer and brief suggestion" },
            medicines: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of generic OTC medicine names"
            }
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    return { suggestion: "Could not generate advice.", medicines: [] };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { suggestion: "Error connecting to AI assistant.", medicines: [] };
  }
};
