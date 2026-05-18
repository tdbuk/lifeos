import { useState, useEffect, useMemo } from "react";

// ── PIN — change to your preferred PIN ───────────────────────────────────────
const APP_PIN = "2201";

// ── PIN Lock ──────────────────────────────────────────────────────────────────
function PinLock({ onUnlock }) {
  const [entered, setEntered] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleKey = (k) => {
    if (entered.length >= APP_PIN.length) return;
    const next = entered + k;
    setEntered(next);
    setError(false);
    if (next.length === APP_PIN.length) {
      if (next === APP_PIN) { setTimeout(() => onUnlock(), 200); }
      else { setShake(true); setError(true); setTimeout(() => { setEntered(""); setShake(false); }, 600); }
    }
  };
  const handleDel = () => { setEntered(e => e.slice(0, -1)); setError(false); };
  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#0F1117", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        .pin-btn { background:#161923; border:1px solid #2D3348; color:#E2E8F0; border-radius:50%; width:72px; height:72px; font-size:22px; font-weight:500; cursor:pointer; transition:background .15s; display:flex; align-items:center; justify-content:center; -webkit-tap-highlight-color:transparent; }
        .pin-btn:active { background:#6EE7B722; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
        .shake { animation:shake 0.5s ease; }
      `}</style>
      <div style={{ marginBottom:10 }}>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:28, fontWeight:500, color:"#6EE7B7" }}>LIFE<span style={{ color:"#E2E8F0" }}>OS</span></span>
      </div>
      <div style={{ fontSize:14, color:"#475569", marginBottom:32 }}>Enter your PIN</div>
      <div className={shake?"shake":""} style={{ display:"flex", gap:16, marginBottom:36 }}>
        {Array.from({ length:APP_PIN.length }).map((_,i) => (
          <div key={i} style={{ width:16, height:16, borderRadius:"50%", background:error?"#EF4444":i<entered.length?"#6EE7B7":"#2D3348", transition:"background .15s" }} />
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,72px)", gap:14 }}>
        {keys.map((k,i) => k===""?<div key={i}/>:k==="⌫"
          ?<button key={i} className="pin-btn" onClick={handleDel} style={{ fontSize:18, color:"#94A3B8" }}>⌫</button>
          :<button key={i} className="pin-btn" onClick={()=>handleKey(k)}>{k}</button>
        )}
      </div>
      {error && <div style={{ marginTop:24, fontSize:13, color:"#EF4444" }}>Incorrect PIN</div>}
    </div>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────
const DEFAULT_CATEGORIES = {
  personal:     { label:"Personal",         color:"#6EE7B7", icon:"◈", isWork:false, subcategories:["Hobbies & Interests","Administration","Personal Projects","Reading List","Audiobooks","Projects with Children"] },
  professional: { label:"Professional Dev", color:"#93C5FD", icon:"◉", isWork:true,  subcategories:["CPD","CIOB Attainment","RICS APC","Courses (Prince2 etc)","Networking","Conferences"] },
  health:       { label:"Health",           color:"#FCA5A5", icon:"◎", isWork:false, subcategories:["Exercise","Diet & Nutrition","Mental Health","Medical Appointments","Sleep","Wellbeing"] },
  companies:    { label:"Companies",        color:"#FCD34D", icon:"◆", isWork:true,  subcategories:["Active Projects","Open Items","Client Actions","Proposals","Financials","Admin"] },
};
const PRIORITY = { high:{label:"High",color:"#EF4444"}, medium:{label:"Med",color:"#F59E0B"}, low:{label:"Low",color:"#10B981"} };
const DAYS  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const ICON_OPTIONS  = ["◈","◉","◎","◆","◇","○","●","◐","▲","△","★","☆","♦","✦","❖","⬡","⬢","▣","▤","⊕"];
const COLOR_OPTIONS = ["#6EE7B7","#93C5FD","#FCA5A5","#FCD34D","#C4B5FD","#F9A8D4","#6EE7F7","#FBB26A","#A7F3D0","#BAE6FD","#DDD6FE","#FDE68A"];

const generateId = () => Math.random().toString(36).slice(2,9);
const todayStr   = () => new Date().toISOString().slice(0,10);
const isOverdue  = t => !t.done && t.dueDate && t.dueDate < todayStr();
const isDueToday = t => !t.done && t.dueDate === todayStr();
const isDueSoon  = t => { if (!t.dueDate||t.done) return false; const d=new Date(t.dueDate),n=new Date(todayStr()); return (d-n)/86400000<=3&&d>=n; };

const SAMPLE_TASKS = [
  { id:generateId(), title:"Read 'Atomic Habits'",                  category:"personal",     sub:"Reading List",          priority:"medium", done:false, dueDate:"2026-05-20", notes:"Chapter 5 onwards",    createdAt:Date.now() },
  { id:generateId(), title:"CIOB CPD log submission",               category:"professional", sub:"CIOB Attainment",       priority:"high",   done:false, dueDate:"2026-05-18", notes:"Log 20hrs minimum",    createdAt:Date.now() },
  { id:generateId(), title:"30-min morning run",                    category:"health",       sub:"Exercise",              priority:"medium", done:true,  dueDate:"2026-05-16", notes:"",                     createdAt:Date.now() },
  { id:generateId(), title:"Project Alpha – issue register review", category:"companies",    sub:"Active Projects",       priority:"high",   done:false, dueDate:"2026-05-17", notes:"Check Sections 4 & 7", createdAt:Date.now() },
  { id:generateId(), title:"Science fair project with kids",        category:"personal",     sub:"Projects with Children",priority:"medium", done:false, dueDate:"2026-05-25", notes:"Buy materials",        createdAt:Date.now() },
  { id:generateId(), title:"Book Prince2 Foundation exam",          category:"professional", sub:"Courses (Prince2 etc)", priority:"low",    done:false, dueDate:"2026-06-01", notes:"",                     createdAt:Date.now() },
  { id:generateId(), title:"GP check-up appointment",               category:"health",       sub:"Medical Appointments",  priority:"high",   done:false, dueDate:"2026-05-22", notes:"Annual blood work",    createdAt:Date.now() },
  { id:generateId(), title:"Client proposal – Riverside scheme",    category:"companies",    sub:"Proposals",             priority:"high",   done:false, dueDate:"2026-05-19", notes:"Final fee schedule",   createdAt:Date.now() },
  { id:generateId(), title:"Photography course research",           category:"personal",     sub:"Hobbies & Interests",   priority:"low",    done:false, dueDate:"2026-06-10", notes:"",                     createdAt:Date.now() },
  { id:generateId(), title:"RICS APC competency diary",             category:"professional", sub:"RICS APC",              priority:"high",   done:false, dueDate:"2026-05-30", notes:"Level 2 updates",      createdAt:Date.now() },
  { id:generateId(), title:"Weekly meal prep",                      category:"health",       sub:"Diet & Nutrition",      priority:"low",    done:false, dueDate:"2026-05-18", notes:"",                     createdAt:Date.now() },
  { id:generateId(), title:"Renew car insurance",                   category:"personal",     sub:"Administration",        priority:"medium", done:false, dueDate:"2026-05-28", notes:"Check comparison sites",createdAt:Date.now() },
];

// ── Global CSS ────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body { overscroll-behavior:none; }
  ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:#1A1D27; } ::-webkit-scrollbar-thumb { background:#334155; border-radius:2px; }
  input, select, textarea { background:#1A1D27; border:1.5px solid #2D3348; color:#E2E8F0; border-radius:10px; padding:10px 14px; font-family:inherit; font-size:15px; outline:none; width:100%; -webkit-appearance:none; }
  input:focus, select:focus, textarea:focus { border-color:#6EE7B7; }
  input[type=checkbox] { width:20px; height:20px; accent-color:#6EE7B7; cursor:pointer; flex-shrink:0; }
  select { background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%2394A3B8' d='M6 8L0 0h12z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:36px; }
  button { -webkit-tap-highlight-color:transparent; }
  .tappable { transition:opacity .15s; cursor:pointer; } .tappable:active { opacity:.7; }
  .modal-bg { position:fixed; inset:0; background:rgba(0,0,0,.8); display:flex; align-items:flex-end; justify-content:center; z-index:200; }
  @media(min-width:600px){ .modal-bg { align-items:center; } }
  .modal { background:#161923; border:1px solid #2D3348; border-radius:20px 20px 0 0; padding:24px; width:100%; max-width:600px; max-height:92vh; overflow-y:auto; }
  @media(min-width:600px){ .modal { border-radius:16px; } }
  .badge { display:inline-block; padding:2px 8px; border-radius:999px; font-size:11px; font-weight:600; }
  .sub-tag { display:inline-flex; align-items:center; gap:4px; padding:4px 12px; border-radius:999px; font-size:13px; margin:3px; }
  .sub-tag-del { background:none; border:none; cursor:pointer; color:inherit; opacity:.6; font-size:16px; line-height:1; padding:0 0 0 4px; }
  .color-swatch { width:28px; height:28px; border-radius:8px; cursor:pointer; border:2.5px solid transparent; transition:border-color .15s; flex-shrink:0; }
  .color-swatch.active { border-color:#fff; }
  .cat-card { background:#0F1117; border:1px solid #2D3348; border-radius:14px; padding:16px; margin-bottom:12px; }
  .task-card { background:#161923; border:1px solid #2D3348; border-radius:12px; padding:14px; margin-bottom:10px; transition:background .15s; }
  .task-card:active { background:#1E2231; }
  .chart-bar { transition:height .4s ease; border-radius:4px 4px 0 0; }
  .cal-cell { border-radius:8px; padding:4px; min-height:60px; }
  @media(min-width:480px){ .cal-cell { min-height:80px; } }
  .bottom-nav { position:fixed; bottom:0; left:0; right:0; background:#161923; border-top:1px solid #2D3348; display:flex; z-index:100; padding-bottom:env(safe-area-inset-bottom); }
  .nav-item { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:10px 4px 8px; gap:4px; cursor:pointer; border:none; background:none; -webkit-tap-highlight-color:transparent; transition:opacity .15s; }
  .nav-item:active { opacity:.6; }
  .nav-icon { font-size:20px; line-height:1; }
  .nav-label { font-size:10px; font-weight:500; letter-spacing:.02em; }
  .fab { position:fixed; bottom:80px; right:20px; width:56px; height:56px; border-radius:50%; background:#6EE7B7; color:#0F1117; border:none; font-size:28px; font-weight:300; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px #6EE7B744; z-index:99; -webkit-tap-highlight-color:transparent; transition:transform .15s; }
  .fab:active { transform:scale(.93); }
  @media(min-width:768px){
    .bottom-nav { display:none; }
    .fab { display:none; }
    .desktop-header { display:flex !important; }
    .main-content { padding-bottom:24px !important; }
  }
  .desktop-header { display:none; }
  @media(min-width:768px){ .desktop-header { display:flex; } }
`;

// ── Main App ──────────────────────────────────────────────────────────────────
export default function LifeDashboard() {
  const [unlocked, setUnlocked] = useState(false);
  const [categories, setCategories] = useState(() => { try { const s=localStorage.getItem("ltd_cats"); return s?JSON.parse(s):DEFAULT_CATEGORIES; } catch { return DEFAULT_CATEGORIES; } });
  const [tasks,      setTasks]      = useState(() => { try { const s=localStorage.getItem("ltd_tasks"); return s?JSON.parse(s):SAMPLE_TASKS;     } catch { return SAMPLE_TASKS;     } });
  const [view,           setView]           = useState("dashboard");
  const [modeFilter,     setModeFilter]     = useState("all");
  const [catFilter,      setCatFilter]      = useState("all");
  const [subFilter,      setSubFilter]      = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showDone,       setShowDone]       = useState(false);
  const [showForm,       setShowForm]       = useState(false);
  const [editTask,       setEditTask]       = useState(null);
  const [showCatMgr,     setShowCatMgr]     = useState(false);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear,  setCalYear]  = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");

  useEffect(() => { try { localStorage.setItem("ltd_tasks", JSON.stringify(tasks));      } catch {} }, [tasks]);
  useEffect(() => { try { localStorage.setItem("ltd_cats",  JSON.stringify(categories)); } catch {} }, [categories]);

  const workCatKeys = useMemo(() => Object.entries(categories).filter(([,v])=>v.isWork).map(([k])=>k), [categories]);

  const modeVisible = useMemo(() => {
    if (modeFilter==="personal") return tasks.filter(t=>!workCatKeys.includes(t.category));
    if (modeFilter==="work")     return tasks.filter(t=> workCatKeys.includes(t.category));
    return tasks;
  }, [tasks, modeFilter, workCatKeys]);

  const filtered = useMemo(() => {
    let list = modeVisible;
    if (catFilter!=="all")      list = list.filter(t=>t.category===catFilter);
    if (subFilter!=="all")      list = list.filter(t=>t.sub===subFilter);
    if (priorityFilter!=="all") list = list.filter(t=>t.priority===priorityFilter);
    if (!showDone)              list = list.filter(t=>!t.done);
    if (search.trim())          list = list.filter(t=>t.title.toLowerCase().includes(search.toLowerCase())||t.notes?.toLowerCase().includes(search.toLowerCase()));
    return list.sort((a,b) => {
      if (a.done!==b.done) return a.done?1:-1;
      const pd={high:0,medium:1,low:2};
      if (pd[a.priority]!==pd[b.priority]) return pd[a.priority]-pd[b.priority];
      return (a.dueDate||"9999")<(b.dueDate||"9999")?-1:1;
    });
  }, [modeVisible, catFilter, subFilter, priorityFilter, showDone, search]);

  const toggleDone = id => setTasks(ts=>ts.map(t=>t.id===id?{...t,done:!t.done}:t));
  const deleteTask = id => setTasks(ts=>ts.filter(t=>t.id!==id));
  const saveTask   = task => {
    if (task.id && tasks.find(t=>t.id===task.id)) setTasks(ts=>ts.map(t=>t.id===task.id?task:t));
    else setTasks(ts=>[...ts,{...task,id:generateId(),createdAt:Date.now()}]);
    setShowForm(false); setEditTask(null);
  };

  const handleUnlock = () => setUnlocked(true);
  if (!unlocked) return <PinLock onUnlock={handleUnlock} />;

  const openEdit = t => { setEditTask(t); setShowForm(true); };
  const subs = catFilter!=="all" ? categories[catFilter]?.subcategories||[] : [];

  // Bottom nav items
  const NAV = [
    { id:"dashboard", icon:"⊞",  label:"Home"     },
    { id:"list",      icon:"☰",  label:"Tasks"    },
    { id:"calendar",  icon:"◫",  label:"Calendar" },
    { id:"charts",    icon:"▦",  label:"Charts"   },
  ];

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#0F1117", minHeight:"100vh", color:"#E2E8F0" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── Desktop Header (hidden on mobile) ── */}
      <div className="desktop-header" style={{ background:"#161923", borderBottom:"1px solid #2D3348", padding:"0 24px", alignItems:"center", justifyContent:"space-between", height:60, position:"sticky", top:0, zIndex:50, gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:18, fontWeight:500, color:"#6EE7B7" }}>LIFE<span style={{ color:"#E2E8F0" }}>OS</span></span>
          <div style={{ display:"flex", gap:4 }}>
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>setView(n.id)} style={{ background:view===n.id?"#6EE7B7":"transparent", color:view===n.id?"#0F1117":"#94A3B8", border:view===n.id?"1.5px solid #6EE7B7":"1.5px solid #2D3348", borderRadius:20, padding:"4px 14px", fontSize:13, fontWeight:500, cursor:"pointer" }}>{n.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <ModeToggle modeFilter={modeFilter} setModeFilter={setModeFilter} />
          <button onClick={()=>setShowCatMgr(true)} style={{ background:"#1E2231", color:"#94A3B8", border:"1px solid #2D3348", borderRadius:8, padding:"7px 14px", fontSize:13, fontWeight:500, cursor:"pointer" }}>⚙ Categories</button>
          <button onClick={()=>{ setEditTask(null); setShowForm(true); }} style={{ background:"#6EE7B7", color:"#0F1117", border:"none", borderRadius:8, padding:"7px 18px", fontWeight:600, fontSize:14, cursor:"pointer" }}>+ Add Task</button>
        </div>
      </div>

      {/* ── Mobile Top Bar ── */}
      <div style={{ background:"#161923", borderBottom:"1px solid #2D3348", padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }} className="mobile-topbar">
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:20, fontWeight:500, color:"#6EE7B7" }}>LIFE<span style={{ color:"#E2E8F0" }}>OS</span></span>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <ModeToggle modeFilter={modeFilter} setModeFilter={setModeFilter} compact />
          <button onClick={()=>setShowCatMgr(true)} style={{ background:"#1E2231", color:"#94A3B8", border:"1px solid #2D3348", borderRadius:8, padding:"7px 10px", fontSize:13, cursor:"pointer" }}>⚙</button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="main-content" style={{ padding:"16px", maxWidth:1400, margin:"0 auto", paddingBottom:100 }}>
        {view==="dashboard" && <DashboardView tasks={modeVisible} categories={categories} onEdit={openEdit} onToggle={toggleDone} onDelete={deleteTask} setView={setView} />}
        {view==="list" && (
          <div>
            {/* Mobile-friendly filter bar */}
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
              <input placeholder="🔍 Search tasks…" value={search} onChange={e=>setSearch(e.target.value)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <select value={catFilter} onChange={e=>{ setCatFilter(e.target.value); setSubFilter("all"); }}>
                  <option value="all">All Categories</option>
                  {Object.entries(categories).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
                </select>
                <select value={priorityFilter} onChange={e=>setPriorityFilter(e.target.value)}>
                  <option value="all">All Priorities</option>
                  {Object.entries(PRIORITY).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              {subs.length>0 && (
                <select value={subFilter} onChange={e=>setSubFilter(e.target.value)}>
                  <option value="all">All Sub-categories</option>
                  {subs.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              )}
              <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, color:"#94A3B8", cursor:"pointer" }}>
                <input type="checkbox" checked={showDone} onChange={e=>setShowDone(e.target.checked)} style={{ width:18, height:18 }} />
                Show completed tasks
              </label>
            </div>
            <TaskList tasks={filtered} categories={categories} onEdit={openEdit} onToggle={toggleDone} onDelete={deleteTask} />
          </div>
        )}
        {view==="calendar" && <CalendarView tasks={modeVisible} categories={categories} month={calMonth} year={calYear} setMonth={setCalMonth} setYear={setCalYear} />}
        {view==="charts"   && <ChartsView   tasks={modeVisible} categories={categories} />}
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="bottom-nav">
        {NAV.map(n=>(
          <button key={n.id} className="nav-item" onClick={()=>setView(n.id)}>
            <span className="nav-icon" style={{ color:view===n.id?"#6EE7B7":"#475569" }}>{n.icon}</span>
            <span className="nav-label" style={{ color:view===n.id?"#6EE7B7":"#475569" }}>{n.label}</span>
          </button>
        ))}
      </nav>

      {/* ── FAB (mobile add button) ── */}
      <button className="fab" onClick={()=>{ setEditTask(null); setShowForm(true); }}>+</button>

      {showForm   && <TaskForm       task={editTask}  categories={categories} onSave={saveTask} onClose={()=>{ setShowForm(false); setEditTask(null); }} />}
      {showCatMgr && <CategoryManager categories={categories} tasks={tasks} onSave={cats=>{ setCategories(cats); setShowCatMgr(false); }} onClose={()=>setShowCatMgr(false)} />}
    </div>
  );
}

