"use client";
import { useState, useEffect, useRef, createContext, useContext } from "react";

/* ══════════════════════════════════════
   THEME CONTEXT
══════════════════════════════════════ */
const ThemeCtx = createContext({ dark: false, T: {}, toggle: () => {} });
const useTheme = () => useContext(ThemeCtx);

const LIGHT = {
  bg:"#ffffff", bg2:"#f7f8f6", bg3:"#f0f2ee",
  border:"rgba(0,0,0,0.08)", borderStrong:"rgba(0,0,0,0.14)",
  accent:"#5ab233", accentDark:"#3d8a20", accentLight:"#e8f5e1",
  text:"#0d0d0d", muted:"#8a9286", muted2:"#555f50",
  black:"#0d0d0d", white:"#ffffff",
  card:"#ffffff", card2:"#f4f6f2",
  navBg:"rgba(255,255,255,0.93)",
  inputBg:"#f7f8f6",
  shadow:"rgba(0,0,0,0.06)",
  shadowHov:"rgba(0,0,0,0.12)",
  tabActive:"#ffffff",
  tabBg:"#f0f2ee",
  positive:"#16a34a", positiveBg:"#dcfce7",
  negative:"#dc2626", negativeBg:"#fee2e2",
  warn:"#ca8a04",    warnBg:"#fef9c3",
};

const DARK = {
  bg:"#0d0f0d", bg2:"#131613", bg3:"#1a1e1a",
  border:"rgba(255,255,255,0.07)", borderStrong:"rgba(255,255,255,0.12)",
  accent:"#5ab233", accentDark:"#74cc4a", accentLight:"rgba(90,178,51,0.12)",
  text:"#e8ede8", muted:"#5a6b5a", muted2:"#8aa08a",
  black:"#0d0f0d", white:"#e8ede8",
  card:"#111411", card2:"#161a16",
  navBg:"rgba(13,15,13,0.93)",
  inputBg:"#1a1e1a",
  shadow:"rgba(0,0,0,0.3)",
  shadowHov:"rgba(0,0,0,0.5)",
  tabActive:"#1a1e1a",
  tabBg:"#0d0f0d",
  positive:"#4ade80", positiveBg:"rgba(74,222,128,0.12)",
  negative:"#f87171", negativeBg:"rgba(248,113,113,0.12)",
  warn:"#fbbf24",    warnBg:"rgba(251,191,36,0.12)",
};

