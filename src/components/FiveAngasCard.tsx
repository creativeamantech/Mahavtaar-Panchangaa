import React from 'react';
import { Moon, Star, Compass, Sparkles, Sun } from 'lucide-react';
import type { PanchangaResponse, Segment } from '../types';
import {
  type Language,
  translations,
  getLocalizedTithi,
  getLocalizedNakshatra,
  getLocalizedYoga,
  getLocalizedKarana,
  getLocalizedVaara,
} from '../i18n';
import {
  TITHI_ATTRIBUTES,
  NAKSHATRA_ATTRIBUTES,
  YOGA_ATTRIBUTES,
  KARANA_ATTRIBUTES,
} from '../vedicData';

interface FiveAngasCardProps {
  data: PanchangaResponse;
  lang: Language;
}

export const FiveAngasCard: React.FC<FiveAngasCardProps> = ({ data, lang }) => {
  const t = translations[lang];

  const primaryTithiNum = data.tithi[0]?.number || 1;
  const tithiMod = ((primaryTithiNum - 1) % 15) + 1;
  const tithiAttr = TITHI_ATTRIBUTES[primaryTithiNum === 30 ? 30 : tithiMod];

  const primaryNakNum = data.nakshatra[0]?.number || 1;
  const nakAttr = NAKSHATRA_ATTRIBUTES[primaryNakNum];

  const primaryYogaNum = data.yoga[0]?.number || 1;
  const yogaAttr = YOGA_ATTRIBUTES[primaryYogaNum];

  const primaryKarNum = data.karana[0]?.number || 1;
  const karMod = ((primaryKarNum - 1) % 11) + 1;
  const karAttr = KARANA_ATTRIBUTES[karMod];

  const renderSegment = (
    segments: Segment[],
    defaultName: string,
    localizeFn?: (num: number, raw: string, lang: Language) => string
  ) => {
    if (!segments || segments.length === 0) {
      return (
        <div className="text-base font-bold text-stone-900 font-devanagari">{defaultName}</div>
      );
    }

    const primary = segments[0];
    const secondary = segments.length > 1 ? segments[1] : null;

    const primaryLocalized =
      localizeFn && primary.number != null
        ? localizeFn(primary.number, primary.name, lang)
        : primary.name;

    const secondaryLocalized =
      secondary && localizeFn && secondary.number != null
        ? localizeFn(secondary.number, secondary.name, lang)
        : secondary?.name;

    return (
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-1.5">
          <span className="text-base sm:text-lg font-bold text-stone-950 font-devanagari">
            {primaryLocalized}
          </span>
          {primary.ends ? (
            <span className="inline-flex items-center rounded-md bg-amber-100/90 px-2 py-0.5 text-xs font-semibold text-amber-900 border border-amber-300/80 font-mono">
              {t.endsAt} {primary.ends}
            </span>
          ) : (
            <span className="text-[11px] text-stone-400 italic">
              {t.throughoutDay}
            </span>
          )}
        </div>

        {/* Transliterated / Secondary English name if in Devanagari */}
        {lang !== 'en' && primary.name !== primaryLocalized && (
          <div className="text-xs text-stone-500 font-sans tracking-wide">
            {primary.name}
          </div>
        )}

        {secondary && (
          <div className="mt-1 rounded-md bg-amber-50/70 p-2 text-xs text-stone-700 border border-amber-200/60 flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-stone-500 text-[11px]">
              <span className="font-medium text-amber-900 uppercase tracking-wider">
                {t.followedBy}:
              </span>
              {secondary.ends ? (
                <span className="font-mono text-stone-600">
                  {t.endsAt} {secondary.ends}
                </span>
              ) : (
                <span className="italic text-stone-400">
                  ({t.throughoutDay})
                </span>
              )}
            </div>
            <div className="font-semibold text-stone-900 font-devanagari">
              {secondaryLocalized}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getVaaraDetails = (vaara: string) => {
    switch (vaara) {
      case 'Ravivāra':
        return {
          deity: lang === 'sa' ? 'सूर्यः अधिपतिः' : lang === 'hi' ? 'स्वामी: सूर्य देव' : 'Ruled by Sūrya (Sun)',
          metal: lang === 'sa' ? 'ताम्रम् • माणिक्यम्' : lang === 'hi' ? 'तांबा • माणिक' : 'Copper • Ruby',
        };
      case 'Somavāra':
        return {
          deity: lang === 'sa' ? 'चन्द्रः अधिपतिः' : lang === 'hi' ? 'स्वामी: चन्द्र देव' : 'Ruled by Candra (Moon)',
          metal: lang === 'sa' ? 'रजतम् • मुक्ताफलम्' : lang === 'hi' ? 'चांदी • मोती' : 'Silver • Pearl',
        };
      case 'Maṅgalavāra':
        return {
          deity: lang === 'sa' ? 'मङ्गलः अधिपतिः' : lang === 'hi' ? 'स्वामी: मङ्गल देव' : 'Ruled by Maṅgala (Mars)',
          metal: lang === 'sa' ? 'ताम्रम् • प्रवालम्' : lang === 'hi' ? 'तांबा • मूंगा' : 'Copper • Red Coral',
        };
      case 'Budhavāra':
        return {
          deity: lang === 'sa' ? 'बुधः अधिपतिः' : lang === 'hi' ? 'स्वामी: बुध देव' : 'Ruled by Budha (Mercury)',
          metal: lang === 'sa' ? 'कांस्यम् • मरकतम्' : lang === 'hi' ? 'कांसा • पन्ना' : 'Bronze • Emerald',
        };
      case 'Guruvāra':
        return {
          deity: lang === 'sa' ? 'बृहस्पतिः अधिपतिः' : lang === 'hi' ? 'स्वामी: बृहस्पति (गुरु)' : 'Ruled by Bṛhaspati (Jupiter)',
          metal: lang === 'sa' ? 'सुवर्णम् • पुखराजम्' : lang === 'hi' ? 'स्वर्ण • पुखराज' : 'Gold • Yellow Sapphire',
        };
      case 'Śukravāra':
        return {
          deity: lang === 'sa' ? 'शुक्रः अधिपतिः' : lang === 'hi' ? 'स्वामी: शुक्र देव' : 'Ruled by Śukra (Venus)',
          metal: lang === 'sa' ? 'रजतम् • वज्रम्' : lang === 'hi' ? 'चांदी • हीरा' : 'Silver • Diamond',
        };
      case 'Śanivāra':
        return {
          deity: lang === 'sa' ? 'शनैश्चरः अधिपतिः' : lang === 'hi' ? 'स्वामी: शनि देव' : 'Ruled by Śani (Saturn)',
          metal: lang === 'sa' ? 'अयः • नीलमणिः' : lang === 'hi' ? 'लोहा • नीलम' : 'Iron • Blue Sapphire',
        };
      default:
        return { deity: 'Solar Weekday', metal: '—' };
    }
  };

  const localizedVaara = getLocalizedVaara(data.vaara, lang);
  const vaaraInfo = getVaaraDetails(data.vaara);

  return (
    <div
      id="five-angas-card"
      className="glass-card rounded-[1.5rem] border border-amber-300/50 bg-gradient-to-b from-amber-50/40 via-white/50 to-orange-50/30 p-6 sm:p-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-amber-200/70 pb-3.5 gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs font-serif-vedic text-base font-bold">
            ॐ
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-serif-vedic tracking-tight">
              {t.limbsTitle}
            </h2>
            <p className="text-xs text-stone-500 font-sans">{t.limbsSubtitle}</p>
          </div>
        </div>
        <div className="text-xs text-amber-900/80 font-mono bg-amber-100/60 px-3 py-1 rounded-full border border-amber-300/60 self-start sm:self-auto">
          JD: {data.sunrise_jd?.toFixed(4)}
        </div>
      </div>

      {/* Five Limbs Grid */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* 1. Tithi */}
        <div
          id="anga-tithi"
          className="rounded-xl border border-stone-200/90 bg-white p-4 shadow-xs transition-all hover:border-amber-400 hover:shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                  १
                </span>
                <Moon className="h-3.5 w-3.5 text-amber-700" />
                <span>{t.tithi}</span>
              </span>
              {tithiAttr && (
                <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-950 font-serif-vedic">
                  {tithiAttr.category[lang]}
                </span>
              )}
            </div>
            {renderSegment(data.tithi, 'Śukla Pratipat', (num, raw, l) =>
              getLocalizedTithi(num, l)
            )}
          </div>

          <div className="mt-3 border-t border-stone-100 pt-2 text-[11px] text-stone-500 space-y-1">
            {tithiAttr && (
              <div className="text-amber-900 font-medium truncate">
                <span className="text-stone-400">Deity:</span> {tithiAttr.deity[lang]}
              </div>
            )}
            <div className="text-[10px] text-stone-400">
              {lang === 'sa'
                ? 'सूर्य-चन्द्रयोः १२° अन्तरम्'
                : lang === 'hi'
                ? 'सूर्य व चन्द्रमा के बीच १२° अंतर'
                : '12° lunar-solar elongation span'}
            </div>
          </div>
        </div>

        {/* 2. Nakshatra */}
        <div
          id="anga-nakshatra"
          className="rounded-xl border border-stone-200/90 bg-white p-4 shadow-xs transition-all hover:border-amber-400 hover:shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                  २
                </span>
                <Star className="h-3.5 w-3.5 text-amber-700" />
                <span>{t.nakshatra}</span>
              </span>
              {nakAttr && (
                <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-stone-700">
                  {nakAttr.gana[lang]}
                </span>
              )}
            </div>
            {renderSegment(data.nakshatra, 'Aśvinī', (num, raw, l) =>
              getLocalizedNakshatra(num, raw, l)
            )}
          </div>

          <div className="mt-3 border-t border-stone-100 pt-2 text-[11px] text-stone-500 space-y-1">
            {nakAttr && (
              <div className="text-amber-900 font-medium truncate">
                <span className="text-stone-400">Lord:</span> {nakAttr.lord[lang]} • {nakAttr.symbol}
              </div>
            )}
            <div className="text-[10px] text-stone-400">
              {lang === 'sa'
                ? 'क्रान्तिवृत्ते १३°२०\' नक्षत्रभागः'
                : lang === 'hi'
                ? 'चन्द्रमा का १३°२०\' नक्षत्र भोग'
                : "13°20' sidereal lunar asterism"}
            </div>
          </div>
        </div>

        {/* 3. Yoga */}
        <div
          id="anga-yoga"
          className="rounded-xl border border-stone-200/90 bg-white p-4 shadow-xs transition-all hover:border-amber-400 hover:shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                  ३
                </span>
                <Compass className="h-3.5 w-3.5 text-amber-700" />
                <span>{t.yoga}</span>
              </span>
              {yogaAttr && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    yogaAttr.nature === 'auspicious'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-rose-100 text-rose-900'
                  }`}
                >
                  {yogaAttr.nature === 'auspicious'
                    ? lang === 'sa'
                      ? 'शुभः'
                      : lang === 'hi'
                      ? 'शुभ'
                      : 'Auspicious'
                    : lang === 'sa'
                    ? 'अशुभः'
                    : lang === 'hi'
                    ? 'अशुभ'
                    : 'Inauspicious'}
                </span>
              )}
            </div>
            {renderSegment(data.yoga, 'Viṣkambha', (num, raw, l) =>
              getLocalizedYoga(num, raw, l)
            )}
          </div>

          <div className="mt-3 border-t border-stone-100 pt-2 text-[11px] text-stone-500 space-y-1">
            {yogaAttr && (
              <div className="text-amber-950 font-medium truncate">
                {yogaAttr.meaning[lang]}
              </div>
            )}
            <div className="text-[10px] text-stone-400">
              {lang === 'sa'
                ? 'सूर्य-चन्द्रयोः योगमानम्'
                : lang === 'hi'
                ? 'सूर्य व चन्द्र भोगांशों का योग'
                : 'Sum of Sun & Moon longitudes'}
            </div>
          </div>
        </div>

        {/* 4. Karana */}
        <div
          id="anga-karana"
          className="rounded-xl border border-stone-200/90 bg-white p-4 shadow-xs transition-all hover:border-amber-400 hover:shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                  ४
                </span>
                <Sparkles className="h-3.5 w-3.5 text-amber-700" />
                <span>{t.karana}</span>
              </span>
              {karAttr && (
                <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-stone-700">
                  {karAttr.type === 'chara'
                    ? lang === 'sa'
                      ? 'चर'
                      : lang === 'hi'
                      ? 'चर'
                      : 'Movable'
                    : lang === 'sa'
                    ? 'स्थिर'
                    : lang === 'hi'
                    ? 'स्थिर'
                    : 'Fixed'}
                </span>
              )}
            </div>
            {renderSegment(data.karana, 'Bava', (num, raw, l) =>
              getLocalizedKarana(num, raw, l)
            )}
          </div>

          <div className="mt-3 border-t border-stone-100 pt-2 text-[11px] text-stone-500 space-y-1">
            {karAttr && (
              <div className="text-amber-900 font-medium truncate">
                <span className="text-stone-400">Deity:</span> {karAttr.deity[lang]}
              </div>
            )}
            <div className="text-[10px] text-stone-400">
              {lang === 'sa'
                ? 'तिथेः अर्धभागः (६° विस्तारः)'
                : lang === 'hi'
                ? 'तिथि का आधा भाग (६° अंतर)'
                : 'Half of a Tithi (6° elongation)'}
            </div>
          </div>
        </div>

        {/* 5. Vaara */}
        <div
          id="anga-vaara"
          className="rounded-xl border border-stone-200/90 bg-white p-4 shadow-xs transition-all hover:border-amber-400 hover:shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                ५
              </span>
              <Sun className="h-3.5 w-3.5 text-amber-700" />
              <span>{t.vaara}</span>
            </div>
            <div className="space-y-1">
              <div className="text-base sm:text-lg font-bold text-stone-950 font-devanagari">
                {localizedVaara}
              </div>
              {lang !== 'en' && (
                <div className="text-xs text-stone-500">{data.vaara}</div>
              )}
              <div className="text-xs font-semibold text-amber-900 pt-0.5">
                {vaaraInfo.deity}
              </div>
            </div>
          </div>

          <div className="mt-3 border-t border-stone-100 pt-2 text-[11px] text-stone-500 space-y-1">
            <div className="text-amber-950 text-[11px]">
              <span className="text-stone-400">Attr:</span> {vaaraInfo.metal}
            </div>
            <div className="text-[10px] text-stone-400">
              {lang === 'sa'
                ? 'सूर्योदयात् सूर्योदयपर्यन्तम्'
                : lang === 'hi'
                ? 'सूर्योदय से अगले सूर्योदय तक'
                : 'From local sunrise to sunrise'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
