import { Calendar, Link as LinkIcon, Send } from 'lucide-react'

export default function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">Unified Calendar</h1>
          <p className="text-xs text-blue-200/80 -mt-0.5">Connect OTAs • View • Automate</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-blue-200/80 text-xs">
        <LinkIcon className="w-4 h-4" />
        <span>Google Sheets & WhatsApp automation</span>
        <Send className="w-4 h-4" />
      </div>
    </header>
  )
}