/* ─── GLOBAL STYLES ─── */
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
`;

/* ══════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════ */
function Logo({ forceLight = false, size = 20 }) {
  const { dark } = useTheme();
  const col = (dark || !forceLight) && dark ? "#e8ede8" : "#0d0d0d";
  return (
    <span style={{ display:"flex", alignItems:"baseline", gap:0, cursor:"pointer",
      fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1 }}>
      <span style={{ fontWeight:300, fontSize:size, color:col, letterSpacing:"-0.3px",transition:"color .3s" }}>Ledgr</span>
      <span style={{ fontWeight:800, fontSize:size, color:col, letterSpacing:"-0.3px",transition:"color .3s" }}>Now</span>
      <span style={{ fontWeight:800, fontSize:size*1.25, color:"#5ab233", lineHeight:1, marginLeft:1, position:"relative", top:1 }}>.</span>
    </span>
  );
}

function Btn({
  children,
  variant = "primary",
  onClick,
  style = {},
  small = false
}: any) {
  const { T, dark } = useTheme() as any;
  const base = {
    padding: small ? "8px 18px" : "11px 24px",
    borderRadius:9, fontSize: small ? 13 : 14, fontWeight:600,
    fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:"pointer",
    transition:"all .2s", border:"none", ...style
  };
  const variants: any = {
    primary: { background: dark ? T.accentLight : T.black, color: dark ? T.accentDark : "#fff",
               border: dark ? `1px solid ${T.accent}` : "none" },
    green:   { background:T.accent, color:"#fff", boxShadow:`0 4px 16px rgba(90,178,51,.25)` },
    ghost:   { background:"transparent", color:T.muted2, border:`1px solid ${T.border}` },
    outline: { background:"transparent", color:T.text, border:`1.5px solid ${T.borderStrong}` },
    danger:  { background:T.negativeBg, color:T.negative, border:`1px solid ${T.negative}44` },
  };
  return (
    <button style={{ ...base, ...variants[variant as keyof typeof variants] }} onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.opacity=".82"; e.currentTarget.style.transform="translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity="1";   e.currentTarget.style.transform="translateY(0)"; }}>
      {children}
    </button>
  );
}

function Card({ children, style = {}, hover = true }: any) {
  const { T } = useTheme() as any;
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      background: T.card,
      border:`1.5px solid ${hov && hover ? `${T.accent}55` : T.border}`,
      borderRadius:16, padding:"28px 24px",
      boxShadow: hov && hover ? `0 12px 40px ${T.shadowHov}` : `0 2px 8px ${T.shadow}`,
      transition:"all .25s", ...style }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: any) {
  const { T } = useTheme() as any;
  return <div style={{ fontSize:11, letterSpacing:"2px", textTransform:"uppercase",
    color:T.accentDark, fontWeight:600, marginBottom:10 }}>{children}</div>;
}

function SectionTitle({ children }: any) {
  const { T } = useTheme() as any;
  return <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:"clamp(26px,4vw,44px)",
    fontWeight:800, letterSpacing:"-1px", lineHeight:1.1, color:T.text }}>{children}</h2>;
}

/* ── THEME TOGGLE SWITCH ── */
function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle} title={dark ? "Switch to Light" : "Switch to Dark"}
      style={{ width:68, height:34, borderRadius:34, border:"none", cursor:"pointer",
        padding:3, display:"flex", alignItems:"center",
        background: dark ? "#1a1e1a" : "#e8ede8",
        transition:"background .35s", position:"relative",
        boxShadow: dark ? "inset 0 0 0 1.5px rgba(90,178,51,.4)" : "inset 0 0 0 1.5px rgba(0,0,0,.1)" }}>
      {/* track icons */}
      <span style={{ position:"absolute", left:9, fontSize:13, opacity: dark ? 0.3 : 1, transition:"opacity .3s" }}>☀️</span>
      <span style={{ position:"absolute", right:9, fontSize:13, opacity: dark ? 1 : 0.3, transition:"opacity .3s" }}>🌙</span>
      {/* thumb */}
      <div style={{ width:28, height:28, borderRadius:"50%",
        background: dark ? "#5ab233" : "#0d0d0d",
        transform: dark ? "translateX(34px)" : "translateX(0px)",
        transition:"transform .35s cubic-bezier(.4,0,.2,1), background .35s",
        boxShadow:"0 2px 8px rgba(0,0,0,.25)", position:"absolute", left:3 }} />
    </button>
  );
}

/* ══════════════════════════════════════
   AUTH MODAL
══════════════════════════════════════ */
function AuthModal({ open, onClose, defaultTab="login" }) {
  const { T } = useTheme();
  const [tab, setTab] = useState(defaultTab);
  useEffect(() => { setTab(defaultTab); }, [defaultTab, open]);
  useEffect(() => {
    const h = e => { if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  if (!open) return null;
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)",
        backdropFilter:"blur(12px)", zIndex:3000, display:"grid", placeItems:"center" }}>
      <div style={{ background:T.card, border:`1.5px solid ${T.border}`, borderRadius:24,
        padding:"44px 40px", width:400, position:"relative",
        animation:"modalIn .3s ease", boxShadow:`0 24px 80px ${T.shadowHov}` }}>
        <button onClick={onClose} style={{ position:"absolute", top:18, right:18,
          width:30, height:30, borderRadius:8, background:T.bg2, border:"none",
          cursor:"pointer", fontSize:16, color:T.muted }}>✕</button>
        <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:24, fontWeight:800,
          marginBottom:6, color:T.text }}>
          {tab==="login" ? "Welcome back" : "Create account"}
        </h2>
        <p style={{ fontSize:13, color:T.muted2, marginBottom:28 }}>
          {tab==="login" ? "Sign in to your LedgrNow account" : "Get started free — no credit card needed"}
        </p>
        <div style={{ display:"flex", gap:4, background:T.tabBg, borderRadius:10, padding:4, marginBottom:24 }}>
          {["login","signup"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, padding:"8px", borderRadius:7, border:"none", cursor:"pointer",
                fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:500, transition:"all .2s",
                background: tab===t ? T.tabActive : "transparent",
                color: tab===t ? T.text : T.muted,
                boxShadow: tab===t ? `0 1px 4px ${T.shadow}` : "none" }}>
              {t==="login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>
        {tab==="signup" && <Field label="Full name" type="text" placeholder="Your name" />}
        <Field label="Email address" type="email" placeholder="you@example.com" />
        <Field label="Password" type="password" placeholder="••••••••" />
        <button style={{ width:"100%", padding:13, borderRadius:10, background:T.accent,
          color:"#fff", border:"none", fontSize:14, fontWeight:600,
          fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:"pointer", marginTop:4, transition:"all .2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity=".85"}
          onMouseLeave={e => e.currentTarget.style.opacity="1"}>
          {tab==="login" ? "Log In →" : "Create Account →"}
        </button>
        <p style={{ textAlign:"center", fontSize:12, color:T.muted, marginTop:16 }}>
          {tab==="login"
            ? <a href="#" style={{ color:T.accentDark }}>Forgot password?</a>
            : <>By signing up you agree to our <a href="#" style={{ color:T.accentDark }}>Terms</a></>}
        </p>
      </div>
    </div>
  );
}

function Field({ label, type, placeholder }) {
  const { T } = useTheme();
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", fontSize:12, color:T.muted2, marginBottom:6 }}>{label}</label>
      <input type={type} placeholder={placeholder}
        style={{ width:"100%", padding:"11px 14px", background:T.inputBg,
          border:`1.5px solid ${T.border}`, borderRadius:9, color:T.text,
          fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none" }}
        onFocus={e => e.target.style.borderColor=T.accent}
        onBlur={e => e.target.style.borderColor=T.border} />
    </div>
  );
}

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function Toast({ toasts, remove }) {
  const { T } = useTheme();
  return (
    <div style={{ position:"fixed", bottom:28, right:28, zIndex:9999,
      display:"flex", flexDirection:"column", gap:10 }}>
      {toasts.map(t => (
        <div key={t.id}
          style={{ display:"flex", alignItems:"center", gap:12,
            background: T.card2, color:T.text,
            padding:"13px 18px", borderRadius:12,
            fontSize:14, fontWeight:500, minWidth:280,
            boxShadow:`0 8px 32px ${T.shadowHov}`,
            border:`1px solid ${T.border}`,
            borderLeft:`4px solid ${t.type==="success" ? T.accent : t.type==="error" ? T.negative : T.accent}`,
            animation:"fadeUp .3s ease" }}>
          <span style={{ fontSize:18 }}>
            {t.type==="success" ? "✅" : t.type==="error" ? "❌" : "ℹ️"}
          </span>
          <span style={{ flex:1 }}>{t.msg}</span>
          <button onClick={() => remove(t.id)}
            style={{ background:"none", border:"none", color:T.muted,
              cursor:"pointer", fontSize:16, lineHeight:1 }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type="success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  const remove = id => setToasts(t => t.filter(x => x.id !== id));
  return { toasts, add, remove };
}

/* ══════════════════════════════════════
   NOTIFICATION PANEL
══════════════════════════════════════ */
function NotifPanel({ open, onClose }) {
  const { T } = useTheme();
  const notifs = [
    { icon:"📈", title:"AAPL hit your price target",      time:"2 min ago",  unread:true  },
    { icon:"🧾", title:"Invoice INV-002 is due in 3 days",time:"1 hr ago",   unread:true  },
    { icon:"✅", title:"Trade journal entry saved",        time:"3 hrs ago",  unread:false },
    { icon:"⚠️", title:"NVDA position down 5%",           time:"5 hrs ago",  unread:true  },
    { icon:"💳", title:"Pro plan renews in 7 days",       time:"Yesterday",  unread:false },
    { icon:"📊", title:"Weekly performance report ready", time:"2 days ago", unread:false },
  ];
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:1998 }} />
      <div style={{ position:"fixed", top:68, right:48, width:340, zIndex:1999,
        background:T.card, border:`1.5px solid ${T.border}`, borderRadius:16,
        boxShadow:`0 16px 56px ${T.shadowHov}`, animation:"slideDown .2s ease", overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, color:T.text }}>Notifications</div>
          <button style={{ background:"none", border:"none", fontSize:12, color:T.accentDark,
            fontWeight:600, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Mark all read</button>
        </div>
        <div style={{ maxHeight:380, overflowY:"auto" }}>
          {notifs.map((n, i) => (
            <div key={i} style={{ display:"flex", gap:12, padding:"14px 20px",
              borderBottom:`1px solid ${T.border}`,
              background: n.unread ? T.accentLight : "transparent",
              cursor:"pointer", transition:"background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background=T.bg2}
              onMouseLeave={e => e.currentTarget.style.background=n.unread ? T.accentLight : "transparent"}>
              <span style={{ fontSize:20, flexShrink:0 }}>{n.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight: n.unread ? 600 : 400, color:T.text }}>{n.title}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{n.time}</div>
              </div>
              {n.unread && <div style={{ width:7, height:7, borderRadius:"50%",
                background:T.accent, flexShrink:0, marginTop:4 }} />}
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
function NavFull({ page, setPage, onAuth }) {
  const { T, dark } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const isApp = ["dashboard","journal","financials","invoices","settings","watchlist"].includes(page);
  const appLinks = [
    { id:"dashboard",  label:"Dashboard",  icon:"📊" },
    { id:"journal",    label:"Journal",    icon:"📓" },
    { id:"financials", label:"Financials", icon:"🏦" },
    { id:"invoices",   label:"Invoices",   icon:"🧾" },
    { id:"watchlist",  label:"Watchlist",  icon:"👁" },
  ];
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:999,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"15px 48px", background:T.navBg,
      backdropFilter:"blur(20px)", borderBottom:`1px solid ${T.border}`,
      transition:"background .3s, border-color .3s" }}>
      <div onClick={() => setPage("home")} style={{ cursor:"pointer" }}><Logo /></div>
      <div style={{ display:"flex", gap:4 }}>
        {isApp ? appLinks.map(l => (
          <button key={l.id} onClick={() => setPage(l.id)}
            style={{ padding:"8px 14px", borderRadius:8, border:"none", cursor:"pointer",
              fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13,
              fontWeight: page===l.id ? 600 : 400,
              background: page===l.id ? T.accentLight : "transparent",
              color: page===l.id ? T.accentDark : T.muted2, transition:"all .2s" }}>
            {l.icon} {l.label}
          </button>
        )) : (
          [["home","Home"],["tools","Tools"],["features","Features"],["pricing","Pricing"]].map(([id,label]) => (
            <a key={id} href={`#${id}`}
              style={{ padding:"8px 14px", borderRadius:8, fontSize:13,
                color:T.muted2, textDecoration:"none", transition:"all .2s" }}
              onMouseEnter={e => { e.target.style.color=T.text; e.target.style.background=dark?"rgba(255,255,255,.05)":"rgba(0,0,0,.04)"; }}
              onMouseLeave={e => { e.target.style.color=T.muted2; e.target.style.background="transparent"; }}>
              {label}
            </a>
          ))
        )}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {/* Theme toggle always visible */}
        <ThemeToggle />
        {isApp ? (
          <>
            <div style={{ position:"relative" }}>
              <button onClick={() => { setNotifOpen(o=>!o); setProfileOpen(false); }}
                style={{ width:36, height:36, borderRadius:9, border:`1px solid ${T.border}`,
                  background:"transparent", cursor:"pointer", fontSize:16,
                  display:"grid", placeItems:"center", position:"relative" }}>
                🔔
                <span style={{ position:"absolute", top:-4, right:-4, width:16, height:16,
                  borderRadius:"50%", background:T.accent, color:"#fff",
                  fontSize:9, fontWeight:700, display:"grid", placeItems:"center",
                  border:`2px solid ${T.bg}` }}>3</span>
              </button>
              <NotifPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>
            <button onClick={() => setPage("settings")}
              style={{ width:36, height:36, borderRadius:9, border:`1px solid ${T.border}`,
                background: page==="settings" ? T.accentLight : "transparent",
                cursor:"pointer", fontSize:16, display:"grid", placeItems:"center" }}>⚙️</button>
            <div style={{ position:"relative" }}>
              <div onClick={() => { setProfileOpen(o=>!o); setNotifOpen(false); }}
                style={{ width:36, height:36, borderRadius:"50%",
                  background:`linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
                  display:"grid", placeItems:"center", cursor:"pointer",
                  fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight:800, color:"#fff" }}>A</div>
              {profileOpen && (
                <>
                  <div onClick={() => setProfileOpen(false)} style={{ position:"fixed", inset:0, zIndex:1998 }}/>
                  <div style={{ position:"absolute", top:44, right:0, width:200, zIndex:1999,
                    background:T.card, border:`1.5px solid ${T.border}`, borderRadius:14,
                    boxShadow:`0 12px 40px ${T.shadowHov}`, overflow:"hidden",
                    animation:"slideDown .2s ease" }}>
                    <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}` }}>
                      <div style={{ fontWeight:600, fontSize:14, color:T.text }}>Alex Johnson</div>
                      <div style={{ fontSize:12, color:T.muted }}>alex@ledgrnow.com</div>
                    </div>
                    {[
                      { icon:"⚙️", label:"Settings", action:() => { setPage("settings"); setProfileOpen(false); } },
                      { icon:"💳", label:"Billing",  action:() => { setPage("settings"); setProfileOpen(false); } },
                      { icon:"🔐", label:"Security", action:() => { setPage("settings"); setProfileOpen(false); } },
                      { icon:"🚪", label:"Sign out", action:() => { setPage("home"); setProfileOpen(false); }, danger:true },
                    ].map(item => (
                      <button key={item.label} onClick={item.action}
                        style={{ display:"flex", alignItems:"center", gap:10, width:"100%",
                          padding:"11px 16px", border:"none", background:"transparent",
                          cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13,
                          color: item.danger ? T.negative : T.muted2, textAlign:"left", transition:"background .15s" }}
                        onMouseEnter={e => e.currentTarget.style.background=T.bg2}
                        onMouseLeave={e => e.currentTarget.style.background="transparent"}>
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
            <Btn variant="ghost" onClick={() => onAuth("login")} small>Log in</Btn>
            <Btn variant="green" onClick={() => setPage("dashboard")} small>Get Started</Btn>
          </>
        )}
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════
   LANDING — HERO
══════════════════════════════════════ */
function Hero({ onAuth, setPage }) {
  const { T, dark } = useTheme();
  return (
    <section id="home" style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"110px 24px 60px",
      position:"relative", textAlign:"center", overflow:"hidden",
      background:T.bg, transition:"background .3s" }}>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`linear-gradient(${T.accent}0a 1px,transparent 1px),linear-gradient(90deg,${T.accent}0a 1px,transparent 1px)`,
        backgroundSize:"56px 56px",
        WebkitMaskImage:"radial-gradient(ellipse at 50% 50%,black 25%,transparent 75%)" }} />
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%",
        background:`radial-gradient(circle,${dark?"rgba(90,178,51,.07)":"rgba(90,178,51,.06)"} 0%,transparent 70%)`,
        top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none" }} />
      <div className="fade-up" style={{ display:"inline-flex", alignItems:"center", gap:8,
        padding:"6px 14px", borderRadius:50, border:`1px solid ${T.accent}55`,
        background:T.accentLight, fontSize:12, fontWeight:500, color:T.accentDark, marginBottom:28 }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:T.accent, display:"inline-block" }}/>
        Now in Public Beta
      </div>
      <h1 className="fade-up-1" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",
        fontSize:"clamp(40px,7vw,76px)", fontWeight:800, lineHeight:1.05,
        letterSpacing:"-2px", maxWidth:820, color:T.text, transition:"color .3s" }}>
        Your Complete<br/><span style={{ color:T.accent }}>Financial Command</span> Center
      </h1>
      <p className="fade-up-2" style={{ marginTop:20, fontSize:17, color:T.muted2,
        maxWidth:500, lineHeight:1.7, fontWeight:300, transition:"color .3s" }}>
        Trade smarter, journal every move, read financial statements, generate invoices — all in one powerful platform.
      </p>
      <div className="fade-up-3" style={{ display:"flex", gap:14, marginTop:40, flexWrap:"wrap", justifyContent:"center" }}>
        <Btn variant="green" onClick={() => setPage("dashboard")} style={{ padding:"14px 32px", fontSize:15 }}>Start for Free →</Btn>
        <Btn variant="outline" onClick={() => document.getElementById("tools")?.scrollIntoView({behavior:"smooth"})}
          style={{ padding:"14px 32px", fontSize:15 }}>Explore Tools</Btn>
      </div>
      <div className="fade-up-4" style={{ display:"flex", gap:48, marginTop:64, flexWrap:"wrap", justifyContent:"center" }}>
        {[["12K+","Active Traders"],["$2.4B","Volume Tracked"],["98.9%","Uptime"],["50+","Exchanges"]].map(([n,l]) => (
          <div key={l} style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:800, color:T.text }}>{n}</div>
            <div style={{ fontSize:12, color:T.muted, marginTop:4, letterSpacing:"0.5px" }}>{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   LANDING — TOOLS
══════════════════════════════════════ */
const TOOLS = [
  { id:"trading",   icon:"📈", name:"Trading",          desc:"Execute trades, set alerts, manage positions",
    options:["Live Trading Dashboard","Paper Trading (Demo)","Portfolio Overview","Price Alerts","Order History","Watchlist"] },
  { id:"journal",   icon:"📓", name:"Trading Journal",  desc:"Log trades, track emotions, analyze patterns",
    options:["Add Journal Entry","View Past Trades","Performance Analytics","Tag & Filter Entries","Export to PDF/CSV"] },
  { id:"fin",       icon:"🏦", name:"Company Financials",desc:"Income statements, balance sheets, cash flow",
    options:["Income Statement","Balance Sheet","Cash Flow Statement","Key Ratios & Metrics","Earnings Calendar","Compare Companies"] },
  { id:"invoices",  icon:"🧾", name:"Invoice & Billing", desc:"Generate, send, and track professional invoices",
    options:["Create New Invoice","Invoice Templates","Manage Clients","Payment Tracking","Recurring Billing","Export & Send PDF"] },
];

function ToolsSection({ setPage }) {
  const { T } = useTheme();
  const [open, setOpen] = useState(null);
  const [selected, setSelected] = useState({});
  const pageMap = { trading:"dashboard", journal:"journal", fin:"financials", invoices:"invoices" };
  return (
    <section id="tools" style={{ padding:"100px 56px", background:T.bg2, transition:"background .3s" }}>
      <div style={{ textAlign:"center", marginBottom:56 }}>
        <SectionLabel>What do you want to do?</SectionLabel>
        <SectionTitle>Pick Your Workflow</SectionTitle>
        <p style={{ fontSize:15, color:T.muted2, marginTop:12, maxWidth:460, margin:"12px auto 0", lineHeight:1.7 }}>
          Select a tool category and choose exactly what you need.
        </p>
      </div>
      <div style={{ maxWidth:860, margin:"0 auto", display:"flex", flexDirection:"column", gap:14 }}>
        {TOOLS.map(t => (
          <div key={t.id}>
            <div onClick={() => setOpen(open===t.id ? null : t.id)}
              style={{ display:"flex", alignItems:"center", gap:16,
                background:T.card, border:`1.5px solid ${open===t.id ? T.accent : T.border}`,
                borderRadius: open===t.id ? "14px 14px 0 0" : 14,
                padding:"18px 24px", cursor:"pointer", transition:"all .2s",
                boxShadow: open===t.id ? `0 4px 24px ${T.accent}18` : "none" }}>
              <div style={{ width:44, height:44, borderRadius:10, background:T.accentLight,
                display:"grid", placeItems:"center", fontSize:20, flexShrink:0 }}>{t.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, color:T.text }}>{t.name}</div>
                <div style={{ fontSize:13, color:T.muted, marginTop:2 }}>{t.desc}</div>
              </div>
              <div style={{ fontSize:18, color: open===t.id ? T.accent : T.muted,
                transform: open===t.id ? "rotate(180deg)" : "none", transition:"transform .3s" }}>⌄</div>
            </div>
            {open===t.id && (
              <div style={{ background:T.card2, border:`1.5px solid ${T.accent}`, borderTop:"none",
                borderRadius:"0 0 14px 14px", padding:24, animation:"slideDown .3s ease" }}>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:10 }}>
                  {t.options.map(o => {
                    const key = `${t.id}-${o}`, sel = selected[key];
                    return (
                      <div key={o} onClick={() => setSelected(s => ({ ...s, [key]:!s[key] }))}
                        style={{ padding:"11px 15px", borderRadius:10,
                          background: sel ? T.accentLight : T.bg,
                          border:`1.5px solid ${sel ? T.accent : T.border}`,
                          fontSize:13, fontWeight:500, color: sel ? T.accentDark : T.muted2,
                          cursor:"pointer", display:"flex", alignItems:"center", gap:10, transition:"all .2s" }}>
                        <span style={{ width:6, height:6, borderRadius:"50%",
                          background: sel ? T.accent : T.muted, flexShrink:0 }}/>
                        {o}
                      </div>
                    );
                  })}
                </div>
                <Btn variant="primary" style={{ marginTop:18 }} onClick={() => setPage(pageMap[t.id])}>
                  Open {t.name} →
                </Btn>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   LANDING — FEATURES
══════════════════════════════════════ */
const FEATS = [
  { icon:"📊", title:"Real-Time Trading Dashboard", big:true,
    desc:"Monitor live prices, execute trades, manage open positions across 50+ exchanges. Advanced charting with 100+ technical indicators.",
    tags:["Live Data","Multi-exchange","TradingView Charts","Risk Management"] },
  { icon:"🧠", title:"AI-Powered Trade Journal",
    desc:"Auto-log every trade with entry/exit, rationale, and emotion tagging. AI surfaces patterns in your wins and losses.",
    tags:["Auto-import","AI Insights"] },
  { icon:"📑", title:"Company Financial Statements",
    desc:"Access 10 years of income statements, balance sheets, and cash flow data for 30,000+ companies globally.",
    tags:["30K Companies","10-yr History"] },
  { icon:"🧾", title:"Invoice Generator",
    desc:"Create branded invoices in seconds. Track payments, set reminders for overdue amounts.",
    tags:["PDF Export","Payment Tracking"] },
  { icon:"🔐", title:"Bank-Grade Security",
    desc:"256-bit AES encryption, 2FA, OAuth2, and read-only API keys — your funds never touch our servers.",
    tags:["2FA","Read-only APIs"] },
  { icon:"📤", title:"Reports & Exports",
    desc:"Generate tax-ready reports, export trades to CSV, send financial summaries in one click.",
    tags:["Tax Reports","CSV / PDF"] },
];

function FeatCard({ icon, title, desc, tags, big }) {
  const { T } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <div style={{ gridColumn: big ? "span 2" : "span 1",
      background:T.card, border:`1.5px solid ${hov ? T.accent+"55" : T.border}`,
      borderRadius:16, padding:"30px 26px", position:"relative", overflow:"hidden",
      transform: hov ? "translateY(-4px)" : "none",
      boxShadow: hov ? `0 16px 48px ${T.shadowHov}` : `0 2px 8px ${T.shadow}`,
      transition:"all .25s" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
        background:T.accent, transform: hov ? "scaleX(1)" : "scaleX(0)",
        transformOrigin:"left", transition:"transform .3s" }} />
      <div style={{ width:46, height:46, borderRadius:12, background:T.accentLight,
        display:"grid", placeItems:"center", fontSize:22, marginBottom:18 }}>{icon}</div>
      <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:17, fontWeight:700,
        marginBottom:10, color:T.text }}>{title}</h3>
      <p style={{ fontSize:14, color:T.muted2, lineHeight:1.7 }}>{desc}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:14 }}>
        {tags.map(t => (
          <span key={t} style={{ fontSize:11, padding:"3px 10px", borderRadius:20,
            border:`1px solid ${T.border}`, color:T.muted, background:T.bg2 }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function FeaturesSection() {
  const { T } = useTheme();
  return (
    <section id="features" style={{ padding:"100px 56px", background:T.bg, transition:"background .3s" }}>
      <div style={{ maxWidth:560 }}>
        <SectionLabel>Platform Features</SectionLabel>
        <SectionTitle>Everything a serious trader needs</SectionTitle>
        <p style={{ fontSize:15, color:T.muted2, marginTop:12, lineHeight:1.7 }}>
          Built for retail traders, analysts, and finance teams.
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, marginTop:52 }}>
        {FEATS.map(f => <FeatCard key={f.title} {...f} />)}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   LANDING — PRICING
══════════════════════════════════════ */
const PLANS = [
  { name:"Starter", monthly:0, annual:0,
    desc:"Perfect for getting started with trading journals and basic financials.",
    features:["Trading Journal (50 entries/mo)","Basic Financial Statements","5 Invoices per month","1 Exchange Connection"],
    missing:["Live Trading Dashboard","AI Trade Analysis","Tax Reports"] },
  { name:"Pro", monthly:29, annual:20, popular:true,
    desc:"For active traders who need full journaling, live data, and billing tools.",
    features:["Unlimited Journal Entries","Full Financial Statements (10yr)","Unlimited Invoices","5 Exchange Connections","Live Trading Dashboard","AI Trade Analysis"],
    missing:["Tax Reports"] },
  { name:"Enterprise", monthly:99, annual:69,
    desc:"For teams and firms needing advanced reporting, APIs, and team management.",
    features:["Everything in Pro","Team Accounts (10 seats)","Tax & Compliance Reports","Unlimited Exchanges","Custom Invoice Branding","Priority Support","API Access"],
    missing:[] },
];

function PlanCard({ plan, annual, onAuth }) {
  const { T } = useTheme();
  const price = annual ? plan.annual : plan.monthly;
  return (
    <div style={{ background: plan.popular ? T.black : T.card,
      border:`1.5px solid ${plan.popular ? T.accent : T.border}`,
      borderRadius:20, padding:"34px 30px", position:"relative",
      boxShadow: plan.popular ? `0 8px 40px ${T.accent}22` : "none",
      transition:"background .3s, border-color .3s" }}>
      {plan.popular && (
        <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)",
          background:T.accent, color:"#fff", fontSize:11, fontWeight:700,
          padding:"4px 16px", borderRadius:20, whiteSpace:"nowrap" }}>⭐ Most Popular</div>
      )}
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase",
        color: plan.popular ? "rgba(255,255,255,.4)" : T.muted, marginBottom:18 }}>{plan.name}</div>
      <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:48, fontWeight:800,
        letterSpacing:"-2px", lineHeight:1, color: plan.popular ? "#fff" : T.text }}>
        <sup style={{ fontSize:22, verticalAlign:"top", marginTop:8 }}>$</sup>
        {price}
        <sub style={{ fontSize:14, color: plan.popular ? "rgba(255,255,255,.4)" : T.muted,
          fontWeight:400, letterSpacing:0 }}>/mo</sub>
      </div>
      <p style={{ fontSize:13, color: plan.popular ? "rgba(255,255,255,.55)" : T.muted2,
        margin:"12px 0 24px", lineHeight:1.6 }}>{plan.desc}</p>
      <div style={{ height:1, background: plan.popular ? "rgba(255,255,255,.1)" : T.border, marginBottom:20 }}/>
      <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:11, marginBottom:28 }}>
        {plan.features.map(f => (
          <li key={f} style={{ display:"flex", alignItems:"center", gap:10,
            fontSize:13, color: plan.popular ? "rgba(255,255,255,.8)" : T.muted2 }}>
            <span style={{ width:18, height:18, borderRadius:"50%", display:"grid", placeItems:"center",
              background: plan.popular ? "rgba(90,178,51,.2)" : T.accentLight,
              color:T.accent, fontSize:10, fontWeight:700, flexShrink:0 }}>✓</span>
            {f}
          </li>
        ))}
        {plan.missing.map(f => (
          <li key={f} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13,
            color: plan.popular ? "rgba(255,255,255,.25)" : T.muted }}>
            <span style={{ width:18, height:18, borderRadius:"50%", display:"grid", placeItems:"center",
              background:T.bg2, color:T.muted, fontSize:10, flexShrink:0 }}>–</span>
            {f}
          </li>
        ))}
      </ul>
      <button onClick={() => onAuth("signup")}
        style={{ width:"100%", padding:13, borderRadius:10, cursor:"pointer",
          fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight:600, transition:"all .2s",
          background: plan.popular ? T.accent : "transparent",
          color: plan.popular ? "#fff" : T.text,
          border: plan.popular ? "none" : `1.5px solid ${T.border}` }}>
        {plan.name==="Starter" ? "Get Started Free" : plan.name==="Pro" ? "Start Pro Trial" : "Contact Sales"}
      </button>
    </div>
  );
}

