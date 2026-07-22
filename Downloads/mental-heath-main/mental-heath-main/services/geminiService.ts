
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly as per guidelines
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const chatWithCounselor = async (message: string, history: { role: string; text: string }[]) => {
  const ai = getAIClient();
  
  // Format history for the Gemini SDK (user/model roles)
  const formattedHistory = history.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.text }]
  }));

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are Mindset Buddy, an empathetic, supportive, and non-judgmental mental health counselor for the Healthy Mindset platform. 
      Your goals:
      1. Provide a safe space for students to vent and share feelings about academic pressure, social anxiety, and burnout.
      2. Offer scientifically backed coping mechanisms like CBT techniques, mindfulness exercises, and time management tips.
      3. Always include a subtle disclaimer that you are an AI and not a substitute for clinical help.
      4. CRITICAL: If a user expresses self-harm or severe crisis, immediately provide emergency resources (like 988) and encourage them to stop the chat and seek immediate human help.
      Keep responses warm, concise, and approachable. Use student-friendly language.`,
    },
    history: formattedHistory,
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

export const runAssessment = async (userInput: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following student's emotional state and needs based on this input: "${userInput}". 
    Provide a detailed wellness assessment in JSON format for the Healthy Mindset platform. 
    Focus on academic pressure, burnout signs, and immediate coping strategies.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: { type: Type.STRING, description: "A brief, empathetic summary of the user's current emotional state." },
          score: { type: Type.NUMBER, description: "A wellness score from 1-100 (100 is optimal health, lower indicates high distress/burnout)." },
          recommendations: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "3-4 specific, actionable steps tailored to the student's mentioned problems."
          },
          plan: { type: Type.STRING, description: "A restorative daily wellness plan described in 2-3 encouraging sentences." }
        },
        required: ["sentiment", "score", "recommendations", "plan"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const findMentalHealthPlaces = async (query: string, location?: { latitude: number, longitude: number }) => {
  const ai = getAIClient();
  // Using gemini-2.5-flash as it supports maps grounding
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Locate ${query} nearby for a Healthy Mindset platform user. Prioritize licensed mental health clinics, psychiatrists, and student wellness centers.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: location ? {
            latitude: location.latitude,
            longitude: location.longitude
          } : undefined
        }
      }
    },
  });

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const text = response.text;

  return {
    text,
    places: chunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        title: chunk.maps.title,
        uri: chunk.maps.uri,
      }))
  };
};

export const generateWellnessVideo = async (prompt: string) => {
  const ai = getAIClient();
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `A high-quality, cinematic, calming wellness video for a student: ${prompt}. Focus on peaceful environments, soft lighting, and a sense of tranquility.`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");

  // Fetch the video with the API key
  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': process.env.API_KEY || '',
    },
  });

  if (!response.ok) throw new Error("Failed to download generated video");
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
