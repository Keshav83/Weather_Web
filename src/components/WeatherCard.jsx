import React, { useEffect, useState } from 'react'
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Droplet } from 'lucide-react'

function weatherCodeToIcon(code) {
  // Open-Meteo weather codes simplified
  if (code === 0) return <Sun className="w-20 h-20" />
  if (code === 1 || code === 2 || code === 3) return <Cloud className="w-20 h-20" />
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain className="w-20 h-20" />
  if (code >= 71 && code <= 77) return <CloudSnow className="w-20 h-20" />
  if (code >= 95) return <CloudLightning className="w-20 h-20" />
  return <Sun className="w-20 h-20" />
}

function weatherCodeToText(code) {
  const map = {
    0: 'Clear',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Rain showers',
    81: 'Moderate showers',
    82: 'Violent showers',
    95: 'Thunderstorm',
  }
  return map[code] || 'Weather'
}

export default function WeatherCard({ location, weatherData }) {
  const [nowStr, setNowStr] = useState('')

  useEffect(() => {
    if (!location || !weatherData) return
    let mounted = true
    function update() {
      try {
        const tz = weatherData.timezone || 'UTC'
        const formatter = new Intl.DateTimeFormat(undefined, {
          timeZone: tz,
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false,
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        })
        const now = formatter.format(new Date())
        if (mounted) setNowStr(now)
      } catch (e) {
        setNowStr(new Date().toLocaleString())
      }
    }
    update()
    const id = setInterval(update, 1000)
    return () => { mounted = false; clearInterval(id) }
  }, [location, weatherData])

  if (!location || !weatherData) return null

  const cw = weatherData.current_weather
  if (!cw) return null

  return (
    <div className="glass p-6 rounded-3xl shadow-xl max-w-3xl mx-auto mt-8 border border-white/30">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <div className="bg-gradient-to-br from-yellow-300 to-orange-300 p-4 rounded-2xl text-white shadow-inner">
            {weatherCodeToIcon(cw.weathercode)}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-semibold">{location.name}, {location.country}</h2>
              <p className="text-sm text-gray-600">{weatherCodeToText(cw.weathercode)}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{Math.round(cw.temperature)}°C</div>
              <div className="text-sm text-gray-600">Feels like — N/A</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5" /> {cw.windspeed} m/s
            </div>
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5" /> Humidity N/A
            </div>
            <div className="text-right">{nowStr}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
