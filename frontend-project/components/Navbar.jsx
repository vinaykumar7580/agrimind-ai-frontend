"use client";
import { Leaf, Bell, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: 'Dashboard', href: '/' },
  { label: 'History', href: '/history' },
  { label: 'Market', href: '/market' },
  { label: 'Community', href: '/community' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ background: 'rgba(15,31,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(61,154,64,0.1)' }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(61,154,64,0.2)', border: '1px solid rgba(61,154,64,0.4)' }}>
          <Leaf size={16} style={{ color: '#52C455' }} />
        </div>
        <span className="font-display text-xl font-bold" style={{ color: '#F0EBE0' }}>
          Agri<span style={{ color: '#52C455' }}>Mind</span>
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full ml-1"
          style={{ background: 'rgba(200,134,10,0.2)', color: '#E8A020', border: '1px solid rgba(200,134,10,0.3)' }}>AI</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm">
        {navLinks.map(({ label, href }) => (
          <Link key={label} href={href}
            className="transition-colors"
            style={{ color: pathname === href ? '#52C455' : '#8FAF8F' }}>
            {label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ border: '1px solid rgba(61,154,64,0.2)' }}>
          <Bell size={15} style={{ color: '#6B8F6B' }} />
        </button>
        <button className="hidden md:flex w-8 h-8 rounded-lg items-center justify-center"
          style={{ border: '1px solid rgba(61,154,64,0.2)' }}>
          <Settings size={15} style={{ color: '#6B8F6B' }} />
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{ background: 'linear-gradient(135deg, #3D9A40, #52C455)', color: '#0F1F0F' }}>
          AJ
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={18} style={{ color: '#6B8F6B' }} /> : <Menu size={18} style={{ color: '#6B8F6B' }} />}
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 p-4 flex flex-col gap-3"
          style={{ background: 'rgba(15,31,15,0.98)', borderBottom: '1px solid rgba(61,154,64,0.15)' }}>
          {navLinks.map(({ label, href }) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}
              className="text-sm py-2 px-3 rounded-lg"
              style={{ color: pathname === href ? '#52C455' : '#8FAF8F', background: pathname === href ? 'rgba(61,154,64,0.1)' : 'transparent' }}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}