import { useEffect, useState } from 'react'

export default function CalendarView({ listingId }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const qs = listingId ? `?listing_id=${encodeURIComponent(listingId)}` : ''
      const res = await fetch(`${backend}/api/events${qs}`)
      const data = await res.json()
      setEvents(data.events || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [listingId])

  const colorFor = (ev) => ev?.source?.color || ev?.listing?.color || '#60a5fa'

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-blue-100 font-semibold">Unified Calendar</h3>
        <button onClick={fetchEvents} className="text-blue-300 hover:text-white">Refresh</button>
      </div>
      {loading ? (
        <p className="text-blue-200/70">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {events.map(ev => (
            <div key={ev.id} className="rounded-lg p-3" style={{backgroundColor: colorFor(ev)+"22", border:`1px solid ${colorFor(ev)}55`}}>
              <div className="text-xs text-blue-200/70">{ev.listing?.name || 'Listing'} • {ev.source?.name || 'Source'}</div>
              <div className="text-white font-medium">{ev.title}</div>
              <div className="text-blue-200/80 text-sm">
                {ev.all_day ? 'All day' : `${new Date(ev.start).toLocaleString()} → ${new Date(ev.end).toLocaleString()}`}
              </div>
              {ev.location && <div className="text-blue-300/70 text-xs">{ev.location}</div>}
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-blue-200/70">No events yet. Add a source and sync.</div>
          )}
        </div>
      )}
    </div>
  )
}
