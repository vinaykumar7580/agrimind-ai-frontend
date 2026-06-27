"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import {
  MessageCircle, Share2, Bookmark, Search, TrendingUp,
  Users, Award, Plus, ThumbsUp, X, Image, Tag, ChevronDown
} from "lucide-react";
import { toast } from "sonner";

const initialPosts = [
  {
    id: 1, author: 'Ramesh Patil', avatar: 'RP', location: 'Nashik, MH', time: '2h ago',
    tag: 'Disease Control', emoji: '🍅',
    title: 'Early Blight in Tomato — what worked for me',
    body: 'After 2 failed attempts with other fungicides, Mancozeb 75 WP at 2.5g/litre every 8 days completely controlled the blight on my 3-acre field. Make sure to spray early morning before 9AM. Also, remove affected lower leaves first.',
    likes: 142, comments: 38, bookmarked: false, liked: false,
    tags: ['Tomato', 'Fungicide', 'Kharif'],
  },
  {
    id: 2, author: 'Sunita Devi', avatar: 'SD', location: 'Amritsar, PB', time: '5h ago',
    tag: 'Yield Tip', emoji: '🌾',
    title: 'Wheat yield jumped 28% after split nitrogen application',
    body: 'Instead of applying all urea at once, I split it: 40% at sowing, 30% at CRI stage (21 days), 30% at tillering (42 days). My yield went from 18 to 23 quintals per acre this rabi season. AgriMind AI suggested this schedule based on my soil report.',
    likes: 89, comments: 21, bookmarked: true, liked: true,
    tags: ['Wheat', 'Nitrogen', 'Rabi', 'Fertilizer'],
  },
  {
    id: 3, author: 'Gopal Krishnan', avatar: 'GK', location: 'Coimbatore, TN', time: '1d ago',
    tag: 'Question', emoji: '❓',
    title: 'Brown spots on cotton leaves — anyone seen this before?',
    body: 'My Bt cotton is showing brown circular spots on older leaves, about 1-2cm diameter with yellow halo. Appears on 30% of plants in field C. Soil moisture seems fine. Uploaded to AgriMind and it suggested Alternaria but I am not fully sure.',
    likes: 34, comments: 52, bookmarked: false, liked: false,
    tags: ['Cotton', 'Help Needed', 'Disease'],
  },
  {
    id: 4, author: 'Kavitha Narayanan', avatar: 'KN', location: 'Belgaum, KA', time: '2d ago',
    tag: 'Market Tip', emoji: '📈',
    title: 'Held my onion stock and got ₹800 more per quintal',
    body: 'AgriMind market forecast said prices would rise in 15 days. I took the risk and stored 40 quintals. Bought cold storage for ₹2/kg. Sold at ₹2,200 instead of ₹1,400 fifteen days later. Net profit increase: ₹32,000. Worth every rupee.',
    likes: 217, comments: 64, bookmarked: false, liked: false,
    tags: ['Onion', 'Market', 'Storage', 'Success Story'],
  },
];

const tagConfig = {
  'Disease Control': { bg: 'rgba(232,64,64,0.12)',   color: '#E84040' },
  'Yield Tip':       { bg: 'rgba(82,196,85,0.12)',   color: '#52C455' },
  'Question':        { bg: 'rgba(107,159,212,0.12)', color: '#6B9FD4' },
  'Market Tip':      { bg: 'rgba(200,134,10,0.12)',  color: '#E8A020' },
  'Success Story':   { bg: 'rgba(82,196,85,0.12)',   color: '#52C455' },
  'Farming Tip':     { bg: 'rgba(200,134,10,0.12)',  color: '#E8A020' },
};

const categoryEmojis = {
  'Disease Control': '🦠',
  'Yield Tip':       '📈',
  'Question':        '❓',
  'Market Tip':      '💰',
  'Success Story':   '🏆',
  'Farming Tip':     '🌾',
};

const cropSuggestions = ['Wheat','Rice','Tomato','Onion','Soybean','Cotton','Sugarcane','Maize','Potato','Mustard','Chana','Brinjal'];


