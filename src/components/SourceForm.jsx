import { useState } from 'react'
import { Link as LinkIcon, Plus, RefreshCw } from 'lucide-react'

export default function SourceForm({ onAdded, onSync }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [color, setColor] = useState('#60a5fa')
  const [loading, setLoading] = useState(false)
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const addSource = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, color, source_type: 'ical' })
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
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
      <form onSubmit={addSource} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input className="bg-slate-900/70 border border-slate-700/70 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                 placeholder="Source name"
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
      <button onClick={onSync} className="mt-3 inline-flex items-center gap-2 text-blue-300 hover:text-white transition">
        <RefreshCw className="w-4 h-4" /> Sync now
      </button>
    </div>
  )
}
