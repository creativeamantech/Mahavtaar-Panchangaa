import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  initPanchangaEngine,
  computePanchanga,
  computePanchangaCustom,
  searchCities,
  findNearestCity,
  getPopularCities,
} from './server/panchangaEngine';
import type { MonthSystem, CoordinateSelection } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize astronomical data
  initPanchangaEngine();

  app.use(express.json());

  // API: City search
  app.get('/api/cities', (req, res) => {
    try {
      const query = (req.query.q as string || '').trim();
      const limit = parseInt(req.query.limit as string || '10', 10);
      if (!query) {
        return res.json({ cities: getPopularCities() });
      }
      const results = searchCities(query, limit);
      res.json({ cities: results });
    } catch (err: any) {
      console.error('Error in /api/cities:', err);
      res.status(500).json({ error: err.message || 'Failed to search cities' });
    }
  });

  // API: Nearest city lookup for GPS device location
  app.get('/api/nearest-city', (req, res) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);
      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Valid lat and lon query parameters are required' });
      }
      const match = findNearestCity(lat, lon);
      res.json(match || { city: null, distanceKm: null });
    } catch (err: any) {
      console.error('Error in /api/nearest-city:', err);
      res.status(500).json({ error: err.message || 'Failed to find nearest city' });
    }
  });

  // API: Daily Panchanga calculation
  app.get('/api/panchanga', (req, res) => {
    try {
      const city = req.query.city as string;
      const date = (req.query.date as string) || ''; // format dd/mm/yyyy
      const monthSystem = ((req.query.month_system as string) || 'amanta') as MonthSystem;
      const ayanamsa = ((req.query.ayanamsa as string) || 'citra') as CoordinateSelection;

      // Check if custom coordinates provided
      const lat = req.query.lat ? parseFloat(req.query.lat as string) : null;
      const lon = req.query.lon ? parseFloat(req.query.lon as string) : null;
      const tz = req.query.tz as string | null;

      // Default date to today if not provided
      let targetDateStr = date;
      if (!targetDateStr) {
        const now = new Date();
        const d = String(now.getDate()).padStart(2, '0');
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const y = now.getFullYear();
        targetDateStr = `${d}/${m}/${y}`;
      }

      let result;
      if (lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon) && tz) {
        result = computePanchangaCustom(lat, lon, tz, targetDateStr, monthSystem, ayanamsa, city || 'Custom Location');
      } else {
        const cityName = city || 'Bengaluru, IN';
        result = computePanchanga(cityName, targetDateStr, monthSystem, ayanamsa);
      }

      res.json(result);
    } catch (err: any) {
      console.error('Error in /api/panchanga:', err);
      res.status(400).json({ error: err.message || 'Failed to compute panchanga' });
    }
  });

  // API: Month range / multi-day Panchanga for calendar view
  app.get('/api/panchanga/month', (req, res) => {
    try {
      const city = (req.query.city as string) || 'Bengaluru, IN';
      const year = parseInt(req.query.year as string, 10) || new Date().getFullYear();
      const month = parseInt(req.query.month as string, 10) || (new Date().getMonth() + 1); // 1-12
      const monthSystem = ((req.query.month_system as string) || 'amanta') as MonthSystem;
      const ayanamsa = ((req.query.ayanamsa as string) || 'citra') as CoordinateSelection;

      const daysInMonth = new Date(year, month, 0).getDate();
      const monthData = [];

      for (let d = 1; d <= daysInMonth; d++) {
        const dStr = String(d).padStart(2, '0');
        const mStr = String(month).padStart(2, '0');
        const dateStr = `${dStr}/${mStr}/${year}`;
        try {
          const p = computePanchanga(city, dateStr, monthSystem, ayanamsa);
          monthData.push({
            day: d,
            date: dateStr,
            vaara: p.vaara,
            tithi: p.tithi[0]?.name || '',
            nakshatra: p.nakshatra[0]?.name || '',
            yoga: p.yoga[0]?.name || '',
            karana: p.karana[0]?.name || '',
            sunrise: p.sunrise,
            sunset: p.sunset,
            masa: p.masa,
            paksha: p.paksha,
            rahu_kala: p.rahu_kala,
            swara_yoga: p.swara_yoga,
          });
        } catch {
          // skip invalid day
        }
      }

      res.json({ year, month, days: monthData });
    } catch (err: any) {
      console.error('Error in /api/panchanga/month:', err);
      res.status(500).json({ error: err.message || 'Failed to compute monthly panchanga' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Drik Panchanga server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
