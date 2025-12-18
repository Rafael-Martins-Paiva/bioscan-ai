import { AnalysisResult } from "../../types";

export default function AnalysisPanel({ data, pulse }: { data: AnalysisResult | null;pulse: boolean }) {
  if (!data) return null;
  
  return (
    <div className={`absolute bottom-6 right-6 p-4 border ${pulse ? "scale-105" : ""}`}>
      <div>{data.isHuman ? "HUMANO" : "DESCONHECIDO"}</div>
      <div>Confiança: {data.confidence}%</div>
      <div>Idade: {data.estimatedAge}</div>
      <div>Gênero: {data.estimatedGender}</div>
    </div>
  );
}