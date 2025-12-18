import React, { useEffect, useRef, useState, useCallback } from 'react';
import { analyzeImageFrame } from '../services/geminiService';
import { AnalysisResult, AppState } from '../types';

interface VideoFeedProps {
  onResultUpdate: (result: AnalysisResult) => void;
  appState: AppState;
  setAppState: (state: AppState) => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ onResultUpdate, appState, setAppState }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  
  // Start Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
          setAppState(AppState.SCANNING);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setAppState(AppState.ERROR);
      }
    };

    startCamera();

    return () => {
      // Cleanup tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [setAppState]);

  // Capture Frame and Analyze logic
  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || appState !== AppState.SCANNING) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64 (reduce quality for speed)
      const base64Image = canvas.toDataURL('image/jpeg', 0.6);

      // Call API
      try {
        const result = await analyzeImageFrame(base64Image);
        onResultUpdate(result);
      } catch (error) {
        console.error("Frame analysis failed", error);
      }
    }
  }, [appState, onResultUpdate]);

  // Interval for sampling (every 10 seconds)
  useEffect(() => {
    const intervalId = setInterval(captureAndAnalyze, 10000);
    return () => clearInterval(intervalId);
  }, [captureAndAnalyze]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
      {/* Hidden Canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Live Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover opacity-80 ${appState === AppState.SCANNING ? '' : 'blur-sm'}`}
      />
      
      {/* Permission/Error Message */}
      {appState === AppState.ERROR && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50">
          <div className="text-red-500 text-center p-6 border border-red-500 rounded font-mono">
            <h2 className="text-2xl mb-2">ERRO DE CÂMERA</h2>
            <p>Acesso à câmera negado ou indisponível.</p>
            <p className="text-sm mt-2">Por favor, verifique suas permissões.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;