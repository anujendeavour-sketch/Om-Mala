import { GoogleGenAI, Type } from "@google/genai";
import { Mantra } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMantra = async (intent?: string): Promise<Mantra | null> => {
  try {
    const prompt = intent 
      ? `Provide a Sanskrit mantra suitable for: ${intent}.` 
      : "Provide a popular, powerful Sanskrit mantra for general meditation and peace.";
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a spiritual guide. Return only JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The mantra in Sanskrit/Devanagari" },
            pronunciation: { type: Type.STRING, description: "Phonetic English pronunciation" },
            meaning: { type: Type.STRING, description: "Brief meaning in English" }
          },
          required: ["text", "pronunciation", "meaning"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as Mantra;

  } catch (error) {
    console.error("Failed to generate mantra:", error);
    return null;
  }
};

export const generateWallpaper = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Mobile wallpaper, spiritual, zen, meditation theme, high quality, 4k, abstract, soft colors, minimalist: ${prompt}` }],
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16"
        }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to generate wallpaper:", error);
    return null;
  }
};