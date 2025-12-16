import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ImageSize, AspectRatio } from "../types";

const apiKey = process.env.API_KEY || '';
// Initialize client only if key exists (handled in UI if missing)
const ai = new GoogleGenAI({ apiKey });

// Helper to encode image file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * AI Concierge: Uses Search and Maps grounding
 */
export const generateConciergeResponse = async (prompt: string, location?: GeolocationCoordinates): Promise<GenerateContentResponse> => {
  const toolConfig: any = {};
  
  if (location) {
    toolConfig.retrievalConfig = {
      latLng: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    };
  }

  // Use gemini-2.5-flash with both Search and Maps tools
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: "You are the helpful digital concierge for 'La Casa di LO', a vacation rental in Monopoli, Italy. Help guests find restaurants, attractions, and local news using Google Search and Maps. Be warm, welcoming, and specific.",
      tools: [{ googleSearch: {} }, { googleMaps: {} }],
      toolConfig: toolConfig,
    }
  });
  return response;
};

/**
 * Image Generator: Uses gemini-3-pro-image-preview
 */
export const generateSouvenirImage = async (
  prompt: string,
  size: ImageSize,
  aspectRatio: AspectRatio
): Promise<GenerateContentResponse> => {
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        imageSize: size,
        aspectRatio: aspectRatio,
      }
    }
  });

  return response;
};

/**
 * Image Editor: Uses gemini-2.5-flash-image
 */
export const editVacationPhoto = async (
  prompt: string,
  imageBase64: string,
  mimeType: string
): Promise<GenerateContentResponse> => {
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType
          }
        },
        { text: prompt }
      ]
    }
  });

  return response;
};
