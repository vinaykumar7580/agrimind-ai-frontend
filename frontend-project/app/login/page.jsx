"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, ArrowRight, Phone, Lock } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.phone || !form.password) { toast.error("Please fill all fields"); return; }
    if (form.phone.length !== 10) { toast.error("Enter a valid 10-digit mobile number"); return; }
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      toast.success("Welcome back to AgriMind!");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen grid-bg flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A1A0A 0%, #1A3520 50%, #0A1A0A 100%)' }}>
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(#3D9A40, transparent)' }} />
        <div className="absolute bottom-32 right-10 w-48 h-48 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(#C8860A, transparent)' }} />

        {/* Logo */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(61,154,64,0.25)', border: '1px solid rgba(61,154,64,0.5)' }}>
            <Leaf size={18} style={{ color: '#52C455' }} />
          </div>
          <span className="font-display text-2xl font-bold" style={{ color: '#F0EBE0' }}>
            Agri<span style={{ color: '#52C455' }}>Mind</span>
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full ml-1"
            style={{ background: 'rgba(200,134,10,0.2)', color: '#E8A020', border: '1px solid rgba(200,134,10,0.3)' }}>AI</span>
        </div>

        {/* Central illustration */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="text-8xl mb-6">🌱</div>
          <h2 className="font-display text-3xl font-bold mb-4" style={{ color: '#F0EBE0' }}>
            Smarter farming<br />starts here
          </h2>
          <p className="text-base max-w-xs" style={{ color: '#6B8F6B', lineHeight: '1.7' }}>
            AI-powered crop diagnosis, soil analysis, live market prices and weather — all in one place.
          </p>
          <div className="flex gap-4 mt-8">
            {[{ value: '2.4L+', label: 'Farmers' }, { value: '+23%', label: 'Yield Boost' }, { value: '94%', label: 'Accuracy' }].map(({ value, label }) => (
              <div key={label} className="px-4 py-3 rounded-xl text-center"
                style={{ background: 'rgba(61,154,64,0.1)', border: '1px solid rgba(61,154,64,0.2)' }}>
                <p className="font-display text-lg font-bold" style={{ color: '#52C455' }}>{value}</p>
                <p className="text-xs" style={{ color: '#6B8F6B' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 rounded-2xl p-5"
          style={{ background: 'rgba(61,154,64,0.08)', border: '1px solid rgba(61,154,64,0.15)' }}>
          <p className="text-sm italic mb-3" style={{ color: '#8FAF8F', lineHeight: '1.7' }}>
            "AgriMind detected blight on my tomatoes before I could even see it. Saved my entire 4-acre crop."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #3D9A40, #52C455)', color: '#0F1F0F' }}>RP</div>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#F0EBE0' }}>Ramesh Patil</p>
              <p className="text-xs" style={{ color: '#6B8F6B' }}>Tomato farmer · Nashik, MH</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(61,154,64,0.2)', border: '1px solid rgba(61,154,64,0.4)' }}>
              <Leaf size={16} style={{ color: '#52C455' }} />
            </div>
            <span className="font-display text-xl font-bold" style={{ color: '#F0EBE0' }}>
              Agri<span style={{ color: '#52C455' }}>Mind</span>
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold mb-1" style={{ color: '#F0EBE0' }}>Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: '#6B8F6B' }}>Sign in to your AgriMind account</p>

          <div className="space-y-4">
            {/* Phone */}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8FAF8F' }}>Mobile Number</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Phone size={15} style={{ color: '#6B8F6B' }} />
                  <span className="text-sm border-r pr-2" style={{ color: '#6B8F6B', borderColor: 'rgba(61,154,64,0.2)' }}>+91</span>
                </div>
                <input name="phone" value={form.phone} onChange={handle}
                  placeholder="9876543210" type="tel" maxLength={10}
                  className="w-full pl-20 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(61,154,64,0.2)', color: '#F0EBE0', fontFamily: 'Inter' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(61,154,64,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(61,154,64,0.2)'}
                  onKeyDown={e => e.key === 'Enter' && (document.getElementById('password-input'))?.focus()} />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium" style={{ color: '#8FAF8F' }}>Password</label>
                <Link href="/forgot-password" className="text-xs" style={{ color: '#52C455' }}>Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B8F6B' }} />
                <input id="password-input" name="password" value={form.password} onChange={handle}
                  placeholder="Enter your password" type={showPass ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(61,154,64,0.2)', color: '#F0EBE0', fontFamily: 'Inter' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(61,154,64,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(61,154,64,0.2)'}
                  onKeyDown={e => e.key === 'Enter' && submit()} />
                <button onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPass
                    ? <EyeOff size={15} style={{ color: '#6B8F6B' }} />
                    : <Eye size={15} style={{ color: '#6B8F6B' }} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button onClick={submit} disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all mt-2"
              style={{
                background: loading ? 'rgba(61,154,64,0.3)' : 'linear-gradient(135deg, #3D9A40, #52C455)',
                color: loading ? '#6B8F6B' : '#0F1F0F',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>
              {loading
                ? <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Signing in...</>
                : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </div>

          <p className="text-sm text-center mt-6" style={{ color: '#6B8F6B' }}>
            New to AgriMind?{' '}
            <Link href="/signup" className="font-semibold" style={{ color: '#52C455' }}>Create account →</Link>
          </p>

          <p className="text-xs text-center mt-4" style={{ color: '#3D5A3E' }}>
            By continuing, you agree to our{' '}
            <a href="#" style={{ color: '#6B8F6B' }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" style={{ color: '#6B8F6B' }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}