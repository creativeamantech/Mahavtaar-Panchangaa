import React from 'react';
import { Sun, Moon, Clock, Compass, Sparkles, Wind } from 'lucide-react';
import type { PanchangaResponse } from '../types';
import { computeSwaraYoga } from '../swaraYoga';
import {
  type Language,
  translations,
  getLocalizedMasa,
  getLocalizedRasi,
  getLocalizedVaara,
} from '../i18n';

interface PanchangaSummaryCardProps {
  data: PanchangaResponse;
  lang: Language;
}

export const PanchangaSummaryCard: React.FC<PanchangaSummaryCardProps> = ({ data, lang }) => {
  const t = translations[lang];

  const localizedMasa = getLocalizedMasa(data.masa, lang);
  const localizedVaara = getLocalizedVaara(data.vaara, lang);
  const localizedSunRasi = getLocalizedRasi(data.sun_rasi || '', lang);
  const localizedMoonRasi = getLocalizedRasi(data.moon_rasi || '', lang);

  const localizedPaksha =
    (data.paksha || '').toLowerCase().includes('k') || (data.paksha || '').toLowerCase().includes('krishna')
      ? t.krishna
      : t.sukla;

  const primaryTithiNum = data.tithi?.[0]?.number || 1;
  const swara = computeSwaraYoga(primaryTithiNum, data.sunrise, data.sunset, undefined, data.moonrise, data.moonset);

  return (
    <div id="panchanga-summary-card" className="space-y-6">
      {/* Vedic Calendar Hierarchy Banner */}
      <div
        id="vedic-calendar-banner"
        className="glass-card rounded-[2rem] p-6 sm:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Moon className="w-64 h-64" />
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/60 pb-6 relative z-10">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900/60 mb-1">
              {t.vedicAlmanac}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-serif-vedic text-stone-800 flex items-baseline gap-2">
              <span>{data.samvatsara}</span>
              <span className="text-xs font-semibold text-stone-500 font-sans tracking-wide">
                {t.samvatsara}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              id="masa-badge"
              className="inline-flex items-center rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-950 border border-amber-300/80 font-devanagari shadow-2xs"
            >
              {localizedMasa} {t.masa}
            </span>
            <span
              id="paksha-badge"
              className="inline-flex items-center rounded-full bg-orange-100 px-3.5 py-1 text-xs font-bold text-orange-950 border border-orange-300/80 font-devanagari shadow-2xs"
            >
              {localizedPaksha} {t.paksha}
            </span>
            <span
              id="vaara-badge"
              className="inline-flex items-center rounded-full bg-stone-100 px-3.5 py-1 text-xs font-bold text-stone-900 border border-stone-300/80 font-devanagari shadow-2xs"
            >
              {localizedVaara}
            </span>
          </div>
        </div>

        {/* Sub-attributes grid: Ayana, Ritu, Sun Rasi, Moon Rasi */}
        <div className="grid grid-cols-2 gap-3.5 pt-4 sm:grid-cols-4">
          <div id="attr-ayana" className="bg-white/70 p-3 rounded-xl border border-stone-200/60">
            <span className="text-xs text-stone-500 block font-medium">{t.ayana}</span>
            <span className="text-sm font-bold text-stone-900 font-devanagari mt-0.5 block">
              {data.ayana}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              {t.drikAyana}: {data.drik_ayana}
            </span>
          </div>

          <div id="attr-rtu" className="bg-white/70 p-3 rounded-xl border border-stone-200/60">
            <span className="text-xs text-stone-500 block font-medium">{t.rtu}</span>
            <span className="text-sm font-bold text-stone-900 font-devanagari mt-0.5 block">
              {data.rtu}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              {t.drikRtu}: {data.drik_rtu}
            </span>
          </div>

          <div id="attr-sun-rasi" className="bg-white/70 p-3 rounded-xl border border-stone-200/60">
            <span className="text-xs text-stone-500 block font-medium">{t.sunSign}</span>
            <span className="text-sm font-bold text-stone-900 font-devanagari mt-0.5 block">
              {localizedSunRasi}
            </span>
            {lang !== 'en' && data.sun_rasi && (
              <span className="text-[11px] text-stone-400 block capitalize">{data.sun_rasi}</span>
            )}
          </div>

          <div id="attr-moon-rasi" className="bg-white/70 p-3 rounded-xl border border-stone-200/60">
            <span className="text-xs text-stone-500 block font-medium">{t.moonSign}</span>
            <span className="text-sm font-bold text-stone-900 font-devanagari mt-0.5 block">
              {localizedMoonRasi}
            </span>
            {lang !== 'en' && data.moon_rasi && (
              <span className="text-[11px] text-stone-400 block capitalize">{data.moon_rasi}</span>
            )}
          </div>
        </div>
      </div>

      {/* Sun, Moon, Key Muhurtas, and Eras Cards */}
      <div id="celestial-events-grid" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Sunrise & Sunset */}
        <div
          id="sun-timings-card"
          className="rounded-2xl border border-amber-200/80 bg-white/60 backdrop-blur-sm p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              {t.solarDay}
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-700">
              <Sun className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-600 font-medium">{t.sunrise}</span>
              <span id="sunrise-val" className="text-base font-bold text-stone-900 font-mono">
                {data.sunrise}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-600 font-medium">{t.sunset}</span>
              <span id="sunset-val" className="text-base font-bold text-stone-900 font-mono">
                {data.sunset}
              </span>
            </div>
          </div>

          <div className="mt-3 border-t border-stone-100 pt-2 flex items-center justify-between text-xs text-stone-600">
            <span className="font-medium">{t.dayLength}</span>
            <span className="font-bold text-amber-900 font-mono">{data.day_duration}</span>
          </div>

          <div className="mt-2.5 border-t border-amber-100/80 pt-2 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-stone-500 font-medium">Sunrise Swara:</span>
              <div className="flex items-center space-x-1.5">
                {swara.sunriseWindow?.isActive && (
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Active Now"></span>
                )}
                <span className={`inline-flex items-center space-x-1 rounded px-1.5 py-0.5 font-bold ${
                  swara.sunriseSwara === 'ida' ? 'bg-sky-100 text-sky-900' : 'bg-orange-100 text-orange-950'
                }`}>
                  <span>{swara.sunriseSwara === 'ida' ? 'Ida (Left)' : 'Pingala (Right)'}</span>
                </span>
                {swara.sunriseWindow && (
                  <span className="text-[10px] font-mono text-stone-500 hidden sm:inline" title="1 hr from sunrise">
                    ({swara.sunriseWindow.windowFormatted})
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500 font-medium">Sunset Swara:</span>
              <div className="flex items-center space-x-1.5">
                {swara.sunsetWindow?.isActive && (
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Active Now"></span>
                )}
                <span className={`inline-flex items-center space-x-1 rounded px-1.5 py-0.5 font-bold ${
                  swara.sunsetSwara === 'ida' ? 'bg-sky-100 text-sky-900' : 'bg-orange-100 text-orange-950'
                }`}>
                  <span>{swara.sunsetSwara === 'ida' ? 'Ida (Left)' : 'Pingala (Right)'}</span>
                </span>
                {swara.sunsetWindow && (
                  <span className="text-[10px] font-mono text-stone-500 hidden sm:inline" title="1 hr before sunset">
                    ({swara.sunsetWindow.windowFormatted})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Moonrise & Moonset */}
        <div
          id="moon-timings-card"
          className="rounded-2xl border border-indigo-200/80 bg-white/60 backdrop-blur-sm p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              {t.lunarNight}
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 text-indigo-700">
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-600 font-medium">{t.moonrise}</span>
              <span id="moonrise-val" className="text-base font-bold text-stone-900 font-mono">
                {data.moonrise || '—'}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-600 font-medium">{t.moonset}</span>
              <span id="moonset-val" className="text-base font-bold text-stone-900 font-mono">
                {data.moonset || '—'}
              </span>
            </div>
          </div>

          <div className="mt-3 border-t border-stone-100 pt-2 flex items-center justify-between text-xs text-stone-600">
            <span className="font-medium">{t.nightLength}</span>
            <span className="font-bold text-indigo-900 font-mono">{data.night_duration || '—'}</span>
          </div>

          <div className="mt-2.5 border-t border-indigo-100/80 pt-2 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-stone-500 font-medium">Moonrise Swara:</span>
              <div className="flex items-center space-x-1.5">
                {swara.moonriseWindow?.isActive && (
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Active Now"></span>
                )}
                <span className={`inline-flex items-center space-x-1 rounded px-1.5 py-0.5 font-bold ${
                  swara.moonriseSwara === 'ida' ? 'bg-sky-100 text-sky-900' : 'bg-orange-100 text-orange-950'
                }`}>
                  <span>{swara.moonriseSwara === 'ida' ? 'Ida (Left)' : 'Pingala (Right)'}</span>
                </span>
                {swara.moonriseWindow && (
                  <span className="text-[10px] font-mono text-stone-500 hidden sm:inline" title="1 hr from moonrise">
                    ({swara.moonriseWindow.windowFormatted})
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500 font-medium">Moonset Swara:</span>
              <div className="flex items-center space-x-1.5">
                {swara.moonsetWindow?.isActive && (
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Active Now"></span>
                )}
                <span className={`inline-flex items-center space-x-1 rounded px-1.5 py-0.5 font-bold ${
                  swara.moonsetSwara === 'ida' ? 'bg-sky-100 text-sky-900' : 'bg-orange-100 text-orange-950'
                }`}>
                  <span>{swara.moonsetSwara === 'ida' ? 'Ida (Left)' : 'Pingala (Right)'}</span>
                </span>
                {swara.moonsetWindow && (
                  <span className="text-[10px] font-mono text-stone-500 hidden sm:inline" title="1 hr before moonset">
                    ({swara.moonsetWindow.windowFormatted})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Auspicious / Inauspicious Timings */}
        <div
          id="quick-muhurta-card"
          className="rounded-2xl border border-stone-200 bg-white/60 backdrop-blur-sm p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
              {lang === 'sa' ? 'मुख्यकालाः' : lang === 'hi' ? 'प्रमुख मुहूर्त' : 'Key Muhūrtas'}
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-100 text-stone-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 space-y-2.5">
            <div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-bold text-rose-700 font-devanagari">{t.rahuKala}</span>
                <span className="font-mono text-xs font-bold text-rose-900 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  {data.rahu_kala ? `${data.rahu_kala.start} – ${data.rahu_kala.end}` : '—'}
                </span>
              </div>
            </div>

            {data.abhijit_muhurta && (
              <div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-emerald-700 font-devanagari">{t.abhijit}</span>
                  <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {data.abhijit_muhurta.start} – {data.abhijit_muhurta.end}
                  </span>
                </div>
              </div>
            )}

            {data.brahma_muhurta && (
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-medium text-stone-700 font-devanagari">{t.brahmaMuhurta}</span>
                <span className="font-mono text-stone-800">
                  {data.brahma_muhurta.start} – {data.brahma_muhurta.end}
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 border-t border-stone-100 pt-2 text-[11px] text-stone-400">
            {data.city} • {data.coordinate_label}
          </div>
        </div>

        {/* Traditional Hindu Eras (Saṁvat) */}
        <div
          id="hindu-eras-card"
          className="rounded-2xl border border-stone-200 bg-white/60 backdrop-blur-sm p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
              {t.eraDetails}
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-100 text-stone-700">
              <Compass className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
              <span className="text-stone-500 block text-[11px] font-medium">{t.sakaEra}</span>
              <span className="font-extrabold text-stone-900 font-mono text-sm">{data.saka_year}</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
              <span className="text-stone-500 block text-[11px] font-medium">{t.vikramaEra}</span>
              <span className="font-extrabold text-stone-900 font-mono text-sm">{data.vikrama_year}</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
              <span className="text-stone-500 block text-[11px] font-medium">{t.kaliYear}</span>
              <span className="font-extrabold text-stone-900 font-mono text-sm">{data.kali_year}</span>
            </div>
            <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
              <span className="text-stone-500 block text-[11px] font-medium">{t.ahargana}</span>
              <span className="font-mono font-extrabold text-stone-900 text-xs truncate block">{data.kali_day}</span>
            </div>
          </div>

          <div className="mt-3 border-t border-stone-100 pt-2 text-[11px] text-stone-500 font-mono truncate">
            {data.ayanamsa || 'Tropical'} ({data.ayanamsa_degrees != null ? `${data.ayanamsa_degrees.toFixed(4)}°` : '0°'})
          </div>
        </div>
      </div>
    </div>
  );
};