function PricingSection({ onAuth }) {
  const { T } = useTheme();
  const [annual, setAnnual] = useState(true);
  return (
    <section id="pricing" style={{ padding:"100px 56px", background:T.bg2, transition:"background .3s" }}>
      <div style={{ textAlign:"center", marginBottom:52 }}>
        <SectionLabel>Pricing</SectionLabel>
        <SectionTitle>Simple, Transparent Plans</SectionTitle>
        <p style={{ fontSize:15, color:T.muted2, marginTop:12 }}>Start free. Scale as you grow. No hidden fees.</p>
        <div style={{ display:"inline-flex", alignItems:"center", gap:12, marginTop:20,
          background:T.bg3, borderRadius:50, padding:"6px 20px", fontSize:14, color:T.muted2,
          border:`1px solid ${T.border}` }}>
          Monthly
          <div onClick={() => setAnnual(a => !a)} style={{ width:40, height:22, borderRadius:11,
            background:T.accent, position:"relative", cursor:"pointer" }}>
            <div style={{ position:"absolute", top:3, left:3, width:16, height:16,
              borderRadius:"50%", background:"#fff", transition:"transform .2s",
              transform: annual ? "translateX(18px)" : "none" }} />
          </div>
          Annual
          <span style={{ background:T.accentLight, color:T.accentDark, fontSize:11,
            fontWeight:600, padding:"2px 8px", borderRadius:20 }}>Save 30%</span>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, maxWidth:1060, margin:"0 auto" }}>
        {PLANS.map(p => <PlanCard key={p.name} plan={p} annual={annual} onAuth={onAuth} />)}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   FOOTER
