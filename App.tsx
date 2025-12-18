import React, { useState } from 'react';
import VideoFeed from './components/VideoFeed';
import HUD from './components/HUD';
import { AnalysisResult, AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);

  return (
    <div className="w-full h-[100dvh] bg-black overflow-hidden relative">
      <VideoFeed 
        onResultUpdate={setCurrentAnalysis} 
        appState={appState}
        setAppState={setAppState}
      />
      <HUD data={currentAnalysis} />
      
      {}
      {appState === AppState.IDLE && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black">
          <div className="text-center animate-pulse">
            <h1 className="text-emerald-500 font-mono text-4xl mb-4 tracking-[0.2em]">INICIANDO</h1>
            <p className="text-emerald-800 font-mono text-sm">CARREGANDO MÓDULOS DE VISÃO...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
