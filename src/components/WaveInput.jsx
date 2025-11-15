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
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">Tip de undă:</span>
          <span className="font-bold text-lg px-4 py-2 rounded-lg" style={{
            backgroundColor: `${waveColor}20`,
            color: waveColor
          }}>
            {waveType}
          </span>
        </div>
        {}
        {(() => {
          const waveTypeInfo = {
            'Gamma': `Radiațiile gamma sunt unde electromagnetice cu cea mai mare energie și cea mai scurtă lungime de undă (sub 0,01 nanometri). Sunt produse în procese nucleare, cum ar fi dezintegrarea radioactivă sau reacțiile din stele. Se folosesc în medicină pentru tratamentul cancerului (radioterapie), sterilizarea echipamentelor medicale și cercetare științifică. Datorită energiei foarte mari, pot penetra aproape orice material și sunt periculoase pentru țesuturile vii, necesitând măsuri stricte de protecție. Detectarea lor se face cu ajutorul contoarelor Geiger sau a scintilatoarelor.`,
            'X-ray': `Razele X au lungimi de undă între 0,01 și 10 nanometri. Sunt generate de tuburi cu raze X sau de tranziții electronice în atomi grei. Aplicațiile principale includ imagistica medicală (radiografii, tomografii), controlul de securitate (scanarea bagajelor) și analiza materialelor. Pot traversa țesuturile moi, dar sunt absorbite de oase și metale, ceea ce le face utile pentru diagnostic. Expunerea excesivă la raze X poate fi dăunătoare, de aceea se folosesc ecrane de plumb pentru protecție.`,
            'UV': `Radiațiile ultraviolete (UV) au lungimi de undă între 10 și 400 nanometri. Sunt emise de soare, lămpi speciale și unele procese industriale. Sunt folosite la sterilizarea suprafețelor, bronzare artificială, detectarea substanțelor fluorescente și polimerizarea materialelor. Expunerea la UV poate provoca arsuri, îmbătrânirea pielii și crește riscul de cancer. Atmosfera Pământului filtrează o mare parte din UV, dar stratul de ozon este esențial pentru protecție.`,
            'Visible': `Lumina vizibilă are lungimi de undă între 400 și 700 nanometri și este singura parte a spectrului electromagnetic percepută de ochiul uman. Este produsă de soare, becuri, LED-uri și alte surse artificiale. Este esențială pentru vedere, orientare, comunicare vizuală și fotosinteză la plante. Proprietățile luminii vizibile includ reflexia, refracția, dispersia și polarizarea. Tehnologii precum fibrele optice, laserele și ecranele digitale folosesc lumina vizibilă pentru transmiterea informației.`,
            'Infrared': `Radiațiile infraroșii (IR) au lungimi de undă între 700 nanometri și 1 milimetru. Sunt emise de orice corp cu temperatură peste zero absolut, inclusiv corpul uman. Sunt folosite la telecomenzi, camere termice, senzori de mișcare, comunicații optice și în astronomie pentru studierea obiectelor reci. IR apropiat este folosit în telecomunicații, iar IR îndepărtat în termografie. Nu sunt vizibile, dar pot fi simțite ca o creștere a temperaturii.`,
            'Microwave': `Microundele au lungimi de undă între 1 milimetru și 1 metru. Sunt produse de oscilatoare electronice, magnetroni sau tranziții moleculare. Aplicațiile includ încălzirea alimentelor (cuptoare cu microunde), comunicații wireless (Wi-Fi, Bluetooth), radare, sateliți și radioastronomie. Pot penetra atmosfera și sunt folosite pentru transmisii la distanță mare. În industrie, microundele sunt folosite la uscarea materialelor și la procese chimice speciale.`,
            'Radio': `Undele radio au cele mai mari lungimi de undă (de la 1 metru la peste 100 de kilometri). Sunt generate de antene și oscilatoare electronice. Sunt folosite la radio, televiziune, telefonie mobilă, comunicații maritime și aviatice, radiolocație și navigație GPS. Pot parcurge distanțe foarte mari, reflectându-se în ionosferă sau propagându-se la suprafața Pământului. Proprietățile lor permit transmiterea informației pe scară globală.`,
            'Invalid': `Tip de undă necunoscut sau invalid.`
          };
          return (
            <div className="text-base text-slate-300 mt-2">
              {waveTypeInfo[waveType] || waveTypeInfo['Invalid']}
            </div>
          );
        })()}
      </div>

      {}
      {}
    </motion.div>;
};
export default WaveInput;