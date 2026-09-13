import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, Globe, Navigation } from 'lucide-react';
import type { CityLocation } from '../types';
import { type Language, translations } from '../i18n';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
  onSelectCity: (city: CityLocation) => void;
  onSelectCustom: (lat: number, lon: number, tz: string, name: string) => void;
  lang: Language;
}

const POPULAR_CITIES = [
  'Bengaluru, IN',
  'New Delhi, IN',
  'Mumbai, IN',
  'Chennai, IN',
  'Kolkata, IN',
  'Varanasi, IN',
  'Ujjain, IN',
  'Hyderabad, IN',
  'Ahmedabad, IN',
  'Pune, IN',
  'London, GB',
  'New York, US',
  'San Francisco, US',
  'Singapore, SG',
  'Dubai, AE',
  'Sydney, AU',
  'Tokyo, JP',
  'Toronto, CA',
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  onSelectCity,
  onSelectCustom,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'custom'>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<CityLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  // Custom coordinates form state
  const [customName, setCustomName] = useState('My Location');
  const [customLat, setCustomLat] = useState('12.97194');
  const [customLon, setCustomLon] = useState('77.59369');
  const [customTz, setCustomTz] = useState('Asia/Kolkata');

  const t = translations[lang];

  useEffect(() => {
    if (!isOpen) return;
    if (!searchTerm.trim()) {
      // Fetch default popular cities
      fetch('/api/cities?limit=12')
        .then((res) => res.json())
        .then((data) => setSearchResults(data.cities || []))
        .catch(() => {});
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(true);
      fetch(`/api/cities?q=${encodeURIComponent(searchTerm.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data.cities || []);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  if (!isOpen) return null;

  const handleSelect = (city: CityLocation) => {
    onSelectCity(city);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (isNaN(lat) || isNaN(lon)) {
      setGeoNotice('Invalid coordinates entered. Please verify latitude and longitude values.');
      return;
    }
    onSelectCustom(lat, lon, customTz.trim() || 'Asia/Kolkata', customName.trim() || 'Custom Location');
    onClose();
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoNotice('Geolocation is not supported by your browser.');
      return;
    }

    setGeoNotice('Detecting current GPS location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
        const detectedName = `GPS (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
        setGeoNotice(null);
        onSelectCustom(lat, lon, tz, detectedName);
        onClose();
      },
      (err) => {
        setGeoNotice(
          'Location access was unavailable or denied. You can select a city from the list or enter coordinates manually.'
        );
      },
      { timeout: 8000 }
    );
  };

  return (
    <div
      id="location-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs"
    >
      <div
        id="location-modal-dialog"
        className="w-full max-w-lg rounded-[1.5rem] border border-stone-200/60 bg-stone-50/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col relative"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif-vedic">
                {t.changeLocation}
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                {lang === 'sa'
                  ? 'सूर्योदय-नक्षत्र-तिथीनां प्रत्यक्षदृग्गणितार्थं स्थानचयनम्'
                  : lang === 'hi'
                  ? 'सूर्योदय व तिथियों के शुद्ध दृग्गणित हेतु अपना नगर चुनें'
                  : `Currently selected: ${currentCity}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="close-location-modal-btn"
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="mt-4 flex rounded-xl bg-stone-100 p-1 border border-stone-200">
          <button
            type="button"
            id="tab-search-cities"
            onClick={() => setActiveTab('search')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
              activeTab === 'search'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.searchCity}
          </button>
          <button
            type="button"
            id="tab-custom-coords"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
              activeTab === 'custom'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.customCoords}
          </button>
        </div>

        {geoNotice && (
          <div className="mt-3 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 border border-amber-200">
            {geoNotice}
          </div>
        )}

        {/* Tab: Search */}
        {activeTab === 'search' && (
          <div className="mt-4 flex-1 flex flex-col min-h-0 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                id="city-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-xl border border-stone-300 bg-stone-50 pl-9 pr-4 py-2 text-sm text-stone-900 focus:border-amber-600 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Auto GPS Detection Button */}
            <button
              type="button"
              id="gps-detect-btn"
              onClick={handleGeolocation}
              className="flex items-center justify-center space-x-2 rounded-xl border border-amber-300 bg-amber-50/70 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors"
            >
              <Navigation className="h-3.5 w-3.5 text-amber-700" />
              <span>{t.detectGps}</span>
            </button>

            {/* Results list */}
            <div className="flex-1 overflow-y-auto divide-y divide-stone-100 pr-1 max-h-72">
              {isLoading ? (
                <div className="py-6 text-center text-xs text-stone-500">Searching global cities...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((city) => (
                  <button
                    key={`${city.name}-${city.country}`}
                    type="button"
                    onClick={() => handleSelect(city)}
                    className="w-full text-left py-2.5 px-2 hover:bg-amber-50/60 rounded-lg flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-bold text-stone-900 group-hover:text-amber-900">
                        {city.name}
                      </div>
                      <div className="text-xs text-stone-400">
                        {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}° • {city.timezone}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-stone-400 group-hover:text-amber-700">
                      {city.country}
                    </span>
                  </button>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-stone-500">
                  No cities found. You can enter custom coordinates in the next tab.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Custom Coordinates */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCustomSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Location Label
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. My Home Observatory"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-600 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Latitude (° North)
                </label>
                <input
                  type="text"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  placeholder="12.9719"
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 font-mono focus:border-amber-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Longitude (° East)
                </label>
                <input
                  type="text"
                  value={customLon}
                  onChange={(e) => setCustomLon(e.target.value)}
                  placeholder="77.5937"
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 font-mono focus:border-amber-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                IANA Timezone
              </label>
              <input
                type="text"
                value={customTz}
                onChange={(e) => setCustomTz(e.target.value)}
                placeholder="Asia/Kolkata"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 font-mono focus:border-amber-600 focus:outline-none"
                required
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white hover:bg-amber-800 shadow-xs"
              >
                {t.saveSettings}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
