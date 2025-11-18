import { useEffect, useState } from 'react'
import { Link as LinkIcon, Plus, RefreshCw, Home } from 'lucide-react'

export default function SourceForm({ onAdded, onSync }) {
  const [listings, setListings] = useState([])
  const [listingId, setListingId] = useState('')
  const [listingName, setListingName] = useState('')
  const [listingColor, setListingColor] = useState('#60a5fa')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [color, setColor] = useState('#60a5fa')
  const [loading, setLoading] = useState(false)
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const loadListings = async () => {
    try {
      const res = await fetch(`${backend}/api/listings`)
      const data = await res.json()
      setListings(data)
      if (data.length && !listingId) setListingId(data[0].id)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { loadListings() }, [])

  const addListing = async () => {
    if (!listingName) return
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/listings`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: listingName, color: listingColor })
      })
      if (!res.ok) throw new Error(await res.text())
      setListingName('')
      await loadListings()
    } catch (e) { alert('Error: ' + e.message) } finally { setLoading(false) }
  }

  const addSource = async (e) => {
    e.preventDefault()
    if (!listingId) { alert('Select or create a listing first.'); return }
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, name, url, color, source_type: 'ical' })
      })
      if (!res.ok) throw new Error(await res.text())
      setName(''); setUrl('')
      onAdded && onAdded()
    } catch (e) {
      alert('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4 space-y-4">
      <div>
        <div className="text-blue-100 font-semibold mb-2 inline-flex items-center gap-2"><Home className="w-4 h-4"/> Listings</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <select value={listingId} onChange={e=>setListingId(e.target.value)} className="bg-slate-900/70 border border-slate-700/70 rounded-lg px-3 py-2 text-blue-100">
            <option value="">Select listing…</option>
            {listings.map(l => (<option key={l.id} value={l.id}>{l.name}</option>))}
          </select>
          <input className="bg-slate-900/70 border border-slate-700/70 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/40" placeholder="New listing name" value={listingName} onChange={e=>setListingName(e.target.value)} />
          <div className="flex items-center gap-2">
            <input type="color" value={listingColor} onChange={e=>setListingColor(e.target.value)} className="w-10 h-10 rounded" />
            <button type="button" onClick={addListing} disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg disabled:opacity-60">Add Listing</button>
          </div>
        </div>
      </div>

      <form onSubmit={addSource} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input className="bg-slate-900/70 border border-slate-700/70 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                 placeholder="Source name (Airbnb / Booking.com)"
                 value={name}
                 onChange={(e)=>setName(e.target.value)} required />
          <div className="relative">
            <LinkIcon className="w-4 h-4 text-blue-300/60 absolute left-3 top-2.5" />
            <input className="w-full bg-slate-900/70 border border-slate-700/70 rounded-lg pl-9 pr-3 py-2 text-blue-100 placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                   placeholder="iCal URL (Airbnb/Booking/VRBO)"
                   value={url}
                   onChange={(e)=>setUrl(e.target.value)} required />
          </div>
          <div className="flex items-center gap-2">
            <input type="color" value={color} onChange={(e)=>setColor(e.target.value)} className="w-10 h-10 rounded" />
            <button type="submit" disabled={loading} className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white px-3 py-2 rounded-lg transition">
              <Plus className="w-4 h-4" /> Add Source
            </button>
          </div>
        </div>
      </form>
      <button onClick={onSync} className="mt-1 inline-flex items-center gap-2 text-blue-300 hover:text-white transition">
        <RefreshCw className="w-4 h-4" /> Sync now
      </button>
    </div>
  )
}
