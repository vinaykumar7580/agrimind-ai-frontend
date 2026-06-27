"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { Search, Filter, Calendar, Microscope, Layers, ChevronRight, TrendingUp, AlertTriangle, CheckCircle, Download } from "lucide-react";

const scans = [
  { id: 1, type: 'crop', crop: 'Tomato', issue: 'Early Blight', severity: 'medium', health: 68, date: 'Jun 25, 2026', time: '09:14 AM', image: '🍅', status: 'treated', location: 'Field A' },
  { id: 2, type: 'soil', crop: 'Wheat Field', issue: 'Low Phosphorus', severity: 'low', health: 74, date: 'Jun 22, 2026', time: '07:30 AM', image: '🌾', status: 'pending', location: 'Field B' },
  { id: 3, type: 'crop', crop: 'Soybean', issue: 'Healthy', severity: 'none', health: 92, date: 'Jun 18, 2026', time: '11:00 AM', image: '🌿', status: 'healthy', location: 'Field C' },
  { id: 4, type: 'crop', crop: 'Onion', issue: 'Thrips Infestation', severity: 'high', health: 45, date: 'Jun 14, 2026', time: '08:45 AM', image: '🧅', status: 'treated', location: 'Field A' },
  { id: 5, type: 'soil', crop: 'Cotton Field', issue: 'High EC Level', severity: 'medium', health: 60, date: 'Jun 10, 2026', time: '06:20 AM', image: '🪴', status: 'pending', location: 'Field D' },
  { id: 6, type: 'crop', crop: 'Sugarcane', issue: 'Red Rot Disease', severity: 'high', health: 38, date: 'Jun 5, 2026', time: '10:15 AM', image: '🎋', status: 'treated', location: 'Field B' },
];

const severityColor = { none: '#52C455', low: '#6B9FD4', medium: '#E8A020', high: '#E84040' };
const severityBg = { none: 'rgba(82,196,85,0.1)', low: 'rgba(107,159,212,0.1)', medium: 'rgba(232,160,32,0.1)', high: 'rgba(232,64,64,0.1)' };
const statusLabel = { treated: { label: 'Treated', color: '#52C455', bg: 'rgba(82,196,85,0.1)' }, pending: { label: 'Action Needed', color: '#E8A020', bg: 'rgba(232,160,32,0.1)' }, healthy: { label: 'Healthy', color: '#52C455', bg: 'rgba(82,196,85,0.1)' } };

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = scans.filter(s =>
    (filter === 'all' || s.type === filter) &&
    (s.crop.toLowerCase().includes(search.toLowerCase()) || s.issue.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: scans.length,
    healthy: scans.filter(s => s.severity === 'none').length,
    treated: scans.filter(s => s.status === 'treated').length,
    pending: scans.filter(s => s.status === 'pending').length,
  };

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-28 pb-20">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1" style={{ color: '#F0EBE0' }}>Scan History</h1>
            <p className="text-sm" style={{ color: '#6B8F6B' }}>All your crop and soil analyses in one place</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(61,154,64,0.1)', border: '1px solid rgba(61,154,64,0.25)', color: '#52C455' }}>
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Scans', value: stats.total, icon: Microscope, color: '#52C455' },
            { label: 'Healthy', value: stats.healthy, icon: CheckCircle, color: '#52C455' },
            { label: 'Treated', value: stats.treated, icon: TrendingUp, color: '#6B9FD4' },
            { label: 'Action Needed', value: stats.pending, icon: AlertTriangle, color: '#E8A020' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs" style={{ color: '#6B8F6B' }}>{label}</p>
                <Icon size={14} style={{ color }} />
              </div>
              <p className="font-display text-2xl font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B8F6B' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by crop or issue..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(61,154,64,0.2)', color: '#F0EBE0', fontFamily: 'Inter' }} />
          </div>
          <div className="flex gap-2">
            {(['all', 'crop', 'soil']).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'tab-active' : ''}`}
                style={{ border: `1px solid ${filter === f ? 'rgba(61,154,64,0.4)' : 'rgba(61,154,64,0.15)'}`, color: filter === f ? '#52C455' : '#6B8F6B', background: filter === f ? 'rgba(61,154,64,0.12)' : 'transparent' }}>
                {f === 'all' ? 'All' : f === 'crop' ? '🌿 Crop' : '🪨 Soil'}
              </button>
            ))}
          </div>
        </div>

        {/* Scan list */}
        <div className="space-y-3">
          {filtered.map(scan => {
            const sev = scan.severity;
            const st = scan.status;
            return (
              <div key={scan.id} className="card card-hover p-4 cursor-pointer">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(61,154,64,0.15)' }}>
                    {scan.image}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm" style={{ color: '#F0EBE0' }}>{scan.crop}</p>
                          <span className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{ background: scan.type === 'crop' ? 'rgba(82,196,85,0.1)' : 'rgba(107,159,212,0.1)', color: scan.type === 'crop' ? '#52C455' : '#6B9FD4' }}>
                            {scan.type === 'crop' ? <span className="flex items-center gap-1"><Microscope size={9} /> Crop</span> : <span className="flex items-center gap-1"><Layers size={9} /> Soil</span>}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: '#6B8F6B' }}>{scan.location} · {scan.date} at {scan.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ background: severityBg[sev], color: severityColor[sev] }}>
                          {scan.issue}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ background: statusLabel[st].bg, color: statusLabel[st].color }}>
                          {statusLabel[st].label}
                        </span>
                      </div>
                    </div>

                    {/* Health bar */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 rounded-full h-1.5" style={{ background: 'rgba(61,154,64,0.1)' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${scan.health}%`, background: scan.health > 70 ? '#52C455' : scan.health > 50 ? '#E8A020' : '#E84040' }} />
                      </div>
                      <span className="text-xs font-semibold flex-shrink-0" style={{ color: scan.health > 70 ? '#52C455' : scan.health > 50 ? '#E8A020' : '#E84040' }}>
                        {scan.health}/100
                      </span>
                      <ChevronRight size={14} style={{ color: '#3D5A3E' }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl mb-3">🔍</p>
            <p className="font-semibold" style={{ color: '#6B8F6B' }}>No results found</p>
            <p className="text-sm mt-1" style={{ color: '#3D5A3E' }}>Try a different search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}