import React, { useState, useEffect } from 'react';
import {
  Sun, Cloud, CloudRain, Wind, Eye, Droplets,
  Thermometer, CloudSnow, CloudLightning, CloudDrizzle,
  Gauge, Sunrise, Sunset, Zap, CloudFog
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

const WMO_CONFIG = {
  0:  { label: 'Clear Sky',     Icon: Sun,            gradient: 'from-amber-400 to-orange-400',  bg: 'bg-amber-50',  text: 'text-amber-600'  },
  1:  { label: 'Mostly Clear',  Icon: Sun,            gradient: 'from-amber-300 to-yellow-400',  bg: 'bg-amber-50',  text: 'text-amber-500'  },
  2:  { label: 'Partly Cloudy', Icon: Cloud,          gradient: 'from-blue-300 to-slate-400',    bg: 'bg-blue-50',   text: 'text-blue-500'   },
  3:  { label: 'Overcast',      Icon: Cloud,          gradient: 'from-slate-400 to-gray-500',    bg: 'bg-slate-50',  text: 'text-slate-600'  },
  45: { label: 'Foggy',         Icon: CloudFog,       gradient: 'from-slate-300 to-gray-400',    bg: 'bg-gray-50',   text: 'text-gray-500'   },
  48: { label: 'Icy Fog',       Icon: CloudFog,       gradient: 'from-slate-200 to-blue-300',    bg: 'bg-slate-50',  text: 'text-slate-500'  },
  51: { label: 'Light Drizzle', Icon: CloudDrizzle,   gradient: 'from-sky-300 to-blue-400',      bg: 'bg-sky-50',    text: 'text-sky-600'    },
  53: { label: 'Drizzle',       Icon: CloudDrizzle,   gradient: 'from-sky-400 to-blue-500',      bg: 'bg-sky-50',    text: 'text-sky-600'    },
  55: { label: 'Heavy Drizzle', Icon: CloudDrizzle,   gradient: 'from-sky-500 to-blue-600',      bg: 'bg-sky-50',    text: 'text-sky-700'    },
  61: { label: 'Light Rain',    Icon: CloudRain,      gradient: 'from-blue-400 to-cyan-500',     bg: 'bg-blue-50',   text: 'text-blue-600'   },
  63: { label: 'Rainy',         Icon: CloudRain,      gradient: 'from-blue-500 to-cyan-600',     bg: 'bg-blue-50',   text: 'text-blue-700'   },
  65: { label: 'Heavy Rain',    Icon: CloudRain,      gradient: 'from-blue-600 to-indigo-700',   bg: 'bg-blue-50',   text: 'text-blue-800'   },
  71: { label: 'Light Snow',    Icon: CloudSnow,      gradient: 'from-indigo-200 to-blue-300',   bg: 'bg-indigo-50', text: 'text-indigo-500'  },
  73: { label: 'Snowy',         Icon: CloudSnow,      gradient: 'from-blue-200 to-indigo-300',   bg: 'bg-indigo-50', text: 'text-indigo-600'  },
  75: { label: 'Heavy Snow',    Icon: CloudSnow,      gradient: 'from-blue-300 to-indigo-400',   bg: 'bg-indigo-50', text: 'text-indigo-700'  },
  80: { label: 'Rain Showers',  Icon: CloudRain,      gradient: 'from-blue-400 to-teal-500',     bg: 'bg-blue-50',   text: 'text-blue-600'   },
  81: { label: 'Rain Showers',  Icon: CloudRain,      gradient: 'from-blue-500 to-teal-600',     bg: 'bg-blue-50',   text: 'text-blue-700'   },
  82: { label: 'Heavy Showers', Icon: CloudRain,      gradient: 'from-blue-600 to-teal-700',     bg: 'bg-blue-50',   text: 'text-blue-800'   },
  95: { label: 'Thunderstorm',  Icon: CloudLightning, gradient: 'from-purple-600 to-indigo-700', bg: 'bg-purple-50', text: 'text-purple-700'  },
  96: { label: 'Thunderstorm',  Icon: CloudLightning, gradient: 'from-purple-700 to-violet-800', bg: 'bg-purple-50', text: 'text-purple-800'  },
  99: { label: 'Thunderstorm',  Icon: CloudLightning, gradient: 'from-purple-800 to-gray-900',   bg: 'bg-purple-50', text: 'text-purple-900'  },
};

const getConfig  = (code) => WMO_CONFIG[code] || { label: 'Cloudy', Icon: Cloud, gradient: 'from-slate-400 to-gray-500', bg: 'bg-slate-50', text: 'text-slate-600' };
const ease = [0.22, 1, 0.36, 1];

const uvLabel = (uv) => {
  if (uv <= 2) return { text: 'Low',       color: 'bg-green-400'  };
  if (uv <= 5) return { text: 'Moderate',  color: 'bg-yellow-400' };
  if (uv <= 7) return { text: 'High',      color: 'bg-orange-400' };
  if (uv <= 10)return { text: 'Very High', color: 'bg-red-500'    };
  return               { text: 'Extreme',  color: 'bg-purple-600' };
};

const windDirection = (deg) => {
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(deg / 45) % 8];
};