function ShareStoryModal({ onClose, onSubmit }) {
  const [step, setStep] = useState('compose');
  const [form, setForm] = useState({
    title: '',
    body: '',
    tag: '',
    customTag: '',
    image: null,
  });
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Disease Control','Yield Tip','Question','Market Tip','Success Story','Farming Tip'];

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => setForm(p => ({ ...p, image: ev.target?.result}));
    reader.readAsDataURL(file);
  };

  const toggleCrop = (crop) =>
    setSelectedCrops(p => p.includes(crop) ? p.filter(c => c !== crop) : [...p, crop]);

  const addCustomTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (selectedCrops.includes(t)) { setTagInput(''); return; }
    setSelectedCrops(p => [...p, t]);
    setTagInput('');
  };

  const canPreview = form.title.trim().length >= 5 && form.body.trim().length >= 20 && form.tag;

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    onSubmit({
      title: form.title,
      body: form.body,
      tag: form.tag,
      tags: selectedCrops,
      emoji: categoryEmojis[form.tag] || '🌿',
      image: form.image,
    });
    setSubmitting(false);
    onClose();
  };

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="w-full max-w-xl rounded-2xl overflow-hidden"
        style={{ background: '#111E11', border: '1px solid rgba(61,154,64,0.25)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(61,154,64,0.12)' }}>
          <div className="flex items-center gap-3">
            {step === 'preview' && (
              <button onClick={() => setStep('compose')}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(61,154,64,0.1)', border: '1px solid rgba(61,154,64,0.2)' }}>
                <ChevronDown size={14} className="rotate-90" style={{ color: '#52C455' }} />
              </button>
            )}
            <div>
              <p className="font-semibold text-sm" style={{ color: '#F0EBE0' }}>
                {step === 'compose' ? 'Share Your Story' : 'Preview Post'}
              </p>
              <p className="text-xs" style={{ color: '#6B8F6B' }}>
                {step === 'compose' ? 'Help fellow farmers learn from your experience' : 'How your post will look'}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: 'rgba(232,64,64,0.1)', border: '1px solid rgba(232,64,64,0.2)' }}>
            <X size={15} style={{ color: '#E84040' }} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 px-5 py-5">

          {/* ── Compose ── */}
          {step === 'compose' && (
            <div className="space-y-5">

              {/* Category */}
              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: '#8FAF8F' }}>
                  POST CATEGORY <span style={{ color: '#E84040' }}>*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setForm(p => ({ ...p, tag: cat }))}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left"
                      style={{
                        background: form.tag === cat ? `${tagConfig[cat].color}18` : 'rgba(0,0,0,0.25)',
                        border: `1px solid ${form.tag === cat ? tagConfig[cat].color + '55' : 'rgba(61,154,64,0.12)'}`,
                        color: form.tag === cat ? tagConfig[cat].color : '#6B8F6B',
                      }}>
                      <span className="text-base leading-none">{categoryEmojis[cat]}</span>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: '#8FAF8F' }}>
                  TITLE <span style={{ color: '#E84040' }}>*</span>
                </label>
                <input
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. How I doubled my tomato yield this season"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(61,154,64,0.2)', color: '#F0EBE0', fontFamily: 'Inter' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(61,154,64,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(61,154,64,0.2)'} />
                <div className="flex justify-between mt-1">
                  {form.title.length > 0 && form.title.length < 5 && (
                    <p className="text-xs" style={{ color: '#E8A020' }}>Title too short</p>
                  )}
                  <p className="text-xs ml-auto" style={{ color: '#3D5A3E' }}>{form.title.length}/100</p>
                </div>
              </div>

              {/* Body */}
              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: '#8FAF8F' }}>
                  YOUR STORY <span style={{ color: '#E84040' }}>*</span>
                </label>
                <textarea
                  value={form.body}
                  onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                  placeholder="Share what happened, what you tried, and what worked. Be specific — the more detail, the more helpful it is for other farmers."
                  rows={5}
                  maxLength={1000}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(61,154,64,0.2)', color: '#F0EBE0', fontFamily: 'Inter', lineHeight: '1.7' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(61,154,64,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(61,154,64,0.2)'} />
                <div className="flex justify-between mt-1">
                  {form.body.length > 0 && form.body.length < 20 && (
                    <p className="text-xs" style={{ color: '#E8A020' }}>Write at least 20 characters</p>
                  )}
                  <p className="text-xs ml-auto" style={{ color: '#3D5A3E' }}>{form.body.length}/1000</p>
                </div>
              </div>

              {/* Crop tags */}
              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: '#8FAF8F' }}>
                  CROP / TOPIC TAGS
                </label>
                {/* Quick select */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {cropSuggestions.map(crop => (
                    <button key={crop} onClick={() => toggleCrop(crop)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: selectedCrops.includes(crop) ? 'rgba(61,154,64,0.15)' : 'rgba(0,0,0,0.25)',
                        border: `1px solid ${selectedCrops.includes(crop) ? 'rgba(61,154,64,0.45)' : 'rgba(61,154,64,0.12)'}`,
                        color: selectedCrops.includes(crop) ? '#52C455' : '#6B8F6B',
                      }}>
                      {selectedCrops.includes(crop) ? '✓ ' : ''}{crop}
                    </button>
                  ))}
                </div>
                {/* Custom tag */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B8F6B' }} />
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addCustomTag()}
                      placeholder="Add custom tag..."
                      className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(61,154,64,0.15)', color: '#F0EBE0', fontFamily: 'Inter' }} />
                  </div>
                  <button onClick={addCustomTag}
                    className="px-3 py-2 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(61,154,64,0.12)', border: '1px solid rgba(61,154,64,0.25)', color: '#52C455' }}>
                    Add
                  </button>
                </div>
                {/* Selected tags */}
                {selectedCrops.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedCrops.map(t => (
                      <span key={t} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(61,154,64,0.1)', border: '1px solid rgba(61,154,64,0.25)', color: '#52C455' }}>
                        #{t}
                        <button onClick={() => toggleCrop(t)} style={{ lineHeight: 1 }}>
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Image upload */}
              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: '#8FAF8F' }}>
                  ATTACH PHOTO <span style={{ color: '#3D5A3E' }}>(optional)</span>
                </label>
                {form.image ? (
                  <div className="relative rounded-xl overflow-hidden" style={{ height: '160px' }}>
                    <img src={form.image} alt="Attached" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setForm(p => ({ ...p, image: null }))}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(232,64,64,0.4)' }}>
                      <X size={13} style={{ color: '#E84040' }} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 py-6 rounded-xl cursor-pointer transition-all"
                    style={{ border: '2px dashed rgba(61,154,64,0.25)', background: 'rgba(0,0,0,0.15)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(61,154,64,0.45)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(61,154,64,0.25)')}>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                    <Image size={22} style={{ color: '#3D5A3E' }} />
                    <p className="text-xs" style={{ color: '#6B8F6B' }}>Click to upload a photo · JPG, PNG up to 5MB</p>
                  </label>
                )}
              </div>

              {/* Writing tips */}
              <div className="rounded-xl p-3" style={{ background: 'rgba(200,134,10,0.07)', border: '1px solid rgba(200,134,10,0.18)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#E8A020' }}>Tips for a great post</p>
                <ul className="space-y-1">
                  {[
                    'Be specific — mention crop variety, quantity, and location',
                    'Share exact product names and dosage amounts',
                    'Include before/after results when possible',
                    'Ask a clear question if you need help from others',
                  ].map(tip => (
                    <li key={tip} className="flex items-start gap-2 text-xs" style={{ color: '#8FAF8F' }}>
                      <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#C8860A' }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ── Preview ── */}
          {step === 'preview' && (
            <div className="card p-5">
              {/* Author row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, rgba(61,154,64,0.3), rgba(82,196,85,0.2))', color: '#52C455', border: '1px solid rgba(61,154,64,0.3)' }}>
                    You
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#F0EBE0' }}>Your Name</p>
                    <p className="text-xs" style={{ color: '#6B8F6B' }}>Your Location · Just now</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: tagConfig[form.tag]?.bg, color: tagConfig[form.tag]?.color }}>
                  {form.tag}
                </span>
              </div>

              {/* Content */}
              <div className="flex gap-3 mb-4">
                <div className="text-3xl flex-shrink-0">{categoryEmojis[form.tag]}</div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: '#F0EBE0', lineHeight: '1.4' }}>{form.title}</h3>
                  <p className="text-sm" style={{ color: '#8FAF8F', lineHeight: '1.7' }}>{form.body}</p>
                </div>
              </div>

              {/* Attached image */}
              {form.image && (
                <div className="rounded-xl overflow-hidden mb-4" style={{ height: '180px' }}>
                  <img src={form.image} alt="Attached" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Tags */}
              {selectedCrops.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {selectedCrops.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(61,154,64,0.08)', color: '#6B8F6B', border: '1px solid rgba(61,154,64,0.12)' }}>
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Action bar preview */}
              <div className="flex items-center gap-4 pt-3" style={{ borderTop: '1px solid rgba(61,154,64,0.1)' }}>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: '#6B8F6B' }}>
                  <ThumbsUp size={13} /> 0
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: '#6B8F6B' }}>
                  <MessageCircle size={13} /> 0
                </span>
                <span className="ml-auto flex items-center gap-1.5 text-xs" style={{ color: '#6B8F6B' }}>
                  <Bookmark size={13} />
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: '#6B8F6B' }}>
                  <Share2 size={13} />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(61,154,64,0.12)' }}>
          {step === 'compose' ? (
            <>
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(61,154,64,0.15)', color: '#6B8F6B' }}>
                Cancel
              </button>
              <button onClick={() => setStep('preview')} disabled={!canPreview}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: canPreview ? 'rgba(61,154,64,0.15)' : 'rgba(0,0,0,0.2)',
                  border: `1px solid ${canPreview ? 'rgba(61,154,64,0.4)' : 'rgba(61,154,64,0.1)'}`,
                  color: canPreview ? '#52C455' : '#3D5A3E',
                  cursor: canPreview ? 'pointer' : 'not-allowed',
                }}>
                Preview →
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setStep('compose')}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(61,154,64,0.15)', color: '#6B8F6B' }}>
                ← Edit
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: submitting ? 'rgba(61,154,64,0.2)' : 'linear-gradient(135deg, #3D9A40, #52C455)',
                  color: submitting ? '#6B8F6B' : '#0F1F0F',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}>
                {submitting
                  ? <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> Publishing...</>
                  : '🌱 Publish Post'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


export default function CommunityPage() {
  const [postList, setPostList] = useState(initialPosts);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [showModal, setShowModal] = useState(false);

  const toggle = (id, field='liked' | 'bookmarked') => {
    setPostList(prev => prev.map(p => {
      if (p.id !== id) return p;
      const val = !p[field];
      if (field === 'liked') toast(val ? '👍 Liked!' : 'Like removed');
      if (field === 'bookmarked') toast(val ? '🔖 Saved to bookmarks' : 'Bookmark removed');
      return { ...p, [field]: val, likes: field === 'liked' ? p.likes + (val ? 1 : -1) : p.likes };
    }));
  };

  const handleNewPost = (data) => {
    const newPost = {
      id: Date.now(),
      author: 'You',
      avatar: 'ME',
      location: 'Your Location',
      time: 'Just now',
      tag: data.tag,
      emoji: data.emoji,
      title: data.title,
      body: data.body,
      likes: 0,
      comments: 0,
      bookmarked: false,
      liked: false,
      tags: data.tags,
    };
    setPostList(prev => [newPost, ...prev]);
    toast.success('🌱 Your story has been published!');
  };

  const allTags = ['All', 'Disease Control', 'Yield Tip', 'Market Tip', 'Question', 'Success Story', 'Farming Tip'];

  const filtered = postList.filter(p =>
    (activeTag === 'All' || p.tag === activeTag) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.body.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />

      {showModal && (
        <ShareStoryModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewPost}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Main feed ── */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-3xl font-bold mb-1" style={{ color: '#F0EBE0' }}>Community</h1>
                <p className="text-sm" style={{ color: '#6B8F6B' }}>Learn from 2.4 lakh+ farmers across India</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'rgba(61,154,64,0.15)', border: '1px solid rgba(61,154,64,0.35)', color: '#52C455' }}>
                <Plus size={14} /> Share Story
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B8F6B' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(61,154,64,0.2)', color: '#F0EBE0', fontFamily: 'Inter' }} />
            </div>

            {/* Tag filter */}
            <div className="flex gap-2 flex-wrap mb-6">
              {allTags.map(tag => (
                <button key={tag} onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTag === tag ? 'tab-active' : ''}`}
                  style={{
                    border: `1px solid ${activeTag === tag ? 'rgba(61,154,64,0.4)' : 'rgba(61,154,64,0.15)'}`,
                    color: activeTag === tag ? '#52C455' : '#6B8F6B',
                    background: activeTag === tag ? 'rgba(61,154,64,0.12)' : 'transparent',
                  }}>
                  {tag}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filtered.map(post => (
                <div key={post.id} className="card card-hover p-5">
                  {/* Author */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: 'linear-gradient(135deg, rgba(61,154,64,0.3), rgba(82,196,85,0.2))', color: '#52C455', border: '1px solid rgba(61,154,64,0.3)' }}>
                        {post.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#F0EBE0' }}>{post.author}</p>
                        <p className="text-xs" style={{ color: '#6B8F6B' }}>{post.location} · {post.time}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: tagConfig[post.tag]?.bg, color: tagConfig[post.tag]?.color }}>
                      {post.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex gap-3 mb-4">
                    <div className="text-3xl flex-shrink-0">{post.emoji}</div>
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: '#F0EBE0', lineHeight: '1.4' }}>{post.title}</h3>
                      <p className="text-sm" style={{ color: '#8FAF8F', lineHeight: '1.7' }}>{post.body}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(61,154,64,0.08)', color: '#6B8F6B', border: '1px solid rgba(61,154,64,0.12)' }}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-3" style={{ borderTop: '1px solid rgba(61,154,64,0.1)' }}>
                    <button onClick={() => toggle(post.id, 'liked')}
                      className="flex items-center gap-1.5 text-xs transition-all"
                      style={{ color: post.liked ? '#52C455' : '#6B8F6B' }}>
                      <ThumbsUp size={14} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs" style={{ color: '#6B8F6B' }}>
                      <MessageCircle size={14} /> {post.comments}
                    </button>
                    <button onClick={() => toggle(post.id, 'bookmarked')}
                      className="flex items-center gap-1.5 text-xs transition-all ml-auto"
                      style={{ color: post.bookmarked ? '#E8A020' : '#6B8F6B' }}>
                      <Bookmark size={14} />
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast('Link copied!'); }}
                      className="flex items-center gap-1.5 text-xs" style={{ color: '#6B8F6B' }}>
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-2xl mb-3">🔍</p>
                  <p className="font-semibold" style={{ color: '#6B8F6B' }}>No posts found</p>
                  <p className="text-sm mt-1" style={{ color: '#3D5A3E' }}>Try a different search or filter</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-4 space-y-4">
            {/* Trending */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} style={{ color: '#52C455' }} />
                <p className="text-sm font-semibold" style={{ color: '#F0EBE0' }}>Trending Topics</p>
              </div>
              <div className="space-y-3">
                {[
                  { topic: '#EarlyBlight',       posts: 1240, trend: '+18%' },
                  { topic: '#KharifSeason2026',   posts: 890,  trend: '+41%' },
                  { topic: '#OnionPrices',         posts: 670,  trend: '+12%' },
                  { topic: '#SoybeanMSP',          posts: 430,  trend: '+8%'  },
                  { topic: '#DroughtManagement',   posts: 310,  trend: '+5%'  },
                ].map(({ topic, posts, trend }, i) => (
                  <div key={topic} className="flex items-center justify-between cursor-pointer"
                    style={{ borderBottom: i < 4 ? '1px solid rgba(61,154,64,0.07)' : 'none', paddingBottom: i < 4 ? '10px' : '0' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#52C455' }}>{topic}</p>
                      <p className="text-xs" style={{ color: '#6B8F6B' }}>{posts.toLocaleString()} posts</p>
                    </div>
                    <span className="text-xs" style={{ color: '#52C455' }}>{trend}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top contributors */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Award size={14} style={{ color: '#E8A020' }} />
                <p className="text-sm font-semibold" style={{ color: '#F0EBE0' }}>Top Contributors</p>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Ramesh Patil',  posts: 84, badge: '🥇', loc: 'Nashik'     },
                  { name: 'Kavitha N.',    posts: 71, badge: '🥈', loc: 'Belgaum'    },
                  { name: 'Harpreet S.',   posts: 65, badge: '🥉', loc: 'Amritsar'   },
                  { name: 'Gopal K.',      posts: 52, badge: '⭐', loc: 'Coimbatore' },
                ].map(({ name, posts, badge, loc }) => (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-lg">{badge}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: '#F0EBE0' }}>{name}</p>
                      <p className="text-xs" style={{ color: '#6B8F6B' }}>{loc} · {posts} posts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community stats */}
            <div className="rounded-xl p-4"
              style={{ background: 'rgba(61,154,64,0.08)', border: '1px solid rgba(61,154,64,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Users size={13} style={{ color: '#52C455' }} />
                <p className="text-xs font-semibold" style={{ color: '#52C455' }}>Community Stats</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Members',          value: '2.4L+' },
                  { label: 'Posts Today',       value: '1,842' },
                  { label: 'States',            value: '18'    },
                  { label: 'Questions Solved',  value: '94%'   },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-bold text-lg" style={{ color: '#F0EBE0' }}>{value}</p>
                    <p className="text-xs" style={{ color: '#6B8F6B' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button onClick={() => setShowModal(true)}
              className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{ background: 'linear-gradient(135deg, #3D9A40, #52C455)', color: '#0F1F0F' }}>
              <Plus size={15} /> Share Your Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}