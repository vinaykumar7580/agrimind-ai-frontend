"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, ArrowRight, Phone, Lock, User, MapPin, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";

const states = ['Andhra Pradesh', 'Bihar', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];
const cropTypes = ['Wheat', 'Rice', 'Soybean', 'Cotton', 'Sugarcane', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds', 'Other'];
const steps = ['Account', 'Farm Details', 'Review'];

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedCrops, setSelectedCrops] = useState([]);
    const [form, setForm] = useState({
        name: '', phone: '', password: '', confirmPassword: '',
        state: '', district: '', landAcres: '', farmingType: 'traditional',
    });

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/api/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name,
                    phone: form.phone,
                    password: form.password,
                    state: form.state,
                    district: form.district,
                    land_acres: Number(form.landAcres) || null,
                    farming_type: form.farmingType,
                    primary_crops: selectedCrops,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }

            toast.success("Signup completed successfully.");

            // Redirect after successful signup
            router.push("/login"); // or "/" if you prefer
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handle = (e) =>
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const toggleCrop = (crop) =>
        setSelectedCrops(p => p.includes(crop) ? p.filter(c => c !== crop) : [...p, crop]);

    const strengthScore = (pw) => {
        let s = 0;
        if (pw.length >= 8) s++;
        if (/[A-Z]/.test(pw)) s++;
        if (/[0-9]/.test(pw)) s++;
        if (/[^A-Za-z0-9]/.test(pw)) s++;
        return s;
    };
    const strengthColor = ['#E84040', '#E8A020', '#6B9FD4', '#52C455'];
    const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'];

    const nextStep = async () => {
        if (step === 0) {
            if (!form.name.trim()) { toast.error("Please enter your name"); return; }
            if (form.phone.length !== 10) { toast.error("Enter a valid 10-digit mobile number"); return; }
            if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
            if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
        }
        if (step === 1) {
            if (!form.state) { toast.error("Please select your state"); return; }
            if (!form.district.trim()) { toast.error("Please enter your district"); return; }
        }
        if (step === 2) {
            await handleSubmit();
            return;
        }
        setStep(s => s + 1);
    };

    const inputCls = "w-full py-3 rounded-xl text-sm outline-none transition-all";
    const inputStyle = {
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(61,154,64,0.2)',
        color: '#F0EBE0',
        fontFamily: 'Inter',
    };
    const focusOn = (e) =>
        (e.target.style.borderColor = 'rgba(61,154,64,0.5)');
    const focusOff = (e) =>
        (e.target.style.borderColor = 'rgba(61,154,64,0.2)');

    const score = strengthScore(form.password);

    return (
        <div className="min-h-screen grid-bg flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0A1A0A 0%, #1A3520 50%, #0A1A0A 100%)' }}>
                <div className="absolute top-20 right-10 w-56 h-56 rounded-full blur-3xl opacity-20"
                    style={{ background: 'radial-gradient(#3D9A40, transparent)' }} />
                <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full blur-3xl opacity-15"
                    style={{ background: 'radial-gradient(#C8860A, transparent)' }} />

                <div className="flex items-center gap-2 relative z-10">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(61,154,64,0.25)', border: '1px solid rgba(61,154,64,0.5)' }}>
                        <Leaf size={18} style={{ color: '#52C455' }} />
                    </div>
                    <span className="font-display text-2xl font-bold" style={{ color: '#F0EBE0' }}>
                        Agri<span style={{ color: '#52C455' }}>Mind</span>
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(200,134,10,0.2)', color: '#E8A020', border: '1px solid rgba(200,134,10,0.3)' }}>AI</span>
                </div>

                <div className="relative z-10">
                    <div className="text-7xl mb-6 text-center">🚜</div>
                    <h2 className="font-display text-3xl font-bold mb-4" style={{ color: '#F0EBE0' }}>
                        Join 2.4 lakh+<br />smart farmers
                    </h2>
                    <p className="text-sm mb-8" style={{ color: '#6B8F6B', lineHeight: '1.8' }}>
                        Get instant AI crop diagnosis, soil health reports, real-time mandi prices and personalised farm advisories.
                    </p>
                    <div className="space-y-3">
                        {[
                            'Instant crop disease detection from photos',
                            'Soil NPK & pH analysis with recommendations',
                            'Live mandi prices from 500+ markets',
                            'Weather-based farm advisory alerts',
                            'Connect with 2.4L+ farmers community',
                        ].map(feat => (
                            <div key={feat} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(61,154,64,0.2)', border: '1px solid rgba(61,154,64,0.4)' }}>
                                    <Check size={11} style={{ color: '#52C455' }} />
                                </div>
                                <p className="text-sm" style={{ color: '#8FAF8F' }}>{feat}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 rounded-2xl p-4"
                    style={{ background: 'rgba(200,134,10,0.08)', border: '1px solid rgba(200,134,10,0.2)' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#E8A020' }}>Free forever for farmers</p>
                    <p className="text-xs" style={{ color: '#8FAF8F' }}>
                        No subscription fee. No hidden charges. Powered by AI for India's agricultural community.
                    </p>
                </div>
            </div>

            {/* Right — form */}
            <div className="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-6 lg:hidden">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'rgba(61,154,64,0.2)', border: '1px solid rgba(61,154,64,0.4)' }}>
                            <Leaf size={16} style={{ color: '#52C455' }} />
                        </div>
                        <span className="font-display text-xl font-bold" style={{ color: '#F0EBE0' }}>
                            Agri<span style={{ color: '#52C455' }}>Mind</span>
                        </span>
                    </div>

                    <h1 className="font-display text-3xl font-bold mb-1" style={{ color: '#F0EBE0' }}>Create account</h1>
                    <p className="text-sm mb-6" style={{ color: '#6B8F6B' }}>Start growing smarter today — it's free</p>

                    {/* Stepper */}
                    <div className="flex items-center mb-8">
                        {steps.map((s, i) => (
                            <div key={s} className="flex items-center flex-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                                        style={{
                                            background: i < step ? '#3D9A40' : i === step ? 'rgba(61,154,64,0.2)' : 'rgba(0,0,0,0.3)',
                                            border: `1px solid ${i <= step ? 'rgba(61,154,64,0.6)' : 'rgba(61,154,64,0.15)'}`,
                                            color: i < step ? '#0F1F0F' : i === step ? '#52C455' : '#3D5A3E',
                                        }}>
                                        {i < step ? <Check size={12} /> : i + 1}
                                    </div>
                                    <span className="text-xs hidden sm:block"
                                        style={{ color: i === step ? '#52C455' : i < step ? '#8FAF8F' : '#3D5A3E' }}>{s}</span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="flex-1 h-px mx-2"
                                        style={{ background: i < step ? 'rgba(61,154,64,0.5)' : 'rgba(61,154,64,0.15)' }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── Step 0: Account ── */}
                    {step === 0 && (
                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8FAF8F' }}>Full Name *</label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B8F6B' }} />
                                    <input name="name" value={form.name} onChange={handle} placeholder="Ramesh Patil"
                                        className={`${inputCls} pl-10 pr-4`} style={inputStyle}
                                        onFocus={focusOn} onBlur={focusOff}
                                        onKeyDown={e => e.key === 'Enter' && (document.getElementById('phone-input'))?.focus()} />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8FAF8F' }}>Mobile Number *</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <Phone size={14} style={{ color: '#6B8F6B' }} />
                                        <span className="text-sm border-r pr-2"
                                            style={{ color: '#6B8F6B', borderColor: 'rgba(61,154,64,0.2)' }}>+91</span>
                                    </div>
                                    <input id="phone-input" name="phone" value={form.phone} onChange={handle}
                                        placeholder="9876543210" type="tel" maxLength={10}
                                        className={`${inputCls} pl-20 pr-4`} style={inputStyle}
                                        onFocus={focusOn} onBlur={focusOff}
                                        onKeyDown={e => e.key === 'Enter' && (document.getElementById('pw-input'))?.focus()} />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8FAF8F' }}>Password *</label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B8F6B' }} />
                                    <input id="pw-input" name="password" value={form.password} onChange={handle}
                                        placeholder="Min. 8 characters" type={showPass ? "text" : "password"}
                                        className={`${inputCls} pl-10 pr-10`} style={inputStyle}
                                        onFocus={focusOn} onBlur={focusOff}
                                        onKeyDown={e => e.key === 'Enter' && (document.getElementById('cpw-input'))?.focus()} />
                                    <button onClick={() => setShowPass(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {showPass
                                            ? <EyeOff size={14} style={{ color: '#6B8F6B' }} />
                                            : <Eye size={14} style={{ color: '#6B8F6B' }} />}
                                    </button>
                                </div>
                                {/* Strength meter */}
                                {form.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[0, 1, 2, 3].map(i => (
                                                <div key={i} className="flex-1 h-1 rounded-full transition-all"
                                                    style={{ background: i < score ? strengthColor[score - 1] : 'rgba(61,154,64,0.1)' }} />
                                            ))}
                                        </div>
                                        <p className="text-xs" style={{ color: strengthColor[score - 1] }}>
                                            {strengthLabel[score - 1]} password
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8FAF8F' }}>Confirm Password *</label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B8F6B' }} />
                                    <input id="cpw-input" name="confirmPassword" value={form.confirmPassword} onChange={handle}
                                        placeholder="Re-enter your password" type={showConfirm ? "text" : "password"}
                                        className={`${inputCls} pl-10 pr-10`}
                                        style={{
                                            ...inputStyle,
                                            borderColor: form.confirmPassword && form.confirmPassword !== form.password
                                                ? 'rgba(232,64,64,0.5)' : 'rgba(61,154,64,0.2)',
                                        }}
                                        onFocus={focusOn}
                                        onBlur={e => {
                                            e.target.style.borderColor = form.confirmPassword && form.confirmPassword !== form.password
                                                ? 'rgba(232,64,64,0.5)' : 'rgba(61,154,64,0.2)';
                                        }}
                                        onKeyDown={e => e.key === 'Enter' && nextStep()} />
                                    <button onClick={() => setShowConfirm(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {form.confirmPassword && form.password === form.confirmPassword
                                            ? <Check size={14} style={{ color: '#52C455' }} />
                                            : showConfirm
                                                ? <EyeOff size={14} style={{ color: '#6B8F6B' }} />
                                                : <Eye size={14} style={{ color: '#6B8F6B' }} />}
                                    </button>
                                </div>
                                {form.confirmPassword && form.password !== form.confirmPassword && (
                                    <p className="text-xs mt-1" style={{ color: '#E84040' }}>Passwords do not match</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Step 1: Farm Details ── */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {/* State */}
                                <div>
                                    <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8FAF8F' }}>State *</label>
                                    <div className="relative">
                                        <select name="state" value={form.state} onChange={handle}
                                            className={`${inputCls} pl-3 pr-8 appearance-none cursor-pointer`} style={inputStyle}
                                            onFocus={focusOn} onBlur={focusOff}>
                                            <option value="">Select state</option>
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                            style={{ color: '#6B8F6B' }} />
                                    </div>
                                </div>

                                {/* District */}
                                <div>
                                    <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8FAF8F' }}>District *</label>
                                    <div className="relative">
                                        <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B8F6B' }} />
                                        <input name="district" value={form.district} onChange={handle} placeholder="e.g. Nashik"
                                            className={`${inputCls} pl-8 pr-3`} style={inputStyle}
                                            onFocus={focusOn} onBlur={focusOff} />
                                    </div>
                                </div>
                            </div>

                            {/* Land size */}
                            <div>
                                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8FAF8F' }}>Total Land (acres)</label>
                                <input name="landAcres" value={form.landAcres} onChange={handle}
                                    placeholder="e.g. 5" type="number" min="0"
                                    className={`${inputCls} px-4`} style={inputStyle}
                                    onFocus={focusOn} onBlur={focusOff} />
                            </div>

                            {/* Farming type */}
                            <div>
                                <label className="text-xs font-medium mb-2 block" style={{ color: '#8FAF8F' }}>Farming Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { value: 'traditional', label: '🌾 Traditional' },
                                        { value: 'organic', label: '🌿 Organic' },
                                        { value: 'modern', label: '🚜 Modern' },
                                    ].map(({ value, label }) => (
                                        <button key={value} onClick={() => setForm(p => ({ ...p, farmingType: value }))}
                                            className="py-2.5 rounded-xl text-xs font-medium transition-all"
                                            style={{
                                                background: form.farmingType === value ? 'rgba(61,154,64,0.15)' : 'rgba(0,0,0,0.2)',
                                                border: `1px solid ${form.farmingType === value ? 'rgba(61,154,64,0.45)' : 'rgba(61,154,64,0.15)'}`,
                                                color: form.farmingType === value ? '#52C455' : '#6B8F6B',
                                            }}>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Primary crops */}
                            <div>
                                <label className="text-xs font-medium mb-2 block" style={{ color: '#8FAF8F' }}>
                                    Primary Crops <span style={{ color: '#3D5A3E' }}>(optional)</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {cropTypes.map(crop => (
                                        <button key={crop} onClick={() => toggleCrop(crop)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                            style={{
                                                background: selectedCrops.includes(crop) ? 'rgba(61,154,64,0.15)' : 'rgba(0,0,0,0.2)',
                                                border: `1px solid ${selectedCrops.includes(crop) ? 'rgba(61,154,64,0.45)' : 'rgba(61,154,64,0.12)'}`,
                                                color: selectedCrops.includes(crop) ? '#52C455' : '#6B8F6B',
                                            }}>
                                            {selectedCrops.includes(crop) ? '✓ ' : ''}{crop}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Step 2: Review ── */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="rounded-2xl p-5 space-y-4"
                                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(61,154,64,0.15)' }}>
                                <p className="text-xs font-semibold" style={{ color: '#6B8F6B' }}>ACCOUNT DETAILS</p>
                                {[
                                    { label: 'Name', value: form.name },
                                    { label: 'Mobile', value: `+91 ${form.phone}` },
                                    { label: 'Password', value: '••••••••' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex items-center justify-between py-2"
                                        style={{ borderBottom: '1px solid rgba(61,154,64,0.08)' }}>
                                        <span className="text-xs" style={{ color: '#6B8F6B' }}>{label}</span>
                                        <span className="text-sm font-medium" style={{ color: '#F0EBE0' }}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-2xl p-5 space-y-4"
                                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(61,154,64,0.15)' }}>
                                <p className="text-xs font-semibold" style={{ color: '#6B8F6B' }}>FARM DETAILS</p>
                                {[
                                    { label: 'State', value: form.state || '—' },
                                    { label: 'District', value: form.district || '—' },
                                    { label: 'Land', value: form.landAcres ? `${form.landAcres} acres` : '—' },
                                    { label: 'Farming Type', value: form.farmingType.charAt(0).toUpperCase() + form.farmingType.slice(1) },
                                    { label: 'Crops', value: selectedCrops.length ? selectedCrops.join(', ') : '—' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex items-start justify-between py-2"
                                        style={{ borderBottom: '1px solid rgba(61,154,64,0.08)' }}>
                                        <span className="text-xs flex-shrink-0" style={{ color: '#6B8F6B' }}>{label}</span>
                                        <span className="text-sm font-medium text-right ml-4" style={{ color: '#F0EBE0' }}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-xl p-3" style={{ background: 'rgba(61,154,64,0.08)', border: '1px solid rgba(61,154,64,0.2)' }}>
                                <p className="text-xs" style={{ color: '#8FAF8F', lineHeight: '1.6' }}>
                                    By creating an account you agree to AgriMind's{' '}
                                    <a href="#" style={{ color: '#52C455' }}>Terms of Service</a> and{' '}
                                    <a href="#" style={{ color: '#52C455' }}>Privacy Policy</a>.
                                    Your data is encrypted and never shared without consent.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex gap-3 mt-6">
                        {step > 0 && (
                            <button onClick={() => setStep(s => s - 1)}
                                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(61,154,64,0.2)', color: '#6B8F6B' }}>
                                ← Back
                            </button>
                        )}
                        <button onClick={nextStep} disabled={loading}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                            style={{
                                background: loading ? 'rgba(61,154,64,0.2)' : 'linear-gradient(135deg, #3D9A40, #52C455)',
                                color: loading ? '#6B8F6B' : '#0F1F0F',
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}>
                            {loading
                                ? <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                : <>{step === 2 ? 'Create Account' : 'Continue'} <ArrowRight size={15} /></>}
                        </button>
                    </div>

                    <p className="text-sm text-center mt-5" style={{ color: '#6B8F6B' }}>
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold" style={{ color: '#52C455' }}>Sign in →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}