import VideoFeed from "@/components/VideoFeed";
import HUD from "@/components/hud/HUD";
import { useScanner } from "@/hooks/useScanner";
import { AppState } from "@/types";

export default function ScannerPage() {
  const { analyzeFrame, result, state, setState } = useScanner();
  
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <VideoFeed
        appState={state}
        onFrameCaptured={analyzeFrame}
        onCameraReady={() => setState(AppState.SCANNING)}
      />

      <HUD data={result} />

      {state === AppState.IDLE && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black">
          <div className="text-center animate-pulse">
            <h1 className="text-emerald-500 font-mono text-4xl mb-4 tracking-[0.2em]">
              INICIANDO
            </h1>
            <p className="text-emerald-800 font-mono text-sm">
              CARREGANDO MÓDULOS DE VISÃO...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}