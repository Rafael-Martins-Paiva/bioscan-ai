export default function Reticle({ scanning }: { scanning: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-72 h-72 border border-white/20 relative">
        {!scanning && <div className="absolute inset-0 flex items-center justify-center text-xs">BUSCANDO ALVO...</div>}
      </div>
    </div>
  );
}