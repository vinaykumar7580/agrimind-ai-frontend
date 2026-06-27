"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { TrendingUp, TrendingDown, Minus, IndianRupee, RefreshCw, Bell, MapPin, BarChart3, ArrowUpRight } from "lucide-react";

const allCrops = [
  { name: 'Wheat', variety: 'HD-2967', price: 2285, prev: 2230, change: 2.4, trend: 'up', msp: 2275, market: 'Pune APMC', state: 'Maharashtra', category: 'Cereals' },
  { name: 'Rice', variety: 'Basmati 1121', price: 4850, prev: 4910, change: -1.2, trend: 'down', msp: 2300, market: 'Delhi Mandi', state: 'Delhi', category: 'Cereals' },
  { name: 'Soybean', variety: 'JS 9560', price: 4620, prev: 4450, change: 3.8, trend: 'up', msp: 4600, market: 'Indore APMC', state: 'MP', category: 'Oilseeds' },
  { name: 'Cotton', variety: 'Bt Cotton', price: 6780, prev: 6780, change: 0, trend: 'flat', msp: 7020, market: 'Nagpur Mandi', state: 'Maharashtra', category: 'Fibre' },
  { name: 'Sugarcane', variety: 'Co-86032', price: 340, prev: 336, change: 1.1, trend: 'up', msp: 315, market: 'Kolhapur', state: 'Maharashtra', category: 'Cash Crops' },
  { name: 'Onion', variety: 'Nasik Red', price: 1820, prev: 1923, change: -5.3, trend: 'down', msp: null, market: 'Lasalgaon', state: 'Maharashtra', category: 'Vegetables' },
  { name: 'Tomato', variety: 'Hybrid', price: 2140, prev: 1980, change: 8.1, trend: 'up', msp: null, market: 'Nashik', state: 'Maharashtra', category: 'Vegetables' },
  { name: 'Maize', variety: 'Hybrid-10', price: 2090, prev: 2110, change: -0.9, trend: 'down', msp: 2090, market: 'Nizamabad', state: 'Telangana', category: 'Cereals' },
  { name: 'Mustard', variety: 'Pusa Bold', price: 5620, prev: 5480, change: 2.6, trend: 'up', msp: 5650, market: 'Alwar Mandi', state: 'Rajasthan', category: 'Oilseeds' },
  { name: 'Chana', variety: 'Desi', price: 5350, prev: 5300, change: 0.9, trend: 'up', msp: 5440, market: 'Gulbarga', state: 'Karnataka', category: 'Pulses' },
];

const categories = ['All', 'Cereals', 'Oilseeds', 'Vegetables', 'Pulses', 'Cash Crops', 'Fibre'];
const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };
const trendColor = { up: '#52C455', down: '#E84040', flat: '#6B8F6B' };

