"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  MessageCircle, Share2, Bookmark, Search, TrendingUp,
  Users, Award, Plus, ThumbsUp, X, Image, Tag, ChevronDown, Trash2
} from "lucide-react";
import { toast } from "sonner";
import { backendAsset, fetchJson, initials, parseUtc, timeAgo } from "../../lib/format";

const PAGE_SIZE = 20;

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


function ShareStoryModal({ onClose, onSubmit, author }) {
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

  // Keep the File for the upload; the object URL is only for the preview.
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please choose an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setForm(p => ({ ...p, image: { file, preview: URL.createObjectURL(file) } }));
  };

  const removeImage = () => {
    if (form.image) URL.revokeObjectURL(form.image.preview);
    setForm(p => ({ ...p, image: null }));
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
    try {
      const data = new FormData();
      data.append('title', form.title.trim());
      data.append('body', form.body.trim());
      data.append('tag', form.tag);
      data.append('emoji', categoryEmojis[form.tag] || '🌿');
      data.append('post_tags', JSON.stringify(selectedCrops));
      if (form.image) data.append('image', form.image.file);

      const post = await fetchJson('/api/community/posts', { method: 'POST', body: data });
      onSubmit(post);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Could not publish your post');
      setSubmitting(false);
    }
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
                    <img src={form.image.preview} alt="Attached" className="w-full h-full object-cover" />
                    <button
                      onClick={removeImage}
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
                    {author?.name ? initials(author.name) : "You"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#F0EBE0' }}>{author?.name || 'You'}</p>
                    <p className="text-xs" style={{ color: '#6B8F6B' }}>{[author?.location, 'Just now'].filter(Boolean).join(' · ')}</p>
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
                  <img src={form.image.preview} alt="Attached" className="w-full h-full object-cover" />
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



const allTags = ['All', 'Disease Control', 'Yield Tip', 'Market Tip', 'Question', 'Success Story', 'Farming Tip', 'Saved'];
const medals = ['🥇', '🥈', '🥉', '⭐'];

export default function CommunityPage() {
  const [postList, setPostList] = useState([]);
  const [status, setStatus] = useState('loading');
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [author, setAuthor] = useState(null);
  const [pending, setPending] = useState({});   // post id -> action in flight
  const requestId = useRef(0);
  const loaded = useRef(false);

  const loadStats = () =>
    fetchJson('/api/community/stats').then(setStats).catch(err => console.error(err));

  // Profile (for the post preview) and sidebar stats, once.
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    fetchJson('/api/get-profile')
      .then(res => {
        const p = res?.data;
        if (p) setAuthor({ name: p.name, location: [p.district, p.state].filter(Boolean).join(', ') });
      })
      .catch(err => console.error(err));

    loadStats();
  }, []);

  // Wait for a pause in typing before searching the server.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const pagePath = (skip) => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(PAGE_SIZE) });
    if (activeTag === 'Saved') params.set('saved', 'true');
    else if (activeTag !== 'All') params.set('tag', activeTag);
    if (query) params.set('search', query);
    return `/api/community/posts?${params}`;
  };

  // Reload from the first page when the tag or search changes. The request id
  // drops responses that arrive after a newer request started.
  useEffect(() => {
    const id = ++requestId.current;
    setStatus('loading');

    fetchJson(pagePath(0))
      .then(page => {
        if (id !== requestId.current) return;
        setPostList(page);
        setHasMore(page.length === PAGE_SIZE);
        setStatus('ready');
      })
      .catch(err => {
        if (id !== requestId.current) return;
        console.error(err);
        setStatus('error');
      });
  }, [activeTag, query]);

  const loadMore = async () => {
    const id = requestId.current;
    setLoadingMore(true);
    try {
      const page = await fetchJson(pagePath(postList.length));
      if (id !== requestId.current) return;
      setPostList(prev => {
        const ids = new Set(prev.map(p => p.id));
        return [...prev, ...page.filter(p => !ids.has(p.id))];
      });
      setHasMore(page.length === PAGE_SIZE);
    } catch (err) {
      console.error(err);
      toast.error('Could not load more posts');
    } finally {
      setLoadingMore(false);
    }
  };

  const updatePost = (id, changes) =>
    setPostList(prev => prev.map(p => (p.id === id ? { ...p, ...changes } : p)));

  // One action per post at a time, so double clicks cannot race.
  const runAction = async (post, action, request) => {
    if (pending[post.id]) return;
    setPending(p => ({ ...p, [post.id]: action }));
    try {
      await request();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setPending(p => {
        const next = { ...p };
        delete next[post.id];
        return next;
      });
    }
  };

  const toggleLike = (post) => runAction(post, 'like', async () => {
    const res = await fetchJson(`/api/community/posts/${post.id}/like`, { method: 'POST' });
    updatePost(post.id, { liked: res.liked, likes: res.likes });
  });

  const toggleBookmark = (post) => runAction(post, 'bookmark', async () => {
    const res = await fetchJson(`/api/community/posts/${post.id}/bookmark`, { method: 'POST' });
    if (activeTag === 'Saved' && !res.bookmarked) {
      setPostList(prev => prev.filter(p => p.id !== post.id));
    } else {
      updatePost(post.id, { bookmarked: res.bookmarked });
    }
    toast(res.bookmarked ? '🔖 Saved to bookmarks' : 'Bookmark removed');
  });

  const deletePost = (post) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    runAction(post, 'delete', async () => {
      await fetchJson(`/api/community/posts/${post.id}`, { method: 'DELETE' });
      setPostList(prev => prev.filter(p => p.id !== post.id));
      loadStats();
      toast('Post deleted');
    });
  };

  const handleNewPost = (post) => {
    // Show it at the top if it belongs in the current view.
    if ((activeTag === 'All' || activeTag === post.tag) && !query) {
      setPostList(prev => [post, ...prev]);
    }
    loadStats();
    toast.success('🌱 Your story has been published!');
  };

  const filtering = activeTag !== 'All' || query;
  const savedView = activeTag === 'Saved' && !query;

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />

      {showModal && (
        <ShareStoryModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewPost}
          author={author}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Main feed ── */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6 gap-3">
              <div>
                <h1 className="font-display text-3xl font-bold mb-1" style={{ color: '#F0EBE0' }}>Community</h1>
                <p className="text-sm" style={{ color: '#6B8F6B' }}>Learn from fellow farmers across India</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0"
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
                  {tag === 'Saved' ? '🔖 Saved' : tag}
                </button>
              ))}
            </div>

            {/* Posts */}
            {status === 'loading' && (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="shimmer rounded-xl h-44" />)}
              </div>
            )}

            {status === 'error' && (
              <div className="text-center py-16">
                <p className="font-semibold" style={{ color: '#6B8F6B' }}>Could not load posts</p>
                <p className="text-sm mt-1" style={{ color: '#3D5A3E' }}>Please refresh the page to try again</p>
              </div>
            )}

            {status === 'ready' && (
              <div className="space-y-4">
                {postList.map(post => {
                  const image = backendAsset(post.image_url);
                  const busy = !!pending[post.id];

                  return (
                    <div key={post.id} className="card card-hover p-5">
                      {/* Author */}
                      <div className="flex items-center justify-between mb-4 gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, rgba(61,154,64,0.3), rgba(82,196,85,0.2))', color: '#52C455', border: '1px solid rgba(61,154,64,0.3)' }}>
                            {initials(post.author)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold" style={{ color: '#F0EBE0' }}>
                              {post.author}{post.is_mine && <span style={{ color: '#6B8F6B' }}> (you)</span>}
                            </p>
                            <p className="text-xs" style={{ color: '#6B8F6B' }}>
                              {[post.location, timeAgo(parseUtc(post.created_at))].filter(Boolean).join(' · ')}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                          style={{ background: tagConfig[post.tag]?.bg, color: tagConfig[post.tag]?.color }}>
                          {post.tag}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex gap-3 mb-4">
                        <div className="text-3xl flex-shrink-0">{post.emoji}</div>
                        <div className="min-w-0">
                          <h3 className="font-semibold mb-2 break-words" style={{ color: '#F0EBE0', lineHeight: '1.4' }}>{post.title}</h3>
                          <p className="text-sm whitespace-pre-wrap break-words" style={{ color: '#8FAF8F', lineHeight: '1.7' }}>{post.body}</p>
                        </div>
                      </div>

                      {image && (
                        <div className="rounded-xl overflow-hidden mb-4" style={{ maxHeight: '320px' }}>
                          <img src={image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Tags */}
                      {post.post_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {post.post_tags.map(t => (
                            <button key={t} onClick={() => setSearch(t)}
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(61,154,64,0.08)', color: '#6B8F6B', border: '1px solid rgba(61,154,64,0.12)' }}>
                              #{t}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-4 pt-3" style={{ borderTop: '1px solid rgba(61,154,64,0.1)' }}>
                        <button onClick={() => toggleLike(post)} disabled={busy}
                          className="flex items-center gap-1.5 text-xs transition-all"
                          style={{ color: post.liked ? '#52C455' : '#6B8F6B' }}>
                          <ThumbsUp size={14} fill={post.liked ? 'currentColor' : 'none'} />
                          {post.likes}
                        </button>
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: '#6B8F6B' }}>
                          <MessageCircle size={14} /> {post.comments}
                        </span>
                        <button onClick={() => toggleBookmark(post)} disabled={busy}
                          className="flex items-center gap-1.5 text-xs transition-all ml-auto"
                          style={{ color: post.bookmarked ? '#E8A020' : '#6B8F6B' }}>
                          <Bookmark size={14} fill={post.bookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast('Link copied!'); }}
                          className="flex items-center gap-1.5 text-xs" style={{ color: '#6B8F6B' }}>
                          <Share2 size={14} />
                        </button>
                        {post.is_mine && (
                          <button onClick={() => deletePost(post)} disabled={busy} title="Delete post"
                            className="flex items-center gap-1.5 text-xs" style={{ color: '#6B8F6B' }}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {hasMore && (
                  <div className="flex justify-center">
                    <button onClick={loadMore} disabled={loadingMore}
                      className="px-4 py-2 rounded-xl text-sm font-medium"
                      style={{ background: 'rgba(61,154,64,0.1)', border: '1px solid rgba(61,154,64,0.25)', color: '#52C455' }}>
                      {loadingMore ? 'Loading…' : 'Load more'}
                    </button>
                  </div>
                )}

                {postList.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-2xl mb-3">{savedView ? '🔖' : filtering ? '🔍' : '🌱'}</p>
                    <p className="font-semibold" style={{ color: '#6B8F6B' }}>
                      {savedView ? 'No saved posts yet' : filtering ? 'No posts found' : 'No posts yet'}
                    </p>
                    <p className="text-sm mt-1" style={{ color: '#3D5A3E' }}>
                      {savedView
                        ? 'Tap the bookmark on a post to save it here'
                        : filtering ? 'Try a different search or filter' : 'Be the first to share your story'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-4 space-y-4">
            {/* Trending */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} style={{ color: '#52C455' }} />
                <p className="text-sm font-semibold" style={{ color: '#F0EBE0' }}>Trending This Week</p>
              </div>
              {stats?.trending?.length ? (
                <div className="space-y-3">
                  {stats.trending.map(({ tag, posts }, i) => {
                    const last = i === stats.trending.length - 1;
                    return (
                      <button key={tag} onClick={() => setSearch(tag)}
                        className="w-full flex items-center justify-between text-left"
                        style={{ borderBottom: last ? 'none' : '1px solid rgba(61,154,64,0.07)', paddingBottom: last ? '0' : '10px' }}>
                        <p className="text-sm font-medium" style={{ color: '#52C455' }}>#{tag}</p>
                        <p className="text-xs" style={{ color: '#6B8F6B' }}>{posts} {posts === 1 ? 'post' : 'posts'}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs" style={{ color: '#6B8F6B' }}>
                  {stats ? 'No tagged posts this week yet.' : 'Loading…'}
                </p>
              )}
            </div>

            {/* Top contributors */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Award size={14} style={{ color: '#E8A020' }} />
                <p className="text-sm font-semibold" style={{ color: '#F0EBE0' }}>Top Contributors</p>
              </div>
              {stats?.top_contributors?.length ? (
                <div className="space-y-3">
                  {stats.top_contributors.map(({ name, location, posts }, i) => (
                    <div key={`${name}-${i}`} className="flex items-center gap-3">
                      <span className="text-lg">{medals[i] || '⭐'}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: '#F0EBE0' }}>{name}</p>
                        <p className="text-xs" style={{ color: '#6B8F6B' }}>
                          {[location, `${posts} ${posts === 1 ? 'post' : 'posts'}`].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs" style={{ color: '#6B8F6B' }}>
                  {stats ? 'No posts yet.' : 'Loading…'}
                </p>
              )}
            </div>

            {/* Community stats */}
            <div className="rounded-xl p-4"
              style={{ background: 'rgba(61,154,64,0.08)', border: '1px solid rgba(61,154,64,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Users size={13} style={{ color: '#52C455' }} />
                <p className="text-xs font-semibold" style={{ color: '#52C455' }}>Community Stats</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Members', value: stats?.members },
                  { label: 'Posts Today', value: stats?.posts_today },
                  { label: 'States', value: stats?.states },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-bold text-lg" style={{ color: '#F0EBE0' }}>
                      {value != null ? value.toLocaleString('en-IN') : '—'}
                    </p>
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
