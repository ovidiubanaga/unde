export const SPECTRUM_RANGES = {
  // In meters
  'Gamma': { min: 1e-14, max: 1e-11 },
  'X-ray': { min: 1e-11, max: 1e-8 },
  'UV': { min: 1e-8, max: 3.8e-7 },
  'Visible': { min: 3.8e-7, max: 7.0e-7 },
  'Infrared': { min: 7.0e-7, max: 1e-3 },
  'Microwave': { min: 1e-3, max: 1 },
  'Radio': { min: 1, max: 1000 },
};

const SPEED_OF_LIGHT = 299792458;

export const getFrequencyRanges = (type) => {
  const wlRange = SPECTRUM_RANGES[type] || { min: 1e-14, max: 1000 };
  // Frequency = c / wavelength, so smaller wavelengths = larger frequencies
  return {
    min: SPEED_OF_LIGHT / wlRange.max,
    max: SPEED_OF_LIGHT / wlRange.min
  };
};

export const detectWaveType = (wl) => {
  if (wl <= 0) return 'Invalid';
  if (wl < SPECTRUM_RANGES['Gamma'].max) return 'Gamma';
  if (wl < SPECTRUM_RANGES['X-ray'].max) return 'X-ray';
  if (wl < SPECTRUM_RANGES['UV'].max) return 'UV';
  if (wl < SPECTRUM_RANGES['Visible'].max) return 'Visible';
  if (wl < SPECTRUM_RANGES['Infrared'].max) return 'Infrared';
  if (wl <= SPECTRUM_RANGES['Microwave'].max) return 'Microwave';
  if (wl > SPECTRUM_RANGES['Radio'].min) return 'Radio';
  return 'Invalid';
};

export const getWaveTypeRanges = (type) => {
  return SPECTRUM_RANGES[type] || { min: 1e-14, max: 1000 };
};

export const getWaveColor = (type) => {
  const colors = {
    'Gamma': '#9333ea',
    'X-ray': '#a855f7',
    'UV': '#a855f7',
    'Visible': '#3b82f6', // Default for visible
    'Infrared': '#dc2626',
    'Microwave': '#991b1b',
    'Radio': '#7f1d1d',
    'Invalid': '#64748b'
  };
  return colors[type] || '#3b82f6';
};