══════════════════════════════════════ */
function Footer({ setPage }) {
  const { T } = useTheme();
  const cols = [
    { heading:"Menu",       links:["Home","Features","Pricing","Blog"] },
    { heading:"Navigation", links:["Trading","Journal","Financials","Invoices","Watchlist"] },
    { heading:"Company",    links:["About","Careers","Privacy","Terms"] },
    { heading:"Social",     links:["LinkedIn","X","Instagram"] },
  ];
  return (
    <footer style={{ background:"#0d0f0d", overflow:"hidden", position:"relative" }}>
      <div style={{ height:4, background:"linear-gradient(90deg,#e040fb,#f06292,#ff7043,#ffb300,#c6e24b,#5ab233)" }} />
      <div style={{ padding:"64px 64px 48px", display:"grid",
        gridTemplateColumns:"1.8fr 1fr 1fr 1fr 1fr", gap:40 }}>
        <div>
          <div onClick={() => setPage("home")} style={{ cursor:"pointer", marginBottom:16 }}>
            <Logo forceLight />
          </div>
         <div style={{ fontStyle:"italic", fontSize:15, color:"#ffffff",
  fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:500, marginBottom:20 }}>
            Your Finance, in Perfect Control.
          </div>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:24, fontWeight:800,
            color:"#fff", lineHeight:1.25, maxWidth:220, marginBottom:18 }}>
            Trade Smarter,<br/>Not Harder
          </div>
          <p style={{ fontSize:13, color:"rgba(255,255,255,.3)", lineHeight:1.7, maxWidth:260 }}>
            Trade, journal, analyze, and invoice — without the overwhelm.
          </p>
          <div style={{ marginTop:28, fontSize:13, color:"rgba(255,255,255,.2)" }}>
            © 2026  LedgrNow. All rights reserved.
          </div>
        </div>
        {cols.map(col => (
          <div key={col.heading}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase",
              color:"rgba(255,255,255,.3)", marginBottom:20 }}>{col.heading}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
              {col.links.map(l => (
  <a
    key={l}
    href={
      l === "Instagram"
        ? "https://instagram.com/ledgrnow"
        : l === "Twitter"
        ? "https://x.com/ledgrnow"
        : l === "LinkedIn"
        ? "https://linkedin.com/company/ledgrnow"
        : "#"
    }
    target="_blank"
    rel="noopener noreferrer"
    style={{
      fontSize: 14,
      color: "rgba(255,255,255,.5)",
      textDecoration: "none",
      transition: "color .2s"
    }}
  >
    {l}
  </a>
))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ overflow:"hidden", lineHeight:0.85, padding:"0 0 0 40px",
        userSelect:"none", pointerEvents:"none" }}>
        <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",
          fontSize:"clamp(80px,16vw,200px)", letterSpacing:"-4px",
          display:"inline", whiteSpace:"nowrap" }}>
          <span style={{ fontWeight:300, color:"rgba(255,255,255,.04)" }}>Ledgr</span>
          <span style={{ fontWeight:800, color:"rgba(255,255,255,.04)" }}>Now</span>
          <span style={{ fontWeight:800, color:"rgba(90,178,51,.5)" }}>.</span>
        </span>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════ */
