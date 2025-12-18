import { useEffect, useState } from "react";

export function useHudEffects(trigger: boolean) {
  const [pulse, setPulse] = useState(false);
  
  useEffect(() => {
    if (!trigger) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 300);
    return () => clearTimeout(t);
  }, [trigger]);
  
  return pulse;
}