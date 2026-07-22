
/// <reference types="vite/client" />

import { GoogleGenAI, Type } from "@google/genai";
import { FoodCategory, FreshnessStatus, RecipientGroup, PredictiveInsight, NGORequirements, FoodListing } from "./types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!API_KEY) {
  console.error("ZeroCrumbs: VITE_GEMINI_API_KEY is missing in .env file. AI features will be disabled.");
}

export const analyzeFoodImage = async (base64Image: string) => {
  try {
    if (!ai) return null;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: "Analyze this food image. Extract: food name, estimated category, servings (quantity in kg/portions), number of people it can serve (integer), prepared date (YYYY-MM-DD), prepared time (e.g. 30 mins), nutrition, allergens, and suggest which Recipient Groups it is best for (Children, Elderly, Pregnant Women, General Public, High Activity). Return JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            quantity: { type: Type.STRING },
            servings: { type: Type.INTEGER, description: "Number of people this food can serve" },
            preparedDate: { type: Type.STRING, description: "Estimated date of preparation (YYYY-MM-DD)" },
            cookingTime: { type: Type.STRING, description: "Estimated prepared time (e.g., '20 mins')" },
            targetGroups: { type: Type.ARRAY, items: { type: Type.STRING } },
            nutrition: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fats: { type: Type.NUMBER },
                allergens: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["calories", "protein", "carbs", "fats", "allergens"]
            }
          },
          required: ["name", "category", "quantity", "nutrition", "targetGroups", "servings", "cookingTime", "preparedDate"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    return null;
  }
};

export const searchNearbyFoodSupport = async (lat: number, lng: number) => {
  try {
    if (!ai) return { text: "AI Unavailable", sources: [] };
    const response = await ai.models.generateContent({
      // Use gemini-2.5-flash for maps grounding as per guidelines for 2.5 series models.
      model: "gemini-2.5-flash",
      contents: "What are the 5 best food banks, shelters, or community kitchens near my current location? Provide their names and brief descriptions.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, sources };
  } catch (error) {
    console.error("Google Maps Grounding Error:", error);
    return null;
  }
};

export const calculateNutritionMatch = async (listing: FoodListing, requirements: NGORequirements) => {
  try {
    if (!ai) return { matchPercentage: 0, matchReason: "AI Unavailable" };
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Compare this food listing with these NGO requirements. 
      Listing: ${JSON.stringify(listing)}
      NGO Requirements: ${JSON.stringify(requirements)}
      
      Calculate a match percentage (0-100) and provide a one-sentence reason why it matches. Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchPercentage: { type: Type.NUMBER },
            matchReason: { type: Type.STRING }
          },
          required: ["matchPercentage", "matchReason"]
        }
      }
    });
    return JSON.parse(response.text || '{"matchPercentage": 50, "matchReason": "Standard nutritional match."}');
  } catch (error) {
    return { matchPercentage: 70, matchReason: "Generic match based on category." };
  }
};

export const getPredictiveInsights = async (userType: string): Promise<PredictiveInsight[]> => {
  try {
    if (!ai) throw new Error("AI Unavailable");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 2 specific, realistic predictive waste insights for a ${userType} in a food-waste reduction platform. 
      Consider seasonality (e.g. festivals, wedding season), local trends, and logistical opportunities. 
      Return JSON as an array of objects with title, description, type (TREND, ALERT, OPPORTUNITY), and impactLevel (HIGH, MEDIUM, LOW).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING },
              impactLevel: { type: Type.STRING }
            },
            required: ["title", "description", "type", "impactLevel"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [
      {
        title: "Seasonality Alert",
        description: "Upcoming local festivities usually lead to a 20% increase in surplus cooked meals.",
        type: "ALERT",
        impactLevel: "MEDIUM"
      }
    ];
  }
};

export const scanFoodSafety = async (base64Image: string) => {
  try {
    if (!ai) return null;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: "Act as a professional food safety inspector. Analyze this image for signs of spoilage, mold, discoloration, or poor quality. Provide a safety verdict and specific observations. Return JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safetyVerdict: { type: Type.STRING, description: "Safe, Caution, or Unsafe" },
            freshnessScore: { type: Type.NUMBER, description: "Score from 0 to 100" },
            observations: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING },
            safeToRedistribute: { type: Type.BOOLEAN }
          },
          required: ["safetyVerdict", "freshnessScore", "observations", "recommendation", "safeToRedistribute"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Food Safety Scan Error:", error);
    return null;
  }
};

export const getKitchenTips = async (foodItem: string) => {
  try {
    if (!ai) return "AI tips unavailable.";
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert chef focused on zero-waste community cooking. I have a surplus of "${foodItem}". Provide: 
      1. A creative recipe for a large group. 
      2. 3 preservation tips to make it last longer. 
      3. A clever "rescue" tip if the food is slightly aged.
      Format the response in structured Markdown.`,
    });
    return response.text;
  } catch (error) {
    return "Could not generate tips at this moment. Please try again soon.";
  }
};

export const getSustainabilityFact = async () => {
  try {
    if (!ai) throw new Error("AI Unavailable");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Tell me one surprising, short fact about food waste and its environmental impact. Keep it under 20 words.",
    });
    return response.text;
  } catch (error) {
    return "Food waste is a major contributor to global greenhouse gas emissions.";
  }
};
