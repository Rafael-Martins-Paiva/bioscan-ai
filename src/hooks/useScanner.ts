import { useState, useRef, useCallback } from "react";
import { AppState, AnalysisResult } from "@/types";
import { analyzeImage } from "@/services/analysisService";

export function useScanner() {
  const [result, setResult] = useState < AnalysisResult | null > (null);
  const [state, setState] = useState < AppState > (AppState.IDLE);
  const lastScan = useRef(0);
  
  const analyzeFrame = useCallback(async (base64: string) => {
    const now = Date.now();
    if (now - lastScan.current < 3000) return;
    lastScan.current = now;
    
    try {
      setState(AppState.SCANNING);
      const res = await analyzeImage(base64);
      setResult(res);
      setState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setState(AppState.ERROR);
    }
  }, []);
  
  return {
    analyzeFrame,
    result,
    state,
    setState
  };
}