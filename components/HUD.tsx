import React, { useEffect, useState } from 'react';
import { AnalysisResult } from '../types';

interface HUDProps {
  data: AnalysisResult | null;
}

const playScanSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
  }
};

const HUD: React.FC<HUDProps> = ({ data }) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (data) {
      setPulse(true);
      playScanSound();
      const timer = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const isHuman = data?.isHuman;
  const colorClass = isHuman ? "text-emerald-400 border-emerald-500/50" : "text-amber-500 border-amber-500/50";
  const bgClass = isHuman ? "bg-emerald-950/40" : "bg-amber-950/40";

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-8 z-10">
      
      {}
      <div className="flex justify-between items-start">
        <div className="border border-emerald-500/30 bg-black/60 backdrop-blur-sm p-3 rounded-br-2xl">
          <h1 className="text-emerald-500 font-mono text-xl tracking-widest font-bold">BIOSCAN.AI</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${data ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-xs text-emerald-400/70 font-mono uppercase">Live Feed</span>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs text-emerald-600 font-mono">SYS.STATUS: ONLINE</div>
          <div className="text-xs text-emerald-600 font-mono">LATENCY: LOW</div>
        </div>
      </div>

      {}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 border border-white/20 rounded-lg">
        {}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400"></div>
        
        {}
        <div className="scan-line opacity-50"></div>
        
        {}
        {!data && <div className="absolute top-1/2 w-full text-center text-emerald-500/50 font-mono text-sm animate-pulse">BUSCANDO ALVO...</div>}
      </div>

      {}
      <div className="flex justify-center sm:justify-end items-end">
        {data ? (
          <div className={`
            relative w-full sm:w-96 backdrop-blur-md border rounded-xl p-6 transition-all duration-300
            ${colorClass} ${bgClass}
            ${pulse ? 'scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'scale-100'}
          `}>
            <div className="absolute -top-3 left-4 bg-black px-2 text-xs font-mono border border-inherit rounded uppercase tracking-widest">
              Dados Biométricos
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono mb-4">
              <div>
                <div className="text-xs opacity-60 uppercase">Espécie</div>
                <div className="text-xl font-bold uppercase">{isHuman ? 'HUMANO' : 'DESCONHECIDO'}</div>
              </div>
              <div>
                <div className="text-xs opacity-60 uppercase">Confiança</div>
                <div className="text-xl font-bold">{data.confidence}%</div>
              </div>
              {isHuman && (
                <>
                  <div>
                    <div className="text-xs opacity-60 uppercase">Gênero Est.</div>
                    <div className="text-2xl font-bold">{data.estimatedGender}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-60 uppercase">Idade Est.</div>
                    <div className="text-2xl font-bold">{data.estimatedAge}</div>
                  </div>
                </>
              )}
            </div>

            {data.detectedFeatures && data.detectedFeatures.length > 0 && (
              <div className="border-t border-white/10 pt-3">
                 <div className="text-xs opacity-60 uppercase mb-2">Características</div>
                 <div className="flex flex-wrap gap-2">
                   {data.detectedFeatures.map((feat, idx) => (
                     <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded">
                       {feat}
                     </span>
                   ))}
                 </div>
              </div>
            )}

            <div className="mt-4 text-xs italic opacity-70 border-l-2 border-current pl-2">
              "{data.notes}"
            </div>
          </div>
        ) : (
          <div className="bg-black/40 backdrop-blur border border-emerald-900/50 p-4 rounded text-emerald-800 font-mono text-xs">
            AGUARDANDO DADOS DO SENSOR...
          </div>
        )}
      </div>
      
      {}
      <div className="fixed inset-0 crt-overlay pointer-events-none z-50"></div>
    </div>
  );
};

export default HUD;