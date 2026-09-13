import React, { useState } from 'react';
import { Orbit, ArrowDownRight, ArrowUpRight, Grid3X3, LayoutGrid } from 'lucide-react';
import type { PanchangaResponse } from '../types';
import {
  type Language,
  translations,
  GRAHA_TRANSLATIONS,
  getLocalizedRasi,
  getLocalizedNakshatra,
} from '../i18n';
import { KundaliChart } from './KundaliChart';

interface PlanetaryPositionsCardProps {
  data: PanchangaResponse;
  lang: Language;
}

export const PlanetaryPositionsCard: React.FC<PlanetaryPositionsCardProps> = ({ data, lang }) => {
  const [displayMode, setDisplayMode] = useState<'table' | 'kundali'>('table');
  const t = translations[lang];
  const planets = data.planets || [];

  return (
    <div
      id="planetary-positions-card"
      className="glass-card rounded-[1.5rem] p-6 sm:p-8 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 pb-3.5 gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 shadow-2xs">
            <Orbit className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif-vedic">
              {t.planetsTitle}
            </h3>
            <p className="text-xs text-stone-500">
              {t.planetsSub} ({data.sunrise}) • {data.coordinate_label}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Toggle between Table and Kundali Chart */}
          <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-semibold">
            <button
              type="button"
              id="planets-mode-table-btn"
              onClick={() => setDisplayMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition-all ${
                displayMode === 'table'
                  ? 'bg-white text-stone-950 font-bold shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>{lang === 'sa' ? 'तालिका' : lang === 'hi' ? 'ग्रह तालिका' : 'Table View'}</span>
            </button>
            <button
              type="button"
              id="planets-mode-kundali-btn"
              onClick={() => setDisplayMode('kundali')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition-all ${
                displayMode === 'kundali'
                  ? 'bg-white text-amber-950 font-bold shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Grid3X3 className="h-3.5 w-3.5 text-amber-700" />
              <span>{lang === 'sa' ? 'कुण्डलीचक्रम्' : lang === 'hi' ? 'कुण्डली चक्र' : 'Kundali Chart'}</span>
            </button>
          </div>

          <div className="text-xs text-stone-600 font-mono bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
            {t.ayanamsaSystem}: {data.ayanamsa_degrees != null ? `${data.ayanamsa_degrees.toFixed(4)}°` : '0.0000°'} ({data.ayanamsa || 'Lahiri'})
          </div>
        </div>
      </div>

      {displayMode === 'kundali' ? (
        <KundaliChart planets={planets} lang={lang} coordinateMode={data.coordinate_label} />
      ) : (
        /* Table View */
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-amber-200/70 bg-amber-50/50 text-xs font-bold uppercase tracking-wider text-amber-950 font-sans">
                <th className="px-4 py-3">{t.graha}</th>
                <th className="px-4 py-3">{t.rasi}</th>
                <th className="px-4 py-3">{t.degrees}</th>
                <th className="px-4 py-3">{t.pada}</th>
                <th className="px-4 py-3">Sidereal Longitude</th>
                <th className="px-4 py-3 text-center">{t.motion}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {planets.map((planet) => {
                const grahaInfo = GRAHA_TRANSLATIONS[planet.id];
                const grahaLabel = grahaInfo ? grahaInfo[lang] || planet.name : planet.name;
                const rasiLabel = getLocalizedRasi(planet.rasi, lang);
                const nakLabel = getLocalizedNakshatra(planet.nakshatraNumber, planet.nakshatra, lang);

                return (
                  <tr
                    key={planet.id}
                    id={`graha-row-${planet.id}`}
                    className="hover:bg-amber-50/30 transition-colors"
                  >
                    {/* Planet Name & Symbol */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100/70 text-amber-900 font-bold text-sm font-devanagari">
                          {grahaInfo?.symbol || '●'}
                        </span>
                        <div>
                          <div className="font-bold text-stone-900 font-devanagari">
                            {grahaLabel}
                          </div>
                          {lang !== 'en' && (
                            <div className="text-[11px] text-stone-400">{planet.name}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Rasi */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-stone-900 font-devanagari">
                        {rasiLabel}
                      </div>
                      <div className="text-[11px] text-stone-400">#{planet.rasiNumber}</div>
                    </td>

                    {/* Degrees in Sign */}
                    <td className="px-4 py-3.5 font-mono text-stone-800 text-xs font-semibold">
                      {planet.degreesInRasi}
                    </td>

                    {/* Nakshatra & Pada */}
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-stone-900 font-devanagari">
                        {nakLabel}
                      </div>
                      <div className="text-xs text-amber-900 font-medium">
                        {lang === 'sa'
                          ? `${planet.pada} पादः`
                          : lang === 'hi'
                          ? `चरण ${planet.pada}`
                          : `Pāda ${planet.pada}`}{' '}
                        <span className="text-stone-400 font-mono">(#{planet.nakshatraNumber})</span>
                      </div>
                    </td>

                    {/* Sidereal Longitude */}
                    <td className="px-4 py-3.5 font-mono text-xs text-stone-600">
                      {planet.siderealLongitude.toFixed(4)}°
                    </td>

                    {/* Retrograde Status */}
                    <td className="px-4 py-3.5 text-center">
                      {planet.isRetrograde ? (
                        <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-900 border border-rose-300">
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                          {t.retrograde}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700">
                          <ArrowUpRight className="mr-1 h-3 w-3 text-stone-400" />
                          {t.direct}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-t border-stone-100 pt-3 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
        <div>
          {lang === 'sa'
            ? '* राहु-केतु छायाग्रहाः सदा वक्रिणः १८:०० समसप्तके तिष्ठतः।'
            : lang === 'hi'
            ? '* राहु व केतु छायाग्रह हैं और परस्पर १८०° पर सदैव वक्री गति में रहते हैं।'
            : '* Rāhu and Ketu are true Mean Lunar Nodes in opposite 180° sidereal alignment.'}
        </div>
        <div className="font-mono text-[11px] text-stone-400">
          VSOP87 / ELP2000 Ephemeris • NASA JPL Algorithms
        </div>
      </div>
    </div>
  );
};
