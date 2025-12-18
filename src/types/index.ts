export enum AppState {
  IDLE = "IDLE",
    SCANNING = "SCANNING",
    RESULT = "RESULT",
    ERROR = "ERROR"
}

export interface AnalysisResult {
  isHuman: boolean;
  estimatedAge: string;
  estimatedGender: string;
  confidence: number;
  notes: string;
  detectedFeatures: string[];
}