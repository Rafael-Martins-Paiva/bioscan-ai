import { useEffect, useRef } from "react";
import { AppState } from "../types";

interface Props {
  onFrameCaptured: (base64: string) => void;
  appState: AppState;
}

export default function VideoFeed({ onFrameCaptured, appState }: Props) {
  const videoRef = useRef < HTMLVideoElement > (null);
  const canvasRef = useRef < HTMLCanvasElement > (null);
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => console.error("Camera error"));
    
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);
  
  useEffect(() => {
    const id = setInterval(() => {
      if (appState !== AppState.SCANNING) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx || video.videoWidth === 0) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      onFrameCaptured(canvas.toDataURL("image/jpeg", 0.6));
    }, 1000);
    
    return () => clearInterval(id);
  }, [appState, onFrameCaptured]);
  
  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
    </>
  );
}