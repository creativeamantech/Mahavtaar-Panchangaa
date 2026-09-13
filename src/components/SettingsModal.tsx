import React from 'react';
import { Settings, X, Check } from 'lucide-react';
import type { CoordinateSelection, MonthSystem } from '../types';
import { type Language, translations } from '../i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ayanamsa: CoordinateSelection;
  monthSystem: MonthSystem;
  onUpdateSettings: (ayanamsa: CoordinateSelection, monthSystem: MonthSystem) => void;
  lang: Language;
}

const AYANAMSA_OPTIONS: { key: CoordinateSelection; name: string; desc: string; descHi: string; descSa: string }[] = [
  {
    key: 'citra',
    name: 'Chitra Paksha (Lahiri)',
    desc: 'Official standard adopted by the Calendar Reform Committee of Government of India.',
    descHi: 'भारत सरकार की राष्ट्रीय पंचांग सुधार समिति द्वारा स्वीकृत मानक अयनांश (लाहिड़ी)।',
    descSa: 'भारतसर्वकारस्य पञ्चाङ्गसुधारसमित्या अङ्गीकृतः चित्रपक्ष-लाहिरी-अयनांशः।',
  },
  {
    key: 'krishnamurti',
    name: 'Krishnamurti Paddhati (KP)',
    desc: 'Widely used in KP astrology system; derived by Prof. K.S. Krishnamurti.',
    descHi: 'कृष्णमूर्ति पद्धति (KP) ज्योतिष में प्रयुक्त मानक अयनांश।',
    descSa: 'कृष्णमूर्ति-पद्धत्यां बहुप्रयुक्तः अयनांशः।',
  },
  {
    key: 'raman',
    name: 'B.V. Raman',
    desc: 'Formulated by Dr. B.V. Raman, based on traditional Hindu astronomy texts.',
    descHi: 'डॉ. बी.वी. रामन द्वारा प्राचीन ग्रन्थों के अनुसार प्रतिपादित अयनांश।',
    descSa: 'डा. बी.वी. रामण-महोदयेन प्रतिपादितः पारम्परिक-अयनांशः।',
  },
  {
    key: 'tropical',
    name: 'Sayana (Tropical / Western)',
    desc: 'Western tropical zodiac (Ayanāṁśa = 0°); 0° Aries aligns with Vernal Equinox.',
    descHi: 'सायान पद्धति (पश्चिमी निरयनांश = ०°), वसन्त विषुव पर आधारित।',
    descSa: 'सायनायन-पद्धतिः (शून्य-अयनांशः), विषुवबिन्दुसंलग्नम्।',
  },
  {
    key: 'revati',
    name: 'Revati (Usha-Shashi)',
    desc: 'Zero point anchored at the star Zeta Piscium (Revatī).',
    descHi: 'रेवती तारा (Zeta Piscium) को शून्य बिन्दु मानकर गणना।',
    descSa: 'रेवती-तारकां शून्यबिन्दुं मत्वा निरयण-गणना।',
  },
  {
    key: 'pushya',
    name: 'Pushya Paksha',
    desc: 'Ancient Vedic star system referencing Delta Cancri (Puṣya).',
    descHi: 'प्राचीन वैदिक गणना जो पुष्य नक्षत्र (Delta Cancri) को आधार बनाती है।',
    descSa: 'पुष्यनक्षत्र-केन्द्रिता प्राचीनवैदिकी गणना।',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  ayanamsa,
  monthSystem,
  onUpdateSettings,
  lang,
}) => {
  const [selectedAyanamsa, setSelectedAyanamsa] = React.useState<CoordinateSelection>(ayanamsa);
  const [selectedMonthSystem, setSelectedMonthSystem] = React.useState<MonthSystem>(monthSystem);
  const t = translations[lang];

  React.useEffect(() => {
    setSelectedAyanamsa(ayanamsa);
    setSelectedMonthSystem(monthSystem);
  }, [ayanamsa, monthSystem, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings(selectedAyanamsa, selectedMonthSystem);
    onClose();
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs"
    >
      <div
        id="settings-modal-dialog"
        className="w-full max-w-lg rounded-[1.5rem] border border-stone-200/60 bg-stone-50/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif-vedic">
                {t.settings}
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                Ayanāṁśa System & Lunar Month Reckoning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="close-settings-modal-btn"
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* Lunar Month System (Amānta vs Pūrṇimānta) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 font-devanagari">
              {t.monthScheme}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="select-amanta"
                onClick={() => setSelectedMonthSystem('amanta')}
                className={`rounded-xl border p-3 text-left transition-all ${
                  selectedMonthSystem === 'amanta'
                    ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-600/30'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm font-devanagari">
                    {t.amanta}
                  </span>
                  {selectedMonthSystem === 'amanta' && (
                    <Check className="h-4 w-4 text-amber-700" />
                  )}
                </div>
                <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                  {lang === 'sa'
                    ? 'अमावास्यान्तः मासः। दक्षिणभारते मुख्यतया आचर्यते।'
                    : lang === 'hi'
                    ? 'अमावस्या के अंत पर नवीन मास प्रारंभ (दक्षिण भारत, महाराष्ट्र, गुजरात में प्रचलित)।'
                    : 'Month ends at New Moon (Amāvasyā). Standard in South India, Maharashtra & Gujarat.'}
                </p>
              </button>

              <button
                type="button"
                id="select-purnimanta"
                onClick={() => setSelectedMonthSystem('purnimanta')}
                className={`rounded-xl border p-3 text-left transition-all ${
                  selectedMonthSystem === 'purnimanta'
                    ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-600/30'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm font-devanagari">
                    {t.purnimanta}
                  </span>
                  {selectedMonthSystem === 'purnimanta' && (
                    <Check className="h-4 w-4 text-amber-700" />
                  )}
                </div>
                <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                  {lang === 'sa'
                    ? 'पूर्णिमान्तः मासः। उत्तरभारते मुख्यतया आचर्यते।'
                    : lang === 'hi'
                    ? 'पूर्णिमा के अंत पर नवीन मास प्रारंभ (उत्तर भारत में सर्वाधिक प्रचलित)।'
                    : 'Month ends at Full Moon (Pūrṇimā). Standard in North India.'}
                </p>
              </button>
            </div>
          </div>

          {/* Ayanāṁśa Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 font-devanagari">
              {t.ayanamsaSystem}
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {AYANAMSA_OPTIONS.map((opt) => (
                <div
                  key={opt.key}
                  id={`ayanamsa-opt-${opt.key}`}
                  onClick={() => setSelectedAyanamsa(opt.key)}
                  className={`flex items-start justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                    selectedAyanamsa === opt.key
                      ? 'border-amber-600 bg-amber-50/70 ring-1 ring-amber-600/30'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="pr-3">
                    <div className="font-bold text-stone-900 text-sm">{opt.name}</div>
                    <div className="text-xs text-stone-500 mt-0.5 font-sans">
                      {lang === 'sa' ? opt.descSa : lang === 'hi' ? opt.descHi : opt.desc}
                    </div>
                  </div>
                  {selectedAyanamsa === opt.key && (
                    <Check className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end space-x-3 border-t border-stone-100 pt-4">
          <button
            type="button"
            id="cancel-settings-btn"
            onClick={onClose}
            className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            id="apply-settings-btn"
            onClick={handleSave}
            className="rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white hover:bg-amber-800 shadow-xs"
          >
            {t.saveSettings}
          </button>
        </div>
      </div>
    </div>
  );
};
