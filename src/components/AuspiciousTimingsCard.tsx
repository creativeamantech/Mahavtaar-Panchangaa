import React from 'react';
import { ShieldAlert, ShieldCheck, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import type { PanchangaResponse } from '../types';
import { type Language, translations } from '../i18n';

interface AuspiciousTimingsCardProps {
  data: PanchangaResponse;
  lang: Language;
}

export const AuspiciousTimingsCard: React.FC<AuspiciousTimingsCardProps> = ({ data, lang }) => {
  const t = translations[lang];

  return (
    <div id="auspicious-timings-section" className="space-y-4">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Inauspicious Periods (Aśubha Muhūrtas) */}
        <div
          id="inauspicious-card"
          className="glass-card rounded-[1.5rem] p-6 sm:p-8"
        >
          <div className="flex items-center space-x-3 border-b border-rose-100 pb-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-800 shadow-2xs">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif-vedic">
                {t.inauspiciousTimings}
              </h3>
              <p className="text-xs text-stone-500">{t.inauspiciousSub}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {/* Rahu Kala */}
            <div
              id="period-rahu-kala"
              className="flex items-center justify-between rounded-xl bg-rose-50/80 p-3.5 border border-rose-200"
            >
              <div>
                <div className="text-sm font-bold text-rose-950 font-devanagari">
                  {t.rahuKala}
                </div>
                <div className="text-xs text-rose-700/90 mt-0.5">{t.rahuKalaDesc}</div>
              </div>
              <div className="font-mono text-sm font-extrabold text-rose-950 bg-white px-2.5 py-1 rounded-md border border-rose-300 shadow-2xs">
                {data.rahu_kala ? `${data.rahu_kala.start} – ${data.rahu_kala.end}` : '—'}
              </div>
            </div>

            {/* Yamaganda */}
            {data.yamaganda && (
              <div
                id="period-yamaganda"
                className="flex items-center justify-between rounded-xl bg-stone-50/90 p-3.5 border border-stone-200"
              >
                <div>
                  <div className="text-sm font-bold text-stone-900 font-devanagari">
                    {t.yamaganda}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">{t.yamagandaDesc}</div>
                </div>
                <div className="font-mono text-sm font-bold text-stone-800 bg-white px-2.5 py-1 rounded-md border border-stone-200">
                  {data.yamaganda.start} – {data.yamaganda.end}
                </div>
              </div>
            )}

            {/* Gulika Kala */}
            {data.gulika_kala && (
              <div
                id="period-gulika"
                className="flex items-center justify-between rounded-xl bg-stone-50/90 p-3.5 border border-stone-200"
              >
                <div>
                  <div className="text-sm font-bold text-stone-900 font-devanagari">
                    {t.gulikaKala}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">{t.gulikaKalaDesc}</div>
                </div>
                <div className="font-mono text-sm font-bold text-stone-800 bg-white px-2.5 py-1 rounded-md border border-stone-200">
                  {data.gulika_kala.start} – {data.gulika_kala.end}
                </div>
              </div>
            )}

            {/* Durmuhurta */}
            {data.durmuhurta && data.durmuhurta.length > 0 && (
              <div id="period-durmuhurta" className="rounded-xl bg-stone-50/90 p-3.5 border border-stone-200">
                <div className="flex items-baseline justify-between mb-1.5">
                  <div className="text-sm font-bold text-stone-900 font-devanagari">
                    {t.durmuhurta}
                  </div>
                  <div className="text-xs text-stone-500">{t.durmuhurtaDesc}</div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.durmuhurta.map((dm, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-lg bg-stone-200/90 px-2.5 py-1 text-xs font-mono font-bold text-stone-900"
                    >
                      {dm.start} – {dm.end}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Varjyam */}
            {data.varjyam && data.varjyam.length > 0 && (
              <div id="period-varjyam" className="rounded-xl bg-stone-50/90 p-3.5 border border-stone-200">
                <div className="flex items-baseline justify-between mb-1.5">
                  <div className="text-sm font-bold text-stone-900 font-devanagari">
                    {t.varjyam}
                  </div>
                  <div className="text-xs text-stone-500">{t.varjyamDesc}</div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.varjyam.map((v, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-lg bg-rose-100/90 px-2.5 py-1 text-xs font-mono font-bold text-rose-900 border border-rose-200"
                    >
                      {v.start} – {v.end}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Auspicious Periods (Śubha Muhūrtas) */}
        <div
          id="auspicious-card"
          className="glass-card rounded-[1.5rem] p-6 sm:p-8"
        >
          <div className="flex items-center space-x-3 border-b border-emerald-100 pb-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 shadow-2xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif-vedic">
                {t.auspiciousTimings}
              </h3>
              <p className="text-xs text-stone-500">{t.auspiciousSub}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {/* Abhijit Muhurta */}
            {data.abhijit_muhurta ? (
              <div
                id="period-abhijit"
                className="flex items-center justify-between rounded-xl bg-emerald-50/80 p-3.5 border border-emerald-200"
              >
                <div>
                  <div className="text-sm font-bold text-emerald-950 font-devanagari">
                    {t.abhijit}
                  </div>
                  <div className="text-xs text-emerald-700 mt-0.5">{t.abhijitDesc}</div>
                </div>
                <div className="font-mono text-sm font-extrabold text-emerald-950 bg-white px-2.5 py-1 rounded-md border border-emerald-300 shadow-2xs">
                  {data.abhijit_muhurta.start} – {data.abhijit_muhurta.end}
                </div>
              </div>
            ) : (
              <div className="p-3.5 text-xs text-stone-500 bg-stone-50 rounded-xl border border-stone-200">
                {lang === 'sa'
                  ? 'बुधवासरे अभिजित्मुहूर्तः वर्ज्यते।'
                  : lang === 'hi'
                  ? 'बुधवार के दिन अभिजित् मुहूर्त का परिहार माना जाता है।'
                  : 'Abhijit Muhurta is avoided on Wednesdays (Budhavara).'}
              </div>
            )}

            {/* Brahma Muhurta */}
            {data.brahma_muhurta && (
              <div
                id="period-brahma"
                className="flex items-center justify-between rounded-xl bg-amber-50/80 p-3.5 border border-amber-200"
              >
                <div>
                  <div className="text-sm font-bold text-amber-950 font-devanagari">
                    {t.brahmaMuhurta}
                  </div>
                  <div className="text-xs text-amber-800 mt-0.5">{t.brahmaMuhurtaDesc}</div>
                </div>
                <div className="font-mono text-sm font-extrabold text-amber-950 bg-white px-2.5 py-1 rounded-md border border-amber-300 shadow-2xs">
                  {data.brahma_muhurta.start} – {data.brahma_muhurta.end}
                </div>
              </div>
            )}

            {/* Amrita Kala */}
            {data.amrita_kala && data.amrita_kala.length > 0 && (
              <div
                id="period-amrita"
                className="rounded-xl bg-emerald-50/60 p-3.5 border border-emerald-200"
              >
                <div className="flex items-baseline justify-between mb-1.5">
                  <div className="text-sm font-bold text-emerald-950 font-devanagari">
                    {t.amritaKala}
                  </div>
                  <div className="text-xs text-emerald-700">{t.amritaKalaDesc}</div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.amrita_kala.map((a, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-mono font-bold text-emerald-900 border border-emerald-300"
                    >
                      {a.start} – {a.end}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Vedic Guidance Note */}
            <div className="rounded-xl bg-amber-50/40 p-3.5 text-xs text-stone-600 border border-amber-200/60">
              <p className="leading-relaxed">
                <strong>{lang === 'sa' ? 'सूचना:' : lang === 'hi' ? 'विशेष:' : 'Note:'}</strong>{' '}
                {lang === 'sa'
                  ? 'सर्वे मुहूर्ताः स्थानीयसूर्योदयानुसारं प्रत्यक्षदृग्गणितेन साधिताः।'
                  : lang === 'hi'
                  ? 'समस्त मुहूर्त काल स्थानीय सूर्योदय, सूर्यास्त व दिनमान के प्रत्यक्ष दृग्गणित पर आधारित हैं।'
                  : `All Muhūrta spans are astronomically calculated based on exact civil sunrise and day/night length in ${data.city}.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
