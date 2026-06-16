import { useState, useEffect, useRef, createContext, useContext } from "react";

const API_URL =
  import.meta?.env?.VITE_API_URL ||
  (typeof process !== "undefined" ? process.env?.NEXT_PUBLIC_API_URL : undefined) ||
  "https://ledgrnowapi-production.up.railway.app";

function getToken() {
  return window.localStorage.getItem("ledgrnow_token");
}

function setToken(token) {
  window.localStorage.setItem("ledgrnow_token", token);
}

function clearToken() {
  window.localStorage.removeItem("ledgrnow_token");
}

async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error?.message || body.message || "Request failed");
  }

  if (response.status === 204) return null;
  return response.json();
}

/* ══════════════════════════════════════
   RESPONSIVE CSS
══════════════════════════════════════ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{font-family:'Plus Jakarta Sans',sans-serif;overflow-x:hidden;transition:background .3s,color .3s;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:#5ab233;border-radius:4px;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.6;transform:scale(1.4);}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
@keyframes modalIn{from{opacity:0;transform:scale(.95);}to{opacity:1;transform:scale(1);}}
.fade-up{animation:fadeUp .7s ease both;}
.fade-up-1{animation:fadeUp .7s ease .1s both;}
.fade-up-2{animation:fadeUp .7s ease .2s both;}
.fade-up-3{animation:fadeUp .7s ease .3s both;}
.fade-up-4{animation:fadeUp .7s ease .4s both;}

/* NAV */
.ln-nav{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;align-items:center;
  justify-content:space-between;padding:14px 48px;backdrop-filter:blur(20px);
  transition:background .3s,border-color .3s;}
.ln-nav-links{display:flex;gap:4px;}
.ln-hamburger{display:none;flex-direction:column;gap:5px;padding:9px;
  border-radius:9px;cursor:pointer;background:transparent;border:none;align-items:center;}
.ln-hamburger span{display:block;height:2px;width:22px;border-radius:2px;transition:all .3s;}
.ln-mobile-menu{display:none;position:fixed;inset:0;top:62px;flex-direction:column;
  padding:20px 16px;gap:8px;overflow-y:auto;z-index:998;animation:slideDown .25s ease;}
.ln-mobile-menu.open{display:flex;}
.ln-mobile-link{padding:13px 16px;border-radius:12px;font-size:15px;font-weight:500;
  text-decoration:none;border:none;cursor:pointer;text-align:left;
  font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s;
  display:flex;align-items:center;gap:10px;width:100%;}

/* HERO */
.ln-hero-section{min-height:100vh;display:flex;flex-direction:column;align-items:center;
  justify-content:center;padding:110px 48px 60px;position:relative;text-align:center;overflow:hidden;}
.ln-hero-h1{font-size:clamp(32px,7vw,76px);font-weight:800;line-height:1.05;
  letter-spacing:-2px;max-width:820px;}
.ln-hero-p{margin-top:20px;font-size:clamp(14px,2vw,17px);max-width:500px;line-height:1.7;font-weight:300;}
.ln-hero-cta{display:flex;gap:14px;margin-top:40px;flex-wrap:wrap;justify-content:center;}
.ln-hero-stats{display:flex;gap:48px;margin-top:64px;flex-wrap:wrap;justify-content:center;}

/* SECTIONS */
.ln-tools-section{padding:80px 48px;transition:background .3s;}
.ln-tools-grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.ln-tools-items{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:8px;margin-bottom:14px;}
.ln-features-section{padding:80px 48px;transition:background .3s;}
.ln-features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px;}
.ln-feat-big{grid-column:span 2;}
.ln-pricing-section{padding:80px 48px;transition:background .3s;}
.ln-pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1060px;margin:0 auto;}

/* FOOTER */
.ln-footer-grid{padding:64px 64px 48px;display:grid;grid-template-columns:1.8fr 1fr 1fr 1fr 1fr;gap:40px;}
.ln-footer-wm{font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(80px,16vw,220px);
  letter-spacing:-6px;display:block;white-space:nowrap;line-height:1;}

/* APP PAGES */
.ln-page{padding:90px 48px 48px;min-height:100vh;transition:background .3s;}
.ln-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;}
.ln-two-col{display:grid;grid-template-columns:1.6fr 1fr;gap:20px;margin-bottom:20px;}
.ln-settings-layout{display:grid;grid-template-columns:220px 1fr;gap:24px;}
.ln-settings-tabs{display:flex;flex-direction:column;gap:4px;}
.ln-invoice-meta{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px;}
.ln-journal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.ln-profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.ln-spark-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;}
.ln-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
.ln-sidebar-shift{transition:margin-left .3s cubic-bezier(.4,0,.2,1);}

/* AI PANEL */
.ln-ai-panel{position:fixed;bottom:104px;right:28px;z-index:2000;
  width:380px;height:580px;border-radius:24px;display:flex;flex-direction:column;
  overflow:hidden;animation:modalIn .25s ease;}
.ln-ai-fab{position:fixed;bottom:28px;right:28px;z-index:2001;}

/* ══════ TABLET 768-1023px ══════ */
@media(max-width:1023px){
  .ln-nav{padding:14px 24px;}
  .ln-nav-links{display:none;}
  .ln-hamburger{display:flex;}
  .ln-hero-section{padding:90px 32px 48px;}
  .ln-tools-section,.ln-features-section,.ln-pricing-section{padding:60px 24px;}
  .ln-tools-grid{grid-template-columns:1fr;}
  .ln-tools-items{grid-template-columns:repeat(auto-fill,minmax(140px,1fr));}
  .ln-features-grid{grid-template-columns:repeat(2,1fr);}
  .ln-feat-big{grid-column:span 2;}
  .ln-pricing-grid{grid-template-columns:1fr 1fr;gap:16px;}
  .ln-footer-grid{grid-template-columns:1fr 1fr;padding:48px 32px 32px;gap:28px;}
  .ln-page{padding:84px 28px 40px;}
  .ln-stats-grid{grid-template-columns:repeat(2,1fr);}
  .ln-two-col{grid-template-columns:1fr;}
  .ln-settings-layout{grid-template-columns:1fr;}
  .ln-spark-grid{grid-template-columns:repeat(2,1fr);}
  .ln-ai-panel{width:340px;}
}

