import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { VedicInvocationBanner } from './components/VedicInvocationBanner';
import { CurrentMuhurtaWidget } from './components/CurrentMuhurtaWidget';
import { FestivalCard } from './components/FestivalCard';
import { MoonPhaseVisualizer } from './components/MoonPhaseVisualizer';
import { MuhurtaTimelineBar } from './components/MuhurtaTimelineBar';
import { PanchangaSummaryCard } from './components/PanchangaSummaryCard';
import { FiveAngasCard } from './components/FiveAngasCard';
import { AuspiciousTimingsCard } from './components/AuspiciousTimingsCard';
import { GauriChoghadiyaCard } from './components/GauriChoghadiyaCard';
import { SwaraYogaCard } from './components/SwaraYogaCard';
import { PlanetaryPositionsCard } from './components/PlanetaryPositionsCard';
import { MonthlyCalendarView } from './components/MonthlyCalendarView';
import { LocationModal } from './components/LocationModal';
import { SettingsModal } from './components/SettingsModal';
import { PrintablePanchanga } from './components/PrintablePanchanga';
import { VedicHorasView } from './components/VedicHorasView';
import type { PanchangaResponse, CityLocation, MonthSystem, CoordinateSelection } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { type Language, translations } from './i18n';
import type { ActiveView } from './components/Header';

