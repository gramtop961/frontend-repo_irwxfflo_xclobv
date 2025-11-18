import Header from './components/Header'
import SourceForm from './components/SourceForm'
import CalendarView from './components/CalendarView'
import AutomationPanel from './components/AutomationPanel'
import { useEffect, useState } from 'react'

export default function App() {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [sources, setSources] = useState([])
  const [syncing, setSyncing] = useState(false)

  const loadSources = async () => {
    try {
      const res = await fetch(`${backend}/api/sources`)
      const data = await res.json()
      setSources(data)
    } catch (e) { console.error(e) }
  }

  const syncNow = async () => {
    setSyncing(true)
    try {
      const res = await fetch(`${backend}/api/sync`, { method: 'POST' })
      await res.json()
      await loadSources()
    } catch (e) { console.error(e) }
    finally { setSyncing(false) }
  }

  useEffect(() => { loadSources() }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.15),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.15),transparent_35%)]"/>
      <div className="relative max-w-6xl mx-auto px-6 pb-16">
        <Header />
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-2 space-y-4">
            <SourceForm onAdded={loadSources} onSync={syncNow} />
            <CalendarView />
          </div>
          <div className="space-y-4">
            <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
              <h3 className="text-blue-100 font-semibold mb-2">Connected Sources</h3>
              <ul className="space-y-2">
                {sources.map(s => (
                  <li key={s.id} className="flex items-center justify-between bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: s.color || '#60a5fa'}}></span>
                      <span className="text-blue-100">{s.name}</span>
                    </div>
                    <a href={s.url} target="_blank" className="text-blue-300/80 text-xs hover:text-white">Open</a>
                  </li>
                ))}
                {sources.length === 0 && <li className="text-blue-200/70">No sources connected yet.</li>}
              </ul>
              <button onClick={syncNow} disabled={syncing} className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-3 py-2 rounded-lg">{syncing ? 'Syncing…' : 'Sync calendars'}</button>
            </div>

            <AutomationPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