/* ══════ MOBILE ≤767px ══════ */
@media(max-width:767px){
  .ln-nav{padding:12px 16px;}
  .ln-nav-links{display:none;}
  .ln-hamburger{display:flex;}
  .ln-nav-desktop-btns{display:none !important;}
  .ln-hero-section{padding:86px 16px 44px;}
  .ln-hero-h1{letter-spacing:-1px;line-height:1.1;}
  .ln-hero-cta{flex-direction:column;align-items:stretch;}
  .ln-hero-cta button,.ln-hero-cta a{width:100%;}
  .ln-hero-stats{gap:20px;margin-top:36px;}
  .ln-tools-section,.ln-features-section,.ln-pricing-section{padding:44px 16px;}
  .ln-tools-grid{grid-template-columns:1fr;gap:10px;}
  .ln-tools-items{grid-template-columns:1fr 1fr;}
  .ln-features-grid{grid-template-columns:1fr;}
  .ln-feat-big{grid-column:span 1;}
  .ln-pricing-grid{grid-template-columns:1fr;}
  .ln-footer-grid{grid-template-columns:1fr;padding:36px 20px 28px;gap:28px;}
  .ln-footer-wm{font-size:clamp(56px,22vw,110px) !important;letter-spacing:-3px !important;}
  .ln-page{padding:78px 14px 28px;}
  .ln-stats-grid{grid-template-columns:1fr 1fr;gap:10px;}
  .ln-two-col{grid-template-columns:1fr;}
  .ln-settings-layout{grid-template-columns:1fr;}
  .ln-settings-tabs{flex-direction:row;flex-wrap:wrap;gap:6px;margin-bottom:14px;}
  .ln-settings-tabs button{flex:none !important;padding:7px 12px !important;font-size:12px !important;width:auto !important;}
  .ln-invoice-meta{grid-template-columns:1fr;}
  .ln-journal-grid{grid-template-columns:1fr 1fr;}
  .ln-profile-grid{grid-template-columns:1fr;}
  .ln-spark-grid{grid-template-columns:1fr 1fr;gap:10px;}
  .ln-ai-panel{width:calc(100vw - 24px);right:12px;bottom:86px;height:68vh;max-height:500px;}
  .ln-ai-fab{bottom:18px;right:14px;}
  .ln-sidebar-shift{margin-left:0 !important;}
}
`;

/* ══════════════════════════════════════
   THEME
══════════════════════════════════════ */
const ThemeCtx = createContext({ dark:false, T:{}, toggle:()=>{} });
const useTheme = () => useContext(ThemeCtx);

const LIGHT = {
  bg:"#ffffff", bg2:"#f7f8f6", bg3:"#f0f2ee",
  border:"rgba(0,0,0,0.08)", borderStrong:"rgba(0,0,0,0.14)",
  accent:"#5ab233", accentDark:"#3d8a20", accentLight:"#e8f5e1",
  text:"#0d0d0d", muted:"#8a9286", muted2:"#555f50",
  black:"#0d0d0d", white:"#ffffff",
  card:"#ffffff", card2:"#f4f6f2",
  navBg:"rgba(255,255,255,0.93)", inputBg:"#f7f8f6",
  shadow:"rgba(0,0,0,0.06)", shadowHov:"rgba(0,0,0,0.12)",
  tabActive:"#ffffff", tabBg:"#f0f2ee",
  positive:"#16a34a", positiveBg:"#dcfce7",
  negative:"#dc2626", negativeBg:"#fee2e2",
  warn:"#ca8a04", warnBg:"#fef9c3",
};
const DARK = {
  bg:"#0d0f0d", bg2:"#131613", bg3:"#1a1e1a",
  border:"rgba(255,255,255,0.07)", borderStrong:"rgba(255,255,255,0.12)",
  accent:"#5ab233", accentDark:"#74cc4a", accentLight:"rgba(90,178,51,0.12)",
  text:"#e8ede8", muted:"#5a6b5a", muted2:"#8aa08a",
  black:"#0d0f0d", white:"#e8ede8",
  card:"#111411", card2:"#161a16",
  navBg:"rgba(13,15,13,0.93)", inputBg:"#1a1e1a",
  shadow:"rgba(0,0,0,0.3)", shadowHov:"rgba(0,0,0,0.5)",
  tabActive:"#1a1e1a", tabBg:"#0d0f0d",
  positive:"#4ade80", positiveBg:"rgba(74,222,128,0.12)",
  negative:"#f87171", negativeBg:"rgba(248,113,113,0.12)",
  warn:"#fbbf24", warnBg:"rgba(251,191,36,0.12)",
};

/* ══════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════ */
function Logo({ size=20 }) {
  const { dark } = useTheme();
  const col = dark ? "#e8ede8" : "#0d0d0d";
  return (
    <span style={{ display:"flex", alignItems:"baseline", gap:0, cursor:"pointer",
      fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1 }}>
      <span style={{ fontWeight:300, fontSize:size, color:col, letterSpacing:"-0.3px", transition:"color .3s" }}>Ledgr</span>
      <span style={{ fontWeight:800, fontSize:size, color:col, letterSpacing:"-0.3px", transition:"color .3s" }}>Now</span>
      <span style={{ fontWeight:800, fontSize:size*1.25, color:"#5ab233", lineHeight:1, marginLeft:1, position:"relative", top:1 }}>.</span>
    </span>
  );
}

function Btn({ children, variant="primary", onClick, style={}, small=false, disabled=false }) {
  const { T, dark } = useTheme();
  const variants = {
    primary:{ background: dark ? T.accentLight : T.black, color: dark ? T.accentDark : "#fff", border: dark ? `1px solid ${T.accent}` : "none" },
    green:  { background:T.accent, color:"#fff", boxShadow:`0 4px 16px rgba(90,178,51,.25)` },
    ghost:  { background:"transparent", color:T.muted2, border:`1px solid ${T.border}` },
    outline:{ background:"transparent", color:T.text, border:`1.5px solid ${T.borderStrong}` },
    danger: { background:T.negativeBg, color:T.negative, border:`1px solid ${T.negative}44` },
  };
  return (
    <button disabled={disabled}
      style={{ padding: small?"8px 18px":"11px 24px", borderRadius:9,
        fontSize: small?13:14, fontWeight:600, fontFamily:"'Plus Jakarta Sans',sans-serif",
        cursor: disabled?"not-allowed":"pointer", transition:"all .2s", border:"none",
        opacity: disabled?0.6:1, ...(variants[variant]||{}), ...style }}
      onClick={onClick}
      onMouseEnter={e=>{ if(!disabled){e.currentTarget.style.opacity=".82";e.currentTarget.style.transform="translateY(-1px)";} }}
      onMouseLeave={e=>{ e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)"; }}>
      {children}
    </button>
  );
}

function Card({ children, style={}, hover=true }) {
  const { T } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <div style={{ background:T.card, border:`1.5px solid ${hov&&hover?T.accent+"55":T.border}`,
      borderRadius:16, padding:"22px", transition:"all .25s",
      boxShadow: hov&&hover?`0 12px 40px ${T.shadowHov}`:`0 2px 8px ${T.shadow}`, ...style }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  const { T } = useTheme();
  return <div style={{ fontSize:11, letterSpacing:"2px", textTransform:"uppercase", color:T.accentDark, fontWeight:600, marginBottom:10 }}>{children}</div>;
}

function SectionTitle({ children }) {
  const { T } = useTheme();
  return <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:"clamp(24px,4vw,44px)", fontWeight:800, letterSpacing:"-1px", lineHeight:1.1, color:T.text }}>{children}</h2>;
}

function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle} style={{ width:62, height:30, borderRadius:30, border:"none", cursor:"pointer",
      padding:2, display:"flex", alignItems:"center", position:"relative",
      background: dark?"#1a1e1a":"#e8ede8", transition:"background .35s",
      boxShadow: dark?"inset 0 0 0 1.5px rgba(90,178,51,.4)":"inset 0 0 0 1.5px rgba(0,0,0,.1)", flexShrink:0 }}>
      <span style={{ position:"absolute", left:7, fontSize:12, opacity:dark?0.3:1, transition:"opacity .3s" }}>☀️</span>
      <span style={{ position:"absolute", right:7, fontSize:12, opacity:dark?1:0.3, transition:"opacity .3s" }}>🌙</span>
      <div style={{ width:24, height:24, borderRadius:"50%", background:dark?"#5ab233":"#0d0d0d",
        transform:dark?"translateX(32px)":"translateX(0px)",
        transition:"transform .35s cubic-bezier(.4,0,.2,1), background .35s",
        boxShadow:"0 2px 8px rgba(0,0,0,.25)", position:"absolute", left:3 }}/>
    </button>
  );
}

function Field({ label, type, placeholder, name, required = true }) {
  const { T } = useTheme();
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", fontSize:12, color:T.muted2, marginBottom:6 }}>{label}</label>
      <input name={name} type={type} placeholder={placeholder} required={required}
        style={{ width:"100%", padding:"11px 14px", background:T.inputBg, border:`1.5px solid ${T.border}`,
          borderRadius:9, color:T.text, fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none" }}
        onFocus={e=>e.target.style.borderColor=T.accent}
        onBlur={e=>e.target.style.borderColor=T.border}/>
    </div>
  );
}

function AuthModal({ open, onClose, defaultTab="login", onAuthenticated }) {
  const { T } = useTheme();
  const [tab, setTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(()=>{ setTab(defaultTab); },[defaultTab, open]);
  useEffect(()=>{ if(open) setError(""); },[open, tab]);
  useEffect(()=>{
    const h=(e)=>{ if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    try {
      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const result = await api(endpoint, {
        method: "POST",
        body: JSON.stringify(
          tab === "login"
            ? { email: payload.email, password: payload.password }
            : payload
        ),
      });
      setToken(result.token);
      onAuthenticated(result.user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  if(!open) return null;
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", backdropFilter:"blur(12px)",
        zIndex:3000, display:"grid", placeItems:"center", padding:16 }}>
      <div style={{ background:T.card, border:`1.5px solid ${T.border}`, borderRadius:24,
        padding:"clamp(24px,5vw,44px) clamp(18px,5vw,40px)", width:"100%", maxWidth:420,
        position:"relative", animation:"modalIn .3s ease", boxShadow:`0 24px 80px ${T.shadowHov}` }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, width:28, height:28,
          borderRadius:8, background:T.bg2, border:"none", cursor:"pointer", fontSize:15, color:T.muted }}>✕</button>
        <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:"clamp(18px,4vw,24px)",
          fontWeight:800, marginBottom:6, color:T.text }}>
          {tab==="login"?"Welcome back":"Create account"}
        </h2>
        <p style={{ fontSize:13, color:T.muted2, marginBottom:24 }}>
          {tab==="login"?"Sign in to your LedgrNow account":"Get started free — no credit card needed"}
        </p>
        <div style={{ display:"flex", gap:4, background:T.tabBg, borderRadius:10, padding:4, marginBottom:22 }}>
          {["login","signup"].map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{ flex:1, padding:"8px", borderRadius:7, border:"none", cursor:"pointer",
                fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:500, transition:"all .2s",
                background:tab===t?T.tabActive:"transparent", color:tab===t?T.text:T.muted,
                boxShadow:tab===t?`0 1px 4px ${T.shadow}`:"none" }}>
              {t==="login"?"Log In":"Sign Up"}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          {tab==="signup"&&<Field name="name" label="Full name" type="text" placeholder="Your name"/>}
          <Field name="email" label="Email address" type="email" placeholder="you@example.com"/>
          <Field name="password" label="Password" type="password" placeholder="Use a strong password"/>
          {error&&(
            <div style={{ marginBottom:12, padding:"10px 12px", borderRadius:10,
              background:"rgba(239,68,68,.12)", color:T.negative, fontSize:12, lineHeight:1.5 }}>
              {error}
            </div>
          )}
          <button disabled={loading} style={{ width:"100%", padding:13, borderRadius:10, background:T.accent,
            color:"#fff", border:"none", fontSize:14, fontWeight:600, opacity:loading ? .72 : 1,
            fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:loading?"not-allowed":"pointer", marginTop:4, transition:"all .2s" }}
            onMouseEnter={e=>{ if(!loading) e.currentTarget.style.opacity=".85"; }}
            onMouseLeave={e=>{ if(!loading) e.currentTarget.style.opacity="1"; }}>
            {loading ? "Please wait..." : tab==="login"?"Log In →":"Create Account →"}
          </button>
        </form>
        <p style={{ textAlign:"center", fontSize:12, color:T.muted, marginTop:14 }}>
          {tab==="login"
            ?<a href="/auth/forgot-password" style={{ color:T.accentDark }}>Forgot password?</a>
            :<>By signing up you agree to our <a href="#" style={{ color:T.accentDark }}>Terms</a></>}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function Toast({ toasts, remove }) {
  const { T } = useTheme();
  return (
    <div style={{ position:"fixed", bottom:18, right:14, zIndex:9999,
      display:"flex", flexDirection:"column", gap:8, maxWidth:"calc(100vw - 28px)" }}>
      {toasts.map(t=>(
        <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10,
          background:T.card2, color:T.text, padding:"11px 14px", borderRadius:12, fontSize:13,
          fontWeight:500, minWidth:240, maxWidth:340,
          boxShadow:`0 8px 32px ${T.shadowHov}`, border:`1px solid ${T.border}`,
          borderLeft:`4px solid ${t.type==="success"?T.accent:t.type==="error"?T.negative:T.accent}`,
          animation:"fadeUp .3s ease" }}>
          <span style={{ fontSize:15 }}>{t.type==="success"?"✅":t.type==="error"?"❌":"ℹ️"}</span>
          <span style={{ flex:1 }}>{t.msg}</span>
          <button onClick={()=>remove(t.id)} style={{ background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:15, lineHeight:1 }}>✕</button>
        </div>
      ))}
    </div>
  );
}
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type="success") => {
    const id = Date.now();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500);
  };
  const remove = (id) => setToasts(t=>t.filter(x=>x.id!==id));
  return { toasts, add, remove };
}

/* ══════════════════════════════════════
   NOTIFICATION PANEL
══════════════════════════════════════ */
function NotifPanel({ open, onClose }) {
  const { T } = useTheme();
  const items = [
    { icon:"📈", title:"AAPL hit your price target",       time:"2 min ago",  unread:true  },
    { icon:"🧾", title:"Invoice INV-002 due in 3 days",    time:"1 hr ago",   unread:true  },
    { icon:"✅", title:"Trade journal entry saved",         time:"3 hrs ago",  unread:false },
    { icon:"⚠️", title:"NVDA position down 5%",            time:"5 hrs ago",  unread:true  },
    { icon:"💳", title:"Pro plan renews in 7 days",        time:"Yesterday",  unread:false },
  ];
  if(!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:1998 }}/>
      <div style={{ position:"fixed", top:66, right:14,
        width:"min(340px,calc(100vw - 28px))", zIndex:1999,
        background:T.card, border:`1.5px solid ${T.border}`, borderRadius:16,
        boxShadow:`0 16px 56px ${T.shadowHov}`, animation:"slideDown .2s ease", overflow:"hidden" }}>
        <div style={{ padding:"13px 18px", borderBottom:`1px solid ${T.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontWeight:700, fontSize:14, color:T.text }}>Notifications</div>
          <button style={{ background:"none", border:"none", fontSize:12, color:T.accentDark,
            fontWeight:600, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Mark all read</button>
        </div>
        <div style={{ maxHeight:340, overflowY:"auto" }}>
          {items.map((n,i)=>(
            <div key={i} style={{ display:"flex", gap:10, padding:"12px 18px",
              borderBottom:`1px solid ${T.border}`,
              background:n.unread?T.accentLight:"transparent", cursor:"pointer" }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{n.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:n.unread?600:400, color:T.text }}>{n.title}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{n.time}</div>
              </div>
              {n.unread&&<div style={{ width:7, height:7, borderRadius:"50%", background:T.accent, flexShrink:0, marginTop:4 }}/>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════
   ALL MODULES
══════════════════════════════════════ */
const ALL_MODULES = [
  { id:"trading",icon:"📈",color:"#5ab233",name:"Trading",desc:"Trade journals, watchlists, risk tools & analytics",
    items:[
      {label:"Trade Journal",icon:"📓",page:"trade-journal"},
      {label:"Watchlist",icon:"👁",page:"watchlist"},
      {label:"Trading Plans",icon:"📋",page:"trading-plans"},
      {label:"Backtesting Notes",icon:"🔬",page:"backtesting"},
      {label:"Risk Calculator",icon:"⚖️",page:"risk-calculator"},
      {label:"Position Size Calculator",icon:"📐",page:"position-size"},
      {label:"P&L Analytics",icon:"📊",page:"pnl-analytics"},
      {label:"Strategy Tracker",icon:"🎯",page:"strategy-tracker"},
    ]},
  { id:"ai",icon:"🤖",color:"#6366f1",name:"AI Trading Assistant",desc:"AI-powered trade reviews, coaching & pattern recognition",
    items:[
      {label:"Trade Review",icon:"🔍",page:"trade-review"},
      {label:"Mistake Detection",icon:"⚠️",page:"mistake-detection"},
      {label:"Performance Analysis",icon:"📈",page:"performance-analysis"},
      {label:"Daily Trade Summary",icon:"📅",page:"daily-summary"},
      {label:"AI Coach",icon:"🧠",page:"ai-coach"},
      {label:"Pattern Recognition",icon:"🔮",page:"pattern-recognition"},
    ]},
  { id:"personal",icon:"🏠",color:"#f59e0b",name:"Personal Finance",desc:"Budgets, savings goals, net worth & EMI tracking",
    items:[
      {label:"Expense Tracker",icon:"💸",page:"expense-tracker"},
      {label:"Budget Planner",icon:"📊",page:"budget-planner"},
      {label:"Savings Goals",icon:"🎯",page:"savings-goals"},
      {label:"Debt Tracker",icon:"📉",page:"debt-tracker"},
      {label:"Net Worth Dashboard",icon:"💰",page:"net-worth"},
      {label:"EMI Calculator",icon:"🧮",page:"emi-calculator"},
    ]},
  { id:"business",icon:"🏢",color:"#0ea5e9",name:"Business Finance",desc:"Income, expenses, P&L, GST & financial statements",
    items:[
      {label:"Income Tracking",icon:"💵",page:"income-tracking"},
      {label:"Expense Management",icon:"💳",page:"expense-management"},
      {label:"Profit & Loss",icon:"📈",page:"profit-loss"},
      {label:"Balance Sheet",icon:"⚖️",page:"balance-sheet"},
      {label:"Cash Flow",icon:"🔄",page:"cash-flow"},
      {label:"GST Reports",icon:"🧾",page:"gst-reports"},
      {label:"Financial Statements",icon:"📑",page:"financial-statements"},
    ]},
  { id:"invoice",icon:"🧾",color:"#5ab233",name:"Invoice & Billing",desc:"Create invoices, track payments & manage clients",
    items:[
      {label:"Create Invoices",icon:"✏️",page:"create-invoices"},
      {label:"Recurring Invoices",icon:"🔁",page:"recurring-invoices"},
      {label:"Payment Tracking",icon:"💰",page:"payment-tracking"},
      {label:"Client Management",icon:"👥",page:"client-management"},
      {label:"Quotation Generator",icon:"📄",page:"quotations"},
    ]},
  { id:"loans",icon:"🏦",color:"#ef4444",name:"Loan Management",desc:"Track personal loans, EMI schedules & interest",
    items:[
      {label:"Personal Loans",icon:"💼",page:"personal-loans"},
      {label:"Borrowed Money Tracker",icon:"📥",page:"borrowed-money"},
      {label:"Lending Tracker",icon:"📤",page:"lending-tracker"},
      {label:"Interest Calculator",icon:"🧮",page:"interest-calculator"},
      {label:"EMI Schedule",icon:"📅",page:"emi-schedule"},
    ]},
  { id:"investments",icon:"📊",color:"#a855f7",name:"Investments",desc:"Stocks, mutual funds, crypto, dividends & SIP",
    items:[
      {label:"Stocks Portfolio",icon:"📈",page:"stocks-portfolio"},
      {label:"Mutual Funds",icon:"🏦",page:"mutual-funds"},
      {label:"Crypto Portfolio",icon:"₿",page:"crypto-portfolio"},
      {label:"Dividend Tracker",icon:"💹",page:"dividend-tracker"},
      {label:"SIP Tracker",icon:"🔄",page:"sip-tracker"},
    ]},
  { id:"tax",icon:"🧮",color:"#f97316",name:"Tax Center",desc:"Tax calculators, capital gains & export reports",
    items:[
      {label:"Tax Calculator",icon:"🧮",page:"tax-calculator"},
      {label:"Capital Gains Report",icon:"📊",page:"capital-gains"},
      {label:"Tax Summary",icon:"📋",page:"tax-summary"},
      {label:"Export Reports",icon:"📤",page:"export-reports"},
    ]},
  { id:"vault",icon:"🔒",color:"#64748b",name:"Documents Vault",desc:"Secure storage for PAN, Aadhaar, statements & contracts",
    items:[
      {label:"PAN Card Storage",icon:"🪪",page:"pan-storage"},
      {label:"Aadhaar Storage",icon:"🪪",page:"aadhaar-storage"},
      {label:"Bank Statements",icon:"🏦",page:"bank-statements"},
      {label:"Trade Reports",icon:"📊",page:"trade-reports"},
      {label:"Invoices",icon:"🧾",page:"create-invoices"},
      {label:"Contracts",icon:"📝",page:"contracts"},
    ]},
  { id:"productivity",icon:"✅",color:"#14b8a6",name:"Productivity",desc:"Notes, goals, tasks, calendar & reminders",
    items:[
      {label:"Notes",icon:"📝",page:"notes"},
      {label:"Goals",icon:"🎯",page:"goals"},
      {label:"Tasks",icon:"✅",page:"tasks"},
      {label:"Financial Calendar",icon:"📅",page:"financial-calendar"},
      {label:"Reminders",icon:"🔔",page:"reminders"},
    ]},
];

/* ══════════════════════════════════════
   APP SIDEBAR
══════════════════════════════════════ */
function AppSidebar({ setPage, sideOpen, setSideOpen }) {
  const { T, dark } = useTheme();
  const [expandedCat, setExpandedCat] = useState("trading");
  return (
    <>
      {sideOpen&&<div onClick={()=>setSideOpen(false)}
        style={{ position:"fixed",inset:0,zIndex:997,background:"rgba(0,0,0,.35)" }}/>}
      <div style={{ position:"fixed",top:0,left:0,bottom:0,
        width:sideOpen?270:0,background:dark?"#0a0c0a":"#fff",
        borderRight:`1px solid ${T.border}`,zIndex:998,
        transition:"width .3s cubic-bezier(.4,0,.2,1)",
        overflow:"hidden",display:"flex",flexDirection:"column",
        boxShadow:sideOpen?`4px 0 24px ${T.shadow}`:"none" }}>
        <div style={{ padding:"15px 18px 10px",borderBottom:`1px solid ${T.border}`,
          display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,marginTop:64 }}>
          <div style={{ fontWeight:700,fontSize:11,color:T.muted,letterSpacing:"1px",textTransform:"uppercase" }}>Modules</div>
          <button onClick={()=>setSideOpen(false)}
            style={{ background:"none",border:"none",cursor:"pointer",color:T.muted,fontSize:20 }}>×</button>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"6px 0" }}>
          {ALL_MODULES.map(cat=>(
            <div key={cat.id}>
              <div onClick={()=>setExpandedCat(expandedCat===cat.id?null:cat.id)}
                style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 16px",cursor:"pointer",
                  background:expandedCat===cat.id?`${cat.color}12`:"transparent",transition:"background .2s" }}
                onMouseEnter={e=>e.currentTarget.style.background=`${cat.color}10`}
                onMouseLeave={e=>e.currentTarget.style.background=expandedCat===cat.id?`${cat.color}12`:"transparent"}>
                <span style={{ width:28,height:28,borderRadius:7,flexShrink:0,
                  background:`${cat.color}18`,display:"grid",placeItems:"center",fontSize:14 }}>{cat.icon}</span>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:600,fontSize:12,color:T.text,
                    whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{cat.name}</div>
                </div>
                <span style={{ fontSize:11,color:T.muted,transition:"transform .2s",
                  transform:expandedCat===cat.id?"rotate(180deg)":"none" }}>⌄</span>
              </div>
              {expandedCat===cat.id&&(
                <div>
                  {cat.items.map(item=>(
                    <div key={item.label} onClick={()=>{ setPage(item.page); setSideOpen(false); }}
                      style={{ display:"flex",alignItems:"center",gap:8,
                        padding:"7px 16px 7px 32px",cursor:"pointer",transition:"all .15s",
                        borderLeft:"2px solid transparent" }}
                      onMouseEnter={e=>{ const el=e.currentTarget; el.style.background=`${cat.color}10`; el.style.borderLeftColor=cat.color; }}
                      onMouseLeave={e=>{ const el=e.currentTarget; el.style.background="transparent"; el.style.borderLeftColor="transparent"; }}>
                      <span style={{ fontSize:13 }}>{item.icon}</span>
                      <span style={{ fontSize:12,color:T.muted2 }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════
   NAV
══════════════════════════════════════ */
function NavFull({ page, setPage, onAuth, sideOpen, setSideOpen, user, onSignOut }) {
  const { T, dark } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isApp = page !== "home";
  const appLinks = [
    {id:"dashboard",label:"Dashboard",icon:"📊"},
    {id:"trade-journal",label:"Journal",icon:"📓"},
    {id:"watchlist",label:"Watchlist",icon:"👁"},
    {id:"create-invoices",label:"Invoices",icon:"🧾"},
    {id:"financial-statements",label:"Financials",icon:"🏦"},
    {id:"settings",label:"Settings",icon:"⚙️"},
  ];
  const landingLinks = [["home","Home"],["tools","Tools"],["features","Features"],["pricing","Pricing"]];

  return (
    <>
      <nav className="ln-nav" style={{ background:T.navBg, borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <div onClick={()=>setPage("home")} style={{ cursor:"pointer" }}><Logo/></div>
          {isApp&&(
            <button onClick={()=>setSideOpen(o=>!o)}
              style={{ width:33,height:33,borderRadius:8,border:`1px solid ${T.border}`,
                background:sideOpen?T.accentLight:"transparent",cursor:"pointer",
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                gap:4,padding:"8px",transition:"all .2s",flexShrink:0 }}>
              {[0,1,2].map(i=>(
                <span key={i} style={{ display:"block",height:2,borderRadius:2,
                  background:sideOpen?T.accent:T.muted2,transition:"all .3s",
                  width:i===1?(sideOpen?"60%":"100%"):"100%" }}/>
              ))}
            </button>
          )}
        </div>

        <div className="ln-nav-links">
          {isApp ? appLinks.map(l=>(
            <button key={l.id} onClick={()=>setPage(l.id)}
              style={{ padding:"7px 13px",borderRadius:8,border:"none",cursor:"pointer",
                fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,
                fontWeight:page===l.id?600:400,
                background:page===l.id?T.accentLight:"transparent",
                color:page===l.id?T.accentDark:T.muted2,transition:"all .2s" }}>
              {l.icon} {l.label}
            </button>
          )) : landingLinks.map(([id,label])=>(
            <a key={id} href={`#${id}`}
              style={{ padding:"7px 13px",borderRadius:8,fontSize:13,
                color:T.muted2,textDecoration:"none",transition:"all .2s" }}
              onMouseEnter={e=>{ const a=e.target; a.style.color=T.text; a.style.background=dark?"rgba(255,255,255,.05)":"rgba(0,0,0,.04)"; }}
              onMouseLeave={e=>{ const a=e.target; a.style.color=T.muted2; a.style.background="transparent"; }}>
              {label}
            </a>
          ))}
        </div>

        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <ThemeToggle/>
          {isApp ? (
            <>
              <div style={{ position:"relative" }}>
                <button onClick={()=>{ setNotifOpen(o=>!o); setProfileOpen(false); }}
                  style={{ width:33,height:33,borderRadius:8,border:`1px solid ${T.border}`,
                    background:"transparent",cursor:"pointer",fontSize:14,
                    display:"grid",placeItems:"center",position:"relative" }}>
                  🔔
                  <span style={{ position:"absolute",top:-4,right:-4,width:15,height:15,
                    borderRadius:"50%",background:T.accent,color:"#fff",
                    fontSize:8,fontWeight:700,display:"grid",placeItems:"center",
                    border:`2px solid ${T.bg}` }}>3</span>
                </button>
                <NotifPanel open={notifOpen} onClose={()=>setNotifOpen(false)}/>
              </div>
              <button onClick={()=>setPage("settings")}
                style={{ width:33,height:33,borderRadius:8,border:`1px solid ${T.border}`,
                  background:page==="settings"?T.accentLight:"transparent",
                  cursor:"pointer",fontSize:14,display:"grid",placeItems:"center" }}>⚙️</button>
              <div style={{ position:"relative" }}>
                <div onClick={()=>{ setProfileOpen(o=>!o); setNotifOpen(false); }}
                  style={{ width:33,height:33,borderRadius:"50%",
                    background:`linear-gradient(135deg,${T.accent},${T.accentDark})`,
                    display:"grid",placeItems:"center",cursor:"pointer",
                    fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:800,color:"#fff" }}>A</div>
                {profileOpen&&(
                  <>
                    <div onClick={()=>setProfileOpen(false)} style={{ position:"fixed",inset:0,zIndex:1998 }}/>
                    <div style={{ position:"absolute",top:41,right:0,width:185,zIndex:1999,
                      background:T.card,border:`1.5px solid ${T.border}`,borderRadius:14,
                      boxShadow:`0 12px 40px ${T.shadowHov}`,overflow:"hidden",animation:"slideDown .2s ease" }}>
                      <div style={{ padding:"12px 14px",borderBottom:`1px solid ${T.border}` }}>
                        <div style={{ fontWeight:600,fontSize:13,color:T.text }}>{user?.name || "LedgrNow User"}</div>
                        <div style={{ fontSize:11,color:T.muted }}>{user?.email || "Signed in"}</div>
                      </div>
                      {[
                        {icon:"⚙️",label:"Settings",action:()=>{ setPage("settings"); setProfileOpen(false); }},
                        {icon:"💳",label:"Billing",action:()=>{ setPage("settings"); setProfileOpen(false); }},
                        {icon:"🔐",label:"Security",action:()=>{ setPage("settings"); setProfileOpen(false); }},
                        {icon:"🚪",label:"Sign out",action:()=>{ onSignOut(); setProfileOpen(false); },danger:true},
                      ].map(item=>(
                        <button key={item.label} onClick={item.action}
                          style={{ display:"flex",alignItems:"center",gap:9,width:"100%",
                            padding:"10px 14px",border:"none",background:"transparent",
                            cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,
                            color:(item).danger?T.negative:T.muted2,textAlign:"left",transition:"background .15s" }}
                          onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          {item.icon} {item.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="ln-nav-desktop-btns" style={{ display:"flex",gap:8 }}>
                <Btn variant="ghost" onClick={()=>onAuth("login")} small>Log in</Btn>
                <Btn variant="green" onClick={()=>onAuth("signup")} small>Get Started</Btn>
              </div>
              <button className="ln-hamburger" onClick={()=>setMobileOpen(o=>!o)}
                style={{ border:`1px solid ${T.border}`,borderRadius:8 }}>
                {[0,1,2].map(i=>(
                  <span key={i} style={{ background:T.muted2 }}/>
                ))}
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu for landing */}
      {!isApp&&(
        <div className={`ln-mobile-menu${mobileOpen?" open":""}`}
          style={{ background:T.card,borderBottom:`1px solid ${T.border}` }}>
          {landingLinks.map(([id,label])=>(
            <a key={id} href={`#${id}`} className="ln-mobile-link"
              onClick={()=>setMobileOpen(false)}
              style={{ background:T.bg2,color:T.text }}>
              {label}
            </a>
          ))}
          <div style={{ height:1,background:T.border,margin:"6px 0" }}/>
          <button className="ln-mobile-link" onClick={()=>{ onAuth("login"); setMobileOpen(false); }}
            style={{ background:T.bg2,color:T.text }}>Log in</button>
          <button className="ln-mobile-link" onClick={()=>{ onAuth("signup"); setMobileOpen(false); }}
            style={{ background:T.accent,color:"#fff",fontWeight:600 }}>Get Started →</button>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════
   HERO
══════════════════════════════════════ */
function Hero({ setPage }) {
  const { T, dark } = useTheme();
  return (
    <section id="home" className="ln-hero-section" style={{ background:T.bg, transition:"background .3s" }}>
      <div style={{ position:"absolute",inset:0,pointerEvents:"none",
        backgroundImage:`linear-gradient(${T.accent}0a 1px,transparent 1px),linear-gradient(90deg,${T.accent}0a 1px,transparent 1px)`,
        backgroundSize:"56px 56px",
        WebkitMaskImage:"radial-gradient(ellipse at 50% 50%,black 25%,transparent 75%)" }}/>
      <div style={{ position:"absolute",width:"min(600px,90vw)",height:"min(600px,90vw)",borderRadius:"50%",
        background:`radial-gradient(circle,${dark?"rgba(90,178,51,.07)":"rgba(90,178,51,.06)"} 0%,transparent 70%)`,
        top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none" }}/>
      <div className="fade-up" style={{ display:"inline-flex",alignItems:"center",gap:8,
        padding:"6px 14px",borderRadius:50,border:`1px solid ${T.accent}55`,
        background:T.accentLight,fontSize:12,fontWeight:500,color:T.accentDark,marginBottom:24 }}>
        <span style={{ width:6,height:6,borderRadius:"50%",background:T.accent,display:"inline-block" }}/>
        Now in Public Beta
      </div>
      <h1 className="ln-hero-h1 fade-up-1" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",color:T.text }}>
        Your Complete<br/><span style={{ color:T.accent }}>Financial Command</span> Center
      </h1>
      <p className="ln-hero-p fade-up-2" style={{ color:T.muted2 }}>
        Trade smarter, journal every move, read financial statements, generate invoices — all in one powerful platform.
      </p>
      <div className="ln-hero-cta fade-up-3">
        <Btn variant="green" onClick={()=>setPage("dashboard")} style={{ padding:"13px 32px",fontSize:15 }}>Start for Free →</Btn>
        <Btn variant="outline" onClick={()=>document.getElementById("tools")?.scrollIntoView({behavior:"smooth"})}
          style={{ padding:"13px 32px",fontSize:15 }}>Explore Tools</Btn>
      </div>
      <div className="ln-hero-stats fade-up-4">
        {[["12K+","Active Traders"],["$2.4B","Volume Tracked"],["98.9%","Uptime"],["50+","Exchanges"]].map(([n,l])=>(
          <div key={l} style={{ textAlign:"center",minWidth:80 }}>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(20px,4vw,28px)",fontWeight:800,color:T.text }}>{n}</div>
            <div style={{ fontSize:12,color:T.muted,marginTop:3,letterSpacing:"0.5px" }}>{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   TOOLS SECTION
══════════════════════════════════════ */
function ToolsSection({ setPage }) {
  const { T, dark } = useTheme();
  const [open, setOpen] = useState(null);
  return (
    <section id="tools" className="ln-tools-section" style={{ background:T.bg2 }}>
      <div style={{ textAlign:"center", marginBottom:52 }}>
        <SectionLabel>Everything in one place</SectionLabel>
        <SectionTitle>Pick Your Workflow</SectionTitle>
        <p style={{ fontSize:"clamp(13px,2vw,16px)", color:T.muted2, marginTop:14,
          maxWidth:540, margin:"14px auto 0", lineHeight:1.8 }}>
          10 powerful modules covering every aspect of your financial life.
          Click any category to explore its tools.
        </p>
      </div>
      <div className="ln-tools-grid">
        {ALL_MODULES.map(cat=>(
          <div key={cat.id} style={{ borderRadius:16 }}>
            <div onClick={()=>setOpen(open===cat.id?null:cat.id)}
              style={{ display:"flex", alignItems:"center", gap:14,
                background: open===cat.id ? `linear-gradient(135deg,${cat.color}22,${cat.color}0a)` : dark ? T.card : "#fff",
                border:`2px solid ${open===cat.id ? cat.color : T.border}`,
                borderRadius: open===cat.id ? "14px 14px 0 0" : 14,
                padding:"16px 20px", cursor:"pointer", transition:"all .25s",
                boxShadow: open===cat.id ? `0 8px 32px ${cat.color}30` : dark?"none":"0 2px 12px rgba(0,0,0,.06)" }}
              onMouseEnter={e=>{ if(open!==cat.id){ const el=e.currentTarget; el.style.borderColor=cat.color; el.style.boxShadow=`0 4px 20px ${cat.color}20`; } }}
              onMouseLeave={e=>{ if(open!==cat.id){ const el=e.currentTarget; el.style.borderColor=T.border; el.style.boxShadow=dark?"none":"0 2px 12px rgba(0,0,0,.06)"; } }}>
              <div style={{ width:46, height:46, borderRadius:12, flexShrink:0,
                background:`${cat.color}20`, display:"grid", placeItems:"center",
                fontSize:22, border:`1.5px solid ${cat.color}30`,
                boxShadow:`0 4px 12px ${cat.color}20` }}>{cat.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:"clamp(13px,2vw,15px)", color:T.text,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:2 }}>{cat.name}</div>
                <div style={{ fontSize:12, color:T.muted, overflow:"hidden",
                  textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{cat.desc}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                <span style={{ fontSize:11, color: open===cat.id ? cat.color : T.muted,
                  background: open===cat.id ? `${cat.color}18` : T.bg3,
                  padding:"3px 9px", borderRadius:20, fontWeight:600,
                  whiteSpace:"nowrap", border:`1px solid ${open===cat.id?cat.color+"44":T.border}` }}>
                  {cat.items.length} tools
                </span>
                <div style={{ width:28, height:28, borderRadius:8, display:"grid", placeItems:"center",
                  background: open===cat.id ? cat.color : T.bg3, transition:"all .25s" }}>
                  <span style={{ fontSize:13, color: open===cat.id ? "#fff" : T.muted,
                    transform: open===cat.id?"rotate(180deg)":"none",
                    transition:"transform .3s", display:"block", lineHeight:1 }}>⌄</span>
                </div>
              </div>
            </div>
            {open===cat.id&&(
              <div style={{ background: dark ? T.card2 : "#fff",
                border:`2px solid ${cat.color}`, borderTop:"none",
                borderRadius:"0 0 14px 14px", padding:"20px 20px 18px",
                animation:"slideDown .25s ease", boxShadow:`0 12px 40px ${cat.color}18` }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"1.5px",
                  textTransform:"uppercase", color:cat.color, marginBottom:14,
                  display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ height:1, flex:1, background:`${cat.color}30` }}/>
                  {cat.items.length} Available Tools
                  <div style={{ height:1, flex:1, background:`${cat.color}30` }}/>
                </div>
                <div className="ln-tools-items">
                  {cat.items.map(item=>(
                    <div key={item.label} onClick={()=>setPage(item.page)}
                      style={{ display:"flex", alignItems:"center", gap:9, padding:"10px 12px",
                        borderRadius:10, background: dark ? T.bg3 : T.bg2,
                        border:`1.5px solid ${T.border}`, cursor:"pointer",
                        transition:"all .2s", fontSize:12, color:T.muted2, fontWeight:500 }}
                      onMouseEnter={e=>{ const el=e.currentTarget; el.style.background=`${cat.color}15`; el.style.borderColor=cat.color; el.style.color=T.text; el.style.transform="translateY(-1px)"; el.style.boxShadow=`0 4px 12px ${cat.color}20`; }}
                      onMouseLeave={e=>{ const el=e.currentTarget; el.style.background=dark?T.bg3:T.bg2; el.style.borderColor=T.border; el.style.color=T.muted2; el.style.transform="translateY(0)"; el.style.boxShadow="none"; }}>
                      <span style={{ fontSize:15, flexShrink:0 }}>{item.icon}</span>
                      <span style={{ lineHeight:1.3 }}>{item.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  marginTop:16, paddingTop:14, borderTop:`1px solid ${cat.color}20`, flexWrap:"wrap", gap:10 }}>
                  <span style={{ fontSize:13, color:T.muted2 }}>Ready to get started?</span>
                  <button onClick={()=>setPage(cat.items[0].page)}
                    style={{ padding:"9px 22px", borderRadius:10, border:"none",
                      background:cat.color, color:"#fff", fontSize:13, fontWeight:700,
                      fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:"pointer",
                      boxShadow:`0 4px 16px ${cat.color}50`, transition:"all .2s",
                      display:"flex", alignItems:"center", gap:8 }}
                    onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow=`0 8px 24px ${cat.color}60`; }}
                    onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=`0 4px 16px ${cat.color}50`; }}>
                    Open {cat.name} <span style={{ fontSize:16 }}>→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   FEATURES
══════════════════════════════════════ */
const FEATS = [
  { icon:"📊",title:"Real-Time Trading Dashboard",big:true,
    desc:"Monitor live prices, execute trades, manage open positions across 50+ exchanges. Advanced charting with 100+ technical indicators.",
    tags:["Live Data","Multi-exchange","TradingView Charts","Risk Management"] },
  { icon:"🧠",title:"AI-Powered Trade Journal",big:false,
    desc:"Auto-log every trade with entry/exit, rationale, and emotion tagging. AI surfaces patterns in wins and losses.",
    tags:["Auto-import","AI Insights"] },
  { icon:"📑",title:"Company Financial Statements",big:false,
    desc:"Access 10 years of income statements, balance sheets, and cash flow for 30,000+ companies globally.",
    tags:["30K Companies","10-yr History"] },
  { icon:"🧾",title:"Invoice Generator",big:false,
    desc:"Create branded invoices in seconds. Track payments, set reminders for overdue amounts.",
    tags:["PDF Export","Payment Tracking"] },
  { icon:"🔐",title:"Bank-Grade Security",big:false,
    desc:"256-bit AES encryption, 2FA, OAuth2, and read-only API keys — your funds are always safe.",
    tags:["2FA","Read-only APIs"] },
  { icon:"📤",title:"Reports & Exports",big:false,
    desc:"Generate tax-ready reports, export trades to CSV, send financial summaries in one click.",
    tags:["Tax Reports","CSV / PDF"] },
];
function FeatCard({ icon,title,desc,tags,big }) {
  const { T } = useTheme();
  const [hov,setHov] = useState(false);
  return (
    <div className={big?"ln-feat-big":""}
      style={{ background:T.card,border:`1.5px solid ${hov?T.accent+"55":T.border}`,
        borderRadius:16,padding:"clamp(18px,3vw,28px)",position:"relative",overflow:"hidden",
        transform:hov?"translateY(-4px)":"none",
        boxShadow:hov?`0 16px 48px ${T.shadowHov}`:`0 2px 8px ${T.shadow}`,transition:"all .25s" }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:T.accent,
        transform:hov?"scaleX(1)":"scaleX(0)",transformOrigin:"left",transition:"transform .3s" }}/>
      <div style={{ width:44,height:44,borderRadius:12,background:T.accentLight,
        display:"grid",placeItems:"center",fontSize:20,marginBottom:16 }}>{icon}</div>
      <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(14px,2vw,17px)",
        fontWeight:700,marginBottom:8,color:T.text }}>{title}</h3>
      <p style={{ fontSize:"clamp(12px,1.5vw,14px)",color:T.muted2,lineHeight:1.7 }}>{desc}</p>
      <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginTop:12 }}>
        {tags.map(t=>(<span key={t} style={{ fontSize:11,padding:"3px 9px",borderRadius:20,
          border:`1px solid ${T.border}`,color:T.muted,background:T.bg2 }}>{t}</span>))}
      </div>
    </div>
  );
}
function FeaturesSection() {
  const { T } = useTheme();
  return (
    <section id="features" className="ln-features-section" style={{ background:T.bg }}>
      <div style={{ maxWidth:560 }}>
        <SectionLabel>Platform Features</SectionLabel>
        <SectionTitle>Everything a serious trader needs</SectionTitle>
        <p style={{ fontSize:"clamp(13px,2vw,15px)",color:T.muted2,marginTop:12,lineHeight:1.7 }}>
          Built for retail traders, analysts, and finance teams.
        </p>
      </div>
      <div className="ln-features-grid">
        {FEATS.map(f=><FeatCard key={f.title} {...f}/>)}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   PRICING
══════════════════════════════════════ */
const PLANS = [
  { name:"Starter",monthly:0,annual:0,desc:"Perfect for getting started with trading journals and basic financials.",
    features:["Trading Journal (50 entries/mo)","Basic Financial Statements","5 Invoices per month","1 Exchange Connection"],
    missing:["Live Trading Dashboard","AI Trade Analysis","Tax Reports"],popular:false },
  { name:"Pro",monthly:29,annual:20,popular:true,desc:"For active traders who need full journaling, live data, and billing tools.",
    features:["Unlimited Journal Entries","Full Financial Statements (10yr)","Unlimited Invoices","5 Exchange Connections","Live Trading Dashboard","AI Trade Analysis"],
    missing:["Tax Reports"] },
  { name:"Enterprise",monthly:99,annual:69,popular:false,desc:"For teams and firms needing advanced reporting, APIs, and team management.",
    features:["Everything in Pro","Team Accounts (10 seats)","Tax & Compliance Reports","Unlimited Exchanges","Custom Invoice Branding","Priority Support","API Access"],
    missing:[] },
];
function PlanCard({ plan,annual,onAuth }) {
  const { T } = useTheme();
  const price = annual?plan.annual:plan.monthly;
  return (
    <div style={{ background:plan.popular?T.black:T.card,
      border:`1.5px solid ${plan.popular?T.accent:T.border}`,
      borderRadius:20,padding:"clamp(22px,4vw,34px) clamp(18px,3vw,30px)",position:"relative",
      boxShadow:plan.popular?`0 8px 40px ${T.accent}22`:"none",transition:"background .3s" }}>
      {plan.popular&&(
        <div style={{ position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",
          background:T.accent,color:"#fff",fontSize:11,fontWeight:700,
          padding:"4px 16px",borderRadius:20,whiteSpace:"nowrap" }}>⭐ Most Popular</div>
      )}
      <div style={{ fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",
        color:plan.popular?"rgba(255,255,255,.4)":T.muted,marginBottom:14 }}>{plan.name}</div>
      <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",
        fontSize:"clamp(34px,5vw,48px)",fontWeight:800,letterSpacing:"-2px",lineHeight:1,
        color:plan.popular?"#fff":T.text }}>
        <sup style={{ fontSize:"clamp(15px,3vw,22px)",verticalAlign:"top",marginTop:6 }}>$</sup>
        {price}
        <sub style={{ fontSize:13,color:plan.popular?"rgba(255,255,255,.4)":T.muted,fontWeight:400,letterSpacing:0 }}>/mo</sub>
      </div>
      <p style={{ fontSize:13,color:plan.popular?"rgba(255,255,255,.55)":T.muted2,margin:"10px 0 18px",lineHeight:1.6 }}>{plan.desc}</p>
      <div style={{ height:1,background:plan.popular?"rgba(255,255,255,.1)":T.border,marginBottom:16 }}/>
      <ul style={{ listStyle:"none",display:"flex",flexDirection:"column",gap:10,marginBottom:22 }}>
        {plan.features.map(f=>(
          <li key={f} style={{ display:"flex",alignItems:"center",gap:9,fontSize:13,
            color:plan.popular?"rgba(255,255,255,.8)":T.muted2 }}>
            <span style={{ width:17,height:17,borderRadius:"50%",display:"grid",placeItems:"center",
              background:plan.popular?"rgba(90,178,51,.2)":T.accentLight,
              color:T.accent,fontSize:9,fontWeight:700,flexShrink:0 }}>✓</span>{f}
          </li>
        ))}
        {plan.missing.map(f=>(
          <li key={f} style={{ display:"flex",alignItems:"center",gap:9,fontSize:13,
            color:plan.popular?"rgba(255,255,255,.25)":T.muted }}>
            <span style={{ width:17,height:17,borderRadius:"50%",display:"grid",placeItems:"center",
              background:T.bg2,color:T.muted,fontSize:9,flexShrink:0 }}>–</span>{f}
          </li>
        ))}
      </ul>
      <button onClick={()=>onAuth("signup")}
        style={{ width:"100%",padding:"12px",borderRadius:10,cursor:"pointer",
          fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:600,transition:"all .2s",
          background:plan.popular?T.accent:"transparent",color:plan.popular?"#fff":T.text,
          border:plan.popular?"none":`1.5px solid ${T.border}` }}>
        {plan.name==="Starter"?"Get Started Free":plan.name==="Pro"?"Start Pro Trial":"Contact Sales"}
      </button>
    </div>
  );
}
function PricingSection({ onAuth }) {
  const { T } = useTheme();
  const [annual,setAnnual] = useState(true);
  return (
    <section id="pricing" className="ln-pricing-section" style={{ background:T.bg2 }}>
      <div style={{ textAlign:"center",marginBottom:48 }}>
        <SectionLabel>Pricing</SectionLabel>
        <SectionTitle>Simple, Transparent Plans</SectionTitle>
        <p style={{ fontSize:"clamp(13px,2vw,15px)",color:T.muted2,marginTop:12 }}>Start free. Scale grow. No hidden fees.</p>
        <div style={{ display:"inline-flex",alignItems:"center",gap:10,marginTop:18,
          background:T.bg3,borderRadius:50,padding:"6px 18px",fontSize:13,color:T.muted2,
          border:`1px solid ${T.border}`,flexWrap:"wrap",justifyContent:"center" }}>
          Monthly
          <div onClick={()=>setAnnual(a=>!a)} style={{ width:36,height:20,borderRadius:10,
            background:T.accent,position:"relative",cursor:"pointer",flexShrink:0 }}>
            <div style={{ position:"absolute",top:2,left:2,width:16,height:16,
              borderRadius:"50%",background:"#fff",transition:"transform .2s",
              transform:annual?"translateX(16px)":"none" }}/>
          </div>
          Annual
          <span style={{ background:T.accentLight,color:T.accentDark,fontSize:11,
            fontWeight:600,padding:"2px 8px",borderRadius:20 }}>Save 30%</span>
        </div>
      </div>
      <div className="ln-pricing-grid">
        {PLANS.map(p=><PlanCard key={p.name} plan={p} annual={annual} onAuth={onAuth}/>)}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   FOOTER
══════════════════════════════════════ */
function Footer({ setPage }) {
  const cols = [
    {heading:"Menu",links:["Home","Features","Pricing","Blog"]},
    {heading:"Navigation",links:["Trading","Journal","Financials","Invoices","Watchlist"]},
    {heading:"Company",links:["About","Careers","Privacy","Terms"]},
    {heading:"Social",links:["LinkedIn","Twitter","Instagram","TikTok"]},
  ];
  return (
    <footer style={{ background:"#0d0f0d", position:"relative" }}>
      <div style={{ height:4,background:"linear-gradient(90deg,#e040fb,#f06292,#ff7043,#ffb300,#c6e24b,#5ab233)" }}/>
      <div className="ln-footer-grid">
        <div>
          <div onClick={()=>setPage("home")} style={{ cursor:"pointer",marginBottom:14 }}><Logo/></div>
          <div style={{ fontStyle:"italic",fontSize:14,color:"rgba(255,255,255,.4)",
            fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:300,marginBottom:14 }}>
            Your Finance, in Perfect Control.
          </div>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",
            fontSize:"clamp(18px,3vw,24px)",fontWeight:800,color:"#fff",lineHeight:1.25,maxWidth:220,marginBottom:14 }}>
            Trade Smarter,<br/>Not Harder
          </div>
          <p style={{ fontSize:13,color:"rgba(255,255,255,.3)",lineHeight:1.7,maxWidth:260 }}>
            Trade, journal, analyze, and invoice — without the overwhelm.
          </p>
          <div style={{ marginTop:22,fontSize:12,color:"rgba(255,255,255,.2)" }}>
            © 2024 LedgrNow. All rights reserved.
          </div>
        </div>
        {cols.map(col=>(
          <div key={col.heading}>
            <div style={{ fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",
              color:"rgba(255,255,255,.3)",marginBottom:16 }}>{col.heading}</div>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {col.links.map(l=>(
                <a key={l} href="#" style={{ fontSize:13,color:"rgba(255,255,255,.5)",textDecoration:"none",transition:"color .2s" }}
                  onMouseEnter={e=>e.target.style.color="#fff"}
                  onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.5)"}>{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:"0 0 20px 28px", userSelect:"none", pointerEvents:"none", overflowX:"auto" }}>
        <span className="ln-footer-wm">
          <span style={{ fontWeight:300, color:"rgba(255,255,255,.07)" }}>Ledgr</span>
          <span style={{ fontWeight:800, color:"rgba(255,255,255,.07)" }}>Now</span>
          <span style={{ fontWeight:800, color:"rgba(90,178,51,.65)" }}>.</span>
        </span>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════
   DASHBOARD
══════════════════════════════════════ */
function Dashboard({ setPage }) {
  const { T } = useTheme();
  const stats = [
    {label:"Portfolio Value",value:"$84,320",change:"+2.4%",up:true,icon:"💼"},
    {label:"Today's P&L",value:"+$1,240",change:"+1.5%",up:true,icon:"📈"},
    {label:"Open Positions",value:"7",change:"3 long / 4 short",up:null,icon:"🎯"},
    {label:"Win Rate (30d)",value:"64.2%",change:"+3.1% vs last mo",up:true,icon:"🏆"},
  ];
  const trades = [
    {symbol:"AAPL",side:"BUY",qty:10,entry:182.50,current:188.20,pnl:"+$57.00",up:true},
    {symbol:"TSLA",side:"SELL",qty:5,entry:245.00,current:238.50,pnl:"+$32.50",up:true},
    {symbol:"NVDA",side:"BUY",qty:3,entry:612.00,current:598.40,pnl:"-$40.80",up:false},
    {symbol:"SPY",side:"BUY",qty:20,entry:510.00,current:514.30,pnl:"+$86.00",up:true},
    {symbol:"AMZN",side:"BUY",qty:8,entry:178.20,current:174.90,pnl:"-$26.40",up:false},
  ];
  const bars = [42,68,55,80,62,90,74,88,60,76,92,70];
  return (
    <div className="ln-page" style={{ background:T.bg2 }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(20px,4vw,28px)",fontWeight:800,color:T.text }}>Good morning 👋</h1>
        <p style={{ color:T.muted2,marginTop:3,fontSize:14 }}>Here's your financial overview for today.</p>
      </div>
      <div className="ln-stats-grid">
        {stats.map(s=>(
          <Card key={s.label} style={{ padding:"16px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:11,color:T.muted,marginBottom:5 }}>{s.label}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(16px,3vw,24px)",fontWeight:800,color:T.text }}>{s.value}</div>
                <div style={{ fontSize:11,marginTop:4,color:s.up===null?T.muted:s.up?T.positive:T.negative }}>{s.change}</div>
              </div>
              <span style={{ fontSize:22 }}>{s.icon}</span>
            </div>
          </Card>
        ))}
      </div>
      <div className="ln-two-col">
        <Card style={{ padding:"20px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8 }}>
            <div>
              <div style={{ fontWeight:700,fontSize:15,color:T.text }}>Portfolio Performance</div>
              <div style={{ fontSize:12,color:T.muted,marginTop:1 }}>Last 12 months</div>
            </div>
            <span style={{ background:T.accentLight,color:T.accentDark,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20 }}>+18.4% YTD</span>
          </div>
          <div style={{ display:"flex",alignItems:"flex-end",gap:4,height:90 }}>
            {bars.map((h,i)=>(
              <div key={i} style={{ flex:1,height:`${h}%`,borderRadius:"3px 3px 0 0",
                background:i===bars.length-1?T.accent:`${T.accent}${Math.round(35+i*8).toString(16)}` }}/>
            ))}
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",marginTop:5 }}>
            {["J","F","M","A","M","J","J","A","S","O","N","D"].map(m=>(
              <span key={m} style={{ fontSize:9,color:T.muted,flex:1,textAlign:"center" }}>{m}</span>
            ))}
          </div>
        </Card>
        <Card style={{ padding:"20px" }}>
          <div style={{ fontWeight:700,fontSize:15,color:T.text,marginBottom:12 }}>Quick Actions</div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {[
              {icon:"📈",label:"New Trade Entry",page:"journal"},
              {icon:"🏦",label:"View Financials",page:"financials"},
              {icon:"🧾",label:"Generate Invoice",page:"invoices"},
              {icon:"📊",label:"Performance Report",page:"journal"},
            ].map(a=>(
              <button key={a.label} onClick={()=>setPage(a.page)}
                style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                  borderRadius:9,border:`1.5px solid ${T.border}`,background:T.bg2,
                  cursor:"pointer",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",
                  color:T.muted2,textAlign:"left",width:"100%",transition:"all .2s" }}
                onMouseEnter={e=>{ const el=e.currentTarget; el.style.borderColor=T.accent; el.style.color=T.accentDark; el.style.background=T.accentLight; }}
                onMouseLeave={e=>{ const el=e.currentTarget; el.style.borderColor=T.border; el.style.color=T.muted2; el.style.background=T.bg2; }}>
                <span style={{ fontSize:16 }}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
      <Card style={{ padding:"20px" }}>
        <div style={{ fontWeight:700,fontSize:15,color:T.text,marginBottom:14 }}>Open Positions</div>
        <div className="ln-table-wrap">
          <table style={{ width:"100%",borderCollapse:"collapse",minWidth:480 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                {["Symbol","Side","Qty","Entry","Current","P&L"].map(h=>(
                  <th key={h} style={{ padding:"8px 10px",textAlign:"left",fontSize:10,
                    fontWeight:600,color:T.muted,letterSpacing:"1px",textTransform:"uppercase",whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.map(t=>(
                <tr key={t.symbol} style={{ borderBottom:`1px solid ${T.border}` }}>
                  <td style={{ padding:"10px",fontWeight:700,color:T.text,whiteSpace:"nowrap" }}>{t.symbol}</td>
                  <td style={{ padding:"10px" }}>
                    <span style={{ padding:"2px 7px",borderRadius:20,fontSize:10,fontWeight:600,
                      background:t.side==="BUY"?T.positiveBg:T.negativeBg,
                      color:t.side==="BUY"?T.positive:T.negative }}>{t.side}</span>
                  </td>
                  <td style={{ padding:"10px",color:T.muted2,fontSize:13 }}>{t.qty}</td>
                  <td style={{ padding:"10px",color:T.muted2,fontSize:13,whiteSpace:"nowrap" }}>${t.entry}</td>
                  <td style={{ padding:"10px",color:T.muted2,fontSize:13,whiteSpace:"nowrap" }}>${t.current}</td>
                  <td style={{ padding:"10px",fontWeight:600,fontSize:13,whiteSpace:"nowrap",color:t.up?T.positive:T.negative }}>{t.pnl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   JOURNAL
══════════════════════════════════════ */
function Journal({ toast }) {
  const { T } = useTheme();
  const [entries,setEntries] = useState([
    {id:1,date:"2024-01-15",symbol:"AAPL",side:"BUY",entry:180,exit:188,qty:10,pnl:80,emotion:"Confident",notes:"Strong earnings beat"},
    {id:2,date:"2024-01-14",symbol:"TSLA",side:"SELL",entry:250,exit:242,qty:5,pnl:40,emotion:"Neutral",notes:"Technical resistance at 250"},
    {id:3,date:"2024-01-12",symbol:"NVDA",side:"BUY",entry:610,exit:598,qty:2,pnl:-24,emotion:"Anxious",notes:"Chased the move — mistake"},
  ]);
  const [showForm,setShowForm] = useState(false);
  const [form,setForm] = useState({symbol:"",side:"BUY",entry:"",exit:"",qty:"",emotion:"Neutral",notes:""});
  const inp = { width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text };
  const addEntry = () => {
    if(!form.symbol||!form.entry||!form.exit) return;
    const pnl=(parseFloat(form.exit)-parseFloat(form.entry))*parseInt(form.qty||"1")*(form.side==="SELL"?-1:1);
    setEntries(e=>[{id:Date.now(),date:new Date().toISOString().slice(0,10),
      symbol:form.symbol,side:form.side,entry:parseFloat(form.entry),exit:parseFloat(form.exit),
      qty:parseInt(form.qty||"1"),pnl:Math.round(pnl),emotion:form.emotion,notes:form.notes},...e]);
    setForm({symbol:"",side:"BUY",entry:"",exit:"",qty:"",emotion:"Neutral",notes:""});
    setShowForm(false); toast("Trade entry saved!");
  };
  const totalPnl=entries.reduce((s,e)=>s+e.pnl,0);
  const wins=entries.filter(e=>e.pnl>0).length;
  return (
    <div className="ln-page" style={{ background:T.bg2 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22,flexWrap:"wrap",gap:12 }}>
        <div>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(20px,4vw,28px)",fontWeight:800,color:T.text }}>Trading Journal</h1>
          <p style={{ color:T.muted2,marginTop:3,fontSize:14 }}>Track, analyze, and improve your trades.</p>
        </div>
        <Btn variant="green" onClick={()=>setShowForm(s=>!s)}>+ New Entry</Btn>
      </div>
      <div className="ln-stats-grid" style={{ marginBottom:18 }}>
        {[
          {label:"Total Trades",value:entries.length},
          {label:"Win Rate",value:`${entries.length?Math.round(wins/entries.length*100):0}%`},
          {label:"Total P&L",value:`${totalPnl>=0?"+":""}$${totalPnl}`,color:totalPnl>=0?T.positive:T.negative},
          {label:"Avg P&L",value:`$${entries.length?Math.round(totalPnl/entries.length):0}`},
        ].map(s=>(
          <Card key={s.label} style={{ padding:"14px" }}>
            <div style={{ fontSize:11,color:T.muted,marginBottom:5 }}>{s.label}</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(16px,3vw,22px)",fontWeight:800,color:(s).color||T.text }}>{s.value}</div>
          </Card>
        ))}
      </div>
      {showForm&&(
        <Card style={{ marginBottom:16,padding:"clamp(14px,3vw,22px)" }}>
          <div style={{ fontWeight:700,fontSize:15,color:T.text,marginBottom:14 }}>New Trade Entry</div>
          <div className="ln-journal-grid">
            {[{key:"symbol",label:"Symbol",ph:"AAPL"},{key:"entry",label:"Entry Price",ph:"182.50",t:"number"},
              {key:"exit",label:"Exit Price",ph:"188.00",t:"number"},{key:"qty",label:"Quantity",ph:"10",t:"number"}].map(f=>(
              <div key={f.key}>
                <label style={{ fontSize:11,color:T.muted2,display:"block",marginBottom:4 }}>{f.label}</label>
                <input value={(form)[f.key]} type={f.t||"text"}
                  onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} style={inp}
                  onFocus={e=>e.target.style.borderColor=T.accent}
                  onBlur={e=>e.target.style.borderColor=T.border}/>
              </div>
            ))}
            <div>
              <label style={{ fontSize:11,color:T.muted2,display:"block",marginBottom:4 }}>Side</label>
              <select value={form.side} onChange={e=>setForm(p=>({...p,side:e.target.value}))} style={inp}>
                <option>BUY</option><option>SELL</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:11,color:T.muted2,display:"block",marginBottom:4 }}>Emotion</label>
              <select value={form.emotion} onChange={e=>setForm(p=>({...p,emotion:e.target.value}))} style={inp}>
                {["Confident","Neutral","Anxious","FOMO","Disciplined"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop:12 }}>
            <label style={{ fontSize:11,color:T.muted2,display:"block",marginBottom:4 }}>Notes</label>
            <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
              placeholder="What was your rationale?" rows={3}
              style={{ ...inp,resize:"vertical" }}
              onFocus={e=>e.target.style.borderColor=T.accent}
              onBlur={e=>e.target.style.borderColor=T.border}/>
          </div>
          <div style={{ display:"flex",gap:10,marginTop:12,flexWrap:"wrap" }}>
            <Btn variant="green" onClick={addEntry}>Save Entry</Btn>
            <Btn variant="outline" onClick={()=>setShowForm(false)}>Cancel</Btn>
          </div>
        </Card>
      )}
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {entries.map(e=>(
          <Card key={e.id} style={{ padding:"16px 20px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,flexWrap:"wrap" }}>
                <div style={{ fontWeight:800,fontSize:16,color:T.text }}>{e.symbol}</div>
                <span style={{ padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600,
                  background:e.side==="BUY"?T.positiveBg:T.negativeBg,
                  color:e.side==="BUY"?T.positive:T.negative }}>{e.side}</span>
                <span style={{ fontSize:11,color:T.muted }}>{e.date}</span>
                <span style={{ fontSize:11,color:T.muted2,background:T.bg2,padding:"2px 7px",borderRadius:6 }}>{e.emotion}</span>
              </div>
              <div style={{ fontWeight:700,fontSize:16,color:e.pnl>=0?T.positive:T.negative }}>{e.pnl>=0?"+":""}${e.pnl}</div>
            </div>
            <div style={{ display:"flex",gap:16,marginTop:8,fontSize:12,color:T.muted2,flexWrap:"wrap" }}>
              <span>Entry: <b style={{ color:T.text }}>${e.entry}</b></span>
              <span>Exit: <b style={{ color:T.text }}>${e.exit}</b></span>
              <span>Qty: <b style={{ color:T.text }}>{e.qty}</b></span>
            </div>
            {e.notes&&<p style={{ marginTop:6,fontSize:12,color:T.muted2,fontStyle:"italic" }}>"{e.notes}"</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   FINANCIALS
══════════════════════════════════════ */
const FIN_DATA = {
  income:{headers:["","2023","2022","2021"],rows:[["Revenue","$383.3B","$394.3B","$365.8B"],["Gross Profit","$169.1B","$170.8B","$152.8B"],["Operating Income","$114.3B","$119.4B","$108.9B"],["Net Income","$97.0B","$99.8B","$94.7B"]]},
  balance:{headers:["","2023","2022","2021"],rows:[["Total Assets","$352.6B","$352.8B","$351.0B"],["Cash & Equiv.","$29.9B","$23.6B","$34.9B"],["Total Debt","$109.3B","$120.1B","$124.7B"],["Total Equity","$62.1B","$50.7B","$63.1B"]]},
  cashflow:{headers:["","2023","2022","2021"],rows:[["Operating CF","$110.5B","$122.2B","$104.0B"],["Investing CF","$-21.0B","$-22.3B","$-14.5B"],["Free Cash Flow","$99.6B","$111.4B","$93.0B"],["CapEx","$-10.9B","$-10.7B","$-11.0B"]]},
};
function Financials() {
  const { T } = useTheme();
  const [ticker,setTicker] = useState("AAPL");
  const [input,setInput] = useState("AAPL");
  const [tab,setTab] = useState("income");
  const data = FIN_DATA[tab];
  const names = {AAPL:"Apple Inc.",MSFT:"Microsoft Corporation",TSLA:"Tesla Inc.",NVDA:"NVIDIA Corporation"};
  const inp = { flex:1,padding:"10px 14px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text };
  return (
    <div className="ln-page" style={{ background:T.bg2 }}>
      <div style={{ marginBottom:22 }}>
        <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(20px,4vw,28px)",fontWeight:800,color:T.text }}>Company Financials</h1>
        <p style={{ color:T.muted2,marginTop:3,fontSize:14 }}>Detailed financial statements for public companies.</p>
      </div>
      <Card style={{ marginBottom:16,padding:"16px 20px" }}>
        <div style={{ display:"flex",gap:10,alignItems:"center",flexWrap:"wrap" }}>
          <input value={input} onChange={e=>setInput(e.target.value.toUpperCase())}
            onKeyDown={e=>e.key==="Enter"&&setTicker(input)} placeholder="Enter ticker (e.g. AAPL, MSFT)"
            style={inp} onFocus={e=>e.target.style.borderColor=T.accent}
            onBlur={e=>e.target.style.borderColor=T.border}/>
          <Btn variant="green" onClick={()=>setTicker(input)}>Search</Btn>
        </div>
      </Card>
      <Card style={{ marginBottom:16,padding:"18px 20px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14 }}>
          <div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(18px,4vw,28px)",fontWeight:800,color:T.text }}>{ticker}</div>
            <div style={{ color:T.muted2,marginTop:2,fontSize:13 }}>{names[ticker]||`${ticker} Corporation`}</div>
          </div>
          <div style={{ display:"flex",gap:14,flexWrap:"wrap" }}>
            {[["Price","$188.42"],["Mkt Cap","$2.91T"],["P/E","30.2x"],["EPS","$6.13"]].map(([l,v])=>(
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:10,color:T.muted,letterSpacing:"0.5px",textTransform:"uppercase" }}>{l}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(13px,2vw,18px)",fontWeight:700,marginTop:3,color:T.text }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <div style={{ display:"flex",gap:4,marginBottom:12,flexWrap:"wrap" }}>
        {[["income","Income Statement"],["balance","Balance Sheet"],["cashflow","Cash Flow"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{ padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",
              fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:600,transition:"all .2s",
              background:tab===id?T.black:"transparent",color:tab===id?"#fff":T.muted2 }}>{label}</button>
        ))}
      </div>
      <Card style={{ padding:"18px" }}>
        <div className="ln-table-wrap">
          <table style={{ width:"100%",borderCollapse:"collapse",minWidth:340 }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${T.border}` }}>
                {data.headers.map((h,i)=>(
                  <th key={i} style={{ padding:"10px 14px",textAlign:i===0?"left":"right",fontSize:11,
                    fontWeight:700,color:T.muted,letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row,ri)=>(
                <tr key={ri} style={{ borderBottom:`1px solid ${T.border}`,background:ri%2===0?"transparent":T.bg2 }}>
                  {row.map((cell,ci)=>(
                    <td key={ci} style={{ padding:"11px 14px",textAlign:ci===0?"left":"right",
                      fontSize:13,fontWeight:ci===0?500:400,color:ci===0?T.text:T.muted2,whiteSpace:"nowrap" }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   INVOICES
══════════════════════════════════════ */
function Invoices({ toast }) {
  const { T } = useTheme();
  const [invoices,setInvoices] = useState([
    {id:"INV-001",client:"Acme Corp",date:"2024-01-15",due:"2024-02-15",amount:4500,status:"Paid"},
    {id:"INV-002",client:"Beta Solutions",date:"2024-01-10",due:"2024-02-10",amount:12000,status:"Pending"},
    {id:"INV-003",client:"Gamma Traders",date:"2024-01-05",due:"2024-02-05",amount:750,status:"Overdue"},
    {id:"INV-004",client:"Delta Investments",date:"2024-01-20",due:"2024-02-20",amount:3200,status:"Draft"},
  ]);
  const [showNew,setShowNew] = useState(false);
  const [form,setForm] = useState({client:"",email:"",items:[{desc:"",qty:1,rate:""}][]});
  const total = form.items.reduce((s,it)=>s+(parseFloat(it.rate)||0)*it.qty,0);
  const sc:{[k]:{bg;color}} = {
    Paid:{bg:T.positiveBg,color:T.positive},Pending:{bg:T.warnBg,color:T.warn},
    Overdue:{bg:T.negativeBg,color:T.negative},Draft:{bg:T.bg3,color:T.muted},
  };
  const inp = { width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text };
  const saveInvoice = () => {
    if(!form.client) return;
    const id=`INV-00${invoices.length+1}`;
    setInvoices(iv=>[{id,client:form.client,date:new Date().toISOString().slice(0,10),due:"",amount:total,status:"Draft"},...iv]);
    setShowNew(false); setForm({client:"",email:"",items:[{desc:"",qty:1,rate:""}]});
    toast("Invoice saved!");
  };
  return (
    <div className="ln-page" style={{ background:T.bg2 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22,flexWrap:"wrap",gap:12 }}>
        <div>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(20px,4vw,28px)",fontWeight:800,color:T.text }}>Invoices & Billing</h1>
          <p style={{ color:T.muted2,marginTop:3,fontSize:14 }}>Create, send, and track your invoices.</p>
        </div>
        <Btn variant="green" onClick={()=>setShowNew(s=>!s)}>+ New Invoice</Btn>
      </div>
      <div className="ln-stats-grid" style={{ marginBottom:18 }}>
        {[
          {label:"Total Invoices",value:invoices.length,icon:"🧾"},
          {label:"Revenue Collected",value:`$${invoices.filter(i=>i.status==="Paid").reduce((s,i)=>s+i.amount,0).toLocaleString()}`,icon:"✅"},
          {label:"Pending",value:`$${invoices.filter(i=>i.status==="Pending").reduce((s,i)=>s+i.amount,0).toLocaleString()}`,icon:"⏳"},
          {label:"Overdue",value:`$${invoices.filter(i=>i.status==="Overdue").reduce((s,i)=>s+i.amount,0).toLocaleString()}`,icon:"⚠️"},
        ].map(s=>(
          <Card key={s.label} style={{ padding:"14px" }}>
            <div style={{ display:"flex",justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:11,color:T.muted,marginBottom:5 }}>{s.label}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(14px,3vw,20px)",fontWeight:800,color:T.text }}>{s.value}</div>
              </div>
              <span style={{ fontSize:20 }}>{s.icon}</span>
            </div>
          </Card>
        ))}
      </div>
      {showNew&&(
        <Card style={{ marginBottom:16,padding:"clamp(14px,3vw,24px)" }}>
          <div style={{ fontWeight:700,fontSize:16,color:T.text,marginBottom:16 }}>Create New Invoice</div>
          <div className="ln-invoice-meta">
            {[{key:"client",label:"Client Name",ph:"Acme Corporation"},{key:"email",label:"Client Email",ph:"billing@client.com"}].map(f=>(
              <div key={f.key}>
                <label style={{ fontSize:11,color:T.muted2,display:"block",marginBottom:4 }}>{f.label}</label>
                <input value={(form)[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                  placeholder={f.ph} style={inp} onFocus={e=>e.target.style.borderColor=T.accent}
                  onBlur={e=>e.target.style.borderColor=T.border}/>
              </div>
            ))}
          </div>
          <div style={{ fontWeight:600,fontSize:13,color:T.text,marginBottom:10 }}>Line Items</div>
          <div className="ln-table-wrap">
            <table style={{ width:"100%",borderCollapse:"collapse",marginBottom:10,minWidth:340 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                  {["Description","Qty","Rate","Amount"].map(h=>(
                    <th key={h} style={{ padding:"7px 8px",textAlign:"left",fontSize:10,color:T.muted,fontWeight:600,textTransform:"uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {form.items.map((it,i)=>(
                  <tr key={i}>
                    <td style={{ padding:"5px 4px" }}>
                      <input value={it.desc} onChange={e=>{ const items=[...form.items]; items[i]={...items[i],desc:e.target.value}; setForm(f=>({...f,items})); }}
                        placeholder="Service" style={{ ...inp,padding:"8px 10px" }}/>
                    </td>
                    <td style={{ padding:"5px 4px",width:64 }}>
                      <input type="number" value={it.qty} onChange={e=>{ const items=[...form.items]; items[i]={...items[i],qty:parseInt(e.target.value)||1}; setForm(f=>({...f,items})); }}
                        style={{ ...inp,padding:"8px 8px" }}/>
                    </td>
                    <td style={{ padding:"5px 4px",width:96 }}>
                      <input type="number" value={it.rate} onChange={e=>{ const items=[...form.items]; items[i]={...items[i],rate:e.target.value}; setForm(f=>({...f,items})); }}
                        placeholder="0.00" style={{ ...inp,padding:"8px 8px" }}/>
                    </td>
                    <td style={{ padding:"5px 10px",fontWeight:600,fontSize:13,color:T.text,whiteSpace:"nowrap" }}>
                      ${((parseFloat(it.rate)||0)*it.qty).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10 }}>
            <button onClick={()=>setForm(f=>({...f,items:[...f.items,{desc:"",qty:1,rate:""}]}))}
              style={{ background:"none",border:"none",color:T.accentDark,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>+ Add Line</button>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(16px,3vw,20px)",fontWeight:800,color:T.text }}>Total: ${total.toFixed(2)}</div>
          </div>
          <div style={{ display:"flex",gap:10,marginTop:14,flexWrap:"wrap" }}>
            <Btn variant="green" onClick={saveInvoice}>Save Invoice</Btn>
            <Btn variant="primary" onClick={saveInvoice}>Save & Send</Btn>
            <Btn variant="outline" onClick={()=>setShowNew(false)}>Cancel</Btn>
          </div>
        </Card>
      )}
      <Card style={{ padding:"18px" }}>
        <div className="ln-table-wrap">
          <table style={{ width:"100%",borderCollapse:"collapse",minWidth:480 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                {["Invoice","Client","Date","Amount","Status",""].map(h=>(
                  <th key={h} style={{ padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:"0.5px",whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv=>{
                const s=sc[inv.status]||{bg:T.bg3,color:T.muted};
                return (
                  <tr key={inv.id} style={{ borderBottom:`1px solid ${T.border}` }}>
                    <td style={{ padding:"12px",fontWeight:700,fontSize:12,color:T.text,whiteSpace:"nowrap" }}>{inv.id}</td>
                    <td style={{ padding:"12px",fontSize:13,color:T.text }}>{inv.client}</td>
                    <td style={{ padding:"12px",fontSize:12,color:T.muted,whiteSpace:"nowrap" }}>{inv.date}</td>
                    <td style={{ padding:"12px",fontWeight:700,fontSize:13,color:T.text,whiteSpace:"nowrap" }}>${inv.amount.toLocaleString()}</td>
                    <td style={{ padding:"12px" }}>
                      <span style={{ padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:600,background:s.bg,color:s.color,whiteSpace:"nowrap" }}>{inv.status}</span>
                    </td>
                    <td style={{ padding:"12px" }}>
                      <button style={{ background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.accentDark,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif",whiteSpace:"nowrap" }}>View PDF</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   WATCHLIST
══════════════════════════════════════ */
function Watchlist() {
  const { T } = useTheme();
  const stocks = [
    {symbol:"AAPL",price:188.42,change:+1.24,pct:+0.66},{symbol:"TSLA",price:238.50,change:-3.20,pct:-1.32},
    {symbol:"NVDA",price:598.40,change:+12.80,pct:+2.19},{symbol:"MSFT",price:374.80,change:+2.10,pct:+0.56},
    {symbol:"GOOGL",price:140.20,change:-0.80,pct:-0.57},{symbol:"AMZN",price:174.90,change:+1.05,pct:+0.60},
    {symbol:"META",price:484.10,change:+5.30,pct:+1.11},{symbol:"SPY",price:514.30,change:+3.20,pct:+0.63},
  ];
  return (
    <div className="ln-page" style={{ background:T.bg2 }}>
      <div style={{ marginBottom:22 }}>
        <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(20px,4vw,28px)",fontWeight:800,color:T.text }}>Watchlist</h1>
        <p style={{ color:T.muted2,marginTop:3,fontSize:14 }}>Track your favourite stocks in real time.</p>
      </div>
      <div className="ln-spark-grid">
        {stocks.slice(0,4).map(s=>(
          <Card key={s.symbol} style={{ padding:"16px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
              <div>
                <div style={{ fontWeight:800,fontSize:15,color:T.text }}>{s.symbol}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(16px,3vw,22px)",fontWeight:700,marginTop:4,color:T.text }}>${s.price}</div>
              </div>
              <span style={{ padding:"3px 8px",borderRadius:20,fontSize:11,fontWeight:600,
                background:s.change>=0?T.positiveBg:T.negativeBg,
                color:s.change>=0?T.positive:T.negative }}>{s.change>=0?"+":""}{s.pct}%</span>
            </div>
            <div style={{ fontSize:12,color:s.change>=0?T.positive:T.negative,marginTop:5,fontWeight:500 }}>{s.change>=0?"+":""}{s.change.toFixed(2)} today</div>
            <svg width="100%" height="34" style={{ marginTop:8 }}>
              {Array.from({length:12},(_,i)=>{
                const x1=(i/11)*100,x2=((i+1)/11)*100;
                const y1=17+Math.sin(i*0.9+s.price%5)*9,y2=17+Math.sin((i+1)*0.9+s.price%5)*9;
                return <line key={i} x1={`${x1}%`} y1={y1} x2={`${x2}%`} y2={y2} stroke={s.change>=0?T.accent:T.negative} strokeWidth="2" strokeLinecap="round"/>;
              })}
            </svg>
          </Card>
        ))}
      </div>
      <Card style={{ padding:"16px" }}>
        <div className="ln-table-wrap">
          <table style={{ width:"100%",borderCollapse:"collapse",minWidth:540 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                {["Symbol","Price","Change","% Chg","52W High","52W Low","Action"].map(h=>(
                  <th key={h} style={{ padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,letterSpacing:"0.5px",textTransform:"uppercase",whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stocks.map((s,i)=>(
                <tr key={s.symbol} style={{ borderBottom:`1px solid ${T.border}`,background:i%2===0?"transparent":T.bg2 }}>
                  <td style={{ padding:"12px",fontWeight:800,fontSize:13,color:T.text }}>{s.symbol}</td>
                  <td style={{ padding:"12px",fontWeight:600,fontSize:13,color:T.text,whiteSpace:"nowrap" }}>${s.price}</td>
                  <td style={{ padding:"12px",fontWeight:600,fontSize:13,whiteSpace:"nowrap",color:s.change>=0?T.positive:T.negative }}>{s.change>=0?"+":""}{s.change.toFixed(2)}</td>
                  <td style={{ padding:"12px" }}>
                    <span style={{ padding:"2px 7px",borderRadius:20,fontSize:10,fontWeight:600,
                      background:s.change>=0?T.positiveBg:T.negativeBg,color:s.change>=0?T.positive:T.negative,whiteSpace:"nowrap" }}>{s.change>=0?"+":""}{s.pct}%</span>
                  </td>
                  <td style={{ padding:"12px",color:T.muted2,fontSize:12,whiteSpace:"nowrap" }}>${(s.price*1.18).toFixed(2)}</td>
                  <td style={{ padding:"12px",color:T.muted2,fontSize:12,whiteSpace:"nowrap" }}>${(s.price*0.74).toFixed(2)}</td>
                  <td style={{ padding:"12px" }}>
                    <div style={{ display:"flex",gap:5 }}>
                      <span style={{ padding:"3px 9px",borderRadius:7,fontSize:11,fontWeight:600,background:T.positiveBg,color:T.positive,cursor:"pointer",whiteSpace:"nowrap" }}>Buy</span>
                      <span style={{ padding:"3px 9px",borderRadius:7,fontSize:11,fontWeight:600,background:T.negativeBg,color:T.negative,cursor:"pointer",whiteSpace:"nowrap" }}>Sell</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   SETTINGS
══════════════════════════════════════ */
function Settings({ toast }) {
  const { T } = useTheme();
  const [profile,setProfile] = useState({name:"Alex Johnson",email:"alex@ledgrnow.com",timezone:"UTC+5:30",currency:"USD"});
  const [notifs,setNotifs] = useState({email:true,pnlAlerts:true,invoiceDue:true,weeklyReport:false,marketNews:false});
  const [activeTab,setActiveTab] = useState("profile");
  const tabs = [{id:"profile",label:"Profile",icon:"👤"},{id:"notifs",label:"Notifications",icon:"🔔"},
    {id:"api",label:"API Keys",icon:"🔑"},{id:"billing",label:"Billing",icon:"💳"},{id:"security",label:"Security",icon:"🔐"}];
  const inp = { width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text };
  return (
    <div className="ln-page" style={{ background:T.bg2 }}>
      <div style={{ marginBottom:22 }}>
        <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(20px,4vw,28px)",fontWeight:800,color:T.text }}>Settings</h1>
        <p style={{ color:T.muted2,marginTop:3,fontSize:14 }}>Manage your account preferences.</p>
      </div>
      <div className="ln-settings-layout">
        <div className="ln-settings-tabs">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              style={{ display:"flex",alignItems:"center",gap:9,padding:"10px 14px",
                borderRadius:10,border:"none",cursor:"pointer",textAlign:"left",
                fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,
                fontWeight:activeTab===t.id?600:400,width:"100%",
                background:activeTab===t.id?T.accentLight:"transparent",
                color:activeTab===t.id?T.accentDark:T.muted2,transition:"all .2s" }}>
              <span style={{ fontSize:15 }}>{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </div>
        <Card style={{ padding:"clamp(18px,4vw,30px)" }}>
          {activeTab==="profile"&&(
            <>
              <div style={{ fontWeight:700,fontSize:16,color:T.text,marginBottom:18 }}>Profile Information</div>
              <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:22,flexWrap:"wrap" }}>
                <div style={{ width:56,height:56,borderRadius:"50%",
                  background:`linear-gradient(135deg,${T.accent},${T.accentDark})`,
                  display:"grid",placeItems:"center",fontSize:20,fontWeight:800,color:"#fff",flexShrink:0 }}>
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight:600,fontSize:14,color:T.text }}>{profile.name}</div>
                  <div style={{ color:T.muted,fontSize:12,marginTop:2 }}>{profile.email}</div>
                </div>
              </div>
              <div className="ln-profile-grid">
                {[{key:"name",label:"Full Name"},{key:"email",label:"Email"},
                  {key:"timezone",label:"Timezone"},{key:"currency",label:"Currency"}].map(f=>(
                  <div key={f.key}>
                    <label style={{ fontSize:11,color:T.muted2,display:"block",marginBottom:4 }}>{f.label}</label>
                    <input value={(profile)[f.key]}
                      onChange={e=>setProfile(p=>({...p,[f.key]:e.target.value}))}
                      style={inp} onFocus={e=>e.target.style.borderColor=T.accent}
                      onBlur={e=>e.target.style.borderColor=T.border}/>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:18 }}><Btn variant="green" onClick={()=>toast("Profile updated!")}>Save Changes</Btn></div>
            </>
          )}
          {activeTab==="notifs"&&(
            <>
              <div style={{ fontWeight:700,fontSize:16,color:T.text,marginBottom:18 }}>Notification Preferences</div>
              {[
                {key:"email",label:"Email Notifications",desc:"Receive updates via email"},
                {key:"pnlAlerts",label:"P&L Alerts",desc:"Get notified on significant P&L moves"},
                {key:"invoiceDue",label:"Invoice Due Reminders",desc:"Reminders before invoices are due"},
                {key:"weeklyReport",label:"Weekly Performance Report",desc:"Summary of your weekly trading activity"},
                {key:"marketNews",label:"Market News Digest",desc:"Daily market highlights"},
              ].map((n,i,arr)=>(
                <div key={n.key} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"14px 0",borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none",gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:500,fontSize:14,color:T.text }}>{n.label}</div>
                    <div style={{ fontSize:12,color:T.muted,marginTop:2 }}>{n.desc}</div>
                  </div>
                  <div onClick={()=>setNotifs(p=>({...p,[n.key]:!(p)[n.key]}))}
                    style={{ width:40,height:21,borderRadius:11,cursor:"pointer",position:"relative",
                      background:(notifs)[n.key]?T.accent:T.bg3,transition:"background .2s",flexShrink:0 }}>
                    <div style={{ position:"absolute",top:2.5,left:2.5,width:16,height:16,
                      borderRadius:"50%",background:"#fff",transition:"transform .2s",
                      transform:(notifs)[n.key]?"translateX(19px)":"none",
                      boxShadow:"0 1px 4px rgba(0,0,0,.2)" }}/>
                  </div>
                </div>
              ))}
              <div style={{ marginTop:18 }}><Btn variant="green" onClick={()=>toast("Preferences saved!")}>Save Preferences</Btn></div>
            </>
          )}
          {(activeTab==="api"||activeTab==="billing"||activeTab==="security")&&(
            <div style={{ textAlign:"center",padding:"44px 0" }}>
              <div style={{ fontSize:42,marginBottom:12 }}>{activeTab==="api"?"🔑":activeTab==="billing"?"💳":"🔐"}</div>
              <div style={{ fontWeight:700,fontSize:17,color:T.text,marginBottom:8 }}>
                {activeTab==="api"?"API Key Management":activeTab==="billing"?"Billing & Plans":"Security Settings"}
              </div>
              <p style={{ color:T.muted2,marginBottom:18,fontSize:14 }}>This section is ready for your backend integration.</p>
              <Btn variant="green" onClick={()=>toast("Coming soon!")}>Coming Soon</Btn>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   AI ASSISTANT
══════════════════════════════════════ */
const SYSTEM_PROMPT = `You are Ledgr, an expert AI financial assistant built into LedgrNow — a platform for trading, journaling, financial statements, and invoicing. Help users with trading strategies, financial analysis, journaling, invoices, and finance concepts. Keep responses concise and practical. Use ** for bold and bullet points where helpful.`;

function AIAssistant() {
  const { T, dark } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role:"assistant", content:"Hi! I'm **Ledgr**, your AI financial assistant 👋\n\nAsk me about trading strategies, financial statements, journals, invoices, and more!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(()=>{
    if(open) setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),100);
  },[open,messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if(!text||loading) return;
    setInput("");
    const userMsg = {role:"user",content:text};
    const newMessages = [...messages,userMsg];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:SYSTEM_PROMPT,
          messages:newMessages.map(m=>({role:m.role,content:m.content})),
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text||"Sorry, I couldn't get a response.";
      setMessages(m=>[...m,{role:"assistant",content:reply}]);
    } catch {
      setMessages(m=>[...m,{role:"assistant",content:"⚠️ Connection error. Please try again."}]);
    } finally { setLoading(false); }
  };

  const renderContent = (text) =>
    text.split("\n").map((line,i)=>{
      const parts = line.split(/\*\*(.*?)\*\*/g).map((p,j)=>j%2===1?<strong key={j}>{p}</strong>:p);
      if(line.startsWith("- ")||line.startsWith("• "))
        return <div key={i} style={{ display:"flex",gap:7,marginTop:3 }}><span style={{ color:T.accent,flexShrink:0 }}>•</span><span>{parts.slice(1)}</span></div>;
      return <div key={i} style={{ marginTop:i>0&&line?5:0 }}>{parts}</div>;
    });

  const suggestions = ["Analyze AAPL financials","Best risk management tips","How to read a balance sheet?","Explain P/E ratio"];

  return (
    <>
      {/* Pulse ring */}
      {!open&&(
        <div className="ln-ai-fab" style={{ width:52,height:52,borderRadius:"50%",
          border:`2px solid #5ab233`,animation:"pulse 2s infinite",pointerEvents:"none",
          position:"fixed",bottom:28,right:28,zIndex:2000 }}/>
      )}

      {/* FAB button */}
      <button className="ln-ai-fab" onClick={()=>setOpen(o=>!o)}
        style={{ position:"fixed",bottom:28,right:28,zIndex:2001,
          width:52,height:52,borderRadius:"50%",border:"none",
          background:`linear-gradient(135deg,${T.accent},${T.accentDark})`,
          cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:`0 8px 32px ${T.accent}55`,transition:"transform .3s",
          transform:open?"scale(0.9) rotate(20deg)":"scale(1)" }}>
        <span style={{ fontSize:22 }}>{open?"✕":"🤖"}</span>
      </button>

      {/* Chat panel */}
      {open&&(
        <div className="ln-ai-panel"
          style={{ background:T.card,border:`1.5px solid ${T.border}`,
            boxShadow:`0 24px 80px ${T.shadowHov}` }}>

          {/* Header */}
          <div style={{ padding:"13px 16px",flexShrink:0,
            background:`linear-gradient(135deg,${dark?"#1a2a1a":"#f0f8eb"},${dark?"#0d1a0d":"#e8f5e1"})`,
            borderBottom:`1px solid ${T.border}`,
            display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ width:36,height:36,borderRadius:"50%",flexShrink:0,
                background:`linear-gradient(135deg,${T.accent},${T.accentDark})`,
                display:"grid",placeItems:"center",fontSize:17 }}>🤖</div>
              <div>
                <div style={{ fontWeight:700,fontSize:14,color:T.text }}>Ledgr AI</div>
                <div style={{ display:"flex",alignItems:"center",gap:5,marginTop:1 }}>
                  <span style={{ width:6,height:6,borderRadius:"50%",background:"#22c55e",display:"inline-block" }}/>
                  <span style={{ fontSize:10,color:T.muted }}>Online · Powered by Claude</span>
                </div>
              </div>
            </div>
            <div style={{ display:"flex",gap:5 }}>
              <button onClick={()=>setMessages([{role:"assistant",content:"Chat cleared! How can I help?"}])}
                style={{ width:27,height:27,borderRadius:7,border:`1px solid ${T.border}`,
                  background:"transparent",cursor:"pointer",fontSize:12,color:T.muted,display:"grid",placeItems:"center" }}>🗑</button>
              <button onClick={()=>setOpen(false)}
                style={{ width:27,height:27,borderRadius:7,border:`1px solid ${T.border}`,
                  background:"transparent",cursor:"pointer",fontSize:12,color:T.muted,display:"grid",placeItems:"center" }}>✕</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1,overflowY:"auto",padding:"12px",display:"flex",flexDirection:"column",gap:10 }}>
            {messages.map((msg,i)=>(
              <div key={i} style={{ display:"flex",flexDirection:msg.role==="user"?"row-reverse":"row",
                gap:7,alignItems:"flex-end" }}>
                {msg.role==="assistant"&&(
                  <div style={{ width:25,height:25,borderRadius:"50%",flexShrink:0,
                    background:`linear-gradient(135deg,${T.accent},${T.accentDark})`,
                    display:"grid",placeItems:"center",fontSize:12 }}>🤖</div>
                )}
                <div style={{ maxWidth:"82%",padding:"9px 12px",
                  borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
                  background:msg.role==="user"?`linear-gradient(135deg,${T.accent},${T.accentDark})`:T.bg2,
                  color:msg.role==="user"?"#fff":T.text,fontSize:13,lineHeight:1.6,
                  border:msg.role==="assistant"?`1px solid ${T.border}`:"none" }}>
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}

            {/* Typing dots */}
            {loading&&(
              <div style={{ display:"flex",gap:7,alignItems:"flex-end" }}>
                <div style={{ width:25,height:25,borderRadius:"50%",flexShrink:0,
                  background:`linear-gradient(135deg,${T.accent},${T.accentDark})`,
                  display:"grid",placeItems:"center",fontSize:12 }}>🤖</div>
                <div style={{ padding:"10px 14px",borderRadius:"18px 18px 18px 4px",
                  background:T.bg2,border:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex",gap:4,alignItems:"center" }}>
                    {[0,1,2].map(d=>(
                      <div key={d} style={{ width:6,height:6,borderRadius:"50%",background:T.accent,
                        animation:`pulse 1.2s ${d*0.2}s infinite` }}/>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* Quick suggestions */}
          {messages.length===1&&(
            <div style={{ padding:"0 12px 10px",display:"flex",gap:6,flexWrap:"wrap",flexShrink:0 }}>
              {suggestions.map(s=>(
                <button key={s} onClick={()=>{ setInput(s); inputRef.current?.focus(); }}
                  style={{ padding:"4px 10px",borderRadius:20,border:`1px solid ${T.accent}55`,
                    background:T.accentLight,color:T.accentDark,fontSize:11,fontWeight:500,
                    cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"opacity .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.opacity=".8"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:"10px 12px",borderTop:`1px solid ${T.border}`,
            display:"flex",gap:8,alignItems:"flex-end",background:T.card,flexShrink:0 }}>
            <textarea ref={inputRef} value={input} rows={1}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMessage(); } }}
              placeholder="Ask about trading, finance…"
              style={{ flex:1,padding:"9px 12px",borderRadius:12,
                border:`1.5px solid ${input?T.accent:T.border}`,
                background:T.inputBg,color:T.text,fontSize:13,
                fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",
                resize:"none",lineHeight:1.5,maxHeight:88,overflowY:"auto",transition:"border-color .2s" }}
              onFocus={e=>e.target.style.borderColor=T.accent}
              onBlur={e=>e.target.style.borderColor=input?T.accent:T.border}/>
            <button onClick={sendMessage} disabled={!input.trim()||loading}
              style={{ width:36,height:36,borderRadius:10,border:"none",flexShrink:0,
                background:input.trim()&&!loading?T.accent:T.bg3,
                color:input.trim()&&!loading?"#fff":T.muted,
                cursor:input.trim()&&!loading?"pointer":"not-allowed",
                display:"grid",placeItems:"center",fontSize:17,transition:"all .2s",
                boxShadow:input.trim()&&!loading?`0 4px 12px ${T.accent}44`:"none" }}>
              {loading?"⌛":"↑"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════ */
/* ══════════════════════════════════════
   SHARED PAGE SHELL
══════════════════════════════════════ */
function PageShell({ title, icon, color="#5ab233", desc, children, setPage }) {
  const { T } = useTheme();
  return (
    <div className="ln-page" style={{ background:T.bg2 }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:10 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:`${color}18`,
            display:"grid", placeItems:"center", fontSize:26, border:`2px solid ${color}30` }}>{icon}</div>
          <div>
            <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:"clamp(20px,4vw,28px)",
              fontWeight:800, color:T.text }}>{title}</h1>
            {desc&&<p style={{ color:T.muted2, marginTop:3, fontSize:14, maxWidth:560 }}>{desc}</p>}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

/* Generic form/list page for simpler modules */
function GenericPage({ title, icon, color="#5ab233", desc, fields }) {
  const { T } = useTheme();
  const [rows, setRows] = useState[]>([{}]);
  const addRow = () => setRows(r=>[...r,{}]);
  const inp = { width:"100%", padding:"9px 11px", borderRadius:8,
    border:`1.5px solid ${T.border}`, background:T.inputBg, fontSize:12,
    fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none", color:T.text };
  return (
    <PageShell title={title} icon={icon} color={color} desc={desc}>
      <Card style={{ padding:"22px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
          <div style={{ fontWeight:700, fontSize:15, color:T.text }}>Records</div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={addRow}
              style={{ padding:"8px 18px", borderRadius:9, border:"none", background:color,
                color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer",
                fontFamily:"'Plus Jakarta Sans',sans-serif" }}>+ Add Record</button>
          </div>
        </div>
        <div className="ln-table-wrap">
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:fields.length*120 }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${T.border}` }}>
                {fields.map(f=>(
                  <th key={f} style={{ padding:"9px 12px", textAlign:"left", fontSize:10,
                    fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:"0.5px",
                    whiteSpace:"nowrap" }}>{f}</th>
                ))}
                <th style={{ padding:"9px 12px", width:60 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row,ri)=>(
                <tr key={ri} style={{ borderBottom:`1px solid ${T.border}`, background:ri%2===0?"transparent":T.bg2 }}>
                  {fields.map(f=>(
                    <td key={f} style={{ padding:"6px 8px" }}>
                      <input value={row[f]||""} onChange={e=>setRows(rs=>rs.map((r,i)=>i===ri?{...r,[f]:e.target.value}:r))}
                        placeholder={f} style={inp}
                        onFocus={e=>e.target.style.borderColor=color}
                        onBlur={e=>e.target.style.borderColor=T.border}/>
                    </td>
                  ))}
                  <td style={{ padding:"6px 8px" }}>
                    <button onClick={()=>setRows(rs=>rs.filter((_,i)=>i!==ri))}
                      style={{ background:"none", border:"none", color:T.negative, cursor:"pointer", fontSize:16 }}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length===0&&(
          <div style={{ textAlign:"center", padding:"48px 0", color:T.muted }}>
            <div style={{ fontSize:40, marginBottom:12 }}>{icon}</div>
            <div style={{ fontWeight:600, fontSize:15, color:T.text, marginBottom:6 }}>No records yet</div>
            <div style={{ fontSize:13 }}>Click "+ Add Record" to get started</div>
          </div>
        )}
      </Card>
    </PageShell>
  );
}

/* AI-Powered page wrapper */
function AIPageWrapper({ title, icon, color="#6366f1", desc, prompt }) {
  const { T } = useTheme();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const analyze = async () => {
    if(!input.trim()) return;
    setLoading(true); setResponse("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1200,
          messages:[{ role:"user", content:`${prompt}

${input}` }] })
      });
      const data = await res.json();
      setResponse(data.content?.[0]?.text || "No response received.");
    } catch { setResponse("⚠️ Connection error. Please try again."); }
    finally { setLoading(false); }
  };
  const renderMd = (text) => text.split("\n").map((line,i)=>{
    const parts = line.split(/\*\*(.*?)\*\*/g).map((p,j)=>j%2===1?<strong key={j}>{p}</strong>:p);
    if(line.startsWith("- ")||line.startsWith("• "))
      return <div key={i} style={{ display:"flex", gap:8, marginTop:4 }}><span style={{ color:color }}>•</span><span>{parts.slice(1)}</span></div>;
    if(line.startsWith("# ")) return <h3 key={i} style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:T.text, marginTop:12, marginBottom:4 }}>{line.slice(2)}</h3>;
    if(line.startsWith("## ")) return <h4 key={i} style={{ fontWeight:600, fontSize:14, color:T.text, marginTop:10 }}>{line.slice(3)}</h4>;
    return <div key={i} style={{ marginTop:i>0&&line?4:0 }}>{parts}</div>;
  });
  return (
    <PageShell title={title} icon={icon} color={color} desc={desc}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }} className="ln-two-col">
        <Card style={{ padding:"22px" }}>
          <div style={{ fontWeight:700, fontSize:15, color:T.text, marginBottom:14 }}>Your Input</div>
          <textarea value={input} onChange={e=>setInput(e.target.value)}
            placeholder="Describe your trade, situation, or question in detail..."
            style={{ width:"100%", minHeight:200, padding:"12px 14px", borderRadius:10,
              border:`1.5px solid ${T.border}`, background:T.inputBg, color:T.text,
              fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif",
              outline:"none", resize:"vertical", lineHeight:1.6 }}
            onFocus={e=>e.target.style.borderColor=color}
            onBlur={e=>e.target.style.borderColor=T.border}/>
          <button onClick={analyze} disabled={loading||!input.trim()}
            style={{ marginTop:14, padding:"11px 28px", borderRadius:10, border:"none",
              background:loading||!input.trim()?T.bg3:color, color:loading||!input.trim()?T.muted:"#fff",
              fontSize:14, fontWeight:700, cursor:loading||!input.trim()?"not-allowed":"pointer",
              fontFamily:"'Plus Jakarta Sans',sans-serif", width:"100%", transition:"all .2s",
              boxShadow:!loading&&input.trim()?`0 4px 16px ${color}44`:"none" }}>
            {loading?"🤖 Analyzing...":"🤖 Analyze with AI"}
          </button>
        </Card>
        <Card style={{ padding:"22px" }}>
          <div style={{ fontWeight:700, fontSize:15, color:T.text, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
            <span>AI Analysis</span>
            {loading&&<span style={{ fontSize:12, color:color, fontWeight:400 }}>Thinking...</span>}
          </div>
          {loading?(
            <div style={{ display:"flex", flexDirection:"column", gap:10, padding:"20px 0" }}>
              {[100,85,70,55].map((w,i)=>(
                <div key={i} style={{ height:14, borderRadius:7, background:T.bg3,
                  width:`${w}%`, animation:"pulse 1.5s infinite" }}/>
              ))}
            </div>
          ):response?(
            <div style={{ fontSize:13, color:T.text, lineHeight:1.7, maxHeight:320, overflowY:"auto" }}>
              {renderMd(response)}
            </div>
          ):(
            <div style={{ textAlign:"center", padding:"48px 0", color:T.muted }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🤖</div>
              <div style={{ fontSize:14 }}>Enter your details on the left and click Analyze</div>
            </div>
          )}
        </Card>
      </div>
    </PageShell>
  );
}

/* ── Trading Journal Page ── */
function TradingJournalPage() {
  const { T } = useTheme();
  const [entries,setEntries] = useState([
    {id:1,date:"2024-01-15",symbol:"AAPL",side:"BUY",entry:180,exit:188,qty:10,pnl:80,emotion:"Confident",notes:"Strong earnings beat"},
    {id:2,date:"2024-01-14",symbol:"TSLA",side:"SELL",entry:250,exit:242,qty:5,pnl:40,emotion:"Neutral",notes:"Technical resistance"},
    {id:3,date:"2024-01-12",symbol:"NVDA",side:"BUY",entry:610,exit:598,qty:2,pnl:-24,emotion:"Anxious",notes:"Chased the move"},
  ]);
  const [showForm,setShowForm] = useState(false);
  const [form,setForm] = useState({symbol:"",side:"BUY",entry:"",exit:"",qty:"",emotion:"Neutral",notes:""});
  const inp = {width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text};
  const addEntry = () => {
    if(!form.symbol||!form.entry||!form.exit) return;
    const pnl=(parseFloat(form.exit)-parseFloat(form.entry))*parseInt(form.qty||"1")*(form.side==="SELL"?-1:1);
    setEntries(e=>[{id:Date.now(),date:new Date().toISOString().slice(0,10),symbol:form.symbol,side:form.side,entry:parseFloat(form.entry),exit:parseFloat(form.exit),qty:parseInt(form.qty||"1"),pnl:Math.round(pnl),emotion:form.emotion,notes:form.notes},...e]);
    setForm({symbol:"",side:"BUY",entry:"",exit:"",qty:"",emotion:"Neutral",notes:""});
    setShowForm(false);
  };
  const totalPnl=entries.reduce((s,e)=>s+e.pnl,0);
  const wins=entries.filter(e=>e.pnl>0).length;
  return (
    <PageShell title="Trade Journal" icon="📓" color="#5ab233" desc="Log and analyze every trade to improve your performance over time.">
      <div className="ln-stats-grid" style={{marginBottom:20}}>
        {[{l:"Total Trades",v:entries.length},{l:"Win Rate",v:`${entries.length?Math.round(wins/entries.length*100):0}%`},
          {l:"Total P&L",v:`${totalPnl>=0?"+":""}$${totalPnl}`,c:totalPnl>=0?T.positive:T.negative},
          {l:"Avg P&L",v:`$${entries.length?Math.round(totalPnl/entries.length):0}`}].map(s=>(
          <Card key={s.l} style={{padding:"16px"}}>
            <div style={{fontSize:11,color:T.muted,marginBottom:5}}>{s.l}</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(16px,3vw,22px)",fontWeight:800,color:(s).c||T.text}}>{s.v}</div>
          </Card>
        ))}
      </div>
      <div style={{marginBottom:16}}><button onClick={()=>setShowForm(s=>!s)} style={{padding:"10px 22px",borderRadius:9,border:"none",background:"#5ab233",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+ New Trade Entry</button></div>
      {showForm&&(
        <Card style={{marginBottom:16,padding:"22px"}}>
          <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:14}}>New Trade Entry</div>
          <div className="ln-journal-grid">
            {[{key:"symbol",label:"Symbol",ph:"AAPL"},{key:"entry",label:"Entry",ph:"182.50",t:"number"},{key:"exit",label:"Exit",ph:"188.00",t:"number"},{key:"qty",label:"Qty",ph:"10",t:"number"}].map(f=>(
              <div key={f.key}>
                <label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>{f.label}</label>
                <input value={(form)[f.key]} type={f.t||"text"} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} style={inp} onFocus={e=>e.target.style.borderColor="#5ab233"} onBlur={e=>e.target.style.borderColor=T.border}/>
              </div>
            ))}
            <div>
              <label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>Side</label>
              <select value={form.side} onChange={e=>setForm(p=>({...p,side:e.target.value}))} style={inp}><option>BUY</option><option>SELL</option></select>
            </div>
            <div>
              <label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>Emotion</label>
              <select value={form.emotion} onChange={e=>setForm(p=>({...p,emotion:e.target.value}))} style={inp}>
                {["Confident","Neutral","Anxious","FOMO","Disciplined"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginTop:12}}>
            <label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>Notes</label>
            <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} rows={2} style={{...inp,resize:"vertical"}}/>
          </div>
          <div style={{display:"flex",gap:10,marginTop:12}}>
            <button onClick={addEntry} style={{padding:"9px 22px",borderRadius:9,border:"none",background:"#5ab233",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Save</button>
            <button onClick={()=>setShowForm(false)} style={{padding:"9px 22px",borderRadius:9,border:`1.5px solid ${T.border}`,background:"transparent",color:T.text,fontSize:13,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Cancel</button>
          </div>
        </Card>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {entries.map(e=>(
          <Card key={e.id} style={{padding:"16px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <span style={{fontWeight:800,fontSize:16,color:T.text}}>{e.symbol}</span>
                <span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600,background:e.side==="BUY"?T.positiveBg:T.negativeBg,color:e.side==="BUY"?T.positive:T.negative}}>{e.side}</span>
                <span style={{fontSize:11,color:T.muted}}>{e.date}</span>
                <span style={{fontSize:11,background:T.bg2,padding:"2px 7px",borderRadius:6,color:T.muted2}}>{e.emotion}</span>
              </div>
              <span style={{fontWeight:700,fontSize:16,color:e.pnl>=0?T.positive:T.negative}}>{e.pnl>=0?"+":""}${e.pnl}</span>
            </div>
            <div style={{display:"flex",gap:16,marginTop:8,fontSize:12,color:T.muted2,flexWrap:"wrap"}}>
              <span>Entry: <b style={{color:T.text}}>${e.entry}</b></span>
              <span>Exit: <b style={{color:T.text}}>${e.exit}</b></span>
              <span>Qty: <b style={{color:T.text}}>{e.qty}</b></span>
            </div>
            {e.notes&&<p style={{marginTop:6,fontSize:12,color:T.muted2,fontStyle:"italic"}}>"{e.notes}"</p>}
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

/* ── Watchlist Page ── */
function WatchlistPage() {
  const { T } = useTheme();
  const stocks = [
    {symbol:"AAPL",price:188.42,change:+1.24,pct:+0.66},{symbol:"TSLA",price:238.50,change:-3.20,pct:-1.32},
    {symbol:"NVDA",price:598.40,change:+12.80,pct:+2.19},{symbol:"MSFT",price:374.80,change:+2.10,pct:+0.56},
    {symbol:"GOOGL",price:140.20,change:-0.80,pct:-0.57},{symbol:"AMZN",price:174.90,change:+1.05,pct:+0.60},
    {symbol:"META",price:484.10,change:+5.30,pct:+1.11},{symbol:"SPY",price:514.30,change:+3.20,pct:+0.63},
  ];
  return (
    <PageShell title="Watchlist" icon="👁" color="#5ab233" desc="Monitor your favourite stocks and set price alerts.">
      <div className="ln-spark-grid" style={{marginBottom:20}}>
        {stocks.slice(0,4).map(s=>(
          <Card key={s.symbol} style={{padding:"16px"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div>
                <div style={{fontWeight:800,fontSize:15,color:T.text}}>{s.symbol}</div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(16px,3vw,22px)",fontWeight:700,marginTop:4,color:T.text}}>${s.price}</div>
              </div>
              <span style={{padding:"3px 8px",borderRadius:20,fontSize:11,fontWeight:600,background:s.change>=0?T.positiveBg:T.negativeBg,color:s.change>=0?T.positive:T.negative}}>{s.change>=0?"+":""}{s.pct}%</span>
            </div>
            <div style={{fontSize:12,color:s.change>=0?T.positive:T.negative,marginTop:5,fontWeight:500}}>{s.change>=0?"+":""}{s.change.toFixed(2)} today</div>
            <svg width="100%" height="34" style={{marginTop:8}}>
              {Array.from({length:12},(_,i)=>{const x1=(i/11)*100,x2=((i+1)/11)*100,y1=17+Math.sin(i*0.9+s.price%5)*9,y2=17+Math.sin((i+1)*0.9+s.price%5)*9;return <line key={i} x1={`${x1}%`} y1={y1} x2={`${x2}%`} y2={y2} stroke={s.change>=0?"#5ab233":T.negative} strokeWidth="2" strokeLinecap="round"/>;})}
            </svg>
          </Card>
        ))}
      </div>
      <Card style={{padding:"18px"}}>
        <div className="ln-table-wrap">
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
            <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>{["Symbol","Price","Change","% Chg","52W High","52W Low","Action"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
            <tbody>{stocks.map((s,i)=>(
              <tr key={s.symbol} style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?"transparent":T.bg2}}>
                <td style={{padding:"12px",fontWeight:800,color:T.text}}>{s.symbol}</td>
                <td style={{padding:"12px",fontWeight:600,color:T.text,whiteSpace:"nowrap"}}>${s.price}</td>
                <td style={{padding:"12px",fontWeight:600,color:s.change>=0?T.positive:T.negative,whiteSpace:"nowrap"}}>{s.change>=0?"+":""}{s.change.toFixed(2)}</td>
                <td style={{padding:"12px"}}><span style={{padding:"2px 7px",borderRadius:20,fontSize:10,fontWeight:600,background:s.change>=0?T.positiveBg:T.negativeBg,color:s.change>=0?T.positive:T.negative}}>{s.change>=0?"+":""}{s.pct}%</span></td>
                <td style={{padding:"12px",color:T.muted2,fontSize:12,whiteSpace:"nowrap"}}>${(s.price*1.18).toFixed(2)}</td>
                <td style={{padding:"12px",color:T.muted2,fontSize:12,whiteSpace:"nowrap"}}>${(s.price*0.74).toFixed(2)}</td>
                <td style={{padding:"12px"}}><div style={{display:"flex",gap:5}}><span style={{padding:"3px 9px",borderRadius:7,fontSize:11,fontWeight:600,background:T.positiveBg,color:T.positive,cursor:"pointer"}}>Buy</span><span style={{padding:"3px 9px",borderRadius:7,fontSize:11,fontWeight:600,background:T.negativeBg,color:T.negative,cursor:"pointer"}}>Sell</span></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </PageShell>
  );
}

/* ── Risk Calculator ── */
function RiskCalculatorPage() {
  const { T } = useTheme();
  const [vals,setVals] = useState({capital:"100000",risk:"1",entry:"100",sl:"95"});
  const capital=parseFloat(vals.capital||"0"),riskPct=parseFloat(vals.risk||"0");
  const entry=parseFloat(vals.entry||"0"),sl=parseFloat(vals.sl||"0");
  const riskAmount=capital*riskPct/100;
  const slPts=Math.abs(entry-sl);
  const posSize=slPts>0?Math.floor(riskAmount/slPts):0;
  const totalExposure=posSize*entry;
  const inp={width:"100%",padding:"11px 14px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text};
  return (
    <PageShell title="Risk Calculator" icon="⚖️" color="#5ab233" desc="Calculate the right position size based on your risk tolerance and stop-loss.">
      <div className="ln-two-col">
        <Card style={{padding:"24px"}}>
          <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:20}}>Input Parameters</div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {[{k:"capital",l:"Total Capital (₹)",ph:"100000"},{k:"risk",l:"Risk Per Trade (%)",ph:"1"},{k:"entry",l:"Entry Price (₹)",ph:"100"},{k:"sl",l:"Stop Loss Price (₹)",ph:"95"}].map(f=>(
              <div key={f.k}>
                <label style={{fontSize:12,color:T.muted2,display:"block",marginBottom:5}}>{f.l}</label>
                <input type="number" value={(vals)[f.k]} onChange={e=>setVals(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={inp} onFocus={e=>e.target.style.borderColor="#5ab233"} onBlur={e=>e.target.style.borderColor=T.border}/>
              </div>
            ))}
          </div>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {[{l:"Risk Amount",v:`₹${riskAmount.toFixed(2)}`,c:"#5ab233",icon:"⚠️"},{l:"Position Size",v:`${posSize} shares`,c:"#6366f1",icon:"📐"},{l:"Total Exposure",v:`₹${totalExposure.toFixed(0)}`,c:"#0ea5e9",icon:"💰"},{l:"Stop Loss Points",v:`₹${slPts.toFixed(2)}`,c:"#ef4444",icon:"🛑"}].map(r=>(
            <Card key={r.l} style={{padding:"20px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:12,color:T.muted,marginBottom:6}}>{r.l}</div>
                  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(20px,4vw,28px)",fontWeight:800,color:r.c}}>{r.v}</div>
                </div>
                <span style={{fontSize:28}}>{r.icon}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

/* ── Position Size Calculator ── */
function PositionSizePage() {
  const { T } = useTheme();
  const [v,setV] = useState({account:"500000",riskPct:"1",entry:"250",target:"275",sl:"240"});
  const acc=parseFloat(v.account||"0"),rPct=parseFloat(v.riskPct||"0");
  const entry=parseFloat(v.entry||"0"),target=parseFloat(v.target||"0"),sl=parseFloat(v.sl||"0");
  const riskAmt=acc*rPct/100, slPts=Math.abs(entry-sl), tgtPts=Math.abs(target-entry);
  const qty=slPts>0?Math.floor(riskAmt/slPts):0;
  const rr=slPts>0?(tgtPts/slPts).toFixed(2):0;
  const potProfit=qty*tgtPts, potLoss=qty*slPts;
  const inp={width:"100%",padding:"10px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text};
  return (
    <PageShell title="Position Size Calculator" icon="📐" color="#5ab233" desc="Calculate optimal position size for any trade based on risk/reward.">
      <div className="ln-two-col">
        <Card style={{padding:"24px"}}>
          <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:18}}>Trade Parameters</div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[{k:"account",l:"Account Size (₹)",ph:"500000"},{k:"riskPct",l:"Risk Per Trade (%)",ph:"1"},{k:"entry",l:"Entry Price",ph:"250"},{k:"target",l:"Target Price",ph:"275"},{k:"sl",l:"Stop Loss",ph:"240"}].map(f=>(
              <div key={f.k}>
                <label style={{fontSize:12,color:T.muted2,display:"block",marginBottom:4}}>{f.l}</label>
                <input type="number" value={(v)[f.k]} onChange={e=>setV(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={inp} onFocus={e=>e.target.style.borderColor="#5ab233"} onBlur={e=>e.target.style.borderColor=T.border}/>
              </div>
            ))}
          </div>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card style={{padding:"20px",background:`linear-gradient(135deg,#5ab23318,${T.card})`}}>
            <div style={{fontSize:12,color:T.muted,marginBottom:6}}>Recommended Quantity</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:42,fontWeight:800,color:"#5ab233"}}>{qty}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:4}}>shares / units</div>
          </Card>
          {[{l:"Risk : Reward",v:`1 : ${rr}`,c:parseFloat(rr.toString())>=2?"#5ab233":"#f59e0b"},{l:"Potential Profit",v:`₹${potProfit.toFixed(0)}`,c:T.positive},{l:"Potential Loss",v:`₹${potLoss.toFixed(0)}`,c:T.negative}].map(r=>(
            <Card key={r.l} style={{padding:"16px"}}>
              <div style={{fontSize:11,color:T.muted,marginBottom:5}}>{r.l}</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color:r.c}}>{r.v}</div>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

/* ── P&L Analytics ── */
function PnLAnalyticsPage() {
  const { T } = useTheme();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const data = [8200,-3100,12400,5600,-1800,9300,14200,-4500,7800,11200,6400,15300];
  const total = data.reduce((s,v)=>s+v,0);
  const wins = data.filter(v=>v>0).length;
  const maxBar = Math.max(...data.map(Math.abs));
  return (
    <PageShell title="P&L Analytics" icon="📊" color="#5ab233" desc="Deep dive into your trading performance across months and strategies.">
      <div className="ln-stats-grid" style={{marginBottom:24}}>
        {[{l:"Total P&L",v:`₹${(total/1000).toFixed(1)}K`,c:total>=0?T.positive:T.negative},{l:"Profitable Months",v:`${wins}/12`,c:T.positive},{l:"Best Month",v:`₹${(Math.max(...data)/1000).toFixed(1)}K`,c:T.positive},{l:"Worst Month",v:`₹${(Math.min(...data)/1000).toFixed(1)}K`,c:T.negative}].map(s=>(
          <Card key={s.l} style={{padding:"16px"}}><div style={{fontSize:11,color:T.muted,marginBottom:5}}>{s.l}</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(16px,3vw,22px)",fontWeight:800,color:s.c}}>{s.v}</div></Card>
        ))}
      </div>
      <Card style={{padding:"24px"}}>
        <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:20}}>Monthly P&L</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:8,height:160}}>
          {data.map((v,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{fontSize:9,color:v>=0?T.positive:T.negative,fontWeight:600,whiteSpace:"nowrap"}}>{v>=0?"+":""}{(v/1000).toFixed(0)}K</div>
              <div style={{width:"100%",borderRadius:"4px 4px 0 0",
                height:`${Math.abs(v)/maxBar*120}px`,
                background:v>=0?"#5ab233":"#ef4444",opacity:0.85}}/>
              <div style={{fontSize:9,color:T.muted}}>{months[i]}</div>
            </div>
          ))}
        </div>
      </Card>
    </PageShell>
  );
}

/* ── Expense Tracker ── */
function ExpenseTrackerPage() {
  const { T } = useTheme();
  const [expenses,setExpenses] = useState([
    {id:1,name:"Rent",cat:"Housing",amount:15000,date:"2024-01-01",mode:"Bank Transfer"},
    {id:2,name:"Groceries",cat:"Food",amount:4500,date:"2024-01-05",mode:"UPI"},
    {id:3,name:"Netflix",cat:"Entertainment",amount:649,date:"2024-01-07",mode:"Credit Card"},
    {id:4,name:"Petrol",cat:"Transport",amount:2000,date:"2024-01-10",mode:"UPI"},
  ]);
  const [form,setForm] = useState({name:"",cat:"Food",amount:"",date:"",mode:"UPI"});
  const [showForm,setShowForm] = useState(false);
  const total=expenses.reduce((s,e)=>s+e.amount,0);
  const cats=["Food","Housing","Transport","Entertainment","Shopping","Health","Education","Other"];
  const modes=["UPI","Credit Card","Debit Card","Cash","Bank Transfer","Net Banking"];
  const inp={width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text};
  const catTotals = cats.map(c=>({cat:c,total:expenses.filter(e=>e.cat===c).reduce((s,e)=>s+e.amount,0)})).filter(c=>c.total>0);
  return (
    <PageShell title="Expense Tracker" icon="💸" color="#f59e0b" desc="Track and categorize all your expenses to understand your spending habits.">
      <div className="ln-stats-grid" style={{marginBottom:20}}>
        {[{l:"Total Expenses",v:`₹${total.toLocaleString()}`,c:T.negative},{l:"This Month",v:`${expenses.length} entries`},{l:"Largest",v:`₹${Math.max(...expenses.map(e=>e.amount)).toLocaleString()}`},{l:"Categories",v:catTotals.length}].map(s=>(
          <Card key={s.l} style={{padding:"16px"}}><div style={{fontSize:11,color:T.muted,marginBottom:5}}>{s.l}</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(14px,3vw,20px)",fontWeight:800,color:(s).c||T.text}}>{s.v}</div></Card>
        ))}
      </div>
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <button onClick={()=>setShowForm(s=>!s)} style={{padding:"9px 20px",borderRadius:9,border:"none",background:"#f59e0b",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+ Add Expense</button>
      </div>
      {showForm&&(
        <Card style={{marginBottom:16,padding:"22px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
            {[{k:"name",l:"Expense Name",ph:"Rent"},{k:"amount",l:"Amount (₹)",ph:"5000",t:"number"},{k:"date",l:"Date",t:"date"}].map(f=>(
              <div key={f.k}><label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>{f.l}</label><input value={(form)[f.k]} type={f.t||"text"} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={inp} onFocus={e=>e.target.style.borderColor="#f59e0b"} onBlur={e=>e.target.style.borderColor=T.border}/></div>
            ))}
            <div><label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>Category</label><select value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))} style={inp}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>Payment Mode</label><select value={form.mode} onChange={e=>setForm(p=>({...p,mode:e.target.value}))} style={inp}>{modes.map(m=><option key={m}>{m}</option>)}</select></div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:14}}>
            <button onClick={()=>{if(!form.name||!form.amount)return;setExpenses(e=>[{id:Date.now(),name:form.name,cat:form.cat,amount:parseFloat(form.amount),date:form.date||new Date().toISOString().slice(0,10),mode:form.mode},...e]);setForm({name:"",cat:"Food",amount:"",date:"",mode:"UPI"});setShowForm(false);}} style={{padding:"9px 20px",borderRadius:9,border:"none",background:"#f59e0b",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Save</button>
            <button onClick={()=>setShowForm(false)} style={{padding:"9px 20px",borderRadius:9,border:`1.5px solid ${T.border}`,background:"transparent",color:T.text,fontSize:13,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Cancel</button>
          </div>
        </Card>
      )}
      <div className="ln-two-col">
        <Card style={{padding:"20px"}}>
          <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:14}}>Recent Expenses</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {expenses.map(e=>(
              <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderRadius:10,background:T.bg2,border:`1px solid ${T.border}`}}>
                <div>
                  <div style={{fontWeight:600,fontSize:13,color:T.text}}>{e.name}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>{e.cat} · {e.date} · {e.mode}</div>
                </div>
                <div style={{fontWeight:700,color:T.negative}}>₹{e.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{padding:"20px"}}>
          <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:14}}>By Category</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {catTotals.sort((a,b)=>b.total-a.total).map(c=>(
              <div key={c.cat}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                  <span style={{color:T.text,fontWeight:500}}>{c.cat}</span>
                  <span style={{color:T.muted2}}>₹{c.total.toLocaleString()}</span>
                </div>
                <div style={{height:6,borderRadius:4,background:T.bg3}}>
                  <div style={{height:"100%",borderRadius:4,background:"#f59e0b",width:`${(c.total/total*100).toFixed(0)}%`,transition:"width .5s"}}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

/* ── Budget Planner ── */
function BudgetPlannerPage() {
  const { T } = useTheme();
  const [budget,setBudget] = useState([
    {cat:"Housing",budgeted:15000,spent:15000},{cat:"Food",budgeted:8000,spent:6200},
    {cat:"Transport",budgeted:4000,spent:3100},{cat:"Entertainment",budgeted:3000,spent:4200},
    {cat:"Shopping",budgeted:5000,spent:2800},{cat:"Health",budgeted:2000,spent:800},
    {cat:"Savings",budgeted:10000,spent:10000},{cat:"Other",budgeted:3000,spent:1500},
  ]);
  const totalBudget=budget.reduce((s,b)=>s+b.budgeted,0);
  const totalSpent=budget.reduce((s,b)=>s+b.spent,0);
  return (
    <PageShell title="Budget Planner" icon="📊" color="#f59e0b" desc="Plan and track your monthly budget across all expense categories.">
      <div className="ln-stats-grid" style={{marginBottom:24}}>
        {[{l:"Total Budget",v:`₹${totalBudget.toLocaleString()}`,c:"#f59e0b"},{l:"Total Spent",v:`₹${totalSpent.toLocaleString()}`,c:totalSpent>totalBudget?T.negative:T.positive},{l:"Remaining",v:`₹${(totalBudget-totalSpent).toLocaleString()}`,c:totalBudget>totalSpent?T.positive:T.negative},{l:"Utilisation",v:`${(totalSpent/totalBudget*100).toFixed(0)}%`}].map(s=>(
          <Card key={s.l} style={{padding:"16px"}}><div style={{fontSize:11,color:T.muted,marginBottom:5}}>{s.l}</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(14px,3vw,20px)",fontWeight:800,color:(s).c||T.text}}>{s.v}</div></Card>
        ))}
      </div>
      <Card style={{padding:"24px"}}>
        <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:18}}>Category Breakdown</div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {budget.map((b,i)=>{
            const pct=Math.min(100,(b.spent/b.budgeted*100));
            const over=b.spent>b.budgeted;
            return (
              <div key={b.cat}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:6}}>
                  <span style={{fontWeight:600,fontSize:13,color:T.text}}>{b.cat}</span>
                  <div style={{display:"flex",gap:12,fontSize:12}}>
                    <span style={{color:over?T.negative:T.positive}}>Spent: ₹{b.spent.toLocaleString()}</span>
                    <span style={{color:T.muted}}>Budget: ₹{b.budgeted.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{height:10,borderRadius:6,background:T.bg3,position:"relative"}}>
                  <div style={{height:"100%",borderRadius:6,background:over?"#ef4444":"#f59e0b",width:`${Math.min(100,pct)}%`,transition:"width .5s"}}/>
                </div>
                <div style={{fontSize:10,color:over?T.negative:T.muted,marginTop:3,textAlign:"right"}}>{over?`Over by ₹${(b.spent-b.budgeted).toLocaleString()}`:`${(100-pct).toFixed(0)}% remaining`}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </PageShell>
  );
}

/* ── Savings Goals ── */
function SavingsGoalsPage() {
  const { T } = useTheme();
  const [goals,setGoals] = useState([
    {id:1,name:"Emergency Fund",target:300000,saved:180000,deadline:"2024-12-31",icon:"🛡️"},
    {id:2,name:"Vacation - Goa",target:50000,saved:32000,deadline:"2024-06-30",icon:"🏖️"},
    {id:3,name:"New Laptop",target:80000,saved:45000,deadline:"2024-09-30",icon:"💻"},
    {id:4,name:"Home Down Payment",target:1000000,saved:250000,deadline:"2026-12-31",icon:"🏠"},
  ]);
  return (
    <PageShell title="Savings Goals" icon="🎯" color="#f59e0b" desc="Set and track your financial savings goals with progress indicators.">
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16,marginBottom:20}}>
        {goals.map(g=>{
          const pct=Math.min(100,(g.saved/g.target*100));
          const remaining=g.target-g.saved;
          return (
            <Card key={g.id} style={{padding:"22px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontSize:24,marginBottom:6}}>{g.icon}</div>
                  <div style={{fontWeight:700,fontSize:15,color:T.text}}>{g.name}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>Due: {g.deadline}</div>
                </div>
                <span style={{fontSize:18,fontWeight:800,color:"#f59e0b"}}>{pct.toFixed(0)}%</span>
              </div>
              <div style={{height:10,borderRadius:6,background:T.bg3,marginBottom:10}}>
                <div style={{height:"100%",borderRadius:6,background:"#f59e0b",width:`${pct}%`,transition:"width .5s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                <span style={{color:T.positive,fontWeight:600}}>Saved: ₹{g.saved.toLocaleString()}</span>
                <span style={{color:T.muted}}>Left: ₹{remaining.toLocaleString()}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}

/* ── Net Worth ── */
function NetWorthPage() {
  const { T } = useTheme();
  const assets=[{name:"Cash & Savings",val:350000},{name:"Stocks Portfolio",val:480000},{name:"Mutual Funds",val:220000},{name:"Fixed Deposits",val:500000},{name:"Gold",val:150000},{name:"Real Estate",val:3500000}];
  const liabilities=[{name:"Home Loan",val:1200000},{name:"Car Loan",val:280000},{name:"Credit Card",val:45000},{name:"Personal Loan",val:0}];
  const totalAssets=assets.reduce((s,a)=>s+a.val,0);
  const totalLiab=liabilities.reduce((s,l)=>s+l.val,0);
  const netWorth=totalAssets-totalLiab;
  return (
    <PageShell title="Net Worth Dashboard" icon="💰" color="#f59e0b" desc="Complete snapshot of your financial health — assets minus liabilities.">
      <div style={{textAlign:"center",padding:"28px 0",marginBottom:24}}>
        <div style={{fontSize:13,color:T.muted,marginBottom:8,letterSpacing:"1px",textTransform:"uppercase"}}>Net Worth</div>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(36px,6vw,64px)",fontWeight:800,color:netWorth>=0?"#f59e0b":T.negative}}>₹{(netWorth/100000).toFixed(1)}L</div>
        <div style={{fontSize:13,color:T.muted,marginTop:8}}>Assets ₹{(totalAssets/100000).toFixed(1)}L — Liabilities ₹{(totalLiab/100000).toFixed(1)}L</div>
      </div>
      <div className="ln-two-col">
        <Card style={{padding:"22px"}}>
          <div style={{fontWeight:700,fontSize:15,color:T.positive,marginBottom:14}}>Assets</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {assets.map(a=>(
              <div key={a.name} style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",borderRadius:10,background:T.bg2,border:`1px solid ${T.border}`}}>
                <span style={{fontSize:13,color:T.text,fontWeight:500}}>{a.name}</span>
                <span style={{fontWeight:700,color:T.positive}}>₹{a.val.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{padding:"22px"}}>
          <div style={{fontWeight:700,fontSize:15,color:T.negative,marginBottom:14}}>Liabilities</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {liabilities.map(l=>(
              <div key={l.name} style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",borderRadius:10,background:T.bg2,border:`1px solid ${T.border}`}}>
                <span style={{fontSize:13,color:T.text,fontWeight:500}}>{l.name}</span>
                <span style={{fontWeight:700,color:l.val>0?T.negative:T.muted}}>₹{l.val.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

/* ── EMI Calculator ── */
function EMICalculatorPage() {
  const { T } = useTheme();
  const [v,setV] = useState({principal:"500000",rate:"8.5",tenure:"60"});
  const P=parseFloat(v.principal||"0"),r=parseFloat(v.rate||"0")/12/100,n=parseInt(v.tenure||"0");
  const emi=r>0&&n>0?Math.round(P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)):0;
  const totalPayment=emi*n, totalInterest=totalPayment-P;
  const inp={width:"100%",padding:"11px 14px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text};
  return (
    <PageShell title="EMI Calculator" icon="🧮" color="#f59e0b" desc="Calculate your Equated Monthly Instalment for any loan.">
      <div className="ln-two-col">
        <Card style={{padding:"24px"}}>
          <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:20}}>Loan Details</div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {[{k:"principal",l:"Loan Amount (₹)",ph:"500000"},{k:"rate",l:"Interest Rate (% per annum)",ph:"8.5"},{k:"tenure",l:"Tenure (months)",ph:"60"}].map(f=>(
              <div key={f.k}><label style={{fontSize:12,color:T.muted2,display:"block",marginBottom:5}}>{f.l}</label><input type="number" value={(v)[f.k]} onChange={e=>setV(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={inp} onFocus={e=>e.target.style.borderColor="#f59e0b"} onBlur={e=>e.target.style.borderColor=T.border}/></div>
            ))}
          </div>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card style={{padding:"24px",background:`linear-gradient(135deg,#f59e0b18,${T.card})`}}>
            <div style={{fontSize:12,color:T.muted,marginBottom:6}}>Monthly EMI</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:42,fontWeight:800,color:"#f59e0b"}}>₹{emi.toLocaleString()}</div>
          </Card>
          {[{l:"Total Amount Payable",v:`₹${totalPayment.toLocaleString()}`,c:T.text},{l:"Total Interest",v:`₹${totalInterest.toLocaleString()}`,c:T.negative},{l:"Principal Amount",v:`₹${P.toLocaleString()}`,c:T.positive}].map(r=>(
            <Card key={r.l} style={{padding:"16px"}}><div style={{fontSize:11,color:T.muted,marginBottom:5}}>{r.l}</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:r.c}}>{r.v}</div></Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

/* ── P&L Statement ── */
function ProfitLossPage() {
  const { T } = useTheme();
  const data={revenue:2850000,cogs:1420000,opex:680000,tax:0.3};
  const gross=data.revenue-data.cogs;
  const ebit=gross-data.opex;
  const net=ebit*(1-data.tax);
  const rows=[{l:"Revenue",v:data.revenue,bold:true},{l:"Cost of Goods Sold",v:-data.cogs},{l:"Gross Profit",v:gross,bold:true,color:T.positive},{l:"Operating Expenses",v:-data.opex},{l:"EBIT",v:ebit,bold:true},{l:"Tax (30%)",v:-(ebit*data.tax)},{l:"Net Profit",v:net,bold:true,color:net>=0?T.positive:T.negative}];
  return (
    <PageShell title="Profit & Loss" icon="📈" color="#0ea5e9" desc="Comprehensive income statement showing revenue, expenses and net profit.">
      <Card style={{padding:"24px",marginBottom:20}}>
        <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:6}}>FY 2023-24 · Annual P&L Statement</div>
        <div style={{fontSize:13,color:T.muted,marginBottom:20}}>All figures in Indian Rupees (₹)</div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {rows.map((r,i)=>(
            <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"12px 16px",
              background:i%2===0?T.bg2:"transparent",borderRadius:8,
              borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontSize:14,fontWeight:(r).bold?700:400,color:T.text}}>{r.l}</span>
              <span style={{fontSize:14,fontWeight:(r).bold?700:400,color:(r).color||(r.v<0?T.negative:T.text)}}>
                {r.v<0?"-":"+"}₹{Math.abs(r.v).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </PageShell>
  );
}

/* ── Balance Sheet ── */
function BalanceSheetPage() {
  const { T } = useTheme();
  const assets={current:[{n:"Cash & Bank",v:450000},{n:"Accounts Receivable",v:280000},{n:"Inventory",v:120000}],fixed:[{n:"Equipment",v:800000},{n:"Vehicles",v:350000},{n:"Property",v:2500000}]};
  const liab={current:[{n:"Accounts Payable",v:180000},{n:"Short-term Loans",v:250000},{n:"Tax Payable",v:85000}],longTerm:[{n:"Bank Loan",v:1200000},{n:"Mortgage",v:1800000}]};
  const totalCurrAssets=assets.current.reduce((s,a)=>s+a.v,0);
  const totalFixedAssets=assets.fixed.reduce((s,a)=>s+a.v,0);
  const totalAssets=totalCurrAssets+totalFixedAssets;
  const totalCurrLiab=liab.current.reduce((s,l)=>s+l.v,0);
  const totalLTLiab=liab.longTerm.reduce((s,l)=>s+l.v,0);
  const totalLiab=totalCurrLiab+totalLTLiab;
  const equity=totalAssets-totalLiab;
  return (
    <PageShell title="Balance Sheet" icon="⚖️" color="#0ea5e9" desc="Financial position statement showing assets, liabilities and equity.">
      <div className="ln-two-col">
        <Card style={{padding:"22px"}}>
          <div style={{fontWeight:800,fontSize:16,color:T.positive,marginBottom:16}}>ASSETS</div>
          <div style={{fontSize:12,fontWeight:700,color:T.muted,letterSpacing:"1px",textTransform:"uppercase",marginBottom:10}}>Current Assets</div>
          {assets.current.map(a=><div key={a.n} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}><span style={{color:T.text}}>{a.n}</span><span style={{fontWeight:600,color:T.text}}>₹{a.v.toLocaleString()}</span></div>)}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",fontSize:14,fontWeight:700,color:T.positive,marginTop:4,borderTop:`2px solid ${T.accent}`}}><span>Total Current Assets</span><span>₹{totalCurrAssets.toLocaleString()}</span></div>
          <div style={{fontSize:12,fontWeight:700,color:T.muted,letterSpacing:"1px",textTransform:"uppercase",margin:"14px 0 10px"}}>Fixed Assets</div>
          {assets.fixed.map(a=><div key={a.n} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}><span style={{color:T.text}}>{a.n}</span><span style={{fontWeight:600,color:T.text}}>₹{a.v.toLocaleString()}</span></div>)}
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 0",fontSize:15,fontWeight:800,color:T.positive,borderTop:`2px solid ${T.accent}`,marginTop:6}}><span>TOTAL ASSETS</span><span>₹{totalAssets.toLocaleString()}</span></div>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card style={{padding:"22px"}}>
            <div style={{fontWeight:800,fontSize:16,color:T.negative,marginBottom:16}}>LIABILITIES</div>
            <div style={{fontSize:12,fontWeight:700,color:T.muted,letterSpacing:"1px",textTransform:"uppercase",marginBottom:10}}>Current Liabilities</div>
            {liab.current.map(l=><div key={l.n} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}><span style={{color:T.text}}>{l.n}</span><span style={{fontWeight:600,color:T.negative}}>₹{l.v.toLocaleString()}</span></div>)}
            <div style={{fontSize:12,fontWeight:700,color:T.muted,letterSpacing:"1px",textTransform:"uppercase",margin:"14px 0 10px"}}>Long-term Liabilities</div>
            {liab.longTerm.map(l=><div key={l.n} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}><span style={{color:T.text}}>{l.n}</span><span style={{fontWeight:600,color:T.negative}}>₹{l.v.toLocaleString()}</span></div>)}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",fontSize:14,fontWeight:800,color:T.negative,borderTop:`2px solid ${T.negative}`,marginTop:6}}><span>TOTAL LIABILITIES</span><span>₹{totalLiab.toLocaleString()}</span></div>
          </Card>
          <Card style={{padding:"22px",background:`linear-gradient(135deg,#0ea5e918,${T.card})`}}>
            <div style={{fontSize:12,color:T.muted,marginBottom:8}}>SHAREHOLDER EQUITY</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:28,fontWeight:800,color:"#0ea5e9"}}>₹{equity.toLocaleString()}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:4}}>Assets − Liabilities</div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

/* ── Cash Flow ── */
function CashFlowPage() {
  const { T } = useTheme();
  const sections=[
    {title:"Operating Activities",color:"#0ea5e9",items:[{n:"Net Profit",v:750000},{n:"Depreciation",v:85000},{n:"Change in Receivables",v:-45000},{n:"Change in Payables",v:28000}]},
    {title:"Investing Activities",color:"#a855f7",items:[{n:"Equipment Purchase",v:-120000},{n:"Sale of Assets",v:35000},{n:"Investments Made",v:-200000}]},
    {title:"Financing Activities",color:"#f59e0b",items:[{n:"Loan Taken",v:500000},{n:"Loan Repayment",v:-180000},{n:"Dividends Paid",v:-50000}]},
  ];
  return (
    <PageShell title="Cash Flow Statement" icon="🔄" color="#0ea5e9" desc="Track cash inflows and outflows across operating, investing and financing activities.">
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {sections.map(s=>{
          const net=s.items.reduce((sum,i)=>sum+i.v,0);
          return (
            <Card key={s.title} style={{padding:"22px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontWeight:700,fontSize:15,color:s.color}}>{s.title}</div>
                <span style={{fontWeight:800,fontSize:16,color:net>=0?T.positive:T.negative}}>{net>=0?"+":""}₹{Math.abs(net).toLocaleString()}</span>
              </div>
              {s.items.map(item=>(
                <div key={item.n} style={{display:"flex",justifyContent:"space-between",padding:"9px 12px",borderRadius:8,background:T.bg2,marginBottom:6,fontSize:13}}>
                  <span style={{color:T.text}}>{item.n}</span>
                  <span style={{fontWeight:600,color:item.v>=0?T.positive:T.negative}}>{item.v>=0?"+":""}₹{Math.abs(item.v).toLocaleString()}</span>
                </div>
              ))}
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}

/* ── Invoices Page (renamed from InvoicesPage) ── */
function InvoicesPage({ toast }) {
  const { T } = useTheme();
  const [invoices,setInvoices] = useState([
    {id:"INV-001",client:"Acme Corp",date:"2024-01-15",due:"2024-02-15",amount:4500,status:"Paid"},
    {id:"INV-002",client:"Beta Solutions",date:"2024-01-10",due:"2024-02-10",amount:12000,status:"Pending"},
    {id:"INV-003",client:"Gamma Traders",date:"2024-01-05",due:"2024-02-05",amount:750,status:"Overdue"},
    {id:"INV-004",client:"Delta Investments",date:"2024-01-20",due:"2024-02-20",amount:3200,status:"Draft"},
  ]);
  const [showNew,setShowNew] = useState(false);
  const [form,setForm] = useState({client:"",email:"",items:[{desc:"",qty:1,rate:""}] as {desc;qty;rate;}[]});
  const total=form.items.reduce((s,it)=>s+(parseFloat(it.rate)||0)*it.qty,0);
  const sc:{[k]:{bg;color}}={Paid:{bg:T.positiveBg,color:T.positive},Pending:{bg:T.warnBg,color:T.warn},Overdue:{bg:T.negativeBg,color:T.negative},Draft:{bg:T.bg3,color:T.muted}};
  const inp={width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text};
  const save=()=>{if(!form.client)return;setInvoices(iv=>[{id:`INV-00${invoices.length+1}`,client:form.client,date:new Date().toISOString().slice(0,10),due:"",amount:total,status:"Draft"},...iv]);setShowNew(false);setForm({client:"",email:"",items:[{desc:"",qty:1,rate:""}]});toast("Invoice saved!");};
  return (
    <PageShell title="Invoices & Billing" icon="✏️" color="#5ab233" desc="Create, send and track professional invoices for your clients.">
      <div className="ln-stats-grid" style={{marginBottom:18}}>
        {[{l:"Total",v:invoices.length,i:"🧾"},{l:"Revenue",v:`$${invoices.filter(i=>i.status==="Paid").reduce((s,i)=>s+i.amount,0).toLocaleString()}`,i:"✅"},{l:"Pending",v:`$${invoices.filter(i=>i.status==="Pending").reduce((s,i)=>s+i.amount,0).toLocaleString()}`,i:"⏳"},{l:"Overdue",v:`$${invoices.filter(i=>i.status==="Overdue").reduce((s,i)=>s+i.amount,0).toLocaleString()}`,i:"⚠️"}].map(s=>(
          <Card key={s.l} style={{padding:"14px"}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:11,color:T.muted,marginBottom:5}}>{s.l}</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(14px,3vw,20px)",fontWeight:800,color:T.text}}>{s.v}</div></div><span style={{fontSize:20}}>{s.i}</span></div></Card>
        ))}
      </div>
      <div style={{marginBottom:16}}><button onClick={()=>setShowNew(s=>!s)} style={{padding:"9px 22px",borderRadius:9,border:"none",background:"#5ab233",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+ New Invoice</button></div>
      {showNew&&(
        <Card style={{marginBottom:16,padding:"22px"}}>
          <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:16}}>New Invoice</div>
          <div className="ln-invoice-meta">
            {[{k:"client",l:"Client",ph:"Acme Corp"},{k:"email",l:"Email",ph:"billing@client.com"}].map(f=>(
              <div key={f.k}><label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>{f.l}</label><input value={(form)[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={inp} onFocus={e=>e.target.style.borderColor="#5ab233"} onBlur={e=>e.target.style.borderColor=T.border}/></div>
            ))}
          </div>
          <div className="ln-table-wrap">
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:340,marginBottom:10}}>
              <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>{["Description","Qty","Rate","Amount"].map(h=><th key={h} style={{padding:"7px 8px",textAlign:"left",fontSize:10,color:T.muted,fontWeight:600,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
              <tbody>{form.items.map((it,i)=>(
                <tr key={i}>
                  <td style={{padding:"5px 4px"}}><input value={it.desc} onChange={e=>{const items=[...form.items];items[i]={...items[i],desc:e.target.value};setForm(f=>({...f,items}));}} placeholder="Service" style={{...inp,padding:"8px 10px"}}/></td>
                  <td style={{padding:"5px 4px",width:64}}><input type="number" value={it.qty} onChange={e=>{const items=[...form.items];items[i]={...items[i],qty:parseInt(e.target.value)||1};setForm(f=>({...f,items}));}} style={{...inp,padding:"8px 8px"}}/></td>
                  <td style={{padding:"5px 4px",width:96}}><input type="number" value={it.rate} onChange={e=>{const items=[...form.items];items[i]={...items[i],rate:e.target.value};setForm(f=>({...f,items}));}} placeholder="0.00" style={{...inp,padding:"8px 8px"}}/></td>
                  <td style={{padding:"5px 10px",fontWeight:600,fontSize:13,color:T.text,whiteSpace:"nowrap"}}>${((parseFloat(it.rate)||0)*it.qty).toFixed(2)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <button onClick={()=>setForm(f=>({...f,items:[...f.items,{desc:"",qty:1,rate:""}]}))} style={{background:"none",border:"none",color:"#5ab233",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+ Add Line</button>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:T.text}}>Total: ${total.toFixed(2)}</div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
            <button onClick={save} style={{padding:"9px 20px",borderRadius:9,border:"none",background:"#5ab233",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Save Invoice</button>
            <button onClick={()=>setShowNew(false)} style={{padding:"9px 20px",borderRadius:9,border:`1.5px solid ${T.border}`,background:"transparent",color:T.text,fontSize:13,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Cancel</button>
          </div>
        </Card>
      )}
      <Card style={{padding:"18px"}}>
        <div className="ln-table-wrap">
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:480}}>
            <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>{["Invoice","Client","Date","Amount","Status",""].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:600,color:T.muted,textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
            <tbody>{invoices.map(inv=>{const s=sc[inv.status]||{bg:T.bg3,color:T.muted};return(
              <tr key={inv.id} style={{borderBottom:`1px solid ${T.border}`}}>
                <td style={{padding:"12px",fontWeight:700,fontSize:12,color:T.text,whiteSpace:"nowrap"}}>{inv.id}</td>
                <td style={{padding:"12px",fontSize:13,color:T.text}}>{inv.client}</td>
                <td style={{padding:"12px",fontSize:12,color:T.muted,whiteSpace:"nowrap"}}>{inv.date}</td>
                <td style={{padding:"12px",fontWeight:700,fontSize:13,color:T.text,whiteSpace:"nowrap"}}>${inv.amount.toLocaleString()}</td>
                <td style={{padding:"12px"}}><span style={{padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:600,background:s.bg,color:s.color}}>{inv.status}</span></td>
                <td style={{padding:"12px"}}><button style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#5ab233",fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>PDF</button></td>
              </tr>
            );})}</tbody>
          </table>
        </div>
      </Card>
    </PageShell>
  );
}

/* ── Interest Calculator ── */
function InterestCalculatorPage() {
  const { T } = useTheme();
  const [v,setV] = useState({principal:"100000",rate:"12",time:"2",type:"compound"});
  const P=parseFloat(v.principal||"0"),r=parseFloat(v.rate||"0")/100,t=parseFloat(v.time||"0");
  const si=P*r*t;
  const ci=P*(Math.pow(1+r,t)-1);
  const result=v.type==="simple"?si:ci;
  const total=P+result;
  const inp={width:"100%",padding:"10px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text};
  return (
    <PageShell title="Interest Calculator" icon="🧮" color="#ef4444" desc="Calculate simple and compound interest for any loan or investment.">
      <div className="ln-two-col">
        <Card style={{padding:"24px"}}>
          <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:18}}>Parameters</div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[{k:"principal",l:"Principal Amount (₹)",ph:"100000"},{k:"rate",l:"Rate of Interest (% p.a.)",ph:"12"},{k:"time",l:"Time Period (years)",ph:"2"}].map(f=>(
              <div key={f.k}><label style={{fontSize:12,color:T.muted2,display:"block",marginBottom:4}}>{f.l}</label><input type="number" value={(v)[f.k]} onChange={e=>setV(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={inp} onFocus={e=>e.target.style.borderColor="#ef4444"} onBlur={e=>e.target.style.borderColor=T.border}/></div>
            ))}
            <div>
              <label style={{fontSize:12,color:T.muted2,display:"block",marginBottom:4}}>Interest Type</label>
              <div style={{display:"flex",gap:8}}>
                {["simple","compound"].map(t=>(
                  <button key={t} onClick={()=>setV(p=>({...p,type:t}))} style={{flex:1,padding:"9px",borderRadius:8,border:`1.5px solid ${v.type===t?"#ef4444":T.border}`,background:v.type===t?"#ef4444":T.bg,color:v.type===t?"#fff":T.muted2,fontSize:13,fontWeight:v.type===t?600:400,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",textTransform:"capitalize"}}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card style={{padding:"24px",background:`linear-gradient(135deg,#ef444418,${T.card})`}}>
            <div style={{fontSize:12,color:T.muted,marginBottom:6}}>{v.type==="simple"?"Simple":"Compound"} Interest</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:38,fontWeight:800,color:"#ef4444"}}>₹{result.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
          </Card>
          {[{l:"Total Amount",v:`₹${total.toLocaleString(undefined,{maximumFractionDigits:0})}`},{l:"Principal",v:`₹${P.toLocaleString()}`},{l:"Effective Rate",v:`${(result/P*100).toFixed(1)}% total`}].map(r=>(
            <Card key={r.l} style={{padding:"16px"}}><div style={{fontSize:11,color:T.muted,marginBottom:5}}>{r.l}</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:T.text}}>{r.v}</div></Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

/* ── EMI Schedule ── */
function EMISchedulePage() {
  const { T } = useTheme();
  const [v,setV] = useState({principal:"500000",rate:"8.5",tenure:"12"});
  const P=parseFloat(v.principal||"0"),r=parseFloat(v.rate||"0")/12/100,n=parseInt(v.tenure||"0");
  const emi=r>0&&n>0?Math.round(P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)):0;
  const schedule=Array.from({length:Math.min(n,12)},(_,i)=>{
    const interest=Math.round((P-i*(emi-Math.round(P*r)))*r);
    const principal=emi-interest;
    return {month:i+1,emi,principal,interest,balance:Math.max(0,P-(i+1)*principal)};
  });
  const inp={width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text};
  return (
    <PageShell title="EMI Schedule" icon="📅" color="#ef4444" desc="Full amortisation schedule showing principal and interest breakup for each EMI.">
      <Card style={{padding:"20px",marginBottom:20}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
          {[{k:"principal",l:"Loan Amount (₹)",ph:"500000"},{k:"rate",l:"Interest Rate (% p.a.)",ph:"8.5"},{k:"tenure",l:"Tenure (months)",ph:"12"}].map(f=>(
            <div key={f.k}><label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>{f.l}</label><input type="number" value={(v)[f.k]} onChange={e=>setV(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={inp} onFocus={e=>e.target.style.borderColor="#ef4444"} onBlur={e=>e.target.style.borderColor=T.border}/></div>
          ))}
        </div>
        <div style={{marginTop:14,padding:"14px",borderRadius:10,background:"#ef444412",border:"1px solid #ef444430"}}>
          <span style={{fontSize:14,fontWeight:700,color:T.text}}>Monthly EMI: </span>
          <span style={{fontSize:20,fontWeight:800,color:"#ef4444"}}>₹{emi.toLocaleString()}</span>
        </div>
      </Card>
      <Card style={{padding:"18px"}}>
        <div className="ln-table-wrap">
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:400}}>
            <thead><tr style={{borderBottom:`2px solid ${T.border}`}}>{["Month","EMI","Principal","Interest","Balance"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"center",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
            <tbody>{schedule.map((s,i)=>(
              <tr key={s.month} style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?"transparent":T.bg2}}>
                <td style={{padding:"10px 12px",textAlign:"center",fontWeight:700,color:T.text}}>#{s.month}</td>
                <td style={{padding:"10px 12px",textAlign:"right",fontWeight:600,color:T.text}}>₹{s.emi.toLocaleString()}</td>
                <td style={{padding:"10px 12px",textAlign:"right",color:T.positive}}>₹{s.principal.toLocaleString()}</td>
                <td style={{padding:"10px 12px",textAlign:"right",color:T.negative}}>₹{s.interest.toLocaleString()}</td>
                <td style={{padding:"10px 12px",textAlign:"right",color:T.muted2}}>₹{s.balance.toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </PageShell>
  );
}

/* ── Stocks Portfolio ── */
function StocksPortfolioPage() {
  const { T } = useTheme();
  const stocks=[
    {symbol:"RELIANCE",qty:50,buyPrice:2400,cmp:2680,sector:"Energy"},
    {symbol:"TCS",qty:20,buyPrice:3500,cmp:3820,sector:"IT"},
    {symbol:"HDFCBANK",qty:40,buyPrice:1600,cmp:1520,sector:"Banking"},
    {symbol:"INFY",qty:30,buyPrice:1450,cmp:1580,sector:"IT"},
    {symbol:"WIPRO",qty:100,buyPrice:480,cmp:510,sector:"IT"},
  ];
  const totalInvested=stocks.reduce((s,st)=>s+st.qty*st.buyPrice,0);
  const currentVal=stocks.reduce((s,st)=>s+st.qty*st.cmp,0);
  const totalPnl=currentVal-totalInvested;
  return (
    <PageShell title="Stocks Portfolio" icon="📈" color="#a855f7" desc="Track your equity portfolio with real-time P&L and allocation insights.">
      <div className="ln-stats-grid" style={{marginBottom:20}}>
        {[{l:"Invested",v:`₹${(totalInvested/1000).toFixed(0)}K`},{l:"Current Value",v:`₹${(currentVal/1000).toFixed(0)}K`},{l:"Total P&L",v:`${totalPnl>=0?"+":""}₹${(totalPnl/1000).toFixed(1)}K`,c:totalPnl>=0?T.positive:T.negative},{l:"Returns",v:`${(totalPnl/totalInvested*100).toFixed(1)}%`,c:totalPnl>=0?T.positive:T.negative}].map(s=>(
          <Card key={s.l} style={{padding:"16px"}}><div style={{fontSize:11,color:T.muted,marginBottom:5}}>{s.l}</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(14px,3vw,20px)",fontWeight:800,color:(s).c||T.text}}>{s.v}</div></Card>
        ))}
      </div>
      <Card style={{padding:"18px"}}>
        <div className="ln-table-wrap">
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
            <thead><tr style={{borderBottom:`2px solid ${T.border}`}}>{["Symbol","Sector","Qty","Buy Price","CMP","P&L","Returns"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
            <tbody>{stocks.map((s,i)=>{const pnl=(s.cmp-s.buyPrice)*s.qty,ret=((s.cmp-s.buyPrice)/s.buyPrice*100).toFixed(1);return(
              <tr key={s.symbol} style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?"transparent":T.bg2}}>
                <td style={{padding:"12px",fontWeight:800,color:T.text}}>{s.symbol}</td>
                <td style={{padding:"12px",fontSize:12,color:T.muted}}><span style={{padding:"2px 8px",borderRadius:20,background:"#a855f718",color:"#a855f7",fontSize:11}}>{s.sector}</span></td>
                <td style={{padding:"12px",color:T.text}}>{s.qty}</td>
                <td style={{padding:"12px",color:T.muted2}}>₹{s.buyPrice}</td>
                <td style={{padding:"12px",fontWeight:600,color:T.text}}>₹{s.cmp}</td>
                <td style={{padding:"12px",fontWeight:600,color:pnl>=0?T.positive:T.negative}}>{pnl>=0?"+":""}₹{Math.abs(pnl).toLocaleString()}</td>
                <td style={{padding:"12px"}}><span style={{padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:600,background:parseFloat(ret)>=0?T.positiveBg:T.negativeBg,color:parseFloat(ret)>=0?T.positive:T.negative}}>{parseFloat(ret)>=0?"+":""}{ret}%</span></td>
              </tr>
            );}}</tbody>
          </table>
        </div>
      </Card>
    </PageShell>
  );
}

/* ── Crypto Portfolio ── */
function CryptoPortfolioPage() {
  const { T } = useTheme();
  const coins=[
    {name:"Bitcoin",symbol:"BTC",qty:0.5,buyPrice:42000,cmp:48200,icon:"₿"},
    {name:"Ethereum",symbol:"ETH",qty:2.5,buyPrice:2200,cmp:2650,icon:"Ξ"},
    {name:"Solana",symbol:"SOL",qty:15,buyPrice:80,cmp:110,icon:"◎"},
    {name:"BNB",symbol:"BNB",qty:8,buyPrice:280,cmp:310,icon:"⬡"},
  ];
  const totalInv=coins.reduce((s,c)=>s+c.qty*c.buyPrice,0);
  const currVal=coins.reduce((s,c)=>s+c.qty*c.cmp,0);
  const pnl=currVal-totalInv;
  return (
    <PageShell title="Crypto Portfolio" icon="₿" color="#a855f7" desc="Track all your cryptocurrency investments in one place.">
      <div className="ln-stats-grid" style={{marginBottom:20}}>
        {[{l:"Invested",v:`$${totalInv.toLocaleString()}`},{l:"Current",v:`$${currVal.toLocaleString()}`},{l:"P&L",v:`${pnl>=0?"+":""}$${pnl.toLocaleString()}`,c:pnl>=0?T.positive:T.negative},{l:"Return",v:`${(pnl/totalInv*100).toFixed(1)}%`,c:pnl>=0?T.positive:T.negative}].map(s=>(
          <Card key={s.l} style={{padding:"16px"}}><div style={{fontSize:11,color:T.muted,marginBottom:5}}>{s.l}</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(14px,3vw,20px)",fontWeight:800,color:(s).c||T.text}}>{s.v}</div></Card>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
        {coins.map(c=>{const ret=((c.cmp-c.buyPrice)/c.buyPrice*100);const cpnl=(c.cmp-c.buyPrice)*c.qty;return(
          <Card key={c.symbol} style={{padding:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:"#a855f718",display:"grid",placeItems:"center",fontSize:20,fontWeight:800,color:"#a855f7"}}>{c.icon}</div>
              <span style={{padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:600,background:ret>=0?T.positiveBg:T.negativeBg,color:ret>=0?T.positive:T.negative}}>{ret>=0?"+":""}{ret.toFixed(1)}%</span>
            </div>
            <div style={{fontWeight:800,fontSize:16,color:T.text}}>{c.name}</div>
            <div style={{fontSize:12,color:T.muted,marginBottom:8}}>{c.qty} {c.symbol}</div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span style={{color:T.muted2}}>Avg: ${c.buyPrice.toLocaleString()}</span>
              <span style={{fontWeight:700,color:T.text}}>${c.cmp.toLocaleString()}</span>
            </div>
            <div style={{marginTop:6,fontWeight:700,fontSize:14,color:cpnl>=0?T.positive:T.negative}}>{cpnl>=0?"+":""}${cpnl.toLocaleString()}</div>
          </Card>
        );})}
      </div>
    </PageShell>
  );
}

/* ── Tax Calculator ── */
function TaxCalculatorPage() {
  const { T } = useTheme();
  const [v,setV] = useState({income:"1200000",regime:"new"});
  const income=parseFloat(v.income||"0");
  const oldSlabs=[{from:0,to:250000,rate:0},{from:250000,to:500000,rate:5},{from:500000,to:1000000,rate:20},{from:1000000,to:Infinity,rate:30}];
  const newSlabs=[{from:0,to:300000,rate:0},{from:300000,to:700000,rate:5},{from:700000,to:1000000,rate:10},{from:1000000,to:1200000,rate:15},{from:1200000,to:1500000,rate:20},{from:1500000,to:Infinity,rate:30}];
  const slabs=v.regime==="old"?oldSlabs:newSlabs;
  const calcTax=(inc)=>slabs.reduce((t,s)=>{const taxable=Math.max(0,Math.min(inc,s.to===Infinity?inc:s.to)-s.from);return t+taxable*s.rate/100;},0);
  const tax=calcTax(income);
  const cess=tax*0.04;
  const total=tax+cess;
  const effectiveRate=income>0?(total/income*100).toFixed(1):0;
  const inp={width:"100%",padding:"11px 14px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text};
  return (
    <PageShell title="Tax Calculator" icon="🧮" color="#f97316" desc="Calculate your income tax liability under old and new tax regimes.">
      <div className="ln-two-col">
        <Card style={{padding:"24px"}}>
          <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:18}}>Income Details</div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:12,color:T.muted2,display:"block",marginBottom:5}}>Annual Income (₹)</label>
            <input type="number" value={v.income} onChange={e=>setV(p=>({...p,income:e.target.value}))} placeholder="1200000" style={inp} onFocus={e=>e.target.style.borderColor="#f97316"} onBlur={e=>e.target.style.borderColor=T.border}/>
          </div>
          <div>
            <label style={{fontSize:12,color:T.muted2,display:"block",marginBottom:8}}>Tax Regime</label>
            <div style={{display:"flex",gap:10}}>
              {[["old","Old Regime"],["new","New Regime"]].map(([val,lbl])=>(
                <button key={val} onClick={()=>setV(p=>({...p,regime:val}))} style={{flex:1,padding:"11px",borderRadius:9,border:`1.5px solid ${v.regime===val?"#f97316":T.border}`,background:v.regime===val?"#f97316":T.bg,color:v.regime===val?"#fff":T.muted2,fontSize:13,fontWeight:v.regime===val?700:400,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all .2s"}}>{lbl}</button>
              ))}
            </div>
          </div>
          <div style={{marginTop:20}}>
            <div style={{fontWeight:600,fontSize:13,color:T.text,marginBottom:10}}>Tax Slabs ({v.regime==="old"?"Old":"New"} Regime)</div>
            {slabs.filter(s=>s.rate>0).map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 10px",borderRadius:7,background:T.bg2,marginBottom:5,fontSize:12}}>
                <span style={{color:T.text}}>₹{s.from.toLocaleString()} – {s.to===Infinity?"Above":("₹"+s.to.toLocaleString())}</span>
                <span style={{fontWeight:600,color:"#f97316"}}>{s.rate}%</span>
              </div>
            ))}
          </div>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card style={{padding:"24px",background:`linear-gradient(135deg,#f9731618,${T.card})`}}>
            <div style={{fontSize:12,color:T.muted,marginBottom:6}}>Total Tax Liability</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:38,fontWeight:800,color:"#f97316"}}>₹{total.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
          </Card>
          {[{l:"Income Tax",v:`₹${tax.toLocaleString(undefined,{maximumFractionDigits:0})}`},{l:"Health & Education Cess (4%)",v:`₹${cess.toLocaleString(undefined,{maximumFractionDigits:0})}`},{l:"Effective Tax Rate",v:`${effectiveRate}%`},{l:"In-hand Income",v:`₹${(income-total).toLocaleString(undefined,{maximumFractionDigits:0})}`}].map(r=>(
            <Card key={r.l} style={{padding:"16px"}}><div style={{fontSize:11,color:T.muted,marginBottom:5}}>{r.l}</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,color:T.text}}>{r.v}</div></Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

/* ── Document Vault ── */
function VaultPage({ title, icon, color="#64748b", docType }) {
  const { T } = useTheme();
  const [docs,setDocs] = useState([]);
  const [dragging,setDragging] = useState(false);
  const addDoc=()=>setDocs(d=>[...d,{name:`${docType}_${Date.now()}.pdf`,date:new Date().toLocaleDateString(),size:"2.4 MB",status:"Verified"}]);
  return (
    <PageShell title={title} icon={icon} color={color} desc={`Securely store and manage your ${docType} documents.`}>
      <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);addDoc();}}
        style={{border:`2px dashed ${dragging?color:T.border}`,borderRadius:16,padding:"48px 24px",textAlign:"center",marginBottom:20,background:dragging?`${color}10`:T.card,transition:"all .2s",cursor:"pointer"}}
        onClick={addDoc}>
        <div style={{fontSize:40,marginBottom:12}}>{icon}</div>
        <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:6}}>Drop files here or click to upload</div>
        <div style={{fontSize:13,color:T.muted}}>Supports PDF, JPG, PNG • Max 10MB per file</div>
        <button style={{marginTop:16,padding:"9px 22px",borderRadius:9,border:"none",background:color,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+ Upload {docType}</button>
      </div>
      {docs.length>0?(
        <Card style={{padding:"20px"}}>
          <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:14}}>Uploaded Documents</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {docs.map((d,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderRadius:10,background:T.bg2,border:`1px solid ${T.border}`}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:36,height:36,borderRadius:8,background:`${color}18`,display:"grid",placeItems:"center",fontSize:18}}>{icon}</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,color:T.text}}>{d.name}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:2}}>{d.date} · {d.size}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600,background:T.positiveBg,color:T.positive}}>{d.status}</span>
                  <button onClick={()=>setDocs(ds=>ds.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:T.negative,cursor:"pointer",fontSize:16}}>×</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ):(
        <Card style={{padding:"40px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:12,opacity:0.3}}>{icon}</div>
          <div style={{fontSize:14,color:T.muted}}>No documents uploaded yet</div>
        </Card>
      )}
    </PageShell>
  );
}

/* ── Notes ── */
function NotesPage() {
  const { T } = useTheme();
  const [notes,setNotes] = useState([{id:1,title:"Trading Rules",content:"1. Never risk more than 1% per trade\n2. Always set stop loss before entry\n3. Follow the plan, not emotions",date:"2024-01-15",color:"#5ab233"},{id:2,title:"Market Analysis - Jan",content:"Market showing bullish divergence on weekly chart. Key support at 21,000. Watch for breakout above 22,000.",date:"2024-01-12",color:"#6366f1"}]);
  const [adding,setAdding] = useState(false);
  const [form,setForm] = useState({title:"",content:"",color:"#5ab233"});
  const colors=["#5ab233","#6366f1","#f59e0b","#0ea5e9","#ef4444","#14b8a6"];
  const inp={width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text};
  return (
    <PageShell title="Notes" icon="📝" color="#14b8a6" desc="Capture trading ideas, market analysis and financial notes.">
      <div style={{marginBottom:16}}><button onClick={()=>setAdding(s=>!s)} style={{padding:"9px 22px",borderRadius:9,border:"none",background:"#14b8a6",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+ New Note</button></div>
      {adding&&(
        <Card style={{marginBottom:16,padding:"22px"}}>
          <div style={{marginBottom:12}}><label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>Title</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Note title" style={inp}/></div>
          <div style={{marginBottom:12}}><label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>Content</label><textarea value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} rows={4} placeholder="Write your note..." style={{...inp,resize:"vertical"}}/></div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:6}}>Colour</label>
            <div style={{display:"flex",gap:8}}>{colors.map(c=><div key={c} onClick={()=>setForm(p=>({...p,color:c}))} style={{width:24,height:24,borderRadius:"50%",background:c,cursor:"pointer",border:form.color===c?`3px solid ${T.text}`:"3px solid transparent",transition:"border .2s"}}/>)}</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{if(!form.title)return;setNotes(n=>[{id:Date.now(),title:form.title,content:form.content,date:new Date().toISOString().slice(0,10),color:form.color},...n]);setForm({title:"",content:"",color:"#5ab233"});setAdding(false);}} style={{padding:"9px 20px",borderRadius:9,border:"none",background:"#14b8a6",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Save</button>
            <button onClick={()=>setAdding(false)} style={{padding:"9px 20px",borderRadius:9,border:`1.5px solid ${T.border}`,background:"transparent",color:T.text,fontSize:13,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Cancel</button>
          </div>
        </Card>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {notes.map(n=>(
          <div key={n.id} style={{borderRadius:16,padding:"20px",background:T.card,border:`2px solid ${n.color}30`,borderTop:`4px solid ${n.color}`,boxShadow:`0 4px 16px ${n.color}12`,position:"relative"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{fontWeight:700,fontSize:14,color:T.text}}>{n.title}</div>
              <button onClick={()=>setNotes(ns=>ns.filter(x=>x.id!==n.id))} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:16}}>×</button>
            </div>
            <div style={{fontSize:13,color:T.muted2,lineHeight:1.6,whiteSpace:"pre-line"}}>{n.content}</div>
            <div style={{fontSize:11,color:T.muted,marginTop:12}}>{n.date}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ── Goals ── */
function GoalsPage() {
  const { T } = useTheme();
  const [goals,setGoals] = useState([
    {id:1,title:"Earn ₹1L from trading",category:"Trading",deadline:"2024-03-31",progress:65,priority:"High",status:"In Progress"},
    {id:2,title:"Build ₹5L emergency fund",category:"Savings",deadline:"2024-12-31",progress:36,priority:"High",status:"In Progress"},
    {id:3,title:"Learn options trading",category:"Education",deadline:"2024-06-30",progress:80,priority:"Medium",status:"In Progress"},
    {id:4,title:"Get chartered accountant cert",category:"Education",deadline:"2025-06-30",progress:20,priority:"Low",status:"Planning"},
  ]);
  const priorityColor={High:"#ef4444",Medium:"#f59e0b",Low:"#5ab233"};
  return (
    <PageShell title="Goals" icon="🎯" color="#14b8a6" desc="Set and track your financial and personal goals with milestones.">
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {goals.map(g=>(
          <Card key={g.id} style={{padding:"20px 24px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:4}}>{g.title}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:"#14b8a618",color:"#14b8a6"}}>{g.category}</span>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:`${priorityColor[g.priority]}18`,color:priorityColor[g.priority]}}>{g.priority} Priority</span>
                  <span style={{fontSize:11,color:T.muted}}>Due: {g.deadline}</span>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:800,color:"#14b8a6"}}>{g.progress}%</div>
                <div style={{fontSize:11,color:T.muted}}>Complete</div>
              </div>
            </div>
            <div style={{height:10,borderRadius:6,background:T.bg3}}>
              <div style={{height:"100%",borderRadius:6,background:`linear-gradient(90deg,#14b8a6,#0ea5e9)`,width:`${g.progress}%`,transition:"width .5s"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
              <div style={{display:"flex",gap:8}}>
                {[25,50,75,100].map(p=>(
                  <button key={p} onClick={()=>setGoals(gs=>gs.map(x=>x.id===g.id?{...x,progress:p}:x))}
                    style={{padding:"3px 8px",borderRadius:6,border:`1px solid ${T.border}`,background:g.progress>=p?"#14b8a6":T.bg,color:g.progress>=p?"#fff":T.muted,fontSize:10,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                    {p}%
                  </button>
                ))}
              </div>
              <span style={{fontSize:12,color:T.muted}}>{g.status}</span>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

/* ── Tasks ── */
function TasksPage() {
  const { T } = useTheme();
  const [tasks,setTasks] = useState([
    {id:1,title:"Review monthly budget",cat:"Finance",due:"2024-01-20",done:false,priority:"High"},
    {id:2,title:"File GST returns",cat:"Tax",due:"2024-01-31",done:false,priority:"High"},
    {id:3,title:"Renew SIP mandate",cat:"Investment",due:"2024-01-25",done:true,priority:"Medium"},
    {id:4,title:"Update trading journal",cat:"Trading",due:"2024-01-18",done:false,priority:"Low"},
    {id:5,title:"Check credit card statement",cat:"Finance",due:"2024-01-22",done:true,priority:"Medium"},
  ]);
  const [adding,setAdding] = useState(false);
  const [form,setForm] = useState({title:"",cat:"Finance",due:"",priority:"Medium"});
  const inp={width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${T.border}`,background:T.inputBg,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",color:T.text};
  const pColor={High:"#ef4444",Medium:"#f59e0b",Low:"#5ab233"};
  const pending=tasks.filter(t=>!t.done).length;
  return (
    <PageShell title="Tasks" icon="✅" color="#14b8a6" desc="Manage your financial to-do list and never miss an important task.">
      <div className="ln-stats-grid" style={{marginBottom:20}}>
        {[{l:"Total Tasks",v:tasks.length},{l:"Pending",v:pending,c:T.negative},{l:"Completed",v:tasks.length-pending,c:T.positive},{l:"Completion",v:`${tasks.length?Math.round((tasks.length-pending)/tasks.length*100):0}%`,c:"#14b8a6"}].map(s=>(
          <Card key={s.l} style={{padding:"14px"}}><div style={{fontSize:11,color:T.muted,marginBottom:5}}>{s.l}</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:"clamp(16px,3vw,22px)",fontWeight:800,color:(s).c||T.text}}>{s.v}</div></Card>
        ))}
      </div>
      <div style={{marginBottom:14}}><button onClick={()=>setAdding(s=>!s)} style={{padding:"9px 22px",borderRadius:9,border:"none",background:"#14b8a6",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+ New Task</button></div>
      {adding&&(
        <Card style={{marginBottom:14,padding:"20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12,marginBottom:12}}>
            <div style={{gridColumn:"span 2"}}><label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>Task</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Task description" style={inp}/></div>
            <div><label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>Category</label><select value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))} style={inp}>{["Finance","Tax","Investment","Trading","Other"].map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>Due Date</label><input type="date" value={form.due} onChange={e=>setForm(p=>({...p,due:e.target.value}))} style={inp}/></div>
            <div><label style={{fontSize:11,color:T.muted2,display:"block",marginBottom:4}}>Priority</label><select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))} style={inp}>{["High","Medium","Low"].map(p=><option key={p}>{p}</option>)}</select></div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{if(!form.title)return;setTasks(t=>[{id:Date.now(),title:form.title,cat:form.cat,due:form.due,done:false,priority:form.priority},...t]);setForm({title:"",cat:"Finance",due:"",priority:"Medium"});setAdding(false);}} style={{padding:"8px 20px",borderRadius:8,border:"none",background:"#14b8a6",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Add Task</button>
            <button onClick={()=>setAdding(false)} style={{padding:"8px 20px",borderRadius:8,border:`1.5px solid ${T.border}`,background:"transparent",color:T.text,fontSize:13,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Cancel</button>
          </div>
        </Card>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {tasks.map(t=>(
          <div key={t.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 18px",borderRadius:12,background:T.card,border:`1.5px solid ${t.done?T.border:T.border}`,opacity:t.done?0.6:1,transition:"all .2s"}}>
            <div onClick={()=>setTasks(ts=>ts.map(x=>x.id===t.id?{...x,done:!x.done}:x))}
              style={{width:22,height:22,borderRadius:6,border:`2px solid ${t.done?"#14b8a6":T.border}`,background:t.done?"#14b8a6":T.bg,display:"grid",placeItems:"center",cursor:"pointer",flexShrink:0,transition:"all .2s"}}>
              {t.done&&<span style={{color:"#fff",fontSize:12}}>✓</span>}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:500,fontSize:14,color:T.text,textDecoration:t.done?"line-through":"none"}}>{t.title}</div>
              <div style={{fontSize:11,color:T.muted,marginTop:2}}>{t.cat}{t.due&&` · Due ${t.due}`}</div>
            </div>
            <span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600,background:`${pColor[t.priority]}18`,color:pColor[t.priority],flexShrink:0}}>{t.priority}</span>
            <button onClick={()=>setTasks(ts=>ts.filter(x=>x.id!==t.id))} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:16,flexShrink:0}}>×</button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ── Financial Calendar ── */
function FinancialCalendarPage() {
  const { T } = useTheme();
  const events = [
    {date:"2024-01-15",title:"SIP Deduction - HDFC Flexi",type:"Investment",amount:"₹5,000",color:"#a855f7"},
    {date:"2024-01-20",title:"Credit Card Bill Due",type:"Payment",amount:"₹12,400",color:"#ef4444"},
    {date:"2024-01-25",title:"Home Loan EMI",type:"Loan",amount:"₹18,500",color:"#f59e0b"},
    {date:"2024-01-28",title:"TDS Deposit Deadline",type:"Tax",amount:"",color:"#f97316"},
    {date:"2024-02-05",title:"PPF Deposit",type:"Investment",amount:"₹12,500",color:"#a855f7"},
    {date:"2024-02-10",title:"NSE Expiry - NIFTY",type:"Trading",amount:"",color:"#5ab233"},
    {date:"2024-02-15",title:"Quarterly Advance Tax",type:"Tax",amount:"₹8,200",color:"#f97316"},
  ];
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [month,setMonth]=useState(0);
  return (
    <PageShell title="Financial Calendar" icon="📅" color="#14b8a6" desc="Never miss an important financial date — EMIs, taxes, SIPs and more.">
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {months.map((m,i)=>(
          <button key={m} onClick={()=>setMonth(i)}
            style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${month===i?"#14b8a6":T.border}`,background:month===i?"#14b8a6":T.bg,color:month===i?"#fff":T.muted2,fontSize:12,fontWeight:month===i?600:400,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all .2s"}}>
            {m}
          </button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {events.map((e,i)=>(
          <Card key={i} style={{padding:"16px 20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
              <div style={{width:48,height:48,borderRadius:12,background:`${e.color}18`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1.5px solid ${e.color}30`}}>
                <div style={{fontSize:14,fontWeight:800,color:e.color}}>{e.date.split("-")[2]}</div>
                <div style={{fontSize:9,color:e.color,textTransform:"uppercase"}}>{months[parseInt(e.date.split("-")[1])-1]}</div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:14,color:T.text}}>{e.title}</div>
                <div style={{display:"flex",gap:8,marginTop:4,flexWrap:"wrap"}}>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:`${e.color}18`,color:e.color}}>{e.type}</span>
                  {e.amount&&<span style={{fontSize:12,color:T.muted,fontWeight:500}}>{e.amount}</span>}
                </div>
              </div>
              <span style={{fontSize:11,color:T.muted,whiteSpace:"nowrap"}}>{e.date}</span>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

function LandingPage({ onAuth, setPage }) {
  return (
    <>
      <Hero setPage={setPage}/>
      <ToolsSection setPage={setPage}/>
      <FeaturesSection/>
      <PricingSection onAuth={onAuth}/>
      <Footer setPage={setPage}/>
    </>
  );
}

/* ══════════════════════════════════════
   ROOT — default export for Next.js 15
══════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [dark, setDark] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [user, setUser] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const { toasts, add:addToast, remove:removeToast } = useToast();

  const T = dark ? DARK : LIGHT;
  const isApp = page !== "home";

  // Close sidebar when going to landing
  useEffect(()=>{ if(page==="home") setSideOpen(false); },[page]);
  useEffect(()=>{
    if(sessionChecked && page !== "home" && !user) {
      setPage("home");
      openAuth("login");
    }
  },[sessionChecked, page, user]);

  // Restore auth session if a token already exists
  useEffect(()=>{
    let alive = true;
    async function verifySession() {
      const token = getToken();
      if(!token) {
        if(alive) setSessionChecked(true);
        return;
      }

      try {
        const result = await api("/api/auth/me");
        if(alive) setUser(result.user);
      } catch {
        clearToken();
      } finally {
        if(alive) setSessionChecked(true);
      }
    }

    verifySession();
    return ()=>{ alive = false; };
  },[]);

  // Sync body background & color
  useEffect(()=>{
    document.body.style.background = T.bg;
    document.body.style.color = T.text;
  },[dark, T.bg, T.text]);

  // Inject global CSS once
  useEffect(()=>{
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return ()=>{ document.head.removeChild(el); };
  },[]);

  const openAuth = (tab) => { setAuthTab(tab); setAuthOpen(true); };
  const onAuthenticated = (nextUser) => {
    setUser(nextUser);
    setPage("dashboard");
    addToast("Signed in successfully", "success");
  };
  const signOut = () => {
    clearToken();
    setUser(null);
    setPage("home");
    addToast("Signed out", "success");
  };
  const goToPage = (nextPage) => {
    if(nextPage !== "home" && !user) {
      openAuth("login");
      addToast("Please sign in to continue", "info");
      return;
    }
    setPage(nextPage);
  };
  const toggle = () => setDark(d=>!d);

  const renderPage = () => {
    switch(page) {
      // ── Core ──
      case "dashboard":            return <Dashboard setPage={goToPage}/>;
      case "settings":             return <Settings toast={addToast}/>;
      // ── Trading ──
      case "trade-journal":        return <TradingJournalPage/>;
      case "watchlist":            return <WatchlistPage/>;
      case "trading-plans":        return <GenericPage title="Trading Plans" icon="📋" color="#5ab233" desc="Plan your trades before you execute them. Document your setup, entry conditions, targets and stop-loss levels." fields={["Plan Name","Asset","Setup Type","Entry Condition","Target Price","Stop Loss","Risk/Reward Ratio","Notes"]}/>;
      case "backtesting":          return <GenericPage title="Backtesting Notes" icon="🔬" color="#5ab233" desc="Record and analyze your strategy backtesting results across different market conditions." fields={["Strategy Name","Timeframe","Period Tested","Total Trades","Win Rate %","Avg Profit","Avg Loss","Notes"]}/>;
      case "risk-calculator":      return <RiskCalculatorPage/>;
      case "position-size":        return <PositionSizePage/>;
      case "pnl-analytics":        return <PnLAnalyticsPage/>;
      case "strategy-tracker":     return <GenericPage title="Strategy Tracker" icon="🎯" color="#5ab233" desc="Track performance of each trading strategy over time to identify what works best." fields={["Strategy Name","Market","Timeframe","Trades This Month","Win Rate","Total P&L","Status","Notes"]}/>;
      // ── AI Trading ──
      case "trade-review":         return <AIPageWrapper title="Trade Review" icon="🔍" color="#6366f1" desc="Paste your trade details and get an AI-powered review with actionable feedback." prompt="You are a professional trading coach. Review this trade and provide detailed feedback on entry, exit, risk management and lessons learned:"/>;
      case "mistake-detection":    return <AIPageWrapper title="Mistake Detection" icon="⚠️" color="#6366f1" desc="Describe a recent losing trade and let AI identify the key mistakes and how to avoid them." prompt="You are a trading psychologist and coach. Analyze this losing trade and identify the key mistakes made, emotional triggers, and specific steps to avoid repeating them:"/>;
      case "performance-analysis": return <AIPageWrapper title="Performance Analysis" icon="📈" color="#6366f1" desc="Share your trading stats and get an AI-powered deep-dive performance analysis." prompt="You are a quantitative trading analyst. Analyze these trading statistics and provide a detailed performance review with specific improvement areas:"/>;
      case "daily-summary":        return <AIPageWrapper title="Daily Trade Summary" icon="📅" color="#6366f1" desc="Enter your trades for the day and get a structured AI summary with key takeaways." prompt="You are a trading journal assistant. Summarize today's trading activity, highlight the best and worst trades, and provide key takeaways for tomorrow:"/>;
      case "ai-coach":             return <AIPageWrapper title="AI Coach" icon="🧠" color="#6366f1" desc="Your personal AI trading coach. Ask anything about trading psychology, strategy or improvement." prompt="You are an expert trading coach and mentor with 20 years of experience. Help this trader improve their skills, mindset and profitability:"/>;
      case "pattern-recognition":  return <AIPageWrapper title="Pattern Recognition" icon="🔮" color="#6366f1" desc="Describe a chart pattern or market condition and let AI identify and explain it." prompt="You are a technical analysis expert. Identify and explain the chart pattern or market condition described, including its implications and trading opportunities:"/>;
      // ── Personal Finance ──
      case "expense-tracker":      return <ExpenseTrackerPage/>;
      case "budget-planner":       return <BudgetPlannerPage/>;
      case "savings-goals":        return <SavingsGoalsPage/>;
      case "debt-tracker":         return <GenericPage title="Debt Tracker" icon="📉" color="#f59e0b" desc="Track all your debts in one place and plan your payoff strategy." fields={["Debt Name","Lender","Total Amount","Outstanding","Interest Rate %","Monthly Payment","Due Date","Status"]}/>;
      case "net-worth":            return <NetWorthPage/>;
      case "emi-calculator":       return <EMICalculatorPage/>;
      // ── Business Finance ──
      case "income-tracking":      return <GenericPage title="Income Tracking" icon="💵" color="#0ea5e9" desc="Record and categorize all your business income streams." fields={["Source","Category","Amount","Date","Payment Mode","Invoice No","Tax Applicable","Notes"]}/>;
      case "expense-management":   return <GenericPage title="Expense Management" icon="💳" color="#0ea5e9" desc="Track and categorize all business expenses for better financial control." fields={["Expense Name","Category","Amount","Date","Vendor","Payment Mode","GST Applicable","Notes"]}/>;
      case "profit-loss":          return <ProfitLossPage/>;
      case "balance-sheet":        return <BalanceSheetPage/>;
      case "cash-flow":            return <CashFlowPage/>;
      case "gst-reports":          return <GenericPage title="GST Reports" icon="🧾" color="#0ea5e9" desc="Generate GST reports for filing returns. Track GSTR-1, GSTR-3B and input tax credits." fields={["Period","GSTIN","Total Sales","Taxable Sales","CGST","SGST","IGST","ITC Available"]}/>;
      case "financial-statements": return <Financials/>;
      // ── Invoice ──
      case "create-invoices":      return <InvoicesPage toast={addToast}/>;
      case "recurring-invoices":   return <GenericPage title="Recurring Invoices" icon="🔁" color="#5ab233" desc="Set up automatic recurring invoices for regular clients. Never miss a billing cycle." fields={["Client Name","Invoice Amount","Frequency","Next Due Date","Payment Terms","Email","Status","Notes"]}/>;
      case "payment-tracking":     return <GenericPage title="Payment Tracking" icon="💰" color="#5ab233" desc="Track all incoming payments and follow up on overdue invoices automatically." fields={["Invoice ID","Client","Amount","Due Date","Paid Date","Payment Mode","Status","Notes"]}/>;
      case "client-management":    return <GenericPage title="Client Management" icon="👥" color="#5ab233" desc="Manage your client database with contact details, billing history and notes." fields={["Client Name","Company","Email","Phone","Address","GSTIN","Total Billed","Status"]}/>;
      case "quotations":           return <GenericPage title="Quotation Generator" icon="📄" color="#5ab233" desc="Create professional quotations for potential clients and convert them to invoices." fields={["Client Name","Quotation Title","Valid Until","Item Description","Quantity","Rate","Total Amount","Notes"]}/>;
      // ── Loans ──
      case "personal-loans":       return <GenericPage title="Personal Loans" icon="💼" color="#ef4444" desc="Track all your personal loans — bank loans, NBFCs, and other borrowings." fields={["Lender Name","Loan Amount","Outstanding","Interest Rate %","EMI Amount","Start Date","End Date","Status"]}/>;
      case "borrowed-money":       return <GenericPage title="Borrowed Money Tracker" icon="📥" color="#ef4444" desc="Track money borrowed from friends and family. Never forget what you owe." fields={["Borrowed From","Amount","Date Borrowed","Due Date","Interest","Amount Repaid","Balance","Notes"]}/>;
      case "lending-tracker":      return <GenericPage title="Lending Tracker" icon="📤" color="#ef4444" desc="Track money you've lent to others. Monitor repayments and outstanding amounts." fields={["Lent To","Amount","Date Lent","Due Date","Interest","Amount Received","Balance","Status"]}/>;
      case "interest-calculator":  return <InterestCalculatorPage/>;
      case "emi-schedule":         return <EMISchedulePage/>;
      // ── Investments ──
      case "stocks-portfolio":     return <StocksPortfolioPage/>;
      case "mutual-funds":         return <GenericPage title="Mutual Funds Portfolio" icon="🏦" color="#a855f7" desc="Track all your mutual fund investments, NAV, returns and SIP status." fields={["Fund Name","Fund House","Units","NAV","Invested Amount","Current Value","XIRR %","Type"]}/>;
      case "crypto-portfolio":     return <CryptoPortfolioPage/>;
      case "dividend-tracker":     return <GenericPage title="Dividend Tracker" icon="💹" color="#a855f7" desc="Track dividends received from stocks and mutual funds." fields={["Stock/Fund","Ex-Dividend Date","Pay Date","Dividend Per Share","Shares Held","Total Dividend","Tax Deducted","Net Received"]}/>;
      case "sip-tracker":          return <GenericPage title="SIP Tracker" icon="🔄" color="#a855f7" desc="Monitor all your Systematic Investment Plans in one place." fields={["Fund Name","SIP Amount","Frequency","Start Date","Next Date","Total Invested","Current Value","Returns %"]}/>;
      // ── Tax ──
      case "tax-calculator":       return <TaxCalculatorPage/>;
      case "capital-gains":        return <GenericPage title="Capital Gains Report" icon="📊" color="#f97316" desc="Calculate short-term and long-term capital gains from your investments." fields={["Asset","Buy Date","Buy Price","Sell Date","Sell Price","Quantity","Gain/Loss","Tax Applicable"]}/>;
      case "tax-summary":          return <GenericPage title="Tax Summary" icon="📋" color="#f97316" desc="Complete summary of your tax liability across all income sources for the financial year." fields={["Income Source","Gross Income","Deductions","Taxable Income","Tax Rate %","Tax Payable","TDS Deducted","Balance"]}/>;
      case "export-reports":       return <GenericPage title="Export Reports" icon="📤" color="#f97316" desc="Export your financial data in multiple formats for CA filing, audits or personal records." fields={["Report Type","Financial Year","Format","Date Range","Include Categories","Status","Notes","Action"]}/>;
      // ── Vault ──
      case "pan-storage":          return <VaultPage title="PAN Card Storage" icon="🪪" color="#64748b" docType="PAN Card"/>;
      case "aadhaar-storage":      return <VaultPage title="Aadhaar Storage" icon="🪪" color="#64748b" docType="Aadhaar Card"/>;
      case "bank-statements":      return <VaultPage title="Bank Statements" icon="🏦" color="#64748b" docType="Bank Statement"/>;
      case "trade-reports":        return <VaultPage title="Trade Reports" icon="📊" color="#64748b" docType="Trade Report"/>;
      case "contracts":            return <VaultPage title="Contracts" icon="📝" color="#64748b" docType="Contract"/>;
      // ── Productivity ──
      case "notes":                return <NotesPage/>;
      case "goals":                return <GoalsPage/>;
      case "tasks":                return <TasksPage/>;
      case "financial-calendar":   return <FinancialCalendarPage/>;
      case "reminders":            return <GenericPage title="Reminders" icon="🔔" color="#14b8a6" desc="Set financial reminders for bill payments, loan EMIs, SIP dates and investment reviews." fields={["Reminder Title","Category","Date","Time","Repeat","Amount","Notes","Status"]}/>;
      default:                     return <LandingPage onAuth={openAuth} setPage={goToPage}/>;
    }
  };

  return (
    <ThemeCtx.Provider value={{ dark, T, toggle }}>
      <div style={{ minHeight:"100vh", transition:"background .3s", overflowX:"hidden" }}>

        <NavFull
          page={page} setPage={goToPage} onAuth={openAuth}
          sideOpen={sideOpen} setSideOpen={setSideOpen}
          user={user} onSignOut={signOut}
        />

        {isApp&&(
          <AppSidebar
            page={page} setPage={goToPage}
            sideOpen={sideOpen} setSideOpen={setSideOpen}
          />
        )}

        {/* Main content — shifts right when sidebar is open on desktop */}
        <div className="ln-sidebar-shift"
          style={{ marginLeft: isApp && sideOpen ? 270 : 0 }}>
          {renderPage()}
        </div>

        <AuthModal
          open={authOpen}
          onClose={()=>setAuthOpen(false)}
          defaultTab={authTab}
          onAuthenticated={onAuthenticated}
        />

        <Toast toasts={toasts} remove={removeToast}/>
        <AIAssistant/>
      </div>
    </ThemeCtx.Provider>
  );
}
