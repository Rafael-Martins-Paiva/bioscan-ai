import { AnalysisResult } from "../types";

const API_URL = "https://bioscan-backend.vercel.app/api/analyze";

export const analyzeImageFrame = async (
  base64Image: string
): Promise < AnalysisResult > => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    const data = (await response.json()) as AnalysisResult;
    return data;
  } catch (error) {
    console.error("Frontend analysis error:", error);
    
    return {
      isHuman: false,
      estimatedAge: "--",
      estimatedGender: "--",
      confidence: 0,
      notes: "Erro na análise",
      detectedFeatures: [],
    };
  }
};