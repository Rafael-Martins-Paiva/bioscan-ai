export function useScanner() {
  const [result, setResult] = useState < AnalysisResult | null > (null);
  const [state, setState] = useState < AppState > (AppState.IDLE);
  const lastScan = useRef(0);
  
  const analyzeFrame = useCallback(async (base64: string) => {
    const now = Date.now();
    if (now - lastScan.current < 10000) return;
    lastScan.current = now;
    
    try {
      setState(AppState.SCANNING);
      const res = await analyzeImage(base64);
      setResult(res);
      setState(AppState.RESULT);
    } catch {
      setState(AppState.ERROR);
    }
  }, []);
  
  return { analyzeFrame, result, state, setState };
}