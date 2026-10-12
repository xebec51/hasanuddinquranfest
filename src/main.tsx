import { createRoot } from 'react-dom/client'
import { ArrowRight } from 'lucide-react'
import './styles.css'
function App() { return <main className="min-h-screen bg-emerald-950 px-6 py-24 text-white"><section className="mx-auto max-w-3xl text-center"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">Universitas Hasanuddin</p><h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Hasanuddin Qur'an Fest 2026</h1><p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-emerald-100">Fondasi project berhasil disiapkan. Konten dan desain HQF akan dibangun di atas struktur ini.</p><button className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-semibold text-emerald-950" type="button">Mulai eksplorasi <ArrowRight size={18} /></button></section></main> }
createRoot(document.getElementById('root')!).render(<App />)
