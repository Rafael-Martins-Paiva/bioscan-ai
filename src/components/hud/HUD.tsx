import { AnalysisResult } from "../../types";
import CRTOverlay from "./CRTOverlay";
import Reticle from "./Reticle";
import TopBar from "./TopBar";
import AnalysisPanel from "./AnalysisPanel";
import { useHudEffects } from "./useHudEffects";

export default function HUD({ data }: { data: AnalysisResult | null }) {
  const pulse = useHudEffects(!!data);
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      <TopBar />
      <Reticle scanning={!data} />
      <AnalysisPanel data={data} pulse={pulse} />
      <CRTOverlay />
    </div>
  );
}