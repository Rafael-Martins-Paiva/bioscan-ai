import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    isHuman: {
      type: Type.BOOLEAN,
      description: "Whether a real human face/person is detected in the image.",
    },
    estimatedAge: {
      type: Type.STRING,
      description: "Estimated age range (e.g., '25-30') or 'N/A' if not human.",
    },
    estimatedGender: {
      type: Type.STRING,
      description: "Estimated gender (Masculino, Feminino, etc.) or 'N/A'.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score between 0 and 100.",
    },
    notes: {
      type: Type.STRING,
      description: "Short observation about expression or accessories (e.g., 'Wearing glasses', 'Smiling').",
    },
    detectedFeatures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 visible features (e.g. 'Hair color', 'Beard', 'Glasses')."
    }
  },
  required: ["isHuman", "estimatedAge", "estimatedGender", "confidence", "notes", "detectedFeatures"],
};

export const analyzeImageFrame = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanBase64,
          },
        },
        {
          text: "Analyze this image specifically for biometric data. Determine if it is a human, estimate age range, and gender. Be precise.",
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a precise biometric scanner AI. Output strictly valid JSON. If no human is clearly visible, set isHuman to false.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Analysis Error:", error);
    // Return a safe fallback to prevent app crash
    return {
      isHuman: false,
      estimatedAge: "--",
      estimatedGender: "--",
      confidence: 0,
      notes: "Erro na análise",
      detectedFeatures: []
    };
  }
};