function LandingPage({ onAuth, setPage }) {
  return (
    <>
      <Hero onAuth={onAuth} setPage={setPage} />
      <ToolsSection setPage={setPage} />
      <FeaturesSection />
      <PricingSection onAuth={onAuth} />
      <Footer setPage={setPage} />
    </>
  );
}

/* ══════════════════════════════════════
   APP — DASHBOARD
══════════════════════════════════════ */
function Dashboard({ setPage }) {
  const { T } = useTheme();
  const stats = [
    { label:"Portfolio Value", value:"$84,320", change:"+2.4%", up:true,  icon:"💼" },
    { label:"Today's P&L",     value:"+$1,240", change:"+1.5%", up:true,  icon:"📈" },
    { label:"Open Positions",  value:"7",       change:"3 long / 4 short",up:null, icon:"🎯" },
    { label:"Win Rate (30d)",  value:"64.2%",   change:"+3.1% vs last mo",up:true, icon:"🏆" },
  ];
  const trades = [
    { symbol:"AAPL", side:"BUY",  qty:10, entry:182.50, current:188.20, pnl:"+$57.00",  up:true  },
    { symbol:"TSLA", side:"SELL", qty:5,  entry:245.00, current:238.50, pnl:"+$32.50",  up:true  },
    { symbol:"NVDA", side:"BUY",  qty:3,  entry:612.00, current:598.40, pnl:"-$40.80",  up:false },
    { symbol:"SPY",  side:"BUY",  qty:20, entry:510.00, current:514.30, pnl:"+$86.00",  up:true  },
    { symbol:"AMZN", side:"BUY",  qty:8,  entry:178.20, current:174.90, pnl:"-$26.40",  up:false },
  ];
  const bars = [42,68,55,80,62,90,74,88,60,76,92,70];
  return (
    <div style={{ padding:"90px 48px 48px", background:T.bg2, minHeight:"100vh", transition:"background .3s" }}>
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:800, color:T.text }}>Good morning 👋</h1>
        <p style={{ color:T.muted2, marginTop:4 }}>Here's your financial overview for today.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding:"22px 20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:12, color:T.muted, marginBottom:8 }}>{s.label}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:26, fontWeight:800, color:T.text }}>{s.value}</div>
                <div style={{ fontSize:12, marginTop:6, color: s.up===null ? T.muted : s.up ? T.positive : T.negative }}>{s.change}</div>
              </div>
              <span style={{ fontSize:26 }}>{s.icon}</span>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:20, marginBottom:20 }}>
        <Card style={{ padding:"24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:T.text }}>Portfolio Performance</div>
              <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>Last 12 months</div>
            </div>
            <span style={{ background:T.accentLight, color:T.accentDark, fontSize:11, fontWeight:600,
              padding:"3px 10px", borderRadius:20, border:`1px solid ${T.accent}33` }}>+18.4% YTD</span>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:120 }}>
            {bars.map((h,i) => (
              <div key={i} style={{ flex:1, height:`${h}%`, borderRadius:"4px 4px 0 0",
                background: i===bars.length-1 ? T.accent : `${T.accent}${Math.round(35+i*8).toString(16)}`,
                transition:"height .3s" }} />
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
            {["J","F","M","A","M","J","J","A","S","O","N","D"].map(m => (
              <span key={m} style={{ fontSize:10, color:T.muted, flex:1, textAlign:"center" }}>{m}</span>
            ))}
          </div>
        </Card>
        <Card style={{ padding:"24px" }}>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:T.text, marginBottom:18 }}>Quick Actions</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { icon:"📈", label:"New Trade Entry",    page:"journal"    },
              { icon:"🏦", label:"View Financials",    page:"financials" },
              { icon:"🧾", label:"Generate Invoice",   page:"invoices"   },
              { icon:"📊", label:"Performance Report", page:"journal"    },
            ].map(a => (
              <button key={a.label} onClick={() => setPage(a.page)}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
                  borderRadius:10, border:`1.5px solid ${T.border}`, background:T.bg2,
                  cursor:"pointer", fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif",
                  color:T.muted2, textAlign:"left", transition:"all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=T.accent; e.currentTarget.style.color=T.accentDark; e.currentTarget.style.background=T.accentLight; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted2; e.currentTarget.style.background=T.bg2; }}>
                <span style={{ fontSize:18 }}>{a.icon}</span> {a.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
      <Card style={{ padding:"24px" }}>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:T.text, marginBottom:18 }}>Open Positions</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.border}` }}>
              {["Symbol","Side","Qty","Entry","Current","P&L"].map(h => (
                <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:11,
                  fontWeight:600, color:T.muted, letterSpacing:"1px", textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map(t => (
              <tr key={t.symbol} style={{ borderBottom:`1px solid ${T.border}` }}>
                <td style={{ padding:"12px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, color:T.text }}>{t.symbol}</td>
                <td style={{ padding:"12px" }}>
                  <span style={{ padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600,
                    background: t.side==="BUY" ? T.positiveBg : T.negativeBg,
                    color: t.side==="BUY" ? T.positive : T.negative }}>{t.side}</span>
                </td>
                <td style={{ padding:"12px", color:T.muted2 }}>{t.qty}</td>
                <td style={{ padding:"12px", color:T.muted2 }}>${t.entry}</td>
                <td style={{ padding:"12px", color:T.muted2 }}>${t.current}</td>
                <td style={{ padding:"12px", fontWeight:600, color: t.up ? T.positive : T.negative }}>{t.pnl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   APP — JOURNAL
══════════════════════════════════════ */
function Journal({ toast = () => {} }) {
  const { T } = useTheme();
  const [entries, setEntries] = useState([
    { id:1, date:"2024-01-15", symbol:"AAPL", side:"BUY",  entry:180, exit:188, qty:10, pnl:80,  emotion:"Confident", notes:"Strong earnings beat" },
    { id:2, date:"2024-01-14", symbol:"TSLA", side:"SELL", entry:250, exit:242, qty:5,  pnl:40,  emotion:"Neutral",   notes:"Technical resistance at 250" },
    { id:3, date:"2024-01-12", symbol:"NVDA", side:"BUY",  entry:610, exit:598, qty:2,  pnl:-24, emotion:"Anxious",   notes:"Chased the move — mistake" },
    { id:4, date:"2024-01-10", symbol:"SPY",  side:"BUY",  entry:508, exit:514, qty:15, pnl:90,  emotion:"Confident", notes:"Followed the trend well" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ symbol:"", side:"BUY", entry:"", exit:"", qty:"", emotion:"Neutral", notes:"" });
  const addEntry = () => {
    if (!form.symbol || !form.entry || !form.exit) return;
    const pnl = (parseFloat(form.exit)-parseFloat(form.entry))*parseInt(form.qty||1)*(form.side==="SELL"?-1:1);
    setEntries(e => [{ id:Date.now(), date:new Date().toISOString().slice(0,10), ...form, pnl:Math.round(pnl) }, ...e]);
    setForm({ symbol:"", side:"BUY", entry:"", exit:"", qty:"", emotion:"Neutral", notes:"" });
    setShowForm(false);
    toast("Trade entry saved successfully!");
  };
  const wins = entries.filter(e => e.pnl>0).length;
  const totalPnl = entries.reduce((s,e) => s+e.pnl, 0);
  const inputStyle = { width:"100%", padding:"10px 14px", borderRadius:9,
    border:`1.5px solid ${T.border}`, background:T.inputBg, fontSize:14,
    fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none", color:T.text };
  return (
    <div style={{ padding:"90px 48px 48px", background:T.bg2, minHeight:"100vh", transition:"background .3s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
        <div>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:800, color:T.text }}>Trading Journal</h1>
          <p style={{ color:T.muted2, marginTop:4 }}>Track, analyze, and improve your trades.</p>
        </div>
        <Btn variant="green" onClick={() => setShowForm(s=>!s)}>+ New Entry</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[
          { label:"Total Trades", value:entries.length },
          { label:"Win Rate",     value:`${Math.round(wins/entries.length*100)}%` },
          { label:"Total P&L",    value:`${totalPnl>=0?"+":""}$${totalPnl}`, color: totalPnl>=0 ? T.positive : T.negative },
          { label:"Avg P&L",      value:`$${Math.round(totalPnl/entries.length)}` },
        ].map(s => (
          <Card key={s.label} style={{ padding:"18px 20px" }}>
            <div style={{ fontSize:12, color:T.muted, marginBottom:6 }}>{s.label}</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:24, fontWeight:800,
              color: s.color || T.text }}>{s.value}</div>
          </Card>
        ))}
      </div>
      {showForm && (
        <Card style={{ marginBottom:20, padding:"24px" }}>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:T.text, marginBottom:18 }}>New Trade Entry</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {[{key:"symbol",label:"Symbol",placeholder:"AAPL"},{key:"entry",label:"Entry Price",placeholder:"182.50",type:"number"},{key:"exit",label:"Exit Price",placeholder:"188.00",type:"number"},{key:"qty",label:"Quantity",placeholder:"10",type:"number"}].map(f => (
              <div key={f.key}>
                <label style={{ fontSize:12, color:T.muted2, display:"block", marginBottom:5 }}>{f.label}</label>
                <input value={form[f.key]} type={f.type||"text"} onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={inputStyle}
                  onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border} />
              </div>
            ))}
            <div>
              <label style={{ fontSize:12, color:T.muted2, display:"block", marginBottom:5 }}>Side</label>
              <select value={form.side} onChange={e=>setForm(p=>({...p,side:e.target.value}))} style={{ ...inputStyle }}>
                <option>BUY</option><option>SELL</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, color:T.muted2, display:"block", marginBottom:5 }}>Emotion</label>
              <select value={form.emotion} onChange={e=>setForm(p=>({...p,emotion:e.target.value}))} style={{ ...inputStyle }}>
                {["Confident","Neutral","Anxious","FOMO","Disciplined"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop:14 }}>
            <label style={{ fontSize:12, color:T.muted2, display:"block", marginBottom:5 }}>Notes</label>
            <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="What was your rationale?"
              style={{ ...inputStyle, resize:"vertical", minHeight:70 }}
              onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border} />
          </div>
          <div style={{ display:"flex", gap:10, marginTop:16 }}>
            <Btn variant="green" onClick={addEntry}>Save Entry</Btn>
            <Btn variant="outline" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </Card>
      )}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {entries.map(e => (
          <Card key={e.id} style={{ padding:"20px 24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, fontWeight:800, color:T.text }}>{e.symbol}</div>
                <span style={{ padding:"2px 9px", borderRadius:20, fontSize:11, fontWeight:600,
                  background: e.side==="BUY" ? T.positiveBg : T.negativeBg,
                  color: e.side==="BUY" ? T.positive : T.negative }}>{e.side}</span>
                <span style={{ fontSize:12, color:T.muted }}>{e.date}</span>
                <span style={{ fontSize:12, color:T.muted2, background:T.bg2, padding:"2px 8px", borderRadius:8 }}>{e.emotion}</span>
              </div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, fontWeight:700,
                color: e.pnl>=0 ? T.positive : T.negative }}>{e.pnl>=0?"+":""}${e.pnl}</div>
            </div>
            <div style={{ display:"flex", gap:24, marginTop:10, fontSize:13, color:T.muted2 }}>
              <span>Entry: <b style={{ color:T.text }}>${e.entry}</b></span>
              <span>Exit: <b style={{ color:T.text }}>${e.exit}</b></span>
              <span>Qty: <b style={{ color:T.text }}>{e.qty}</b></span>
            </div>
            {e.notes && <p style={{ marginTop:8, fontSize:13, color:T.muted2, fontStyle:"italic" }}>"{e.notes}"</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   APP — FINANCIALS
══════════════════════════════════════ */
const FIN_DATA = {
  income:   { headers:["","2023","2022","2021"], rows:[["Revenue","$383.3B","$394.3B","$365.8B"],["Gross Profit","$169.1B","$170.8B","$152.8B"],["Operating Income","$114.3B","$119.4B","$108.9B"],["Net Income","$97.0B","$99.8B","$94.7B"]] },
  balance:  { headers:["","2023","2022","2021"], rows:[["Total Assets","$352.6B","$352.8B","$351.0B"],["Cash & Equiv.","$29.9B","$23.6B","$34.9B"],["Total Debt","$109.3B","$120.1B","$124.7B"],["Total Equity","$62.1B","$50.7B","$63.1B"]] },
  cashflow: { headers:["","2023","2022","2021"], rows:[["Operating CF","$110.5B","$122.2B","$104.0B"],["Investing CF","$-21.0B","$-22.3B","$-14.5B"],["Financing CF","$-108.5B","$-110.7B","$-93.4B"],["Free Cash Flow","$99.6B","$111.4B","$93.0B"]] },
};

function Financials() {
  const { T } = useTheme();
  const [ticker, setTicker] = useState("AAPL");
  const [input, setInput] = useState("AAPL");
  const [tab, setTab] = useState("income");
  const data = FIN_DATA[tab];
  const inputStyle = { flex:1, padding:"11px 16px", borderRadius:9, border:`1.5px solid ${T.border}`,
    background:T.inputBg, fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none", color:T.text };
  return (
    <div style={{ padding:"90px 48px 48px", background:T.bg2, minHeight:"100vh", transition:"background .3s" }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:800, color:T.text }}>Company Financials</h1>
        <p style={{ color:T.muted2, marginTop:4 }}>Detailed financial statements for public companies.</p>
      </div>
      <Card style={{ marginBottom:24, padding:"20px 24px" }}>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <input value={input} onChange={e=>setInput(e.target.value.toUpperCase())}
            onKeyDown={e=>e.key==="Enter"&&setTicker(input)} placeholder="Enter ticker (e.g. AAPL, MSFT, TSLA)"
            style={inputStyle} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border} />
          <Btn variant="green" onClick={() => setTicker(input)}>Search</Btn>
        </div>
      </Card>
      <Card style={{ marginBottom:20, padding:"24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:800, color:T.text }}>{ticker}</div>
            <div style={{ color:T.muted2, marginTop:2 }}>{{ AAPL:"Apple Inc.", MSFT:"Microsoft Corporation", TSLA:"Tesla Inc.", NVDA:"NVIDIA Corporation" }[ticker] || `${ticker} Corporation`}</div>
          </div>
          <div style={{ display:"flex", gap:24 }}>
            {[["Price","$188.42"],["Mkt Cap","$2.91T"],["P/E","30.2x"],["EPS","$6.13"]].map(([l,v]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:11, color:T.muted, letterSpacing:"0.5px", textTransform:"uppercase" }}>{l}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, fontWeight:700, marginTop:4, color:T.text }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <div style={{ display:"flex", gap:4, marginBottom:16 }}>
        {[["income","Income Statement"],["balance","Balance Sheet"],["cashflow","Cash Flow"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ padding:"9px 20px", borderRadius:8, border:"none", cursor:"pointer",
              fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:600, transition:"all .2s",
              background: tab===id ? T.black : "transparent", color: tab===id ? "#fff" : T.muted2 }}>
            {label}
          </button>
        ))}
      </div>
      <Card style={{ padding:"24px" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:`2px solid ${T.border}` }}>
              {data.headers.map((h,i) => (
                <th key={i} style={{ padding:"10px 16px", textAlign:i===0?"left":"right", fontSize:12,
                  fontWeight:700, color:T.muted, letterSpacing:"0.5px", textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row,ri) => (
              <tr key={ri} style={{ borderBottom:`1px solid ${T.border}`, background: ri%2===0 ? "transparent" : T.bg2 }}>
                {row.map((cell,ci) => (
                  <td key={ci} style={{ padding:"12px 16px", textAlign:ci===0?"left":"right",
                    fontSize:14, fontWeight: ci===0 ? 500 : 400,
                    color: ci===0 ? T.text : T.muted2 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   APP — INVOICES
══════════════════════════════════════ */
function Invoices({ toast = () => {} }) {
  const { T } = useTheme();
  const [invoices, setInvoices] = useState([
    { id:"INV-001", client:"Acme Corp",         date:"2024-01-15", due:"2024-02-15", amount:4500,  status:"Paid"    },
    { id:"INV-002", client:"Beta Solutions",     date:"2024-01-10", due:"2024-02-10", amount:12000, status:"Pending" },
    { id:"INV-003", client:"Gamma Traders",      date:"2024-01-05", due:"2024-02-05", amount:750,   status:"Overdue" },
    { id:"INV-004", client:"Delta Investments",  date:"2024-01-20", due:"2024-02-20", amount:3200,  status:"Draft"   },
  ]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ client:"", email:"", items:[{desc:"",qty:1,rate:""}] });
  const addItem = () => setForm(f=>({...f,items:[...f.items,{desc:"",qty:1,rate:""}]}));
  const updateItem = (i,k,v) => setForm(f=>({...f,items:f.items.map((it,idx)=>idx===i?{...it,[k]:v}:it)}));
  const total = form.items.reduce((s,it)=>s+(parseFloat(it.rate)||0)*(parseInt(it.qty)||0),0);
  const saveInvoice = () => {
    if(!form.client) return;
    const id = `INV-00${invoices.length+1}`;
    setInvoices(iv=>[{id,client:form.client,date:new Date().toISOString().slice(0,10),due:"",amount:total,status:"Draft"},...iv]);
    setShowNew(false);
    setForm({client:"",email:"",items:[{desc:"",qty:1,rate:""}]});
    toast("Invoice saved successfully!");
  };
  const statusColor = {
    Paid:    { bg:T.positiveBg, color:T.positive },
    Pending: { bg:T.warnBg,     color:T.warn     },
    Overdue: { bg:T.negativeBg, color:T.negative },
    Draft:   { bg:T.bg3,        color:T.muted    },
  };
  const inputStyle = { width:"100%", padding:"10px 14px", borderRadius:9,
    border:`1.5px solid ${T.border}`, background:T.inputBg, fontSize:14,
    fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none", color:T.text };
  return (
    <div style={{ padding:"90px 48px 48px", background:T.bg2, minHeight:"100vh", transition:"background .3s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
        <div>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:800, color:T.text }}>Invoices & Billing</h1>
          <p style={{ color:T.muted2, marginTop:4 }}>Create, send, and track your invoices.</p>
        </div>
        <Btn variant="green" onClick={() => setShowNew(s=>!s)}>+ New Invoice</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[
          { label:"Total Invoices",     value:invoices.length,                                                                               icon:"🧾" },
          { label:"Revenue Collected",  value:`$${invoices.filter(i=>i.status==="Paid").reduce((s,i)=>s+i.amount,0).toLocaleString()}`,       icon:"✅" },
          { label:"Pending",            value:`$${invoices.filter(i=>i.status==="Pending").reduce((s,i)=>s+i.amount,0).toLocaleString()}`,    icon:"⏳" },
          { label:"Overdue",            value:`$${invoices.filter(i=>i.status==="Overdue").reduce((s,i)=>s+i.amount,0).toLocaleString()}`,    icon:"⚠️" },
        ].map(s => (
          <Card key={s.label} style={{ padding:"20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:12, color:T.muted, marginBottom:6 }}>{s.label}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:800, color:T.text }}>{s.value}</div>
              </div>
              <span style={{ fontSize:24 }}>{s.icon}</span>
            </div>
          </Card>
        ))}
      </div>
      {showNew && (
        <Card style={{ marginBottom:20, padding:"28px" }}>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:18, color:T.text, marginBottom:20 }}>Create New Invoice</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
            {[{key:"client",label:"Client Name",ph:"Acme Corporation"},{key:"email",label:"Client Email",ph:"billing@client.com"}].map(f=>(
              <div key={f.key}>
                <label style={{ fontSize:12, color:T.muted2, display:"block", marginBottom:5 }}>{f.label}</label>
                <input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph}
                  style={inputStyle} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border} />
              </div>
            ))}
          </div>
          <div style={{ fontWeight:600, fontSize:14, color:T.text, marginBottom:10 }}>Line Items</div>
          <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:14 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                {["Description","Qty","Rate","Amount"].map(h=>(
                  <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontSize:11,
                    color:T.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {form.items.map((it,i)=>(
                <tr key={i}>
                  <td style={{ padding:"6px 4px" }}>
                    <input value={it.desc} onChange={e=>updateItem(i,"desc",e.target.value)} placeholder="Service description"
                      style={{ ...inputStyle, padding:"8px 12px" }} />
                  </td>
                  <td style={{ padding:"6px 4px", width:80 }}>
                    <input type="number" value={it.qty} onChange={e=>updateItem(i,"qty",e.target.value)}
                      style={{ ...inputStyle, padding:"8px 10px" }} />
                  </td>
                  <td style={{ padding:"6px 4px", width:120 }}>
                    <input type="number" value={it.rate} onChange={e=>updateItem(i,"rate",e.target.value)} placeholder="0.00"
                      style={{ ...inputStyle, padding:"8px 10px" }} />
                  </td>
                  <td style={{ padding:"6px 12px", fontWeight:600, fontSize:14, color:T.text }}>
                    ${((parseFloat(it.rate)||0)*(parseInt(it.qty)||0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <button onClick={addItem} style={{ background:"none", border:"none", color:T.accentDark,
              fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>+ Add Line Item</button>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:800, color:T.text }}>Total: ${total.toFixed(2)}</div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:20 }}>
            <Btn variant="green" onClick={saveInvoice}>Save Invoice</Btn>
            <Btn variant="primary" onClick={saveInvoice}>Save & Send</Btn>
            <Btn variant="outline" onClick={() => setShowNew(false)}>Cancel</Btn>
          </div>
        </Card>
      )}
      <Card style={{ padding:"24px" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.border}` }}>
              {["Invoice","Client","Date","Due Date","Amount","Status",""].map(h=>(
                <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11,
                  fontWeight:600, color:T.muted, textTransform:"uppercase", letterSpacing:"0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv=>{
              const sc = statusColor[inv.status];
              return (
                <tr key={inv.id} style={{ borderBottom:`1px solid ${T.border}` }}>
                  <td style={{ padding:"14px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:13, color:T.text }}>{inv.id}</td>
                  <td style={{ padding:"14px", fontSize:14, color:T.text }}>{inv.client}</td>
                  <td style={{ padding:"14px", fontSize:13, color:T.muted }}>{inv.date}</td>
                  <td style={{ padding:"14px", fontSize:13, color:T.muted }}>{inv.due||"—"}</td>
                  <td style={{ padding:"14px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, color:T.text }}>${inv.amount.toLocaleString()}</td>
                  <td style={{ padding:"14px" }}>
                    <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600,
                      background:sc.bg, color:sc.color }}>{inv.status}</span>
                  </td>
                  <td style={{ padding:"14px" }}>
                    <button style={{ background:"none", border:"none", cursor:"pointer",
                      fontSize:13, color:T.accentDark, fontWeight:600, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>View PDF</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   APP — WATCHLIST
══════════════════════════════════════ */
function Watchlist() {
  const { T } = useTheme();
  const stocks = [
    { symbol:"AAPL",  price:188.42, change:+1.24, pct:+0.66 },
    { symbol:"TSLA",  price:238.50, change:-3.20, pct:-1.32 },
    { symbol:"NVDA",  price:598.40, change:+12.80,pct:+2.19 },
    { symbol:"MSFT",  price:374.80, change:+2.10, pct:+0.56 },
    { symbol:"GOOGL", price:140.20, change:-0.80, pct:-0.57 },
    { symbol:"AMZN",  price:174.90, change:+1.05, pct:+0.60 },
    { symbol:"META",  price:484.10, change:+5.30, pct:+1.11 },
    { symbol:"SPY",   price:514.30, change:+3.20, pct:+0.63 },
  ];
  return (
    <div style={{ padding:"90px 48px 48px", background:T.bg2, minHeight:"100vh", transition:"background .3s" }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:800, color:T.text }}>Watchlist</h1>
        <p style={{ color:T.muted2, marginTop:4 }}>Track your favourite stocks in real time.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 }}>
        {stocks.slice(0,4).map(s=>(
          <Card key={s.symbol} style={{ padding:"20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, fontWeight:800, color:T.text }}>{s.symbol}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:700, marginTop:6, color:T.text }}>${s.price}</div>
              </div>
              <span style={{ padding:"3px 9px", borderRadius:20, fontSize:12, fontWeight:600,
                background: s.change>=0 ? T.positiveBg : T.negativeBg,
                color: s.change>=0 ? T.positive : T.negative }}>
                {s.change>=0?"+":""}{s.pct}%
              </span>
            </div>
            <div style={{ fontSize:13, color: s.change>=0?T.positive:T.negative, marginTop:8, fontWeight:500 }}>
              {s.change>=0?"+":""}{s.change.toFixed(2)} today
            </div>
            <svg width="100%" height="40" style={{ marginTop:10 }}>
              {Array.from({length:12},(_,i)=>{
                const x1=(i/11)*100, x2=((i+1)/11)*100;
                const y1=20+Math.sin(i*0.9+s.price%5)*12, y2=20+Math.sin((i+1)*0.9+s.price%5)*12;
                return <line key={i} x1={`${x1}%`} y1={y1} x2={`${x2}%`} y2={y2}
                  stroke={s.change>=0?T.accent:T.negative} strokeWidth="2" strokeLinecap="round"/>;
              })}
            </svg>
          </Card>
        ))}
      </div>
      <Card style={{ padding:"0" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.border}` }}>
              {["Symbol","Price","Change","% Change","52W High","52W Low","Volume","Action"].map(h=>(
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11,
                  fontWeight:600, color:T.muted, letterSpacing:"0.5px", textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stocks.map((s,i)=>(
              <tr key={s.symbol} style={{ borderBottom:`1px solid ${T.border}`, background: i%2===0?"transparent":T.bg2 }}>
                <td style={{ padding:"14px 16px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, color:T.text }}>{s.symbol}</td>
                <td style={{ padding:"14px 16px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600, color:T.text }}>${s.price}</td>
                <td style={{ padding:"14px 16px", fontWeight:600, color: s.change>=0?T.positive:T.negative }}>{s.change>=0?"+":""}{s.change.toFixed(2)}</td>
                <td style={{ padding:"14px 16px" }}>
                  <span style={{ padding:"2px 8px", borderRadius:20, fontSize:12, fontWeight:600,
                    background: s.change>=0?T.positiveBg:T.negativeBg, color: s.change>=0?T.positive:T.negative }}>
                    {s.change>=0?"+":""}{s.pct}%
                  </span>
                </td>
                <td style={{ padding:"14px 16px", color:T.muted2 }}>${(s.price*1.18).toFixed(2)}</td>
                <td style={{ padding:"14px 16px", color:T.muted2 }}>${(s.price*0.74).toFixed(2)}</td>
                <td style={{ padding:"14px 16px", color:T.muted2 }}>{(Math.random()*100+20).toFixed(1)}M</td>
                <td style={{ padding:"14px 16px" }}>
                  <div style={{ display:"flex", gap:6 }}>
                    <span style={{ padding:"3px 10px", borderRadius:7, fontSize:12, fontWeight:600, background:T.positiveBg, color:T.positive, cursor:"pointer" }}>Buy</span>
                    <span style={{ padding:"3px 10px", borderRadius:7, fontSize:12, fontWeight:600, background:T.negativeBg, color:T.negative, cursor:"pointer" }}>Sell</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════
   APP — SETTINGS
══════════════════════════════════════ */
function Settings({ toast }) {
  const { T } = useTheme();
  const [profile, setProfile] = useState({ name:"Alex Johnson", email:"alex@ledgrnow.com", timezone:"UTC+5:30", currency:"USD" });
  const [notifs, setNotifs] = useState({ email:true, pnlAlerts:true, invoiceDue:true, weeklyReport:false, marketNews:false });
  const [activeTab, setActiveTab] = useState("profile");
  const tabs = [
    { id:"profile",  label:"Profile",      icon:"👤" },
    { id:"notifs",   label:"Notifications", icon:"🔔" },
    { id:"api",      label:"API Keys",      icon:"🔑" },
    { id:"billing",  label:"Billing",       icon:"💳" },
    { id:"security", label:"Security",      icon:"🔐" },
  ];
  const inputStyle = { width:"100%", padding:"10px 14px", borderRadius:9,
    border:`1.5px solid ${T.border}`, background:T.inputBg, fontSize:14,
    fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none", color:T.text };
  return (
    <div style={{ padding:"90px 48px 48px", background:T.bg2, minHeight:"100vh", transition:"background .3s" }}>
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:800, color:T.text }}>Settings</h1>
        <p style={{ color:T.muted2, marginTop:4 }}>Manage your account preferences and integrations.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:24 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          {tabs.map(t=>(
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 16px",
                borderRadius:10, border:"none", cursor:"pointer", textAlign:"left",
                fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight: activeTab===t.id ? 600 : 400,
                background: activeTab===t.id ? T.accentLight : "transparent",
                color: activeTab===t.id ? T.accentDark : T.muted2, transition:"all .2s" }}>
              <span style={{ fontSize:17 }}>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
        <Card style={{ padding:"32px" }}>
          {activeTab==="profile" && (
            <>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:18, color:T.text, marginBottom:24 }}>Profile Information</div>
              <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:28 }}>
                <div style={{ width:72, height:72, borderRadius:"50%",
                  background:`linear-gradient(135deg,${T.accent},${T.accentDark})`,
                  display:"grid", placeItems:"center",
                  fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:26, fontWeight:800, color:"#fff" }}>
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:16, color:T.text }}>{profile.name}</div>
                  <div style={{ color:T.muted, fontSize:13, marginTop:2 }}>{profile.email}</div>
                  <button style={{ marginTop:8, background:"none", border:`1px solid ${T.border}`,
                    borderRadius:6, padding:"4px 12px", fontSize:12, cursor:"pointer",
                    fontFamily:"'Plus Jakarta Sans',sans-serif", color:T.muted2 }}>Change Avatar</button>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {[{key:"name",label:"Full Name"},{key:"email",label:"Email"},{key:"timezone",label:"Timezone"},{key:"currency",label:"Currency"}].map(f=>(
                  <div key={f.key}>
                    <label style={{ fontSize:12, color:T.muted2, display:"block", marginBottom:5 }}>{f.label}</label>
                    <input value={profile[f.key]} onChange={e=>setProfile(p=>({...p,[f.key]:e.target.value}))}
                      style={inputStyle} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop:24 }}>
                <Btn variant="green" onClick={() => toast("Profile updated!")}>Save Changes</Btn>
              </div>
            </>
          )}
          {activeTab==="notifs" && (
            <>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:18, color:T.text, marginBottom:24 }}>Notification Preferences</div>
              {[
                { key:"email",        label:"Email Notifications",      desc:"Receive updates via email" },
                { key:"pnlAlerts",    label:"P&L Alerts",               desc:"Get notified on significant P&L moves" },
                { key:"invoiceDue",   label:"Invoice Due Reminders",     desc:"Reminders before invoices are due" },
                { key:"weeklyReport", label:"Weekly Performance Report", desc:"Summary of your weekly trading activity" },
                { key:"marketNews",   label:"Market News Digest",        desc:"Daily market highlights and news" },
              ].map((n,i,arr)=>(
                <div key={n.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"18px 0", borderBottom: i<arr.length-1 ? `1px solid ${T.border}` : "none" }}>
                  <div>
                    <div style={{ fontWeight:500, fontSize:14, color:T.text }}>{n.label}</div>
                    <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{n.desc}</div>
                  </div>
                  <div onClick={() => setNotifs(p=>({...p,[n.key]:!p[n.key]}))}
                    style={{ width:44, height:24, borderRadius:12, cursor:"pointer", position:"relative",
                      background: notifs[n.key] ? T.accent : T.bg3, transition:"background .2s" }}>
                    <div style={{ position:"absolute", top:3, left:3, width:18, height:18,
                      borderRadius:"50%", background:"#fff", transition:"transform .2s",
                      transform: notifs[n.key] ? "translateX(20px)" : "none",
                      boxShadow:"0 1px 4px rgba(0,0,0,.2)" }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop:20 }}>
                <Btn variant="green" onClick={() => toast("Preferences saved!")}>Save Preferences</Btn>
              </div>
            </>
          )}
          {(activeTab==="api"||activeTab==="billing"||activeTab==="security") && (
            <div style={{ textAlign:"center", padding:"60px 0" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>
                {activeTab==="api"?"🔑":activeTab==="billing"?"💳":"🔐"}
              </div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:20, fontWeight:700, color:T.text, marginBottom:8 }}>
                {activeTab==="api"?"API Key Management":activeTab==="billing"?"Billing & Plans":"Security Settings"}
              </div>
              <p style={{ color:T.muted2, marginBottom:24 }}>This section is ready for your backend integration.</p>
              <Btn variant="green" onClick={() => toast("Coming soon!")}>Coming Soon</Btn>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   ROOT APP
══════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [dark, setDark] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const { toasts, add: addToast, remove: removeToast } = useToast();

  const T = dark ? DARK : LIGHT;

  // Apply bg+color to body
  useEffect(() => {
    document.body.style.background = T.bg;
    document.body.style.color = T.text;
  }, [dark, T.bg, T.text]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const openAuth = (tab="login") => { setAuthTab(tab); setAuthOpen(true); };
  const toggle = () => setDark(d => !d);

  const renderPage = () => {
    switch(page) {
      case "dashboard":  return <Dashboard setPage={setPage} />;
      case "journal":    return <Journal toast={addToast} />;
      case "financials": return <Financials />;
      case "invoices":   return <Invoices toast={addToast} />;
      case "settings":   return <Settings toast={addToast} />;
      case "watchlist":  return <Watchlist />;
      default:           return <LandingPage onAuth={openAuth} setPage={setPage} />;
    }
  };

  return (
    <ThemeCtx.Provider value={{ dark, T, toggle }}>
      <div style={{ minHeight:"100vh", transition:"background .3s" }}>
        <NavFull page={page} setPage={setPage} onAuth={openAuth} />
        {renderPage()}
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
        <Toast toasts={toasts} remove={removeToast} />
      </div>
    </ThemeCtx.Provider>
  );
}