const fmt12h = (isoStr) => {
  const d = new Date(isoStr);
  let h = d.getHours(), ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2,'0')} ${ampm}`;
};

const WeatherWidget = ({ location }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [weatherData, setWeatherData] = useState([]);
  const [current, setCurrent]         = useState(null);
  const [todayHourly, setTodayHourly] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!location?.latitude || !location?.longitude) return;
      try {
        setLoading(true); setError(false);

        const lat = location.latitude;
        const lon = location.longitude;

        // ① wttr.in — REAL station observations (updated every 30 min), no API key
        const wttrRes  = await fetch(`https://wttr.in/${lat},${lon}?format=j1`);
        const wttrData = await wttrRes.json();

        // ② Open-Meteo — hourly + daily forecast data
        const params = new URLSearchParams({
          latitude: lat, longitude: lon,
          hourly: 'temperature_2m,weather_code,precipitation_probability',
          daily: [
            'temperature_2m_max','temperature_2m_min','weather_code',
            'wind_speed_10m_max','precipitation_sum','sunrise','sunset',
            'uv_index_max','precipitation_probability_max'
          ].join(','),
          wind_speed_unit: 'kmh',
          timezone: 'auto',
          forecast_days: 5,
        });
        const meteoRes  = await fetch(`${OPEN_METEO_URL}?${params}`);
        const meteoData = await meteoRes.json();

        if (!wttrData?.current_condition || !meteoData?.daily) throw new Error('No data');

        // ── Parse wttr.in current conditions (station-based, real observations) ──
        const obs = wttrData.current_condition[0];
        const wttrCode = parseInt(obs.weatherCode, 10);
        // Map wttr.in weather codes to WMO-like codes we have config for
        const mapWttrCode = (code) => {
          if (code === 113) return 0;           // Sunny/Clear
          if ([116].includes(code)) return 2;   // Partly cloudy
          if ([119, 122].includes(code)) return 3; // Overcast
          if ([143, 248].includes(code)) return 45; // Mist/Fog
          if ([176, 263, 266, 293, 296].includes(code)) return 61; // Light rain
          if ([299, 302, 305, 308].includes(code)) return 63; // Moderate/heavy rain
          if ([353, 356, 359].includes(code)) return 80; // Rain showers
          if ([200, 386, 389].includes(code)) return 95; // Thunderstorm
          if ([179, 182, 185, 281, 284].includes(code)) return 51; // Drizzle/freezing
          if ([227, 230, 323, 326, 329, 332, 335, 338, 368, 371, 374, 377].includes(code)) return 71; // Snow
          return 3; // default overcast
        };
        const mappedCode = mapWttrCode(wttrCode);

        setCurrent({
          temp:      parseInt(obs.temp_C, 10),
          feelsLike: parseInt(obs.FeelsLikeC, 10),
          humidity:  parseInt(obs.humidity, 10),
          wind:      parseInt(obs.windspeedKmph, 10),
          windDir:   obs.winddir16Point,
          pressure:  parseInt(obs.pressure, 10),
          cloud:     parseInt(obs.cloudcover, 10),
          uv:        parseFloat(obs.uvIndex),
          visibility: obs.visibility,
          precip:    parseFloat(obs.precipMM ?? 0),
          desc:      obs.weatherDesc?.[0]?.value ?? '',
          code:      mappedCode,
          config:    getConfig(mappedCode),
        });

        // ── Today's hourly — wttr.in station data interpolated to 1-hour resolution ──
        // wttr.in gives real observations at 3h intervals (0,3,6,9,12,15,18,21).
        // Linear interpolation fills the in-between hours from real data checkpoints.
        const nowHour  = new Date().getHours();
        const liveTemp = parseInt(obs.temp_C, 10);

        // Parse wttr.in 3-hour checkpoints for today
        const wttrTodayHourly = (wttrData.weather?.[0]?.hourly ?? []).map(h => ({
          hourOfDay: Math.round(parseInt(h.time, 10) / 100), // "1200" → 12
          temp:      parseInt(h.tempC, 10),
          feelsLike: parseInt(h.FeelsLikeC, 10),
          rain:      parseInt(h.chanceofrain, 10),
          code:      mapWttrCode(parseInt(h.weatherCode, 10)),
          desc:      h.weatherDesc?.[0]?.value ?? '',
        }));

        // Interpolate between 3h checkpoints to produce 1h slots
        const interpHours = [];
        for (let i = 0; i < wttrTodayHourly.length - 1; i++) {
          const a = wttrTodayHourly[i];
          const b = wttrTodayHourly[i + 1];
          for (let step = 0; step < 3; step++) {
            const t = step / 3;
            interpHours.push({
              hourOfDay: a.hourOfDay + step,
              temp:      Math.round(a.temp + (b.temp - a.temp) * t),
              rain:      Math.round(a.rain + (b.rain - a.rain) * t),
              code:      step < 2 ? a.code : b.code,
              desc:      step < 2 ? a.desc : b.desc,
            });
          }
        }
        // Add the last checkpoint (21:00)
        if (wttrTodayHourly.length > 0) {
          const last = wttrTodayHourly[wttrTodayHourly.length - 1];
          interpHours.push({ hourOfDay: last.hourOfDay, temp: last.temp, rain: last.rain, code: last.code, desc: last.desc });
        }

        // Filter to current hour and beyond, cap at 12 entries
        const todayHours = interpHours
          .filter(h => h.hourOfDay >= nowHour)
          .slice(0, 12);

        // First slot → exact live station reading (most accurate)
        if (todayHours.length > 0) {
          todayHours[0].temp   = liveTemp;
          todayHours[0].isLive = true;
        }

        setTodayHourly(todayHours);




        // ── Daily cards from Open-Meteo ──
        const DAYS     = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const FULLDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const MONTHS   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        // Apply a bias offset based on what the model thought today's max should be vs the REAL live reading
        const modelTodayMax = Math.round(meteoData.daily.temperature_2m_max[0]);
        const biasOffset    = liveTemp > modelTodayMax ? liveTemp - modelTodayMax : 0;

        const days = meteoData.daily.time.map((dateStr, i) => {
          const d    = new Date(dateStr + 'T12:00:00');
          const code = meteoData.daily.weather_code[i];
          const rawMax = Math.round(meteoData.daily.temperature_2m_max[i]);
          const rawMin = Math.round(meteoData.daily.temperature_2m_min[i]);
          
          return {
            day: DAYS[d.getDay()], fullDay: FULLDAYS[d.getDay()],
            date: d.getDate(), month: MONTHS[d.getMonth()],
            // Use the biased MAX temperature for daytime reality, completely avoiding "averages"!
            temp:     i === 0 ? liveTemp : rawMax + biasOffset,
            tempMin:  rawMin + biasOffset,
            tempMax:  rawMax + biasOffset,
            wind:     Math.round(meteoData.daily.wind_speed_10m_max[i]),
            precip:   meteoData.daily.precipitation_sum?.[i] ?? 0,
            rainProb: meteoData.daily.precipitation_probability_max?.[i] ?? 0,
            uv:       meteoData.daily.uv_index_max?.[i] ?? 0,
            sunrise:  fmt12h(meteoData.daily.sunrise[i]),
            sunset:   fmt12h(meteoData.daily.sunset[i]),
            code:     i === 0 ? mappedCode : code,
            config:   getConfig(i === 0 ? mappedCode : code),
          };
        });

        setWeatherData(days);
        setSelectedDay(0);
      } catch { setError(true); }
      finally  { setLoading(false); }
    };
    fetchWeather();
  }, [location]);


  /* ─────────────── Loading / Error states ─────────────── */
  if (loading) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500" />
      <div className="p-8 flex flex-col items-center justify-center gap-3" style={{ minHeight: 260 }}>
        <motion.div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full"
          animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }} />
        <p className="text-sm text-gray-400 font-medium">Fetching weather data…</p>
      </div>
    </motion.div>
  );

  if (error || !weatherData.length) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="h-1.5 bg-gradient-to-r from-gray-300 to-gray-400" />
      <div className="p-8 flex flex-col items-center justify-center gap-2 text-gray-400" style={{ minHeight: 260 }}>
        <Cloud size={36} className="opacity-30" />
        <p className="text-sm font-medium">Weather data unavailable</p>
      </div>
    </motion.div>
  );

  const day              = weatherData[selectedDay];
  const { Icon, gradient, label, bg, text } = day.config;
  const isToday          = selectedDay === 0;
  const uv               = uvLabel(isToday ? current?.uv : day.uv);

  /* ─────────────── Main Render ─────────────── */
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease }}
    >
      {/* Colour bar */}
      <motion.div key={`bar-${selectedDay}`}
        className={`h-1.5 bg-gradient-to-r ${gradient}`}
        initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease }} />

      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-2">
          <motion.div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${gradient}`}
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
            <Thermometer size={14} className="text-white" />
          </motion.div>
          <span className="font-semibold text-gray-800 text-sm">Weather Forecast</span>
        </div>
        <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium border border-green-100">Live · Open-Meteo</span>
      </div>

      {/* ── Hero Card ── */}
      <div className="mx-4 mt-4" style={{ position: 'relative', minHeight: 210 }}>
        <AnimatePresence mode="sync">
          <motion.div key={selectedDay}
            className={`rounded-2xl p-5 bg-gradient-to-br ${gradient} text-white relative overflow-hidden`}
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24, position: 'absolute', top: 0, left: 0, right: 0 }}
            transition={{ duration: 0.25, ease }}>

            {/* Decorative blobs */}
            <motion.div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white opacity-10"
              animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} />
            <motion.div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-white opacity-10"
              animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }} />

            {/* Top row: temp + icon */}
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest opacity-75 mb-0.5">{day.fullDay}, {day.month} {day.date}</p>
                <p className="text-sm opacity-80 capitalize mb-2">{isToday && current?.desc ? current.desc : label}</p>
                <motion.div className="text-6xl font-black tracking-tight"
                  initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease }}>
                  {day.temp}°C
                </motion.div>
                <p className="text-xs opacity-70 mt-1 font-medium">Feels like {isToday ? current?.feelsLike : day.tempMin}°C</p>
                <p className="text-xs opacity-60 font-medium">↓{day.tempMin}° · ↑{day.tempMax}°</p>
              </div>
              <motion.div className="flex flex-col items-center"
                animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
                <Icon size={56} className="opacity-90 drop-shadow-xl" />
                <span className="text-xs font-semibold mt-1 opacity-80">{label}</span>
              </motion.div>
            </div>

            {/* Stats grid */}
            <div className="mt-4 grid grid-cols-4 gap-2 pt-4 border-t border-white/20">
              {[
                { StatIcon: Droplets,    label: 'Humidity',  value: `${isToday ? current?.humidity : '—'}%` },
                { StatIcon: Wind,        label: 'Wind',      value: `${isToday ? `${current?.wind} ${current?.windDir}` : `${day.wind} km/h`}` },
                { StatIcon: CloudRain,   label: 'Rain',      value: `${day.precip.toFixed(1)} mm` },
                { StatIcon: Gauge,       label: 'Pressure',  value: isToday ? `${current?.pressure}hPa` : '—' },
              ].map(({ StatIcon, label: lbl, value }, i) => (
                <motion.div key={lbl} className="text-center"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease, delay: 0.08 + i * 0.06 }}>
                  <StatIcon size={13} className="mx-auto mb-1 opacity-70" />
                  <div className="text-[10px] opacity-70 mb-0.5">{lbl}</div>
                  <div className="text-xs font-bold leading-tight">{value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Extra Detail Strips ── */}
      <div className="mx-4 mt-3 space-y-2">

        {/* UV index + Cloud cover + Rain probability row */}
        <div className="grid grid-cols-3 gap-2">
          {/* UV */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1">
              <Zap size={12} className="text-orange-500" />
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">UV Index</span>
            </div>
            <div className="text-base font-black text-gray-800">{isToday ? (current?.uv?.toFixed(1) ?? '—') : day.uv?.toFixed(1)}</div>
            <span className={`text-[10px] font-semibold text-white px-1.5 py-0.5 rounded-full ${uv.color}`}>{uv.text}</span>
          </div>
          {/* Cloud cover */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1">
              <Cloud size={12} className="text-blue-400" />
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Clouds</span>
            </div>
            <div className="text-base font-black text-gray-800">{isToday ? `${current?.cloud ?? '—'}%` : '—'}</div>
            <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div className="h-full bg-blue-400 rounded-full"
                initial={{ width: 0 }} animate={{ width: isToday ? `${current?.cloud ?? 0}%` : '0%' }}
                transition={{ duration: 0.8, ease }} />
            </div>
          </div>
          {/* Visibility */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1">
              <Eye size={12} className="text-purple-400" />
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Visibility</span>
            </div>
            <div className="text-base font-black text-gray-800">{isToday ? `${current?.visibility} km` : '—'}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              {isToday && current?.visibility >= 10 ? 'Excellent' : isToday && current?.visibility >= 5 ? 'Good' : isToday ? 'Poor' : ''}
            </div>
          </div>
        </div>

        {/* Sunrise / Sunset */}
        <div className="bg-gradient-to-r from-orange-50 to-indigo-50 rounded-xl p-3 flex items-center justify-between border border-orange-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-300 to-amber-400 flex items-center justify-center">
              <Sunrise size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Sunrise</p>
              <p className="text-sm font-bold text-gray-800">{day.sunrise}</p>
            </div>
          </div>
          {/* Day arc */}
          <div className="flex-1 mx-4 relative h-0.5 bg-gradient-to-r from-orange-300 via-yellow-300 to-indigo-400 rounded-full">
            <motion.div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full shadow-md border-2 border-white"
              animate={{ left: isToday ? `${Math.min(100, Math.max(0, ((new Date().getHours() - 6) / 12) * 100))}%` : '50%' }}
              transition={{ duration: 1, ease }} />
          </div>
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide text-right">Sunset</p>
              <p className="text-sm font-bold text-gray-800 text-right">{day.sunset}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <Sunset size={16} className="text-white" />
            </div>
          </div>
        </div>

        {/* Hourly strip (today only) */}
        {isToday && todayHourly.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Today's Hourly</p>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {todayHourly.map((h, i) => {
                const hConf = getConfig(h.code);
                const HIcon = hConf.Icon;
                const isNow = i === 0;
                return (
                  <motion.div key={h.hourOfDay}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease, delay: i * 0.04 }}
                    title={h.desc}
                    className={`flex-shrink-0 flex flex-col items-center gap-1 rounded-xl px-3 py-2 ${isNow ? `bg-gradient-to-b ${hConf.gradient} text-white` : 'bg-gray-50 text-gray-700'}`}
                  >
                    <span className={`text-[10px] font-semibold ${isNow ? 'text-white/80' : 'text-gray-400'}`}>
                      {isNow ? 'Now' : `${h.hourOfDay % 12 || 12}${h.hourOfDay >= 12 ? 'pm' : 'am'}`}
                    </span>
                    <HIcon size={16} className={isNow ? 'text-white' : hConf.text} />
                    <span className="text-xs font-bold">{h.temp}°</span>
                    {h.rain > 0 && (
                      <span className={`text-[9px] font-semibold ${isNow ? 'text-white/70' : 'text-blue-400'}`}>{h.rain}%</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── 5-day Selector ── */}
      <div className="px-4 py-4 mt-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">5-Day Forecast</p>
        <div className="grid grid-cols-5 gap-1">
          {weatherData.map((d, i) => {
            const { Icon: DIcon, gradient: dGrad, bg: dBg, text: dText } = d.config;
            const isSel = selectedDay === i;
            return (
              <motion.button key={i} onClick={() => setSelectedDay(i)}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease, delay: 0.25 + i * 0.06 }}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-colors duration-200 focus:outline-none ${
                  isSel ? `bg-gradient-to-b ${dGrad} text-white shadow-md` : `${dBg} ${dText}`
                }`}>
                <span className={`text-[10px] font-semibold ${isSel ? 'text-white' : 'text-gray-400'}`}>{i === 0 ? 'Today' : d.day}</span>
                <DIcon size={17} className={isSel ? 'text-white' : ''} />
                <span className={`text-xs font-bold ${isSel ? 'text-white' : 'text-gray-700'}`}>{d.temp}°</span>
                {d.rainProb > 0 && (
                  <span className={`text-[9px] font-semibold ${isSel ? 'text-white/70' : 'text-blue-400'}`}>{d.rainProb}%</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;