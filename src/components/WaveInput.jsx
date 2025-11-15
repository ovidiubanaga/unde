import React from 'react';
import { motion } from 'framer-motion';
import { Waves } from 'lucide-react';
import { Label } from '@/components/ui/label';
const WaveInput = ({
  coefficient,
  setCoefficient,
  exponent,
  setExponent,
  waveType,
  waveColor
}) => {
  const handleCoefficientChange = e => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setCoefficient(value);
    }
  };
  const handleExponentChange = e => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setExponent(value);
    }
  };

  // The setPreset function is no longer needed as the buttons are removed.
  // const setPreset = (coeff, exp) => {
  //   setCoefficient(coeff);
  //   setExponent(exp);
  // }

  return <motion.div whileHover={{
    scale: 1.02
  }} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl" style={{
        backgroundColor: `${waveColor}20`
      }}>
          <Waves className="w-6 h-6" style={{
          color: waveColor
        }} />
        </div>
        <h2 className="text-2xl font-bold">Introduceti lungimea de unda:</h2>
      </div>

      <div className="space-y-3">
        <Label htmlFor="wavelength" className="text-slate-300"></Label>
        <div className="flex items-center gap-2">
          <input id="wavelength-coeff" type="number" value={coefficient} onChange={handleCoefficientChange} step="0.1" className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center" aria-label="Coeficient lungime de undă" />
          <span className="text-slate-400 font-bold text-lg">×  10 </span>
          <input id="wavelength-exp" type="number" value={exponent} onChange={handleExponentChange} className="w-20 bg-slate-900/50 border border-slate-600 rounded-xl px-2 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center" aria-label="Exponent lungime de undă" />
          <span className="text-slate-400 font-bold text-lg">m</span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Tip de unda:</span>
          <span className="font-bold text-lg px-4 py-2 rounded-lg" style={{
          backgroundColor: `${waveColor}20`,
          color: waveColor
        }}>
            {waveType}
          </span>
        </div>
      </div>

      {/* Removed preset buttons as requested */}
      {/* <div className="grid grid-cols-3 gap-2 pt-2">
        <button
          onClick={() => setPreset(4.0, -7)}
          className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm transition-all hover:scale-105"
        >
          Violet (400nm)
        </button>
        <button
          onClick={() => setPreset(5.5, -7)}
          className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm transition-all hover:scale-105"
        >
          Green (550nm)
        </button>
        <button
          onClick={() => setPreset(7.0, -7)}
          className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm transition-all hover:scale-105"
        >
          Red (700nm)
        </button>
       </div> */}
    </motion.div>;
};
export default WaveInput;