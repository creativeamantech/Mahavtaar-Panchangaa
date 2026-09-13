import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  Settings,
  Printer,
  Sun,
  Globe,
  Wind,
  Clock,
} from 'lucide-react';
import { type Language, translations } from '../i18n';

export type ActiveView = 'panchanga' | 'calendar' | 'planets' | 'timings' | 'swara' | 'horas';

interface HeaderProps {
  currentDate: string; // dd/mm/yyyy
  currentCity: string;
  activeView: ActiveView;
  onDateChange: (newDateStr: string) => void;
  onViewChange: (view: ActiveView) => void;
  onOpenLocation: () => void;
  onOpenSettings: () => void;
  onPrint: () => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  currentCity,
  activeView,
  onDateChange,
  onViewChange,
  onOpenLocation,
  onOpenSettings,
  onPrint,
  lang,
  onLangChange,
}) => {
  const t = translations[lang];

  // Parse dd/mm/yyyy to standard date object
  const parseDateStr = (str: string): Date => {
    const parts = str.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      return new Date(y, m, d);
    }
    return new Date();
  };

  const formatDateToDDMMYYYY = (date: Date): string => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handlePrevDay = () => {
    const d = parseDateStr(currentDate);
    d.setDate(d.getDate() - 1);
    onDateChange(formatDateToDDMMYYYY(d));
  };

  const handleNextDay = () => {
    const d = parseDateStr(currentDate);
    d.setDate(d.getDate() + 1);
    onDateChange(formatDateToDDMMYYYY(d));
  };

  const handleToday = () => {
    onDateChange(formatDateToDDMMYYYY(new Date()));
  };

  // Convert dd/mm/yyyy to yyyy-mm-dd for input[type=date]
  const dateParts = currentDate.split('/');
  const inputDateVal =
    dateParts.length === 3
      ? `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`
      : '';

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const [y, m, d] = e.target.value.split('-');
    if (y && m && d) {
      onDateChange(`${d}/${m}/${y}`);
    }
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 border-b border-amber-200/80 bg-white/95 backdrop-blur-md shadow-2xs"
    >
      {/* Top Banner */}
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-md ring-1 ring-amber-900/20">
              <Sun className="h-6 w-6 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1
                  id="app-title"
                  className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 font-serif-vedic"
                >
                  {t.appName}
                </h1>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900 border border-amber-300 font-devanagari">
                  दृग्गणित
                </span>
              </div>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Language Selector + Location + Settings Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Language Switcher */}
            <div
              id="language-switcher"
              className="flex items-center rounded-xl bg-stone-100/90 p-1 border border-stone-200"
            >
              <button
                type="button"
                id="lang-btn-en"
                onClick={() => onLangChange('en')}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-white text-amber-950 shadow-xs border border-amber-200/80'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="English"
              >
                English
              </button>
              <button
                type="button"
                id="lang-btn-hi"
                onClick={() => onLangChange('hi')}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold font-devanagari transition-all ${
                  lang === 'hi'
                    ? 'bg-white text-amber-950 shadow-xs border border-amber-200/80'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="हिन्दी (Hindi)"
              >
                हिन्दी
              </button>
              <button
                type="button"
                id="lang-btn-sa"
                onClick={() => onLangChange('sa')}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold font-devanagari transition-all ${
                  lang === 'sa'
                    ? 'bg-white text-amber-950 shadow-xs border border-amber-200/80'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="संस्कृतम् (Sanskrit)"
              >
                संस्कृतम्
              </button>
            </div>

            {/* Location selector */}
            <button
              id="header-location-btn"
              onClick={onOpenLocation}
              className="flex items-center space-x-1.5 rounded-xl border border-stone-300/90 bg-white px-3 py-1.5 text-xs font-bold text-stone-800 shadow-2xs hover:bg-stone-50 hover:border-amber-400 transition-colors"
              title="Change City or Coordinates"
            >
              <MapPin className="h-3.5 w-3.5 text-amber-700" />
              <span className="max-w-[150px] truncate">{currentCity}</span>
            </button>

            {/* Settings button */}
            <button
              id="header-settings-btn"
              onClick={onOpenSettings}
              className="flex items-center space-x-1.5 rounded-xl border border-stone-300/90 bg-white px-2.5 py-1.5 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50 hover:text-stone-900 transition-colors"
              title={t.settings}
            >
              <Settings className="h-3.5 w-3.5 text-stone-600" />
              <span className="hidden sm:inline font-devanagari">{t.settings}</span>
            </button>

            {/* Print button */}
            <button
              id="header-print-btn"
              onClick={onPrint}
              className="flex items-center space-x-1.5 rounded-xl border border-stone-300/90 bg-white px-2.5 py-1.5 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50 hover:text-stone-900 transition-colors"
              title={t.printAction}
            >
              <Printer className="h-3.5 w-3.5 text-stone-600" />
              <span className="hidden sm:inline font-devanagari">{t.printAction}</span>
            </button>
          </div>
        </div>

        {/* Date Navigation & Views Bar */}
        <div className="mt-3.5 flex flex-col gap-3 border-t border-stone-100 pt-3 md:flex-row md:items-center md:justify-between">
          {/* Day Navigation Controls */}
          <div id="date-navigation-group" className="flex items-center space-x-2">
            <button
              id="prev-day-btn"
              onClick={handlePrevDay}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 transition-colors shadow-2xs"
              title={t.prevDay}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              id="today-btn"
              onClick={handleToday}
              className="rounded-xl border border-amber-300 bg-amber-100/70 px-3.5 py-1.5 text-xs font-bold text-amber-950 hover:bg-amber-200/70 transition-colors font-devanagari shadow-2xs"
            >
              {t.today}
            </button>

            <button
              id="next-day-btn"
              onClick={handleNextDay}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 transition-colors shadow-2xs"
              title={t.nextDay}
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Direct date picker */}
            <div className="relative flex items-center">
              <input
                id="direct-date-input"
                type="date"
                value={inputDateVal}
                onChange={handleDateInputChange}
                className="h-8 rounded-xl border border-stone-300 bg-white px-2.5 text-xs font-semibold text-stone-900 focus:border-amber-600 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* View Mode Tabs */}
          <div
            id="view-mode-tabs"
            className="flex items-center space-x-1 rounded-xl bg-stone-100 p-1 border border-stone-200/70 overflow-x-auto hide-scrollbar max-w-full"
          >
            <button
              type="button"
              id="tab-panchanga-view"
              onClick={() => onViewChange('panchanga')}
              className={`whitespace-nowrap shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold font-devanagari transition-all ${
                activeView === 'panchanga'
                  ? 'bg-white text-amber-950 font-black shadow-xs border border-amber-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.dailyPanchanga}
            </button>
            <button
              type="button"
              id="tab-timings-view"
              onClick={() => onViewChange('timings')}
              className={`whitespace-nowrap shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold font-devanagari transition-all ${
                activeView === 'timings'
                  ? 'bg-white text-amber-950 font-black shadow-xs border border-amber-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.muhurtasAndTimings}
            </button>
            <button
              type="button"
              id="tab-planets-view"
              onClick={() => onViewChange('planets')}
              className={`whitespace-nowrap shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold font-devanagari transition-all ${
                activeView === 'planets'
                  ? 'bg-white text-amber-950 font-black shadow-xs border border-amber-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.grahaSthiti}
            </button>
            <button
              type="button"
              id="tab-calendar-view"
              onClick={() => onViewChange('calendar')}
              className={`flex whitespace-nowrap shrink-0 items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold font-devanagari transition-all ${
                activeView === 'calendar'
                  ? 'bg-white text-amber-950 font-black shadow-xs border border-amber-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{t.monthCalendar}</span>
            </button>
            <button
              type="button"
              id="tab-swara-view"
              onClick={() => onViewChange('swara')}
              className={`flex whitespace-nowrap shrink-0 items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold font-devanagari transition-all ${
                activeView === 'swara'
                  ? 'bg-white text-amber-950 font-black shadow-xs border border-amber-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Wind className="h-3.5 w-3.5 text-amber-700" />
              <span>{t.views.swara}</span>
            </button>
            <button
              type="button"
              id="tab-horas-view"
              onClick={() => onViewChange('horas')}
              className={`flex whitespace-nowrap shrink-0 items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold font-devanagari transition-all ${
                activeView === 'horas'
                  ? 'bg-white text-amber-950 font-black shadow-xs border border-amber-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Clock className="h-3.5 w-3.5 text-amber-700" />
              <span>{lang === 'hi' ? 'वैदिक होरा' : lang === 'sa' ? 'वैदिकहोरा' : 'Vedic Horas'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
