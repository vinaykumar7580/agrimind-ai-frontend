"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  Search, Microscope, Layers, ChevronRight, TrendingUp, AlertTriangle,
  CheckCircle, Download, X,
} from "lucide-react";
import { toast } from "sonner";
import { backendAsset, fetchJson, formatClock, formatDate, parseUtc } from "../../lib/format";

const PAGE_SIZE = 20;

const severityColor = { none: '#52C455', low: '#6B9FD4', medium: '#E8A020', high: '#E84040' };
const severityBg = { none: 'rgba(82,196,85,0.1)', low: 'rgba(107,159,212,0.1)', medium: 'rgba(232,160,32,0.1)', high: 'rgba(232,64,64,0.1)' };
const statusLabel = {
  treated: { label: 'Treated', color: '#52C455', bg: 'rgba(82,196,85,0.1)' },
  pending: { label: 'Action Needed', color: '#E8A020', bg: 'rgba(232,160,32,0.1)' },
  healthy: { label: 'Healthy', color: '#52C455', bg: 'rgba(82,196,85,0.1)' },
};
const nutrientNames = {
  nitrogen: 'Nitrogen', phosphorus: 'Phosphorus', potassium: 'Potassium',
  organic_matter: 'Organic Matter', moisture: 'Moisture', ec: 'EC',
};

const healthColor = (h) => (h > 70 ? '#52C455' : h > 50 ? '#E8A020' : '#E84040');

// Soil scans keep their details inside soil_data and have no severity, so
// derive a name, an issue line and a severity from the nutrient statuses.
function describeScan(scan) {
  if (scan.scan_type === 'crop') {
    return {
      name: scan.crop_name || 'Unknown crop',
      issue: scan.disease || 'Healthy',
      severity: scan.severity || 'none',
    };
  }

  const data = scan.soil_data || {};
  const issues = [];
  if (data.ph && data.ph.status && data.ph.status !== 'good') {
    issues.push(`${cap(data.ph.status)} pH`);
  }
  Object.entries(data.nutrients || {}).forEach(([key, n]) => {
    if (n?.status && n.status !== 'good') issues.push(`${cap(n.status)} ${nutrientNames[key] || key}`);
  });

  return {
    name: `${data.soil_type || 'Soil'} soil`,
    issue: issues.length ? issues.join(', ') : 'Healthy',
    severity: issues.length === 0 ? 'none' : issues.length === 1 ? 'low' : 'medium',
  };
}

const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

