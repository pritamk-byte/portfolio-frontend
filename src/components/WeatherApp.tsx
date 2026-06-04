'use client';
import { useState, useEffect } from 'react';
import { CloudSun, CloudRain, Wind, Droplets, Sun, Calendar, Clock, Cloud, CloudLightning, Snowflake, Loader2 } from 'lucide-react';

// Fallback data so the app never looks "broken" to a recruiter
const FALLBACK_DATA = {
  city: 'San Francisco', temp: 68, condition: 'Partly Cloudy', high: 72, low: 54, wind: 12, humidity: 45,
  hourly: [
    { time: 'Now', temp: 68, icon: '02d' }, { time: '1 PM', temp: 70, icon: '01d' },
    { time: '2 PM', temp: 72, icon: '01d' }, { time: '3 PM', temp: 71, icon: '02d' }, { time: '4 PM', temp: 69, icon: '10d' }
  ],
  daily: [
    { day: 'Today', min: 54, max: 72, icon: '02d' }, { day: 'Tue', min: 56, max: 75, icon: '01d' },
    { day: 'Wed', min: 52, max: 64, icon: '10d' }, { day: 'Thu', min: 50, max: 68, icon: '02d' },
    { day: 'Fri', min: 55, max: 74, icon: '01d' }, { day: 'Sat', min: 58, max: 77, icon: '01d' }, { day: 'Sun', min: 57, max: 73, icon: '02d' }
  ]
};

// Maps OpenWeather API icon codes to our beautiful Lucide React icons
const getWeatherIcon = (iconCode: string) => {
  const code = iconCode.slice(0, 2);
  switch (code) {
    case '01': return { Icon: Sun, color: "text-yellow-400" }; // clear sky
    case '02': return { Icon: CloudSun, color: "text-yellow-400" }; // few clouds
    case '03': 
    case '04': return { Icon: Cloud, color: "text-zinc-300" }; // scattered/broken clouds
    case '09': 
    case '10': return { Icon: CloudRain, color: "text-blue-400" }; // rain
    case '11': return { Icon: CloudLightning, color: "text-purple-400" }; // thunderstorm
    case '13': return { Icon: Snowflake, color: "text-blue-200" }; // snow
    default: return { Icon: CloudSun, color: "text-zinc-300" };
  }
};

