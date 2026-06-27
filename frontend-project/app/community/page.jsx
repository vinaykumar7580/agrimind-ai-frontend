"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { Heart, MessageCircle, Share2, Bookmark, Search, TrendingUp, Users, Award, Plus, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

const posts = [
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

const tagColor= {
  'Disease Control': { bg: 'rgba(232,64,64,0.12)', color: '#E84040' },
  'Yield Tip': { bg: 'rgba(82,196,85,0.12)', color: '#52C455' },
  'Question': { bg: 'rgba(107,159,212,0.12)', color: '#6B9FD4' },
  'Market Tip': { bg: 'rgba(200,134,10,0.12)', color: '#E8A020' },
};

export default function CommunityPage() {
  const [postList, setPostList] = useState(posts);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const toggle = (id, field= 'liked' | 'bookmarked') => {
    setPostList(prev => prev.map(p => {
      if (p.id !== id) return p;
      const val = !p[field];
      if (field === 'liked') toast(val ? '👍 Liked!' : 'Like removed');
      if (field === 'bookmarked') toast(val ? '🔖 Saved to bookmarks' : 'Bookmark removed');
      return { ...p, [field]: val, likes: field === 'liked' ? p.likes + (val ? 1 : -1) : p.likes };
    }));
  };

  const allTags = ['All', 'Disease Control', 'Yield Tip', 'Market Tip', 'Question'];
  const filtered = postList.filter(p =>
    (activeTag === 'All' || p.tag === activeTag) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.body.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main feed */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-3xl font-bold mb-1" style={{ color: '#F0EBE0' }}>Community</h1>
                <p className="text-sm" style={{ color: '#6B8F6B' }}>Learn from 2.4 lakh+ farmers across India</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(61,154,64,0.15)', border: '1px solid rgba(61,154,64,0.35)', color: '#52C455' }}
                onClick={() => toast('Post creation coming soon!')}>
                <Plus size={14} /> Share Story
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B8F6B' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(61,154,64,0.2)', color: '#F0EBE0', fontFamily: 'Inter' }} />
            </div>

            {/* Tag filter */}
            <div className="flex gap-2 flex-wrap mb-6">
              {allTags.map(tag => (
                <button key={tag} onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTag === tag ? 'tab-active' : ''}`}
                  style={{ border: `1px solid ${activeTag === tag ? 'rgba(61,154,64,0.4)' : 'rgba(61,154,64,0.15)'}`, color: activeTag === tag ? '#52C455' : '#6B8F6B', background: activeTag === tag ? 'rgba(61,154,64,0.12)' : 'transparent' }}>
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
                      style={{ background: tagColor[post.tag]?.bg, color: tagColor[post.tag]?.color }}>
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

                  {/* Crop tags */}
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
                      <ThumbsUp size={14} fill={post.liked ? '#52C455' : 'none'} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs" style={{ color: '#6B8F6B' }}>
                      <MessageCircle size={14} /> {post.comments}
                    </button>
                    <button onClick={() => toggle(post.id, 'bookmarked')} className="flex items-center gap-1.5 text-xs transition-all ml-auto"
                      style={{ color: post.bookmarked ? '#E8A020' : '#6B8F6B' }}>
                      <Bookmark size={14} fill={post.bookmarked ? '#E8A020' : 'none'} />
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast('Link copied!'); }}
                      className="flex items-center gap-1.5 text-xs" style={{ color: '#6B8F6B' }}>
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            {/* Trending */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} style={{ color: '#52C455' }} />
                <p className="text-sm font-semibold" style={{ color: '#F0EBE0' }}>Trending Topics</p>
              </div>
              <div className="space-y-3">
                {[
                  { topic: '#EarlyBlight', posts: 1240, trend: '+18%' },
                  { topic: '#KharifSeason2026', posts: 890, trend: '+41%' },
                  { topic: '#OnionPrices', posts: 670, trend: '+12%' },
                  { topic: '#SoybeanMSP', posts: 430, trend: '+8%' },
                  { topic: '#DroughtManagement', posts: 310, trend: '+5%' },
                ].map(({ topic, posts, trend }, i) => (
                  <div key={topic} className="flex items-center justify-between cursor-pointer" style={{ borderBottom: i < 4 ? '1px solid rgba(61,154,64,0.07)' : 'none', paddingBottom: i < 4 ? '10px' : '0' }}>
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
                  { name: 'Ramesh Patil', posts: 84, badge: '🥇', loc: 'Nashik' },
                  { name: 'Kavitha N.', posts: 71, badge: '🥈', loc: 'Belgaum' },
                  { name: 'Harpreet S.', posts: 65, badge: '🥉', loc: 'Amritsar' },
                  { name: 'Gopal K.', posts: 52, badge: '⭐', loc: 'Coimbatore' },
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
            <div className="rounded-xl p-4" style={{ background: 'rgba(61,154,64,0.08)', border: '1px solid rgba(61,154,64,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Users size={13} style={{ color: '#52C455' }} />
                <p className="text-xs font-semibold" style={{ color: '#52C455' }}>Community Stats</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Members', value: '2.4L+' },
                  { label: 'Posts Today', value: '1,842' },
                  { label: 'States', value: '18' },
                  { label: 'Questions Solved', value: '94%' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-bold text-lg" style={{ color: '#F0EBE0' }}>{value}</p>
                    <p className="text-xs" style={{ color: '#6B8F6B' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}