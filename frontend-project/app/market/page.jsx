"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { TrendingUp, TrendingDown, Minus, IndianRupee, RefreshCw, MapPin, BarChart3 } from "lucide-react";
import { fetchJson, formatDate } from "../../lib/format";

const CATEGORY_ORDER = ['Cereals', 'Oilseeds', 'Vegetables', 'Pulses', 'Cash Crops', 'Fibre'];
const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };
const trendColor = { up: '#52C455', down: '#E84040', flat: '#6B8F6B' };

const rupee = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const signed = (n) => `${n > 0 ? '+' : ''}${n}%`;

function MoverCard({ title, crop, positive }) {
  const Icon = positive ? TrendingUp : TrendingDown;
  const color = positive ? '#52C455' : '#E84040';

  return (
    <div className="card p-4">
      <p className="text-xs mb-3" style={{ color: '#6B8F6B' }}>{title}</p>
      {crop ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-bold" style={{ color: '#F0EBE0' }}>{crop.name}</p>
            <p className="text-xs" style={{ color: '#6B8F6B' }}>{crop.market}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <Icon size={14} style={{ color }} />
              <span className="font-bold" style={{ color }}>{signed(crop.change)}</span>
            </div>
            <p className="text-sm" style={{ color: '#8FAF8F' }}>{rupee(crop.price)}/qtl</p>
          </div>
        </div>
      ) : (
        <p className="text-sm" style={{ color: '#6B8F6B' }}>
          — <span className="text-xs">needs price history</span>
        </p>
      )}
    </div>
  );
}

