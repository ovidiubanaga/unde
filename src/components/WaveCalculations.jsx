import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, Radio } from 'lucide-react';
const WaveCalculations = ({
  wavelengthMeters,
  frequency,
  waveType,
  waveColor
}) => {
  const formatFrequency = freq => {
    if (freq <= 0) return "N/A";
    if (freq >= 1e18) return `${(freq / 1e18).toFixed(2)} EHz`;
    if (freq >= 1e15) return `${(freq / 1e15).toFixed(2)} PHz`;
    if (freq >= 1e12) return `${(freq / 1e12).toFixed(2)} THz`;
    if (freq >= 1e9) return `${(freq / 1e9).toFixed(2)} GHz`;
    if (freq >= 1e6) return `${(freq / 1e6).toFixed(2)} MHz`;
    if (freq >= 1e3) return `${(freq / 1e3).toFixed(2)} kHz`;
    return `${freq.toFixed(2)} Hz`;
  };
  const formatEnergy = freq => {
    if (freq <= 0) return "N/A";
    const h = 6.62607015e-34; // Planck's constant in J·s
    const energy = h * freq;
    const energyEV = energy / 1.602176634e-19; // Convert Joules to eV

    if (energyEV >= 1e9) return `${(energyEV / 1e9).toFixed(2)} GeV`;
    if (energyEV >= 1e6) return `${(energyEV / 1e6).toFixed(2)} MeV`;
    if (energyEV >= 1e3) return `${(energyEV / 1e3).toFixed(2)} keV`;
    return `${energyEV.toFixed(2)} eV`;
  };
  const formatPeriod = freq => {
    if (freq <= 0) return "N/A";
    const period = 1 / freq;
    if (period < 1e-15) return `${(period * 1e18).toExponential(2)} as`;
    if (period < 1e-12) return `${(period * 1e15).toExponential(2)} fs`;
    if (period < 1e-9) return `${(period * 1e12).toExponential(2)} ps`;
    if (period < 1e-6) return `${(period * 1e9).toExponential(2)} ns`;
    if (period < 1e-3) return `${(period * 1e6).toExponential(2)} µs`;
    return `${period.toExponential(2)} s`;
  };
  const formatWavelength = wl => {
    if (wl <= 0) return "N/A";
    return `${wl.toExponential(2)} m`;
  };
  const calculations = [{
    icon: Radio,
    label: 'Wavelength (λ)',
    value: formatWavelength(wavelengthMeters),
    description: 'Input value'
  }, {
    icon: Zap,
    label: 'Frequency (f)',
    value: formatFrequency(frequency),
    description: 'f = c / λ'
  }, {
    icon: Calculator,
    label: 'Photon Energy (E)',
    value: formatEnergy(frequency),
    description: 'E = hf'
  }];
  return <motion.div whileHover={{
    scale: 1.02
  }} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl" style={{
        backgroundColor: `${waveColor}20`
      }}>
          <Calculator className="w-6 h-6" style={{
          color: waveColor
        }} />
        </div>
        <h2 className="text-2xl font-bold">Valori a undei:</h2>
      </div>

      <div className="space-y-3">
        {calculations.map((calc, index) => <motion.div key={calc.label} initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: index * 0.1
      }} className="bg-slate-900/50 border border-slate-600 rounded-xl p-4 hover:border-slate-500 transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg mt-1" style={{
            backgroundColor: `${waveColor}20`
          }}>
                <calc.icon className="w-5 h-5" style={{
              color: waveColor
            }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">{calc.label}</span>
                  <span className="text-xs text-slate-500 font-mono">{calc.description}</span>
                </div>
                <div className="text-xl font-bold" style={{
              color: waveColor
            }}>
                  {calc.value}
                </div>
              </div>
            </div>
          </motion.div>)}
      </div>

      <div className="pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-500 space-y-1">
          <p>c ≈ 3.00 × 10⁸ m/s (speed of light)</p>
          <p>h ≈ 6.63 × 10⁻³⁴ J·s (Planck's constant)</p>
        </div>
      </div>
    </motion.div>;
};
export default WaveCalculations;