export default function App() {
  // Current date formatted as DD/MM/YYYY
  const getTodayFormatted = () => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const [lang, setLang] = useState<Language>('en');
  const [currentDate, setCurrentDate] = useState<string>(getTodayFormatted());
  const [currentCity, setCurrentCity] = useState<string>('Bengaluru, IN');
  const [customCoords, setCustomCoords] = useState<{
    lat: number;
    lon: number;
    tz: string;
    name: string;
  } | null>(null);

  const [monthSystem, setMonthSystem] = useState<MonthSystem>('amanta');
  const [ayanamsa, setAyanamsa] = useState<CoordinateSelection>('citra');
  const [activeView, setActiveView] = useState<ActiveView>('panchanga');

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const [panchangaData, setPanchangaData] = useState<PanchangaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang];

  // Fetch Panchanga data whenever date, city/coords, or calculation settings change
  const fetchPanchanga = useCallback(() => {
    setIsLoading(true);
    setError(null);

    let url = `/api/panchanga?date=${encodeURIComponent(currentDate)}&month_system=${monthSystem}&ayanamsa=${ayanamsa}`;

    if (customCoords) {
      url += `&lat=${customCoords.lat}&lon=${customCoords.lon}&tz=${encodeURIComponent(
        customCoords.tz
      )}&city=${encodeURIComponent(customCoords.name)}`;
    } else {
      url += `&city=${encodeURIComponent(currentCity)}`;
    }

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Calculation error (Status ${res.status})`);
        }
        return res.json();
      })
      .then((data: PanchangaResponse) => {
        setPanchangaData(data);
        setIsLoading(false);
      })
      .catch((err: any) => {
        console.error('Panchanga fetch error:', err);
        setError(err.message || 'Failed to calculate Panchanga for this date and location.');
        setIsLoading(false);
      });
  }, [currentDate, currentCity, customCoords, monthSystem, ayanamsa]);

  useEffect(() => {
    fetchPanchanga();
  }, [fetchPanchanga]);

  const handleSelectCity = (city: CityLocation) => {
    setCustomCoords(null);
    setCurrentCity(city.name);
  };

  const handleSelectCustom = (lat: number, lon: number, tz: string, name: string) => {
    setCustomCoords({ lat, lon, tz, name });
    setCurrentCity(name);
  };

  const handleUpdateSettings = (newAyanamsa: CoordinateSelection, newMonthSystem: MonthSystem) => {
    setAyanamsa(newAyanamsa);
    setMonthSystem(newMonthSystem);
  };

  return (
    <div className="min-h-screen text-stone-900 font-sans antialiased flex flex-col selection:bg-indigo-200 selection:text-indigo-900 relative">
      {/* Premium Cosmic Overlay Texture */}
      <div className="pointer-events-none fixed inset-0 mix-blend-overlay opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0"></div>
      
      {/* Navigation Header with Language Switcher */}
      <Header
        currentDate={currentDate}
        currentCity={currentCity}
        activeView={activeView}
        onDateChange={setCurrentDate}
        onViewChange={setActiveView}
        onOpenLocation={() => setIsLocationOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onPrint={() => setIsPrintOpen(true)}
        lang={lang}
        onLangChange={setLang}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Error State */}
        {error && (
          <div
            id="error-banner"
            className="mb-6 flex items-start space-x-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900"
          >
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold">Calculation Notice</h4>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
            <button
              onClick={fetchPanchanga}
              className="inline-flex items-center rounded-xl border border-rose-300 bg-white px-3.5 py-1.5 text-xs font-bold text-rose-850 hover:bg-rose-100 transition-colors"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && !panchangaData ? (
          <div id="loading-state" className="flex flex-col items-center justify-center py-32 text-center">
            <div className="flex h-14 w-14 animate-spin items-center justify-center rounded-full border-4 border-amber-200 border-t-amber-700"></div>
            <div className="mt-5 text-lg font-bold font-serif-vedic text-stone-900">
              {lang === 'sa'
                ? 'दृग्गणित-ग्रहस्थितीनां साधनं क्रियते...'
                : lang === 'hi'
                ? 'दृग्गणित अनुसार ग्रह स्थितियों एवं पंचांग की गणना जारी है...'
                : 'Calculating Observational Planetary Positions & Panchanga...'}
            </div>
            <p className="text-xs text-stone-500 mt-1 max-w-sm font-sans">
              Computing High-Precision Drik-Ganita Ephemeris for {currentCity}
            </p>
          </div>
        ) : panchangaData ? (
          <div className="space-y-6">
            {/* View: Daily Panchanga */}
            {activeView === 'panchanga' && (
              <div id="view-daily-panchanga" className="space-y-6">
                {/* 1. Traditional Vedic Invocation */}
                <VedicInvocationBanner lang={lang} />

                {/* 2. Real-Time Muhurta Status & Ghati/Pala Clock */}
                <CurrentMuhurtaWidget data={panchangaData} lang={lang} />

                {/* 3. Special Observances & Festivals (Ekadashi, Purnima, Amavasya, Pradosha, etc.) */}
                <FestivalCard data={panchangaData} lang={lang} />

                {/* 4. Vedic Calendar Hierarchy Banner, Durations & Swara Badges */}
                <PanchangaSummaryCard data={panchangaData} lang={lang} />

                {/* 5. Shiva Swarodaya (Swara Yoga) Pranic Alignment Card */}
                <SwaraYogaCard data={panchangaData} lang={lang} />

                {/* 6. Visual Moon Phase Graphic & Illumination */}
                <MoonPhaseVisualizer data={panchangaData} lang={lang} />

                {/* 7. Interactive 24-hour Muhurta Timeline */}
                <MuhurtaTimelineBar data={panchangaData} lang={lang} />

                {/* 8. The Five Limbs (Pancha Angas) with Vedic Attributes */}
                <FiveAngasCard data={panchangaData} lang={lang} />

                {/* 9. Auspicious and Inauspicious Muhurtas */}
                <AuspiciousTimingsCard data={panchangaData} lang={lang} />

                {/* 10. Daytime and Nighttime Gauri Choghadiya */}
                <GauriChoghadiyaCard data={panchangaData} lang={lang} />

                {/* 11. Graha Sthiti (Planets) with Table & Kundali Chart Toggle */}
                <PlanetaryPositionsCard data={panchangaData} lang={lang} />
              </div>
            )}

            {/* View: Dedicated Swara Yoga (Shiva Swarodaya) */}
            {activeView === 'swara' && (
              <div id="view-swara-dedicated" className="space-y-6">
                <VedicInvocationBanner lang={lang} />
                <SwaraYogaCard data={panchangaData} lang={lang} />
              </div>
            )}

            {/* View: Muhurtas & Timings Dedicated */}
            {activeView === 'timings' && (
              <div id="view-timings-dedicated" className="space-y-6">
                <VedicInvocationBanner lang={lang} />
                <CurrentMuhurtaWidget data={panchangaData} lang={lang} />
                <SwaraYogaCard data={panchangaData} lang={lang} />
                <MuhurtaTimelineBar data={panchangaData} lang={lang} />
                <AuspiciousTimingsCard data={panchangaData} lang={lang} />
                <GauriChoghadiyaCard data={panchangaData} lang={lang} />
              </div>
            )}

            {/* View: Planetary Ephemeris Dedicated */}
            {activeView === 'planets' && (
              <div id="view-planets-dedicated" className="space-y-6">
                <VedicInvocationBanner lang={lang} />
                <MoonPhaseVisualizer data={panchangaData} lang={lang} />
                <PlanetaryPositionsCard data={panchangaData} lang={lang} />
              </div>
            )}

            {/* View: Monthly Calendar */}
            {activeView === 'calendar' && (
              <div id="view-month-calendar" className="space-y-6">
                <VedicInvocationBanner lang={lang} />
                <MonthlyCalendarView
                  currentCity={currentCity}
                  monthSystem={monthSystem}
                  ayanamsa={ayanamsa}
                  currentDateStr={currentDate}
                  onSelectDate={(newDate) => {
                    setCurrentDate(newDate);
                    setActiveView('panchanga');
                  }}
                  lang={lang}
                />
              </div>
            )}

            {/* View: Vedic Horas */}
            {activeView === 'horas' && (
              <div id="view-vedic-horas" className="space-y-6">
                <VedicInvocationBanner lang={lang} />
                <VedicHorasView panchangaData={panchangaData} />
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer
        id="app-footer"
        className="mt-auto border-t border-stone-200/50 bg-stone-100/50 backdrop-blur-md py-8 text-xs text-stone-500 relative z-10"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-serif-vedic font-black text-indigo-950 text-sm tracking-wide">
              {t.appName}
            </span>
            <span className="text-stone-300">•</span>
            <span className="font-devanagari font-semibold">
              {lang === 'sa'
                ? 'दृग्गणित-पद्धत्या विशुद्ध-खगोलीयपञ्चाङ्गम्'
                : lang === 'hi'
                ? 'दृग्गणित पद्धति पर आधारित शुद्ध भारतीय पंचांग'
                : 'Drig-ganita Observational Almanac System'}
            </span>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
            VSOP87 / ELP2000 Ephemeris • NASA JPL Algorithms • Lahiri Ayanāṁśa
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        currentCity={currentCity}
        onSelectCity={handleSelectCity}
        onSelectCustom={handleSelectCustom}
        lang={lang}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        ayanamsa={ayanamsa}
        monthSystem={monthSystem}
        onUpdateSettings={handleUpdateSettings}
        lang={lang}
      />

      {isPrintOpen && panchangaData && (
        <PrintablePanchanga
          data={panchangaData}
          onClose={() => setIsPrintOpen(false)}
          lang={lang}
        />
      )}
    </div>
  );
}