export default function WeatherApp() {
  const [weather, setWeather] = useState(FALLBACK_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        if (!API_KEY) throw new Error("No API Key configured.");

        // Fetch Current Weather
        const currRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`);
        const currData = await currRes.json();

        // Fetch 5 Day / 3 Hour Forecast
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`);
        const forecastData = await forecastRes.json();

        // Parse Hourly (Next 5 intervals)
        const hourly = forecastData.list.slice(0, 5).map((item: any) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric' }),
          temp: Math.round(item.main.temp),
          icon: item.weather[0].icon
        }));
        hourly[0].time = 'Now';

        // Parse Daily (Find min/max per day)
        const dailyMap = new Map();
        forecastData.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short' });
          if (!dailyMap.has(date)) dailyMap.set(date, { min: item.main.temp, max: item.main.temp, icon: item.weather[0].icon });
          else {
            const existing = dailyMap.get(date);
            existing.min = Math.min(existing.min, item.main.temp);
            existing.max = Math.max(existing.max, item.main.temp);
          }
        });
        
        const daily = Array.from(dailyMap, ([day, data]) => ({
          day, min: Math.round(data.min), max: Math.round(data.max), icon: data.icon
        })).slice(0, 7);
        daily[0].day = 'Today';

        setWeather({
          city: currData.name,
          temp: Math.round(currData.main.temp),
          condition: currData.weather[0].main,
          high: Math.round(currData.main.temp_max),
          low: Math.round(currData.main.temp_min),
          wind: Math.round(currData.wind.speed),
          humidity: currData.main.humidity,
          hourly,
          daily
        });
      } catch (err) {
        console.warn("Failed to fetch live weather, using fallback data.");
        setErrorMsg("Using offline preview data.");
      } finally {
        setIsLoading(false);
      }
    };

    // Request User Location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
        () => {
          console.warn("Location denied, using fallback data.");
          setIsLoading(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  const CurrentIconData = getWeatherIcon(weather.hourly[0]?.icon || '02d');
  const CurrentIcon = CurrentIconData.Icon;

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white overflow-hidden select-none font-sans relative">
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-blue-400 mb-4" size={32} />
          <p className="text-sm font-medium animate-pulse text-blue-200">Locating satellites...</p>
        </div>
      )}

      {/* Left Column: Current Weather */}
      <div className="flex-1 p-6 sm:p-8 md:border-r border-white/10 flex flex-col justify-between relative overflow-y-auto custom-scrollbar min-h-0">
        <div className="absolute top-10 right-10 w-32 h-32 sm:w-48 sm:h-48 bg-blue-500/20 blur-[60px] sm:blur-[80px] rounded-full pointer-events-none"></div>

        <div className="mt-2 sm:mt-0 flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight mb-1">{weather.city}</h1>
            <p className="text-blue-200 text-sm sm:text-base">Local Conditions</p>
          </div>
          {errorMsg && <div className="text-[10px] bg-white/10 px-2 py-1 rounded text-blue-200">{errorMsg}</div>}
        </div>

        <div className="my-8 sm:my-12">
          <div className="flex items-center gap-4 sm:gap-6 mb-4">
            <CurrentIcon size={64} className={`${CurrentIconData.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] sm:w-[84px] sm:h-[84px] shrink-0`} strokeWidth={1} />
            <div>
              <div className="text-6xl sm:text-7xl font-light tracking-tighter">{weather.temp}°</div>
              <div className="text-lg sm:text-xl font-medium text-blue-100">{weather.condition}</div>
            </div>
          </div>
          <div className="flex gap-4 text-xs sm:text-sm font-medium text-blue-200/80">
            <span>H: {weather.high}°</span>
            <span>L: {weather.low}°</span>
          </div>
        </div>

        {/* Current Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/5">
            <div className="flex items-center gap-2 text-blue-200 mb-1.5 sm:mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <Wind size={14} /> Wind
            </div>
            <div className="text-xl sm:text-2xl font-medium">{weather.wind} <span className="text-xs sm:text-sm text-blue-200/70">mph</span></div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/5">
            <div className="flex items-center gap-2 text-blue-200 mb-1.5 sm:mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <Droplets size={14} /> Humidity
            </div>
            <div className="text-xl sm:text-2xl font-medium">{weather.humidity}<span className="text-xs sm:text-sm text-blue-200/70">%</span></div>
          </div>
        </div>
      </div>

      {/* Right Column: Forecasts */}
      <div className="w-full md:w-80 bg-black/20 backdrop-blur-3xl flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
        
        {/* Hourly Forecast */}
        <div className="p-4 sm:p-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2 text-blue-200 mb-4 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <Clock size={14} /> Hourly Forecast
          </div>
          <div className="flex justify-between items-center gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-2">
            {weather.hourly.map((item, i) => {
              const { Icon, color } = getWeatherIcon(item.icon);
              return (
                <div key={i} className="flex flex-col items-center gap-3 shrink-0 min-w-[45px]">
                  <span className="text-[11px] sm:text-xs text-blue-200 font-medium">{item.time}</span>
                  <Icon size={20} className={color} />
                  <span className="text-xs sm:text-sm font-semibold">{item.temp}°</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Multi-Day Forecast */}
        <div className="p-4 sm:p-6 shrink-0">
          <div className="flex items-center gap-2 text-blue-200 mb-4 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <Calendar size={14} /> Extended Forecast
          </div>
          <div className="space-y-3 sm:space-y-4">
            {weather.daily.map((day, i) => {
              const { Icon, color } = getWeatherIcon(day.icon);
              return (
                <div key={i} className="flex items-center justify-between group">
                  <span className="w-10 sm:w-12 text-xs sm:text-sm font-medium text-blue-100">{day.day}</span>
                  <Icon size={16} className={`sm:w-[18px] sm:h-[18px] ${color}`} />
                  <div className="flex items-center gap-2 sm:gap-3 w-28 sm:w-32">
                    <span className="text-[10px] sm:text-xs text-blue-300/70 w-5 sm:w-6 text-right">{day.min}°</span>
                    <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full" style={{ width: `${Math.min(100, Math.max(10, ((day.max - day.min) / 40) * 100))}%`, marginLeft: 'auto', marginRight: 'auto' }}></div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-white font-medium w-5 sm:w-6">{day.max}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}