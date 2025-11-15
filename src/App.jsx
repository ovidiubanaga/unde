import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import WaveInput from '@/components/WaveInput';
import WaveCalculations from '@/components/WaveCalculations';
import WaveSlider from '@/components/WaveSlider';
import WaveCanvas from '@/components/WaveCanvas';
import { Toaster } from '@/components/ui/toaster';
import { getWaveColor, detectWaveType } from '@/lib/waveUtils';
function App() {
  const [coefficient, setCoefficient] = useState(5.0);
  const [exponent, setExponent] = useState(-7);
  const [wavelengthMeters, setWavelengthMeters] = useState(5.0e-7);
  const [frequency, setFrequency] = useState(0);
  const [independentFrequency, setIndependentFrequency] = useState(6.0e14);
  const [waveType, setWaveType] = useState('Visible');
  const [amplitude, setAmplitude] = useState(50);
  const [phase, setPhase] = useState(0);
  const SPEED_OF_LIGHT = 299792458;
  const isFrequencyChangeRef = useRef(false);

  // Update wavelength in meters when coefficient or exponent changes
  useEffect(() => {
    const newWavelengthMeters = coefficient * 10 ** exponent;
    setWavelengthMeters(newWavelengthMeters);
  }, [coefficient, exponent]);

  // Update scientific notation inputs when wavelengthMeters changes (e.g., from slider)
  // Only update if the change is significant to avoid feedback loops
  useEffect(() => {
    // Skip update if wavelength changed from frequency slider
    if (isFrequencyChangeRef.current) {
      isFrequencyChangeRef.current = false;
      return;
    }

    if (wavelengthMeters <= 0) {
      setCoefficient(0);
      setExponent(0);
      return;
    }
    const exp = Math.floor(Math.log10(wavelengthMeters));
    const coeff = wavelengthMeters / 10 ** exp;
    // Only update if coefficient is significantly different or exponent changed
    const newCoeff = parseFloat(coeff.toFixed(4));
    if (Math.abs(newCoeff - coefficient) > 0.01 || exp !== exponent) {
      setCoefficient(newCoeff);
      setExponent(exp);
    }
  }, [wavelengthMeters]);
  useEffect(() => {
    // Calculate frequency from wavelength
    if (wavelengthMeters > 0) {
      const calculatedFrequency = SPEED_OF_LIGHT / wavelengthMeters;
      setFrequency(calculatedFrequency);
      // Update independent frequency to keep it in sync
      setIndependentFrequency(calculatedFrequency);
    } else {
      setFrequency(0);
    }

    // Determine wave type
    const type = detectWaveType(wavelengthMeters);
    setWaveType(type);
  }, [wavelengthMeters]);

  // Handle independent frequency changes using the relation: λ × f = c
  const handleFrequencyChange = (newFrequency) => {
    if (newFrequency > 0) {
      setIndependentFrequency(newFrequency);
      // Mark that this wavelength change came from frequency slider
      isFrequencyChangeRef.current = true;
      // Calculate new wavelength: λ = c / f
      const newWavelength = SPEED_OF_LIGHT / newFrequency;
      setWavelengthMeters(newWavelength);
    }
  };
  return <>
      <Helmet>
        <title>Wave Explorer - Interactive Wavelength Physics Calculator</title>
        <meta name="description" content="Explore electromagnetic waves with real-time physics calculations, frequency detection, and interactive sine wave visualization." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <motion.header initial={{
          opacity: 0,
          y: -20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Lungimi de unde</h1>
            {/* Removed the empty paragraph element as requested */}
          </motion.header>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="grid md:grid-cols-2 gap-6">
            <WaveInput coefficient={coefficient} setCoefficient={setCoefficient} exponent={exponent} setExponent={setExponent} waveType={waveType} waveColor={getWaveColor(waveType)} />
            
            <WaveCalculations wavelengthMeters={wavelengthMeters} frequency={frequency} waveType={waveType} waveColor={getWaveColor(waveType)} />
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }}>
            <WaveSlider amplitude={amplitude} setAmplitude={setAmplitude} phase={phase} setPhase={setPhase} wavelengthMeters={wavelengthMeters} setWavelengthMeters={setWavelengthMeters} independentFrequency={independentFrequency} handleFrequencyChange={handleFrequencyChange} waveType={waveType} waveColor={getWaveColor(waveType)} />
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.6
        }}>
            <WaveCanvas wavelengthMeters={wavelengthMeters} amplitude={amplitude} phase={phase} waveColor={getWaveColor(waveType)} waveType={waveType} />
          </motion.div>
        </div>
        <Toaster />
      </div>
    </>;
}
export default App;