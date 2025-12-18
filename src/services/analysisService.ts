import { AnalysisResult } from "../types";

export async function analyzeImage(image: string): Promise < AnalysisResult > {
  const res = await fetch("http://localhost:3333/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image })
  });
  
  if (!res.ok) throw new Error("Backend error");
  return res.json();
}