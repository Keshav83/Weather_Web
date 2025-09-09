import React, { useState } from 'react'

export default function SearchBar({ onSearch, placeholder = 'Search city...' }) {
  const [q, setQ] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!q.trim()) return
    onSearch(q.trim())
  }

  return (
    <form onSubmit={submit} className="w-full max-w-2xl mx-auto flex gap-3">
      <input
        aria-label="Search city"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="flex-1 p-3 rounded-xl shadow-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-300"
        placeholder={placeholder}
      />
      <button className="px-4 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700">Search</button>
    </form>
  )
}
