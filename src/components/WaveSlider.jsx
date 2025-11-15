import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Activity, Waves } from 'lucide-react';
import { getWaveTypeRanges } from '@/lib/waveUtils';
const WaveSlider = ({
  amplitude,
  setAmplitude,
  phase,
  setPhase,
  wavelengthMeters,
  setWavelengthMeters,
  waveType,
  waveColor
}) => {
  const [sliderValue, setSliderValue] = useState(50);
  const [sliderRange, setSliderRange] = useState({
    min: 3.8e-7,
    max: 7.0e-7
  });
  useEffect(() => {
    const newRange = getWaveTypeRanges(waveType);
    setSliderRange(newRange);

    // Recalculate slider position when waveType changes
    const clampedWavelength = Math.max(newRange.min, Math.min(wavelengthMeters, newRange.max));
    const position = (Math.log10(clampedWavelength) - Math.log10(newRange.min)) / (Math.log10(newRange.max) - Math.log10(newRange.min)) * 100;
    setSliderValue(isNaN(position) ? 50 : position);
  }, [waveType, wavelengthMeters]);
  const handleWavelengthSliderChange = value => {
    const position = value[0];
    setSliderValue(position);
    // Logarithmic scale
    const logMin = Math.log10(sliderRange.min);
    const logMax = Math.log10(sliderRange.max);
    const newWavelength = 10 ** (logMin + position / 100 * (logMax - logMin));
    setWavelengthMeters(newWavelength);
  };
  return <motion.div whileHover={{
    scale: 1.01
  }} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl" style={{
        backgroundColor: `${waveColor}20`
      }}>
          <Activity className="w-6 h-6" style={{
          color: waveColor
        }} />
        </div>
        <h2 className="text-2xl font-bold">Parametrii de unda:</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 flex items-center gap-2">
              <Waves className="w-4 h-4" style={{
              color: waveColor
            }} />
              Lungime de undă (în domeniu {waveType})
            </Label>
            <span className="font-bold px-3 py-1 rounded-lg text-sm truncate" style={{
            backgroundColor: `${waveColor}20`,
            color: waveColor
          }}>
              {wavelengthMeters > 0 ? `${wavelengthMeters.toExponential(2)} m` : "N/A"}
            </span>
          </div>
          <Slider value={[sliderValue]} onValueChange={handleWavelengthSliderChange} min={0} max={100} step={0.1} className="w-full" />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{sliderRange.min.toExponential(1)} m</span>
            <span>{sliderRange.max.toExponential(1)} m</span>
          </div>
        </div>
      
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4" style={{
              color: waveColor
            }} />
              Amplitudine (A)
            </Label>
            <span className="font-bold px-3 py-1 rounded-lg text-sm" style={{
            backgroundColor: `${waveColor}20`,
            color: waveColor
          }}>
              {amplitude}%
            </span>
          </div>
          <Slider value={[amplitude]} onValueChange={value => setAmplitude(value[0])} min={10} max={100} step={1} className="w-full" />
          <p className="text-xs text-slate-400 mt-2">y = A sin(ω t + φ)</p>
        </div>

        {/* Phase Shift control removed per user request */}
      </div>
    </motion.div>;
};
export default WaveSlider;