export default function MarketPage() {
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('change');

  const filtered = allCrops
    .filter(c => category === 'All' || c.category === category)
    .sort((a, b) => sort === 'price' ? b.price - a.price : sort === 'change' ? Math.abs(b.change) - Math.abs(a.change) : a.name.localeCompare(b.name));

  const topGainer = [...allCrops].sort((a, b) => b.change - a.change)[0];
  const topLoser = [...allCrops].sort((a, b) => a.change - b.change)[0];

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-28 pb-20">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1" style={{ color: '#F0EBE0' }}>Market Prices</h1>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#6B8F6B' }}>
              <MapPin size={13} /> Maharashtra · <RefreshCw size={11} /> Updated 8 min ago
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(61,154,64,0.1)', border: '1px solid rgba(61,154,64,0.25)', color: '#52C455' }}>
            <Bell size={14} /> Set Alerts
          </button>
        </div>

        {/* Hero movers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card p-4">
            <p className="text-xs mb-3" style={{ color: '#6B8F6B' }}>Top Gainer Today</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg font-bold" style={{ color: '#F0EBE0' }}>{topGainer.name}</p>
                <p className="text-xs" style={{ color: '#6B8F6B' }}>{topGainer.market}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <TrendingUp size={14} style={{ color: '#52C455' }} />
                  <span className="font-bold" style={{ color: '#52C455' }}>+{topGainer.change}%</span>
                </div>
                <p className="text-sm" style={{ color: '#8FAF8F' }}>₹{topGainer.price.toLocaleString()}/qtl</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <p className="text-xs mb-3" style={{ color: '#6B8F6B' }}>Top Loser Today</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg font-bold" style={{ color: '#F0EBE0' }}>{topLoser.name}</p>
                <p className="text-xs" style={{ color: '#6B8F6B' }}>{topLoser.market}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <TrendingDown size={14} style={{ color: '#E84040' }} />
                  <span className="font-bold" style={{ color: '#E84040' }}>{topLoser.change}%</span>
                </div>
                <p className="text-sm" style={{ color: '#8FAF8F' }}>₹{topLoser.price.toLocaleString()}/qtl</p>
              </div>
            </div>
          </div>

          <div className="card p-4" style={{ background: 'rgba(61,154,64,0.08)', border: '1px solid rgba(61,154,64,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#52C455' }} />
              <p className="text-xs font-semibold" style={{ color: '#52C455' }}>AI Market Insight</p>
            </div>
            <p className="text-sm" style={{ color: '#8FAF8F', lineHeight: '1.6' }}>
              Tomato prices surged 8% — offseason supply shortage from Nashik belt.
              <span style={{ color: '#52C455' }}> Hold stock</span> if possible for 7–10 more days.
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
          <div className="flex items-center gap-2 ml-auto">
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
        <div className="card overflow-hidden mb-8">
          <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold" style={{ color: '#6B8F6B', borderBottom: '1px solid rgba(61,154,64,0.1)' }}>
            <span className="col-span-3">Crop & Variety</span>
            <span className="col-span-2">Market</span>
            <span className="col-span-2 text-right">Price/qtl</span>
            <span className="col-span-2 text-right">Today</span>
            <span className="col-span-2 text-right">vs MSP</span>
            <span className="col-span-1"></span>
          </div>
          {filtered.map((crop, i) => {
            const TIcon = trendIcon[crop.trend];
            const tColor = trendColor[crop.trend];
            const mspDiff = crop.msp ? ((crop.price - crop.msp) / crop.msp * 100).toFixed(1) : null;
            return (
              <div key={crop.name} className="grid grid-cols-12 items-center px-5 py-4 market-row cursor-pointer transition-colors"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(61,154,64,0.07)' : 'none' }}>
                <div className="col-span-3">
                  <p className="text-sm font-semibold" style={{ color: '#F0EBE0' }}>{crop.name}</p>
                  <p className="text-xs" style={{ color: '#6B8F6B' }}>{crop.variety}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs" style={{ color: '#8FAF8F' }}>{crop.market}</p>
                  <p className="text-xs" style={{ color: '#6B8F6B' }}>{crop.state}</p>
                </div>
                <div className="col-span-2 text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    <IndianRupee size={11} style={{ color: '#8FAF8F' }} />
                    <span className="text-sm font-bold" style={{ color: '#F0EBE0' }}>{crop.price.toLocaleString()}</span>
                  </div>
                  <p className="text-xs" style={{ color: '#6B8F6B' }}>prev ₹{crop.prev.toLocaleString()}</p>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <TIcon size={13} style={{ color: tColor }} />
                  <span className="text-sm font-semibold" style={{ color: tColor }}>
                    {crop.change === 0 ? '—' : `${crop.change > 0 ? '+' : ''}${crop.change}%`}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  {mspDiff !== null ? (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      background: parseFloat(mspDiff) >= 0 ? 'rgba(82,196,85,0.1)' : 'rgba(232,64,64,0.1)',
                      color: parseFloat(mspDiff) >= 0 ? '#52C455' : '#E84040'
                    }}>
                      {parseFloat(mspDiff) >= 0 ? '+' : ''}{mspDiff}%
                    </span>
                  ) : <span className="text-xs" style={{ color: '#3D5A3E' }}>—</span>}
                </div>
                <div className="col-span-1 flex justify-end">
                  <ArrowUpRight size={14} style={{ color: '#3D5A3E' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Forecast strip */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={15} style={{ color: '#52C455' }} />
            <p className="font-semibold" style={{ color: '#F0EBE0' }}>30-Day AI Price Outlook</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { crop: 'Tomato', direction: 'up', forecast: '₹2,400–2,800', confidence: 78, reason: 'Offseason demand + supply crunch' },
              { crop: 'Onion', direction: 'up', forecast: '₹2,100–2,500', confidence: 71, reason: 'Post-monsoon scarcity cycle' },
              { crop: 'Wheat', direction: 'flat', forecast: '₹2,260–2,320', confidence: 85, reason: 'Stable export and domestic demand' },
            ].map(({ crop, direction, forecast, confidence, reason }) => (
              <div key={crop} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(61,154,64,0.1)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold" style={{ color: '#F0EBE0' }}>{crop}</p>
                  <div className="flex items-center gap-1">
                    {direction === 'up' ? <TrendingUp size={13} style={{ color: '#52C455' }} /> : <Minus size={13} style={{ color: '#6B8F6B' }} />}
                    <span className="text-xs font-medium" style={{ color: direction === 'up' ? '#52C455' : '#6B8F6B' }}>{forecast}</span>
                  </div>
                </div>
                <p className="text-xs mb-2" style={{ color: '#6B8F6B' }}>{reason}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-full h-1" style={{ background: 'rgba(61,154,64,0.1)' }}>
                    <div className="h-1 rounded-full progress-bar" style={{ width: `${confidence}%` }} />
                  </div>
                  <span className="text-xs" style={{ color: '#6B8F6B' }}>{confidence}% confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}