import { useState } from 'react'
import { Sheet, Phone, Send } from 'lucide-react'

export default function AutomationPanel({ listingId }) {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [webhook, setWebhook] = useState('')
  const [rangeDays, setRangeDays] = useState(30)
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const exportToSheet = async () => {
    setStatus('Sending to webhook…')
    try {
      const res = await fetch(`${backend}/api/export-to-sheet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhook_url: webhook, range_days: Number(rangeDays), listing_id: listingId || null })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      setStatus(`Sent ${data.sent} rows to the webhook`)
    } catch (e) { setStatus('Error: ' + e.message) }
  }

  const sendWhatsApp = async () => {
    setStatus('Sending WhatsApp…')
    try {
      const res = await fetch(`${backend}/api/whatsapp/send-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient_phone: recipient, message, listing_id: listingId || null })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      setStatus(`WhatsApp sent (${data.message_length} chars)`)    
    } catch (e) { setStatus('Error: ' + e.message) }
  }

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4 space-y-4">
      <h3 className="text-blue-100 font-semibold">Automation</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-blue-200/80 text-sm mb-2 inline-flex items-center gap-2"><Sheet className="w-4 h-4"/> Export to Google Sheets (via webhook)</div>
          <input className="w-full bg-slate-900/70 border border-slate-700/70 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/40 mb-2" placeholder="Apps Script Web App URL" value={webhook} onChange={e=>setWebhook(e.target.value)} />
          <input type="number" className="w-full bg-slate-900/70 border border-slate-700/70 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/40 mb-2" placeholder="Days ahead" value={rangeDays} onChange={e=>setRangeDays(e.target.value)} />
          <button onClick={exportToSheet} className="w-full bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg">Export</button>
        </div>
        <div>
          <div className="text-blue-200/80 text-sm mb-2 inline-flex items-center gap-2"><Phone className="w-4 h-4"/> Send schedule via WhatsApp Business</div>
          <input className="w-full bg-slate-900/70 border border-slate-700/70 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/40 mb-2" placeholder="Recipient phone (+1...)" value={recipient} onChange={e=>setRecipient(e.target.value)} />
          <textarea className="w-full bg-slate-900/70 border border-slate-700/70 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-300/40 mb-2" placeholder="Optional custom message, leave empty to auto-generate" value={message} onChange={e=>setMessage(e.target.value)} />
          <button onClick={sendWhatsApp} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg inline-flex items-center justify-center gap-2"><Send className="w-4 h-4"/> Send</button>
        </div>
      </div>
      {status && <div className="text-blue-200/80 text-sm">{status}</div>}
    </div>
  )
}
