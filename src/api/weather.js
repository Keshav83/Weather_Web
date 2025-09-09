import axios from 'axios'

// Geocoding (Open-Meteo free geocoding API)
export async function geocodeCity(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
  const res = await axios.get(url)
  return res.data.results || []
}

// Current weather (Open-Meteo free forecast API)
export async function getCurrentWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
  const res = await axios.get(url)
  return res.data
}
