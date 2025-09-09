import React, { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import { geocodeCity, getCurrentWeather } from './api/weather'

export default function App() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selected, setSelected] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query) return
    let cancelled = false
    const t = setTimeout(async () => {
      try {
        const res = await geocodeCity(query)
        if (!cancelled) setSuggestions(res)
      } catch (e) {
        console.error(e)
      }
    }, 400)
    return () => { cancelled = true; clearTimeout(t) }
  }, [query])

  async function handleSearch(q) {
    setQuery(q)
    setLoading(true)
    setError(null)
    try {
      const res = await geocodeCity(q)
      setSuggestions(res)
      if (res.length > 0) {
        chooseLocation(res[0])
      } else {
        setError('No location found')
      }
    } catch (e) {
      setError('Failed to search')
    } finally { setLoading(false) }
  }

  async function chooseLocation(loc) {
    setSelected(loc)
    setWeather(null)
    setError(null)
    try {
      setLoading(true)
      const w = await getCurrentWeather(loc.latitude, loc.longitude)
      setWeather(w)
    } catch (e) {
      console.error(e)
      setError('Could not fetch weather')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <header className="w-full max-w-4xl">
        <div className="py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold">Fancy Weather</h1>
            <p className="text-sm text-gray-600">Search any city — powered by free Open-Meteo APIs</p>
          </div>
        </div>

        <div className="mt-4">
          <SearchBar onSearch={handleSearch} />

          {/* suggestions */}
          {suggestions && suggestions.length > 0 && (
            <div className="mt-3 max-w-2xl mx-auto bg-white/60 rounded-xl p-3 shadow-sm border border-white/30">
              {suggestions.map((s) => (
                <button key={`${s.id}-${s.latitude}-${s.longitude}`} onClick={() => chooseLocation(s)} className="w-full text-left p-2 rounded-lg hover:bg-indigo-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{s.name}{s.admin1 ? `, ${s.admin1}` : ''}</div>
                      <div className="text-xs text-gray-600">{s.country} — {s.latitude.toFixed(2)}, {s.longitude.toFixed(2)}</div>
                    </div>
                    <div className="text-sm text-gray-500">Select</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {loading && <div className="mt-6 text-center text-gray-500">Loading...</div>}
          {error && <div className="mt-6 text-center text-red-500">{error}</div>}
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl">
        {selected && weather && (
          <WeatherCard location={selected} weatherData={weather} />
        )}

        {!selected && (
          <div className="mt-12 text-center text-gray-700">
            <div className="text-2xl font-semibold">Search for a city to see the current weather</div>
            <p className="mt-4">No API keys — free to use. Try: <span className="font-medium">New Delhi, London, Tokyo</span></p>
          </div>
        )}
      </main>

      <footer className="w-full max-w-4xl text-center py-6 text-sm text-gray-600">
        Built with ❤️ using Open-Meteo
      </footer>
    </div>
  )
}