export default function MarketPage() {
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('change');
  const [prices, setPrices] = useState(null);
  const [pricesError, setPricesError] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [forecastError, setForecastError] = useState(false);
  const requested = useRef(false);

  // The ref keeps this to one request each, including under StrictMode. The
  // forecast is a Gemini call, cached on the backend for 6 hours.
  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    fetchJson('/api/market/prices')
      .then(setPrices)
      .catch(err => { console.error(err); setPricesError(true); });

    fetchJson('/api/market/forecast')
      .then(data => setForecast(Array.isArray(data) ? data : []))
      .catch(err => { console.error(err); setForecastError(true); });
  }, []);

  const list = prices || [];
  const categories = ['All', ...CATEGORY_ORDER.filter(c => list.some(p => p.category === c)),
    ...[...new Set(list.map(p => p.category))].filter(c => c && !CATEGORY_ORDER.includes(c))];

  const filtered = list
    .filter(c => category === 'All' || c.category === category)
    .sort((a, b) => sort === 'price' ? b.price - a.price : sort === 'change' ? Math.abs(b.change) - Math.abs(a.change) : a.name.localeCompare(b.name));

  // A change needs a previous price at the same mandi.
  const withHistory = list.filter(p => p.prev != null);
  const gainers = withHistory.filter(p => p.change > 0).sort((a, b) => b.change - a.change);
  const losers = withHistory.filter(p => p.change < 0).sort((a, b) => a.change - b.change);

  const dates = list.map(p => p.date).filter(Boolean).sort();
  const latest = dates[dates.length - 1];
  const states = [...new Set(list.map(p => p.state).filter(Boolean))];

  const insight = forecast?.length
    ? [...forecast].sort((a, b) => (b.confidence || 0) - (a.confidence || 0))[0]
    : null;

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-28 pb-20">

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-1" style={{ color: '#F0EBE0' }}>Market Prices</h1>
          <div className="flex items-center gap-2 text-sm flex-wrap" style={{ color: '#6B8F6B' }}>
            {states.length > 0 && (
              <><MapPin size={13} /> {states.length === 1 ? states[0] : `${states.length} states`} ·</>
            )}
            <RefreshCw size={11} /> {latest ? `Mandi prices for ${formatDate(new Date(`${latest}T00:00:00`))}` : 'Loading prices'}
          </div>
        </div>

        {pricesError && !prices && (
          <div className="card p-8 text-center mb-8">
            <p className="font-semibold" style={{ color: '#6B8F6B' }}>Market prices unavailable</p>
            <p className="text-sm mt-1" style={{ color: '#3D5A3E' }}>Please refresh the page to try again</p>
          </div>
        )}

        {!prices && !pricesError && (
          <div className="space-y-3 mb-8">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="shimmer rounded-xl h-14" />)}
          </div>
        )}

        {prices && (
          <>
            {/* Hero movers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <MoverCard title="Top Gainer" crop={gainers[0]} positive />
              <MoverCard title="Top Loser" crop={losers[0]} />

              <div className="card p-4" style={{ background: 'rgba(61,154,64,0.08)', border: '1px solid rgba(61,154,64,0.2)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#52C455' }} />
                  <p className="text-xs font-semibold" style={{ color: '#52C455' }}>AI Market Insight</p>
                </div>
                <p className="text-sm" style={{ color: '#8FAF8F', lineHeight: '1.6' }}>
                  {insight ? (
                    <>
                      <span style={{ color: '#F0EBE0' }}>{insight.crop}</span> is expected to go{' '}
                      <span style={{ color: trendColor[insight.direction] || '#F0EBE0' }}>
                        {insight.direction === 'flat' ? 'sideways' : insight.direction}
                      </span>{' '}
                      to {rupee(insight.forecast_low)}–{Number(insight.forecast_high).toLocaleString('en-IN')} in 30 days. {insight.reason}.
                    </>
                  ) : forecastError ? 'The AI insight is unavailable right now.' : 'Generating insight…'}
                </p>
              </div>
            </div>

            {/* Category filter + sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === cat ? 'tab-active' : ''}`}
                    style={{ border: `1px solid ${category === cat ? 'rgba(61,154,64,0.4)' : 'rgba(61,154,64,0.15)'}`, color: category === cat ? '#52C455' : '#6B8F6B', background: category === cat ? 'rgba(61,154,64,0.12)' : 'transparent' }}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <span className="text-xs" style={{ color: '#6B8F6B' }}>Sort by:</span>
                {(['change', 'price', 'name']).map(s => (
                  <button key={s} onClick={() => setSort(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${sort === s ? 'tab-active' : ''}`}
                    style={{ border: `1px solid ${sort === s ? 'rgba(61,154,64,0.4)' : 'rgba(61,154,64,0.15)'}`, color: sort === s ? '#52C455' : '#6B8F6B', background: sort === s ? 'rgba(61,154,64,0.12)' : 'transparent' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="card overflow-x-auto mb-8">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold" style={{ color: '#6B8F6B', borderBottom: '1px solid rgba(61,154,64,0.1)' }}>
                  <span className="col-span-3">Crop & Variety</span>
                  <span className="col-span-3">Market</span>
                  <span className="col-span-2 text-right">Price/qtl</span>
                  <span className="col-span-2 text-right">Change</span>
                  <span className="col-span-2 text-right">vs MSP</span>
                </div>
                {filtered.map((crop, i) => {
                  const TIcon = trendIcon[crop.trend] || Minus;
                  const tColor = trendColor[crop.trend] || '#6B8F6B';
                  return (
                    <div key={crop.name} className="grid grid-cols-12 items-center px-5 py-4 market-row transition-colors"
                      style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(61,154,64,0.07)' : 'none' }}>
                      <div className="col-span-3">
                        <p className="text-sm font-semibold" style={{ color: '#F0EBE0' }}>{crop.name}</p>
                        <p className="text-xs" style={{ color: '#6B8F6B' }}>{crop.variety}</p>
                      </div>
                      <div className="col-span-3">
                        <p className="text-xs" style={{ color: '#8FAF8F' }}>{crop.market}</p>
                        <p className="text-xs" style={{ color: '#6B8F6B' }}>{crop.state}</p>
                      </div>
                      <div className="col-span-2 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <IndianRupee size={11} style={{ color: '#8FAF8F' }} />
                          <span className="text-sm font-bold" style={{ color: '#F0EBE0' }}>{crop.price.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-xs" style={{ color: '#6B8F6B' }}>
                          {crop.prev == null
                            ? 'no history yet'
                            : `prev ${rupee(crop.prev)}${crop.prev_date ? ` · ${formatDate(new Date(`${crop.prev_date}T00:00:00`)).replace(/ \d{4}$/, '')}` : ''}`}
                        </p>
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-1">
                        <TIcon size={13} style={{ color: tColor }} />
                        <span className="text-sm font-semibold" style={{ color: tColor }}>
                          {crop.change === 0 ? '—' : signed(crop.change)}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        {crop.msp_diff != null ? (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{
                            background: crop.msp_diff >= 0 ? 'rgba(82,196,85,0.1)' : 'rgba(232,64,64,0.1)',
                            color: crop.msp_diff >= 0 ? '#52C455' : '#E84040',
                          }}>
                            {signed(crop.msp_diff)}
                          </span>
                        ) : <span className="text-xs" style={{ color: '#3D5A3E' }}>No MSP</span>}
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-sm text-center py-10" style={{ color: '#6B8F6B' }}>No prices in this category.</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Forecast strip */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={15} style={{ color: '#52C455' }} />
            <p className="font-semibold" style={{ color: '#F0EBE0' }}>30-Day AI Price Outlook</p>
          </div>

          {forecastError ? (
            <p className="text-sm" style={{ color: '#6B8F6B' }}>The AI forecast is unavailable right now. Please try again later.</p>
          ) : !forecast ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <div key={i} className="shimmer rounded-xl h-28" />)}
            </div>
          ) : forecast.length === 0 ? (
            <p className="text-sm" style={{ color: '#6B8F6B' }}>No forecast available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {forecast.map(({ crop, direction, forecast_low, forecast_high, confidence, reason }) => {
                const Icon = trendIcon[direction] || Minus;
                const color = trendColor[direction] || '#6B8F6B';
                return (
                  <div key={crop} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(61,154,64,0.1)' }}>
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <p className="font-semibold" style={{ color: '#F0EBE0' }}>{crop}</p>
                      <div className="flex items-center gap-1">
                        <Icon size={13} style={{ color }} />
                        <span className="text-xs font-medium" style={{ color }}>
                          {rupee(forecast_low)}–{Number(forecast_high).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    {reason && <p className="text-xs mb-2" style={{ color: '#6B8F6B' }}>{reason}</p>}
                    {typeof confidence === 'number' && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-full h-1" style={{ background: 'rgba(61,154,64,0.1)' }}>
                          <div className="h-1 rounded-full progress-bar" style={{ width: `${confidence}%` }} />
                        </div>
                        <span className="text-xs" style={{ color: '#6B8F6B' }}>{confidence}% confidence</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