// ── Mode Toggle ───────────────────────────────────────────────────────────────
function ModeToggle({ modeFilter, setModeFilter, compact }) {
  return (
    <div style={{ display:"flex", gap:2, background:"#0F1117", borderRadius:20, padding:3, border:"1px solid #2D3348" }}>
      {[["all","All"],["personal",compact?"P":"Personal"],["work",compact?"W":"Work"]].map(([m,l])=>(
        <button key={m} onClick={()=>setModeFilter(m)} style={{ borderRadius:16, padding:compact?"4px 8px":"4px 12px", fontSize:12, fontWeight:500, background:modeFilter===m?(m==="personal"?"#6EE7B7":m==="work"?"#93C5FD":"#334155"):"transparent", color:modeFilter===m?"#0F1117":"#94A3B8", border:"none", cursor:"pointer" }}>{l}</button>
      ))}
    </div>
  );
}

// ── Dashboard View ────────────────────────────────────────────────────────────
function DashboardView({ tasks, categories, onToggle, onEdit, setView }) {
  const overdue  = tasks.filter(isOverdue);
  const dueToday = tasks.filter(isDueToday);
  const done     = tasks.filter(t=>t.done);

  return (
    <div>
      {/* Stats — 2-col on mobile, 4-col on desktop */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        {[
          { label:"Total Tasks", value:tasks.length,  color:"#6EE7B7", sub:`${done.length} done`     },
          { label:"Overdue",     value:overdue.length, color:"#EF4444", sub:"Need attention"          },
          { label:"Due Today",   value:dueToday.length,color:"#F59E0B", sub:"On your plate"           },
          { label:"Due Soon",    value:tasks.filter(t=>isDueSoon(t)&&!isDueToday(t)).length, color:"#93C5FD", sub:"Within 3 days" },
        ].map(s=>(
          <div key={s.label} style={{ background:"#161923", border:"1px solid #2D3348", borderRadius:12, padding:"14px 16px", borderTop:`3px solid ${s.color}` }}>
            <div style={{ fontSize:28, fontWeight:700, color:s.color, fontFamily:"'DM Mono',monospace", lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:13, fontWeight:500, color:"#E2E8F0", marginTop:4 }}>{s.label}</div>
            <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Action Required */}
      {(overdue.length+dueToday.length)>0 && (
        <div style={{ background:"#161923", border:"1px solid #2D3348", borderRadius:14, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:600, color:"#64748B", letterSpacing:"0.08em", marginBottom:12, textTransform:"uppercase" }}>Action Required</div>
          {[...overdue.slice(0,4).map(t=>({...t,_tag:"OVERDUE"})),...dueToday.slice(0,4).map(t=>({...t,_tag:"TODAY"}))].slice(0,6).map(t=>(
            <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }} onClick={()=>onEdit(t)}>
              <span className="badge" style={{ background:t._tag==="OVERDUE"?"#7F1D1D":"#78350F", color:t._tag==="OVERDUE"?"#FCA5A5":"#FDE68A", flexShrink:0 }}>{t._tag}</span>
              <span style={{ flex:1, fontSize:14, color:"#CBD5E1", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</span>
              <span style={{ color:categories[t.category]?.color, flexShrink:0 }}>{categories[t.category]?.icon}</span>
            </div>
          ))}
        </div>
      )}

      {/* Category progress */}
      <div style={{ background:"#161923", border:"1px solid #2D3348", borderRadius:14, padding:16, marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:600, color:"#64748B", letterSpacing:"0.08em", marginBottom:14, textTransform:"uppercase" }}>By Category</div>
        {Object.entries(categories).map(([k,cat])=>{
          const all=tasks.filter(t=>t.category===k);
          const openN=all.filter(t=>!t.done).length;
          const pct=all.length>0?Math.round(all.filter(t=>t.done).length/all.length*100):0;
          return (
            <div key={k} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:14, color:"#CBD5E1" }}><span style={{ color:cat.color }}>{cat.icon}</span> {cat.label}</span>
                <span style={{ fontSize:12, color:"#64748B" }}>{openN} open · {pct}%</span>
              </div>
              <div style={{ background:"#0F1117", borderRadius:4, height:6 }}>
                <div style={{ background:cat.color, width:`${pct}%`, height:"100%", borderRadius:4, transition:"width .5s" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Category lanes — single col on mobile */}
      {Object.entries(categories).map(([k,cat])=>{
        const catTasks=tasks.filter(t=>t.category===k&&!t.done).slice(0,5);
        return (
          <div key={k} style={{ background:"#161923", border:"1px solid #2D3348", borderRadius:14, overflow:"hidden", marginBottom:12 }}>
            <div style={{ padding:"12px 16px", borderBottom:"1px solid #2D3348", background:`linear-gradient(90deg,${cat.color}18,transparent)` }}>
              <span style={{ fontSize:14, fontWeight:600, color:cat.color }}>{cat.icon} {cat.label}</span>
            </div>
            <div style={{ padding:"8px 12px" }}>
              {catTasks.length===0&&<div style={{ fontSize:13, color:"#475569", padding:"6px 0" }}>No open tasks</div>}
              {catTasks.map(t=>(
                <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 4px", borderBottom:"1px solid #1A1D27" }}>
                  <input type="checkbox" checked={t.done} onChange={()=>onToggle(t.id)} />
                  <div style={{ flex:1, minWidth:0 }} onClick={()=>onEdit(t)}>
                    <div style={{ fontSize:14, color:isOverdue(t)?"#FCA5A5":"#CBD5E1", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</div>
                    <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{t.sub}{t.dueDate?" · "+t.dueDate.slice(5).replace("-","/"):""}</div>
                  </div>
                  <PriorityDot p={t.priority} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Task List (card-based for mobile) ─────────────────────────────────────────
function TaskList({ tasks, categories, onToggle, onEdit, onDelete }) {
  if (!tasks.length) return <div style={{ textAlign:"center", padding:"60px 20px", color:"#475569" }}>No tasks match your filters.</div>;
  return (
    <div>
      {tasks.map(t=>{
        const cat=categories[t.category];
        return (
          <div key={t.id} className="task-card">
            <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
              <input type="checkbox" checked={t.done} onChange={()=>onToggle(t.id)} style={{ marginTop:2 }} />
              <div style={{ flex:1, minWidth:0 }} onClick={()=>onEdit(t)}>
                <div style={{ fontSize:15, color:t.done?"#475569":isOverdue(t)?"#FCA5A5":"#E2E8F0", textDecoration:t.done?"line-through":"none", marginBottom:4 }}>{t.title}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                  {cat && <span style={{ fontSize:12, color:cat.color }}>{cat.icon} {cat.label}</span>}
                  {t.sub && <span style={{ fontSize:11, color:"#475569" }}>· {t.sub}</span>}
                  {t.dueDate && <span style={{ fontSize:11, color:isOverdue(t)?"#EF4444":isDueToday(t)?"#F59E0B":"#475569", fontFamily:"monospace" }}>· {t.dueDate.slice(5).replace("-","/")} {isOverdue(t)?"⚠":isDueToday(t)?"●":""}</span>}
                </div>
                {t.notes && <div style={{ fontSize:12, color:"#475569", marginTop:4 }}>{t.notes.slice(0,80)}{t.notes.length>80?"…":""}</div>}
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
                <PriorityDot p={t.priority} label />
                <button onClick={()=>onDelete(t.id)} style={{ background:"none", border:"none", color:"#EF444488", fontSize:20, cursor:"pointer", lineHeight:1 }}>×</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Calendar View ─────────────────────────────────────────────────────────────
function CalendarView({ tasks, categories, month, year, setMonth, setYear }) {
  const firstDay    = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const cells       = Array(firstDay).fill(null).concat(Array.from({length:daysInMonth},(_,i)=>i+1));

  const tasksByDate = useMemo(()=>{
    const map={};
    tasks.filter(t=>t.dueDate).forEach(t=>{ if(!map[t.dueDate])map[t.dueDate]=[]; map[t.dueDate].push(t); });
    return map;
  },[tasks]);

  const prev=()=>{ if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const next=()=>{ if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); };
  const ts=todayStr();

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <button onClick={prev} style={{ background:"#161923", border:"1px solid #2D3348", color:"#E2E8F0", borderRadius:10, padding:"8px 16px", fontSize:16, cursor:"pointer" }}>‹</button>
        <span style={{ fontSize:17, fontWeight:600, color:"#E2E8F0" }}>{MONTHS[month]} {year}</span>
        <button onClick={next} style={{ background:"#161923", border:"1px solid #2D3348", color:"#E2E8F0", borderRadius:10, padding:"8px 16px", fontSize:16, cursor:"pointer" }}>›</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
        {DAYS.map(d=><div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:600, color:"#475569", padding:"4px 0", textTransform:"uppercase" }}>{d[0]}</div>)}
        {cells.map((day,i)=>{
          if(!day) return <div key={i}/>;
          const ds=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const dt=tasksByDate[ds]||[];
          const isT=ds===ts;
          return (
            <div key={i} className="cal-cell" style={{ background:isT?"#1E3A2F":"#161923", border:isT?"1.5px solid #6EE7B7":"1px solid #2D3348", borderRadius:8 }}>
              <div style={{ fontSize:12, fontWeight:isT?700:400, color:isT?"#6EE7B7":"#64748B", marginBottom:2 }}>{day}</div>
              {dt.slice(0,2).map(t=>{ const c=categories[t.category]; return <div key={t.id} style={{ fontSize:9, padding:"1px 3px", borderRadius:3, background:`${c?.color??"#6EE7B7"}22`, color:c?.color??"#6EE7B7", marginBottom:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</div>; })}
              {dt.length>2&&<div style={{ fontSize:9, color:"#475569" }}>+{dt.length-2}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Charts View ───────────────────────────────────────────────────────────────
function ChartsView({ tasks, categories }) {
  const open=tasks.filter(t=>!t.done);
  const done=tasks.filter(t=>t.done);
  const pct=tasks.length>0?Math.round(done.length/tasks.length*100):0;

  const byCat=Object.entries(categories).map(([k,cat])=>({ k,cat,open:open.filter(t=>t.category===k).length,done:done.filter(t=>t.category===k).length }));
  const maxCat=Math.max(...byCat.map(b=>b.open+b.done),1);
  const byPri=Object.entries(PRIORITY).map(([k,p])=>({ k,p,count:open.filter(t=>t.priority===k).length }));
  const maxPri=Math.max(...byPri.map(b=>b.count),1);
  const next7=Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()+i); const s=d.toISOString().slice(0,10); return {date:s,label:i===0?"Today":DAYS[d.getDay()],count:tasks.filter(t=>t.dueDate===s&&!t.done).length}; });
  const maxDay=Math.max(...next7.map(d=>d.count),1);

  const BarChart=({data,maxVal,colorFn,h=120})=>(
    <div style={{display:"flex",alignItems:"flex-end",gap:6,height:h,paddingTop:8}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
          <span style={{fontSize:10,color:"#64748B",fontFamily:"monospace"}}>{d.count??(d.open+d.done)}</span>
          <div style={{width:"100%",display:"flex",flexDirection:"column",gap:2,alignItems:"center"}}>
            {d.open!==undefined&&<><div className="chart-bar" style={{width:"75%",height:Math.max(3,(d.open/maxVal)*(h-30)),background:colorFn?colorFn(d):"#6EE7B7"}}/><div className="chart-bar" style={{width:"75%",height:Math.max(2,(d.done/maxVal)*(h-30)),background:"#334155"}}/></>}
            {d.count!==undefined&&<div className="chart-bar" style={{width:"75%",height:Math.max(3,(d.count/maxVal)*(h-30)),background:colorFn?colorFn(d):"#93C5FD"}}/>}
          </div>
          <span style={{fontSize:9,color:"#475569",textAlign:"center",lineHeight:1.2}}>{d.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Completion */}
      <div style={{ background:"#161923", border:"1px solid #2D3348", borderRadius:14, padding:20, display:"flex", alignItems:"center", gap:20 }}>
        <div style={{ position:"relative", flexShrink:0 }}>
          <svg width={110} height={110} style={{ transform:"rotate(-90deg)" }}>
            <circle cx={55} cy={55} r={42} fill="none" stroke="#1E2231" strokeWidth={13}/>
            <circle cx={55} cy={55} r={42} fill="none" stroke="#6EE7B7" strokeWidth={13} strokeDasharray={`${2*Math.PI*42*pct/100} ${2*Math.PI*42*(1-pct/100)}`} strokeLinecap="round"/>
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", transform:"rotate(0deg)" }}>
            <span style={{ fontSize:22, fontWeight:700, color:"#6EE7B7", fontFamily:"monospace" }}>{pct}%</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:600, color:"#E2E8F0", marginBottom:8 }}>Overall Completion</div>
          <div style={{ fontSize:14, color:"#94A3B8" }}><b style={{ color:"#6EE7B7" }}>{done.length}</b> completed</div>
          <div style={{ fontSize:14, color:"#94A3B8" }}><b style={{ color:"#EF4444" }}>{open.length}</b> remaining</div>
        </div>
      </div>

      <div style={{ background:"#161923", border:"1px solid #2D3348", borderRadius:14, padding:16 }}>
        <div style={{ fontSize:12, fontWeight:600, color:"#64748B", letterSpacing:"0.08em", marginBottom:4, textTransform:"uppercase" }}>By Category</div>
        <div style={{ fontSize:11, color:"#334155", marginBottom:8 }}>
          <span style={{ display:"inline-block",width:10,height:10,borderRadius:2,background:"#6EE7B7",marginRight:4,verticalAlign:"middle"}}/>open
          <span style={{ display:"inline-block",width:10,height:10,borderRadius:2,background:"#334155",marginLeft:10,marginRight:4,verticalAlign:"middle"}}/>done
        </div>
        <BarChart data={byCat.map(b=>({...b,label:b.cat.label.slice(0,6)}))} maxVal={maxCat} colorFn={d=>d.cat.color}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div style={{ background:"#161923", border:"1px solid #2D3348", borderRadius:14, padding:16 }}>
          <div style={{ fontSize:12, fontWeight:600, color:"#64748B", letterSpacing:"0.08em", marginBottom:12, textTransform:"uppercase" }}>Priority</div>
          <BarChart data={byPri.map(b=>({...b,label:b.p.label}))} maxVal={maxPri} colorFn={d=>d.p.color}/>
        </div>
        <div style={{ background:"#161923", border:"1px solid #2D3348", borderRadius:14, padding:16 }}>
          <div style={{ fontSize:12, fontWeight:600, color:"#64748B", letterSpacing:"0.08em", marginBottom:12, textTransform:"uppercase" }}>Next 7 Days</div>
          <BarChart data={next7} maxVal={maxDay} colorFn={d=>d.date===todayStr()?"#F59E0B":"#93C5FD"}/>
        </div>
      </div>
    </div>
  );
}

// ── Category Manager ──────────────────────────────────────────────────────────
function CategoryManager({ categories, tasks, onSave, onClose }) {
  const [cats, setCats] = useState(()=>JSON.parse(JSON.stringify(categories)));
  const [newName, setNewName] = useState("");
  const [confirmDel, setConfirmDel] = useState(null);

  const updateCat    = (key,field,val) => setCats(c=>({...c,[key]:{...c[key],[field]:val}}));
  const addSubcat    = (key,val) => { const v=val.trim(); if(!v||cats[key].subcategories.includes(v))return; setCats(c=>({...c,[key]:{...c[key],subcategories:[...c[key].subcategories,v]}})); };
  const removeSubcat = (key,sub) => setCats(c=>({...c,[key]:{...c[key],subcategories:c[key].subcategories.filter(s=>s!==sub)}}));

  const addCategory = () => {
    const name=newName.trim(); if(!name)return;
    const key=name.toLowerCase().replace(/[^a-z0-9]/g,"_")+"_"+generateId();
    setCats(c=>({...c,[key]:{label:name,color:COLOR_OPTIONS[Math.floor(Math.random()*COLOR_OPTIONS.length)],icon:ICON_OPTIONS[Math.floor(Math.random()*ICON_OPTIONS.length)],isWork:false,subcategories:[]}}));
    setNewName("");
  };

  const tryDelete=(key)=>{ const count=tasks.filter(t=>t.category===key).length; if(count>0){setConfirmDel({key,count});return;} setCats(c=>{const n={...c};delete n[key];return n;}); };
  const forceDelete=(key)=>{ setCats(c=>{const n={...c};delete n[key];return n;}); setConfirmDel(null); };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div style={{ fontSize:17, fontWeight:600, color:"#E2E8F0" }}>⚙ Manage Categories</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#94A3B8", fontSize:24, cursor:"pointer", lineHeight:1 }}>×</button>
        </div>
        <div style={{ fontSize:13, color:"#475569", marginBottom:16 }}>Add, rename, recolour or delete categories and sub-categories.</div>
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="New category name…" onKeyDown={e=>e.key==="Enter"&&addCategory()} />
          <button onClick={addCategory} style={{ background:"#6EE7B7", color:"#0F1117", border:"none", borderRadius:10, padding:"10px 18px", fontWeight:600, fontSize:15, cursor:"pointer", flexShrink:0 }}>Add</button>
        </div>
        {Object.entries(cats).map(([key,cat])=>(
          <CatCard key={key} catKey={key} cat={cat} taskCount={tasks.filter(t=>t.category===key).length}
            onUpdate={(f,v)=>updateCat(key,f,v)} onAddSub={v=>addSubcat(key,v)} onRemoveSub={sub=>removeSubcat(key,sub)} onDelete={()=>tryDelete(key)} />
        ))}
        {confirmDel&&(
          <div style={{ background:"#1A0A0A", border:"1px solid #EF4444", borderRadius:12, padding:16, marginTop:8 }}>
            <div style={{ color:"#FCA5A5", fontWeight:600, marginBottom:6 }}>⚠ {confirmDel.count} task{confirmDel.count!==1?"s are":" is"} in this category.</div>
            <div style={{ fontSize:13, color:"#94A3B8", marginBottom:12 }}>Tasks will be kept but lose category assignment.</div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setConfirmDel(null)} style={{ background:"transparent", color:"#94A3B8", border:"1.5px solid #2D3348", borderRadius:20, padding:"6px 16px", cursor:"pointer" }}>Cancel</button>
              <button onClick={()=>forceDelete(confirmDel.key)} style={{ background:"#EF4444", color:"#fff", border:"none", borderRadius:20, padding:"6px 16px", fontWeight:600, cursor:"pointer" }}>Delete anyway</button>
            </div>
          </div>
        )}
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20, paddingTop:16, borderTop:"1px solid #2D3348" }}>
          <button onClick={onClose} style={{ background:"transparent", color:"#94A3B8", border:"1.5px solid #2D3348", borderRadius:20, padding:"8px 18px", cursor:"pointer" }}>Cancel</button>
          <button onClick={()=>onSave(cats)} style={{ background:"#6EE7B7", color:"#0F1117", border:"none", borderRadius:20, padding:"8px 22px", fontWeight:600, fontSize:15, cursor:"pointer" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function CatCard({ cat, taskCount, onUpdate, onAddSub, onRemoveSub, onDelete }) {
  const [newSub,setNewSub]=useState("");
  const [open,setOpen]=useState(false);
  return (
    <div className="cat-card" style={{ borderLeft:`3px solid ${cat.color}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <select value={cat.icon} onChange={e=>onUpdate("icon",e.target.value)} style={{ background:`${cat.color}22`, border:"none", color:cat.color, fontSize:18, padding:"4px", borderRadius:8, cursor:"pointer", width:42, flexShrink:0 }}>
          {ICON_OPTIONS.map(ic=><option key={ic} value={ic}>{ic}</option>)}
        </select>
        <input value={cat.label} onChange={e=>onUpdate("label",e.target.value)} style={{ flex:1, background:"transparent", border:"none", borderBottom:"1.5px solid #2D3348", fontSize:15, fontWeight:600, color:"#E2E8F0", padding:"4px 0", borderRadius:0 }} />
        <label style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#94A3B8", cursor:"pointer", flexShrink:0 }}>
          <input type="checkbox" checked={cat.isWork||false} onChange={e=>onUpdate("isWork",e.target.checked)} style={{ width:16, height:16 }} /> Work
        </label>
        <span style={{ fontSize:11, color:"#475569", flexShrink:0 }}>{taskCount}</span>
        <button onClick={()=>setOpen(o=>!o)} style={{ background:"none", border:"none", color:"#64748B", fontSize:16, cursor:"pointer", flexShrink:0 }}>{open?"▲":"▼"}</button>
        <button onClick={onDelete} style={{ background:"none", border:"none", color:"#EF4444", fontSize:22, cursor:"pointer", flexShrink:0, lineHeight:1 }}>×</button>
      </div>
      {open&&(
        <div style={{ marginTop:14 }}>
          <div style={{ fontSize:11, color:"#64748B", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>Colour</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", marginBottom:14 }}>
            {COLOR_OPTIONS.map(c=><div key={c} className={`color-swatch${cat.color===c?" active":""}`} onClick={()=>onUpdate("color",c)} style={{ background:c }}/>)}
            <input type="color" value={cat.color} onChange={e=>onUpdate("color",e.target.value)} style={{ width:30, height:30, padding:2, border:"1.5px solid #2D3348", borderRadius:6, cursor:"pointer", background:"#0F1117" }}/>
          </div>
          <div style={{ fontSize:11, color:"#64748B", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>Sub-categories</div>
          <div style={{ display:"flex", flexWrap:"wrap", marginBottom:10 }}>
            {cat.subcategories.length===0&&<span style={{ fontSize:12, color:"#475569" }}>None yet</span>}
            {cat.subcategories.map(sub=><span key={sub} className="sub-tag" style={{ background:`${cat.color}22`, color:cat.color, border:`1px solid ${cat.color}44` }}>{sub}<button className="sub-tag-del" onClick={()=>onRemoveSub(sub)}>×</button></span>)}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <input value={newSub} onChange={e=>setNewSub(e.target.value)} placeholder="Add sub-category…" onKeyDown={e=>{ if(e.key==="Enter"){onAddSub(newSub);setNewSub("");} }} style={{ fontSize:14 }}/>
            <button onClick={()=>{ onAddSub(newSub); setNewSub(""); }} style={{ background:`${cat.color}33`, color:cat.color, border:`1.5px solid ${cat.color}55`, borderRadius:10, padding:"8px 16px", cursor:"pointer", flexShrink:0, fontWeight:500 }}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Task Form ─────────────────────────────────────────────────────────────────
function TaskForm({ task, categories, onSave, onClose }) {
  const firstCat=Object.keys(categories)[0]||"personal";
  const [form,setForm]=useState(task??{title:"",category:firstCat,sub:categories[firstCat]?.subcategories[0]||"",priority:"medium",dueDate:"",notes:"",done:false});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const subs=categories[form.category]?.subcategories||[];
  useEffect(()=>{ if(!subs.includes(form.sub))set("sub",subs[0]||""); },[form.category]);

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontSize:17, fontWeight:600, color:"#E2E8F0" }}>{task?"Edit Task":"New Task"}</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#94A3B8", fontSize:24, cursor:"pointer", lineHeight:1 }}>×</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={{ fontSize:12, color:"#64748B", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>Title *</label>
            <input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="What needs to be done?" />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={{ fontSize:12, color:"#64748B", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>Category</label>
              <select value={form.category} onChange={e=>set("category",e.target.value)}>
                {Object.entries(categories).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, color:"#64748B", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>Sub-category</label>
              <select value={form.sub} onChange={e=>set("sub",e.target.value)}>
                {subs.length===0&&<option value="">None</option>}
                {subs.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={{ fontSize:12, color:"#64748B", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>Priority</label>
              <select value={form.priority} onChange={e=>set("priority",e.target.value)}>
                {Object.entries(PRIORITY).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, color:"#64748B", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>Due Date</label>
              <input type="date" style={{ colorScheme:"dark" }} value={form.dueDate} onChange={e=>set("dueDate",e.target.value)}/>
            </div>
          </div>
          <div>
            <label style={{ fontSize:12, color:"#64748B", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>Notes</label>
            <textarea style={{ minHeight:80, resize:"vertical" }} value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Additional notes…"/>
          </div>
          {task&&(
            <label style={{ display:"flex", alignItems:"center", gap:10, fontSize:14, color:"#94A3B8", cursor:"pointer" }}>
              <input type="checkbox" checked={form.done} onChange={e=>set("done",e.target.checked)}/> Mark as completed
            </label>
          )}
          <button onClick={()=>{ if(form.title.trim()) onSave(form); }} style={{ background:"#6EE7B7", color:"#0F1117", border:"none", borderRadius:12, padding:"14px", fontWeight:600, fontSize:16, cursor:"pointer", marginTop:4 }}>
            {task?"Save Changes":"Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Priority Dot ──────────────────────────────────────────────────────────────
function PriorityDot({ p, label }) {
  const c=PRIORITY[p];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>
      <span style={{ width:8, height:8, borderRadius:"50%", background:c?.color, display:"inline-block", flexShrink:0 }}/>
      {label&&<span style={{ fontSize:11, color:c?.color }}>{c?.label}</span>}
    </span>
  );
}