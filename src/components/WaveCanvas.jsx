import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Play, Pause } from 'lucide-react';
const WaveCanvas = ({
  wavelengthMeters,
  amplitude,
  phase,
  waveColor,
  waveType
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const scaleRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const lastPanPosRef = useRef({ x: 0, y: 0 });
  const lastTouchDistanceRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const isPlayingRef = useRef(true);
  const drawRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let animationTime = 0;

    // set up sizes and base transform (respect DPR)
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      // reset transform to device pixel ratio only
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawWave = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // clear in CSS pixels (since transform maps DPR)
      ctx.clearRect(0, 0, width, height);

      // Apply pan/zoom transform from user interactions
      ctx.save();
      ctx.translate(panRef.current.x, panRef.current.y);
      ctx.scale(scaleRef.current, scaleRef.current);

      // Draw grid (scaled by current transform)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
      ctx.lineWidth = 1 / Math.max(0.0001, scaleRef.current); // keep grid hairline when zoomed
      for (let i = 0; i <= 10; i++) {
        const y = (height / 10) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let i = 0; i <= 20; i++) {
        const x = (width / 20) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw center line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 2 / Math.max(0.0001, scaleRef.current);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (wavelengthMeters > 0) {
        // Draw sine wave
        ctx.strokeStyle = waveColor;
        ctx.lineWidth = 3 / Math.max(0.0001, scaleRef.current);
        ctx.shadowBlur = 15 / Math.max(0.0001, scaleRef.current);
        ctx.shadowColor = waveColor;
        ctx.beginPath();
        const wavelengthNm = wavelengthMeters * 1e9;
        const amplitudeScale = amplitude / 100 * (height / 2 - 20);
        const frequency = 800 / wavelengthNm; // Visual frequency scaled for display
        const phaseRad = phase * Math.PI / 180;
        for (let x = 0; x < width; x++) {
          const y = height / 2 + amplitudeScale * Math.sin(frequency * (x / 100) + phaseRad + animationTime);
          if (x === 0) ctx.moveTo(x, y);else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      // advance animation only when playing
      if (isPlayingRef.current) {
        animationTime += 0.05;
        animationRef.current = requestAnimationFrame(drawWave);
      } else {
        // when paused, keep a single static frame (do not schedule next frame)
        animationRef.current = null;
      }
    };

    // expose draw function so outside handlers can restart the loop
    drawRef.current = drawWave;

    // Interaction handlers: zoom on wheel, pan on drag, pinch to zoom
    const clampScale = (s) => Math.min(8, Math.max(0.2, s));

    const screenToWorld = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      // convert to world coordinates considering pan and scale
      return {
        x: (x - panRef.current.x) / scaleRef.current,
        y: (y - panRef.current.y) / scaleRef.current
      };
    };

    const handleWheel = (e) => {
      e.preventDefault();
      // zoom at cursor
      const delta = -e.deltaY;
      const zoomFactor = delta > 0 ? 1.08 : 1 / 1.08;
      const prevScale = scaleRef.current;
      let nextScale = clampScale(prevScale * zoomFactor);
      // adjust pan so the point under cursor stays stationary
      const world = screenToWorld(e.clientX, e.clientY);
      panRef.current.x = e.clientX - canvas.getBoundingClientRect().left - world.x * nextScale;
      panRef.current.y = e.clientY - canvas.getBoundingClientRect().top - world.y * nextScale;
      scaleRef.current = nextScale;
    };

    const handlePointerDown = (e) => {
      isPanningRef.current = true;
      lastPanPosRef.current = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
    };
    const handlePointerMove = (e) => {
      if (!isPanningRef.current) return;
      const dx = e.clientX - lastPanPosRef.current.x;
      const dy = e.clientY - lastPanPosRef.current.y;
      panRef.current.x += dx;
      panRef.current.y += dy;
      lastPanPosRef.current = { x: e.clientX, y: e.clientY };
    };
    const handlePointerUp = (e) => {
      isPanningRef.current = false;
      canvas.releasePointerCapture && canvas.releasePointerCapture(e.pointerId);
    };

    // Touch pinch helpers
    const getTouchDistance = (t1, t2) => Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length === 2) {
        lastTouchDistanceRef.current = getTouchDistance(e.touches[0], e.touches[1]);
      }
    };
    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length === 2) {
        const dist = getTouchDistance(e.touches[0], e.touches[1]);
        const last = lastTouchDistanceRef.current || dist;
        const zoomFactor = dist / last;
        const prevScale = scaleRef.current;
        let nextScale = clampScale(prevScale * zoomFactor);
        // zoom around midpoint
        const rect = canvas.getBoundingClientRect();
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const world = screenToWorld(midX, midY);
        panRef.current.x = midX - rect.left - world.x * nextScale;
        panRef.current.y = midY - rect.top - world.y * nextScale;
        scaleRef.current = nextScale;
        lastTouchDistanceRef.current = dist;
        e.preventDefault();
      } else if (e.touches && e.touches.length === 1) {
        // single finger pan
        const t = e.touches[0];
        if (!isPanningRef.current) {
          isPanningRef.current = true;
          lastPanPosRef.current = { x: t.clientX, y: t.clientY };
        } else {
          const dx = t.clientX - lastPanPosRef.current.x;
          const dy = t.clientY - lastPanPosRef.current.y;
          panRef.current.x += dx;
          panRef.current.y += dy;
          lastPanPosRef.current = { x: t.clientX, y: t.clientY };
        }
      }
    };
    const handleTouchEnd = (e) => {
      lastTouchDistanceRef.current = null;
      isPanningRef.current = false;
    };

    // initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

  drawWave();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [wavelengthMeters, amplitude, phase, waveColor]);

  // toggle play/pause from UI
  const togglePlay = () => {
    if (isPlayingRef.current) {
      // pause
      isPlayingRef.current = false;
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    } else {
      // resume
      isPlayingRef.current = true;
      setIsPlaying(true);
      // start loop again
      if (drawRef.current) {
        animationRef.current = requestAnimationFrame(() => drawRef.current());
      }
    }
  };
  return <motion.div whileHover={{
    scale: 1.005
  }} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl" style={{
        backgroundColor: `${waveColor}20`
      }}>
          <TrendingUp className="w-6 h-6" style={{
          color: waveColor
        }} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Vizualizare</h2>
          <p className="text-sm text-slate-400">Unde sinusoidala pentru vizualizare</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-lg text-sm font-bold" style={{
          backgroundColor: `${waveColor}20`,
          color: waveColor
        }}>
            {waveType}
          </div>
          <button onClick={togglePlay} title={isPlaying ? 'Pause animation' : 'Play animation'} className="px-3 py-2 rounded-lg text-sm font-medium" style={{
          backgroundColor: `${waveColor}10`,
          color: waveColor
        }}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-600 rounded-xl overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-64 md:h-80" style={{
        display: 'block'
      }} />
      </div>

      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Wavelength</div>
          <div className="text-sm font-bold truncate" style={{
          color: waveColor
        }}>
            {wavelengthMeters > 0 ? `${wavelengthMeters.toExponential(2)} m` : "N/A"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Amplitude</div>
          <div className="text-sm font-bold" style={{
          color: waveColor
        }}>
            {amplitude}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Phase</div>
          <div className="text-sm font-bold" style={{
          color: waveColor
        }}>
            {phase}°
          </div>
        </div>
      </div>
    </motion.div>;
};
export default WaveCanvas;