function ScanDetail({ scan, onClose, onStatusChange, updating }) {
  const info = describeScan(scan);
  const created = parseUtc(scan.created_at);
  const image = backendAsset(scan.image_url);
  const soil = scan.soil_data || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-xl rounded-2xl overflow-hidden flex flex-col"
        style={{ background: '#111E11', border: '1px solid rgba(61,154,64,0.25)', maxHeight: '90vh' }}>

        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(61,154,64,0.12)' }}>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#F0EBE0' }}>{info.name}</p>
            <p className="text-xs" style={{ color: '#6B8F6B' }}>
              {[scan.location, `${formatDate(created)} at ${formatClock(created)}`].filter(Boolean).join(' · ')}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(232,64,64,0.1)', border: '1px solid rgba(232,64,64,0.2)' }}>
            <X size={15} style={{ color: '#E84040' }} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 space-y-4">
          {image && (
            <div className="rounded-xl overflow-hidden" style={{ height: '200px' }}>
              <img src={image} alt={info.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-1 rounded-full font-medium"
              style={{ background: severityBg[info.severity], color: severityColor[info.severity] }}>
              {info.issue}
            </span>
            {scan.health_score != null && (
              <span className="text-xs font-semibold" style={{ color: healthColor(scan.health_score) }}>
                Health {scan.health_score}/100
              </span>
            )}
          </div>

          {scan.ai_summary && (
            <p className="text-sm" style={{ color: '#8FAF8F', lineHeight: '1.7' }}>{scan.ai_summary}</p>
          )}

          {scan.scan_type === 'crop' && scan.findings?.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#6B8F6B' }}>AI FINDINGS</p>
              <div className="space-y-2">
                {scan.findings.map((f, i) => (
                  <div key={i} className="card p-3">
                    <p className="text-sm font-medium" style={{ color: '#F0EBE0' }}>{f.label}</p>
                    {f.desc && <p className="text-xs" style={{ color: '#6B8F6B' }}>{f.desc}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {scan.scan_type === 'crop' && scan.treatment?.length > 0 && (
            <div className="rounded-xl p-4" style={{ background: 'rgba(61,154,64,0.08)', border: '1px solid rgba(61,154,64,0.2)' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: '#52C455' }}>TREATMENT PLAN</p>
              <div className="space-y-2">
                {scan.treatment.map(({ step, action, urgent }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xs px-2 py-1 rounded-lg flex-shrink-0 font-medium"
                      style={{ background: urgent ? 'rgba(232,64,64,0.15)' : 'rgba(61,154,64,0.12)', color: urgent ? '#E84040' : '#52C455' }}>
                      {step}
                    </span>
                    <p className="text-xs" style={{ color: '#8FAF8F', lineHeight: '1.6' }}>{action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {scan.scan_type === 'soil' && (
            <div className="grid grid-cols-2 gap-2">
              {soil.ph && (
                <div className="card p-3">
                  <p className="text-xs" style={{ color: '#6B8F6B' }}>pH</p>
                  <p className="text-sm font-semibold" style={{ color: '#F0EBE0' }}>{soil.ph.value}</p>
                </div>
              )}
              {Object.entries(soil.nutrients || {}).map(([key, n]) => (
                <div key={key} className="card p-3">
                  <p className="text-xs" style={{ color: '#6B8F6B' }}>{nutrientNames[key] || key}</p>
                  <p className="text-sm font-semibold" style={{ color: n?.status && n.status !== 'good' ? '#E8A020' : '#F0EBE0' }}>
                    {n?.value} {n?.unit}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(61,154,64,0.12)' }}>
          <p className="text-xs mb-2" style={{ color: '#6B8F6B' }}>Mark this scan as</p>
          <div className="flex gap-2">
            {['pending', 'treated', 'healthy'].map(s => (
              <button key={s} onClick={() => onStatusChange(scan, s)}
                disabled={updating || scan.status === s}
                className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: scan.status === s ? statusLabel[s].bg : 'rgba(0,0,0,0.2)',
                  border: `1px solid ${scan.status === s ? statusLabel[s].color + '55' : 'rgba(61,154,64,0.15)'}`,
                  color: scan.status === s ? statusLabel[s].color : '#6B8F6B',
                }}>
                {statusLabel[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [scans, setScans] = useState([]);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('loading');
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const requestId = useRef(0);

  // Wait for a pause in typing before searching the server.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadStats = () =>
    fetchJson('/api/scans/stats').then(setStats).catch(err => console.error(err));

  useEffect(() => { loadStats(); }, []);

  const pagePath = (skip) => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(PAGE_SIZE) });
    if (filter !== 'all') params.set('scan_type', filter);
    if (query) params.set('search', query);
    return `/api/scans/history?${params}`;
  };

  // Reload from the first page whenever the filter or search changes. The
  // request id drops responses that arrive after a newer request started.
  useEffect(() => {
    const id = ++requestId.current;
    setStatus('loading');

    fetchJson(pagePath(0))
      .then(page => {
        if (id !== requestId.current) return;
        setScans(page);
        setHasMore(page.length === PAGE_SIZE);
        setStatus('ready');
      })
      .catch(err => {
        if (id !== requestId.current) return;
        console.error(err);
        setStatus('error');
      });
  }, [filter, query]);

  const loadMore = async () => {
    const id = requestId.current;
    setLoadingMore(true);
    try {
      const page = await fetchJson(pagePath(scans.length));
      if (id !== requestId.current) return;
      setScans(prev => {
        const ids = new Set(prev.map(s => s.id));
        return [...prev, ...page.filter(s => !ids.has(s.id))];
      });
      setHasMore(page.length === PAGE_SIZE);
    } catch (err) {
      console.error(err);
      toast.error('Could not load more scans');
    } finally {
      setLoadingMore(false);
    }
  };

  const changeStatus = async (scan, newStatus) => {
    setUpdating(true);
    try {
      await fetchJson(`/api/scans/${scan.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const update = s => (s.id === scan.id ? { ...s, status: newStatus } : s);
      setScans(prev => prev.map(update));
      setSelected(prev => (prev ? update(prev) : prev));
      loadStats();
      toast.success(`Marked as ${statusLabel[newStatus].label}`);
    } catch (err) {
      console.error(err);
      toast.error('Could not update the status');
    } finally {
      setUpdating(false);
    }
  };

  const filtering = filter !== 'all' || query;

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />

      {selected && (
        <ScanDetail scan={selected} onClose={() => setSelected(null)}
          onStatusChange={changeStatus} updating={updating} />
      )}

      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-28 pb-20">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1" style={{ color: '#F0EBE0' }}>Scan History</h1>
            <p className="text-sm" style={{ color: '#6B8F6B' }}>All your crop and soil analyses in one place</p>
          </div>
          <a href="/api/scans/export" download
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0"
            style={{ background: 'rgba(61,154,64,0.1)', border: '1px solid rgba(61,154,64,0.25)', color: '#52C455' }}>
            <Download size={14} /> Export CSV
          </a>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Scans', value: stats?.total, icon: Microscope, color: '#52C455' },
            { label: 'Healthy', value: stats?.healthy, icon: CheckCircle, color: '#52C455' },
            { label: 'Treated', value: stats?.treated, icon: TrendingUp, color: '#6B9FD4' },
            { label: 'Action Needed', value: stats?.pending, icon: AlertTriangle, color: '#E8A020' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs" style={{ color: '#6B8F6B' }}>{label}</p>
                <Icon size={14} style={{ color }} />
              </div>
              <p className="font-display text-2xl font-bold" style={{ color }}>{value ?? '—'}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B8F6B' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by crop, issue, soil type or location..."
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
        {status === 'loading' && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="shimmer rounded-xl h-20" />)}
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-16">
            <p className="font-semibold" style={{ color: '#6B8F6B' }}>Could not load your scans</p>
            <p className="text-sm mt-1" style={{ color: '#3D5A3E' }}>Please refresh the page to try again</p>
          </div>
        )}

        {status === 'ready' && (
          <div className="space-y-3">
            {scans.map(scan => {
              const info = describeScan(scan);
              const st = statusLabel[scan.status] || statusLabel.pending;
              const created = parseUtc(scan.created_at);
              const image = backendAsset(scan.image_url);
              const health = scan.health_score;

              return (
                <div key={scan.id} onClick={() => setSelected(scan)} className="card card-hover p-4 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(61,154,64,0.15)' }}>
                      {image
                        ? <img src={image} alt="" className="w-full h-full object-cover" />
                        : scan.scan_type === 'crop' ? '🌿' : '🪨'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-semibold text-sm" style={{ color: '#F0EBE0' }}>{info.name}</p>
                            <span className="text-xs px-1.5 py-0.5 rounded-full"
                              style={{ background: scan.scan_type === 'crop' ? 'rgba(82,196,85,0.1)' : 'rgba(107,159,212,0.1)', color: scan.scan_type === 'crop' ? '#52C455' : '#6B9FD4' }}>
                              {scan.scan_type === 'crop'
                                ? <span className="flex items-center gap-1"><Microscope size={9} /> Crop</span>
                                : <span className="flex items-center gap-1"><Layers size={9} /> Soil</span>}
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: '#6B8F6B' }}>
                            {[scan.location, `${formatDate(created)} at ${formatClock(created)}`].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ background: severityBg[info.severity], color: severityColor[info.severity] }}>
                            {info.issue}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ background: st.bg, color: st.color }}>
                            {st.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        {health != null ? (
                          <>
                            <div className="flex-1 rounded-full h-1.5" style={{ background: 'rgba(61,154,64,0.1)' }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${health}%`, background: healthColor(health) }} />
                            </div>
                            <span className="text-xs font-semibold flex-shrink-0" style={{ color: healthColor(health) }}>
                              {health}/100
                            </span>
                          </>
                        ) : <div className="flex-1" />}
                        <ChevronRight size={14} style={{ color: '#3D5A3E' }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {hasMore && (
              <div className="flex justify-center pt-2">
                <button onClick={loadMore} disabled={loadingMore}
                  className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ background: 'rgba(61,154,64,0.1)', border: '1px solid rgba(61,154,64,0.25)', color: '#52C455' }}>
                  {loadingMore ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}

            {scans.length === 0 && (
              <div className="text-center py-16">
                <p className="text-2xl mb-3">{filtering ? '🔍' : '🌱'}</p>
                <p className="font-semibold" style={{ color: '#6B8F6B' }}>
                  {filtering ? 'No results found' : 'No scans yet'}
                </p>
                <p className="text-sm mt-1" style={{ color: '#3D5A3E' }}>
                  {filtering ? 'Try a different search or filter' : 'Upload a crop or soil photo on the home page to get started'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
