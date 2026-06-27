"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const steps = ["Find Account", "New Password", "Done"];

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [phone, setPhone] = useState("");
  const [form, setForm] = useState({ password: "", confirmPassword: "" });

  const handle = (e) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const strengthScore = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strengthColor = ["#E84040", "#E8A020", "#6B9FD4", "#52C455"];
  const strengthLabel = ["Weak", "Fair", "Good", "Strong"];
  const score = strengthScore(form.password);

  const findAccount = async () => {
    if (phone.length !== 10) { toast.error("Enter a valid 10-digit mobile number"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    toast.success("Account found!");
    setStep(1);
  };

  const resetPassword = async () => {
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setStep(2);
  };

  const inputCls = "w-full py-3 rounded-xl text-sm outline-none transition-all";
  const inputStyle = {
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(61,154,64,0.2)",
    color: "#F0EBE0",
    fontFamily: "Inter",
  };
  const focusOn  = (e) => (e.target.style.borderColor = "rgba(61,154,64,0.5)");
  const focusOff = (e) => (e.target.style.borderColor = "rgba(61,154,64,0.2)");

  return (
    <div className="min-h-screen grid-bg flex">

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1A0A 0%, #1A3520 50%, #0A1A0A 100%)" }}>
        <div className="absolute top-24 left-16 w-60 h-60 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(#3D9A40, transparent)" }} />
        <div className="absolute bottom-24 right-12 w-44 h-44 rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(#C8860A, transparent)" }} />

        {/* Logo */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(61,154,64,0.25)", border: "1px solid rgba(61,154,64,0.5)" }}>
            <Leaf size={18} style={{ color: "#52C455" }} />
          </div>
          <span className="font-display text-2xl font-bold" style={{ color: "#F0EBE0" }}>
            Agri<span style={{ color: "#52C455" }}>Mind</span>
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full ml-1"
            style={{ background: "rgba(200,134,10,0.2)", color: "#E8A020", border: "1px solid rgba(200,134,10,0.3)" }}>AI</span>
        </div>

        {/* Illustration */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
            style={{ background: "rgba(61,154,64,0.12)", border: "1px solid rgba(61,154,64,0.25)" }}>
            <ShieldCheck size={44} style={{ color: "#52C455" }} />
          </div>
          <h2 className="font-display text-3xl font-bold mb-4" style={{ color: "#F0EBE0" }}>
            Account recovery<br />made simple
          </h2>
          <p className="text-sm max-w-xs" style={{ color: "#6B8F6B", lineHeight: "1.8" }}>
            Enter your registered mobile number and set a new password. Your farm data stays safe and untouched.
          </p>

          {/* Steps preview */}
          <div className="mt-10 w-full max-w-xs space-y-3">
            {[
              { icon: Phone, label: "Enter registered mobile number" },
              { icon: Lock, label: "Set a new secure password" },
              { icon: Check, label: "Sign in with your new password" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl text-left"
                style={{ background: "rgba(61,154,64,0.07)", border: "1px solid rgba(61,154,64,0.12)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(61,154,64,0.15)", border: "1px solid rgba(61,154,64,0.25)" }}>
                  <Icon size={15} style={{ color: "#52C455" }} />
                </div>
                <p className="text-sm" style={{ color: "#8FAF8F" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security note */}
        <div className="relative z-10 rounded-2xl p-4"
          style={{ background: "rgba(200,134,10,0.08)", border: "1px solid rgba(200,134,10,0.2)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "#E8A020" }}>Your data is secure</p>
          <p className="text-xs" style={{ color: "#8FAF8F" }}>
            AgriMind uses industry-standard encryption to protect your account and farm data at all times.
          </p>
        </div>
      </div>

      {/* ── Right — form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(61,154,64,0.2)", border: "1px solid rgba(61,154,64,0.4)" }}>
              <Leaf size={16} style={{ color: "#52C455" }} />
            </div>
            <span className="font-display text-xl font-bold" style={{ color: "#F0EBE0" }}>
              Agri<span style={{ color: "#52C455" }}>Mind</span>
            </span>
          </div>

          {/* Back to login */}
          {step < 2 && (
            <Link href="/login"
              className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors"
              style={{ color: "#6B8F6B" }}>
              <ArrowLeft size={14} /> Back to login
            </Link>
          )}

          {/* Stepper */}
          {step < 2 && (
            <div className="flex items-center mb-8">
              {steps.slice(0, 2).map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                      style={{
                        background: i < step ? "#3D9A40" : i === step ? "rgba(61,154,64,0.2)" : "rgba(0,0,0,0.3)",
                        border: `1px solid ${i <= step ? "rgba(61,154,64,0.6)" : "rgba(61,154,64,0.15)"}`,
                        color: i < step ? "#0F1F0F" : i === step ? "#52C455" : "#3D5A3E",
                      }}>
                      {i < step ? <Check size={12} /> : i + 1}
                    </div>
                    <span className="text-xs hidden sm:block"
                      style={{ color: i === step ? "#52C455" : i < step ? "#8FAF8F" : "#3D5A3E" }}>{s}</span>
                  </div>
                  {i < 1 && (
                    <div className="flex-1 h-px mx-2"
                      style={{ background: i < step ? "rgba(61,154,64,0.5)" : "rgba(61,154,64,0.15)" }} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Step 0: Find Account ── */}
          {step === 0 && (
            <>
              <h1 className="font-display text-3xl font-bold mb-1" style={{ color: "#F0EBE0" }}>Forgot password?</h1>
              <p className="text-sm mb-8" style={{ color: "#6B8F6B" }}>
                Enter the mobile number linked to your AgriMind account.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "#8FAF8F" }}>
                    Registered Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <Phone size={14} style={{ color: "#6B8F6B" }} />
                      <span className="text-sm border-r pr-2"
                        style={{ color: "#6B8F6B", borderColor: "rgba(61,154,64,0.2)" }}>+91</span>
                    </div>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/, ""))}
                      placeholder="9876543210" type="tel" maxLength={10}
                      className={`${inputCls} pl-20 pr-4`} style={inputStyle}
                      onFocus={focusOn} onBlur={focusOff}
                      onKeyDown={e => e.key === "Enter" && findAccount()} />
                  </div>
                  {phone && phone.length < 10 && (
                    <p className="text-xs mt-1.5" style={{ color: "#E8A020" }}>
                      {10 - phone.length} more digit{10 - phone.length !== 1 ? "s" : ""} needed
                    </p>
                  )}
                  {phone.length === 10 && (
                    <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#52C455" }}>
                      <Check size={11} /> Looks good
                    </p>
                  )}
                </div>

                <button onClick={findAccount} disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: loading ? "rgba(61,154,64,0.2)" : "linear-gradient(135deg, #3D9A40, #52C455)",
                    color: loading ? "#6B8F6B" : "#0F1F0F",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}>
                  {loading
                    ? <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> Finding account...</>
                    : <>Find My Account <ArrowRight size={15} /></>}
                </button>
              </div>

              <p className="text-sm text-center mt-6" style={{ color: "#6B8F6B" }}>
                Remember your password?{" "}
                <Link href="/login" className="font-semibold" style={{ color: "#52C455" }}>Sign in →</Link>
              </p>
            </>
          )}

          {/* ── Step 1: New Password ── */}
          {step === 1 && (
            <>
              <h1 className="font-display text-3xl font-bold mb-1" style={{ color: "#F0EBE0" }}>Set new password</h1>
              <p className="text-sm mb-2" style={{ color: "#6B8F6B" }}>
                Create a strong password for your account.
              </p>

              {/* Account found badge */}
              <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-xl"
                style={{ background: "rgba(61,154,64,0.08)", border: "1px solid rgba(61,154,64,0.2)" }}>
                <Check size={13} style={{ color: "#52C455" }} />
                <p className="text-xs" style={{ color: "#8FAF8F" }}>
                  Account found for <span style={{ color: "#F0EBE0" }}>+91 {phone}</span>
                </p>
              </div>

              <div className="space-y-4">
                {/* New password */}
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "#8FAF8F" }}>New Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B8F6B" }} />
                    <input name="password" value={form.password} onChange={handle}
                      placeholder="Min. 8 characters" type={showPass ? "text" : "password"}
                      className={`${inputCls} pl-10 pr-10`} style={inputStyle}
                      onFocus={focusOn} onBlur={focusOff}
                      onKeyDown={e => e.key === "Enter" && (document.getElementById("cpw"))?.focus()} />
                    <button onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPass
                        ? <EyeOff size={14} style={{ color: "#6B8F6B" }} />
                        : <Eye size={14} style={{ color: "#6B8F6B" }} />}
                    </button>
                  </div>

                  {/* Strength meter */}
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[0, 1, 2, 3].map(i => (
                          <div key={i} className="flex-1 h-1 rounded-full transition-all"
                            style={{ background: i < score ? strengthColor[score - 1] : "rgba(61,154,64,0.1)" }} />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs" style={{ color: strengthColor[score - 1] }}>
                          {strengthLabel[score - 1]} password
                        </p>
                        <p className="text-xs" style={{ color: "#3D5A3E" }}>
                          Use uppercase, numbers & symbols
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "#8FAF8F" }}>Confirm New Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B8F6B" }} />
                    <input id="cpw" name="confirmPassword" value={form.confirmPassword} onChange={handle}
                      placeholder="Re-enter new password" type={showConfirm ? "text" : "password"}
                      className={`${inputCls} pl-10 pr-10`}
                      style={{
                        ...inputStyle,
                        borderColor: form.confirmPassword && form.confirmPassword !== form.password
                          ? "rgba(232,64,64,0.5)" : "rgba(61,154,64,0.2)",
                      }}
                      onFocus={focusOn}
                      onBlur={e => {
                        e.target.style.borderColor = form.confirmPassword && form.confirmPassword !== form.password
                          ? "rgba(232,64,64,0.5)" : "rgba(61,154,64,0.2)";
                      }}
                      onKeyDown={e => e.key === "Enter" && resetPassword()} />
                    <button onClick={() => setShowConfirm(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2">
                      {form.confirmPassword && form.password === form.confirmPassword
                        ? <Check size={14} style={{ color: "#52C455" }} />
                        : showConfirm
                          ? <EyeOff size={14} style={{ color: "#6B8F6B" }} />
                          : <Eye size={14} style={{ color: "#6B8F6B" }} />}
                    </button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-xs mt-1" style={{ color: "#E84040" }}>Passwords do not match</p>
                  )}
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#52C455" }}>
                      <Check size={11} /> Passwords match
                    </p>
                  )}
                </div>

                {/* Password rules */}
                <div className="rounded-xl p-3 space-y-1.5"
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(61,154,64,0.1)" }}>
                  <p className="text-xs font-medium mb-2" style={{ color: "#6B8F6B" }}>Password must have:</p>
                  {[
                    { rule: "At least 8 characters", met: form.password.length >= 8 },
                    { rule: "One uppercase letter", met: /[A-Z]/.test(form.password) },
                    { rule: "One number", met: /[0-9]/.test(form.password) },
                    { rule: "One special character", met: /[^A-Za-z0-9]/.test(form.password) },
                  ].map(({ rule, met }) => (
                    <div key={rule} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                        style={{ background: met ? "rgba(82,196,85,0.2)" : "rgba(0,0,0,0.3)", border: `1px solid ${met ? "rgba(82,196,85,0.5)" : "rgba(61,154,64,0.15)"}` }}>
                        {met && <Check size={9} style={{ color: "#52C455" }} />}
                      </div>
                      <p className="text-xs transition-colors" style={{ color: met ? "#8FAF8F" : "#3D5A3E" }}>{rule}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-2">
                  <button onClick={() => setStep(0)}
                    className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(61,154,64,0.2)", color: "#6B8F6B" }}>
                    ← Back
                  </button>
                  <button onClick={resetPassword} disabled={loading}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: loading ? "rgba(61,154,64,0.2)" : "linear-gradient(135deg, #3D9A40, #52C455)",
                      color: loading ? "#6B8F6B" : "#0F1F0F",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}>
                    {loading
                      ? <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      : <>Reset Password <ArrowRight size={15} /></>}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── Step 2: Success ── */}
          {step === 2 && (
            <div className="flex flex-col items-center text-center py-8">
              {/* Animated success ring */}
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full"
                  style={{ background: "rgba(61,154,64,0.1)", border: "2px solid rgba(61,154,64,0.3)" }} />
                <div className="absolute inset-2 rounded-full"
                  style={{ background: "rgba(61,154,64,0.15)", border: "1px solid rgba(61,154,64,0.4)" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #3D9A40, #52C455)" }}>
                    <Check size={24} style={{ color: "#0F1F0F" }} />
                  </div>
                </div>
              </div>

              <h1 className="font-display text-3xl font-bold mb-3" style={{ color: "#F0EBE0" }}>
                Password reset!
              </h1>
              <p className="text-sm mb-2" style={{ color: "#6B8F6B", lineHeight: "1.7" }}>
                Your password has been updated successfully.<br />
                You can now sign in with your new password.
              </p>

              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl my-6"
                style={{ background: "rgba(61,154,64,0.08)", border: "1px solid rgba(61,154,64,0.2)" }}>
                <ShieldCheck size={14} style={{ color: "#52C455" }} />
                <p className="text-xs" style={{ color: "#8FAF8F" }}>
                  Account secured · +91 {phone}
                </p>
              </div>

              <button onClick={() => router.push("/login")}
                className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                style={{ background: "linear-gradient(135deg, #3D9A40, #52C455)", color: "#0F1F0F" }}>
                Sign In Now <ArrowRight size={15} />
              </button>

              
            </div>
          )}

        </div>
      </div>
    </div>
  );
}