import { Activity, Bell, Search, ChevronDown } from "lucide-react";
import { personas } from "../data/seed.js";

export default function Header({ persona, setPersona, screen, setScreen, agentOpen, setAgentOpen, pendingApprovals }) {
  const screens = [
    { id: "S1", label: "Cross-functional", subtitle: "Network performance" },
    { id: "S2", label: "Persona", subtitle: "My accountable KPIs" },
    { id: "S3", label: "Order / Batch", subtitle: "Execution detail" },
    { id: "POL", label: "Autonomy & Policy", subtitle: "Levels, blast radius, rollback" },
    { id: "PB", label: "Playbooks", subtitle: "Versioned action sequences" },
    { id: "OBS", label: "Control Plane", subtitle: "Agent observability" },
    { id: "AUD", label: "Audit", subtitle: "Compliance & access" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/70 glass">
      <div className="flex items-center gap-4 px-5 py-3">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-400 to-accent-700 grid place-items-center shadow-soft">
            <Activity size={18} className="text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold text-white tracking-tight">ATSC Operations Command Center</div>
            <div className="text-[10.5px] text-ink-400 font-medium tracking-wide uppercase">v2.0 — Agentic execution edition</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 ml-2 overflow-x-auto no-scrollbar">
          {screens.map((s) => (
            <button
              key={s.id}
              onClick={() => setScreen(s.id)}
              className={`group px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-all ${
                screen === s.id
                  ? "bg-accent-600/15 text-accent-300 ring-1 ring-accent-500/40"
                  : "text-ink-300 hover:text-white hover:bg-ink-800"
              }`}
              title={s.subtitle}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-ink-800/70 border border-ink-700 text-[12.5px] text-ink-300 w-72">
          <Search size={14} />
          <span className="opacity-70">Search orders, lots, exceptions…</span>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-ink-700 text-ink-300">⌘ K</span>
        </div>

        <PersonaSwitcher persona={persona} setPersona={setPersona} />

        <button
          onClick={() => setAgentOpen((v) => !v)}
          className={`relative h-9 px-3 rounded-md text-[12.5px] font-medium transition-all flex items-center gap-2 ${
            agentOpen ? "bg-accent-600/20 text-accent-200 ring-1 ring-accent-500/40" : "bg-ink-800 hover:bg-ink-700 text-ink-100"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-ok-500 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ok-500"></span>
          </span>
          AI Agent
          {pendingApprovals > 0 && (
            <span className="ml-1 text-[10px] font-semibold rounded-full bg-warn-500/20 text-warn-500 px-1.5 py-0.5">
              {pendingApprovals} pending
            </span>
          )}
        </button>

        <button className="relative h-9 w-9 rounded-md bg-ink-800 hover:bg-ink-700 grid place-items-center" title="Notifications">
          <Bell size={15} className="text-ink-200" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-bad-500"></span>
        </button>
      </div>
    </header>
  );
}

function PersonaSwitcher({ persona, setPersona }) {
  const p = personas.find((x) => x.id === persona);
  return (
    <div className="relative group">
      <button className="h-9 px-2.5 rounded-md bg-ink-800 hover:bg-ink-700 flex items-center gap-2 text-[12.5px]">
        <span className="h-6 w-6 rounded-md grid place-items-center text-[11px] font-semibold text-ink-900" style={{ background: p.color }}>
          {p.short.slice(0, 2).toUpperCase()}
        </span>
        <div className="leading-tight text-left">
          <div className="text-white font-medium">{p.name}</div>
          <div className="text-[10px] text-ink-400 -mt-0.5">{p.short}</div>
        </div>
        <ChevronDown size={14} className="text-ink-300" />
      </button>
      <div className="absolute right-0 top-full mt-1 w-72 rounded-lg border border-ink-700 bg-ink-900 shadow-soft hidden group-hover:block z-50 p-1.5">
        <div className="text-[10.5px] uppercase tracking-wide text-ink-400 px-2 py-1.5">Switch persona</div>
        {personas.map((pp) => (
          <button
            key={pp.id}
            onClick={() => setPersona(pp.id)}
            className={`w-full text-left px-2 py-1.5 rounded-md flex items-center gap-2 hover:bg-ink-800 ${
              persona === pp.id ? "bg-ink-800" : ""
            }`}
          >
            <span className="h-6 w-6 rounded-md grid place-items-center text-[11px] font-semibold text-ink-900" style={{ background: pp.color }}>
              {pp.short.slice(0, 2).toUpperCase()}
            </span>
            <div className="text-[12.5px]">
              <div className="text-white font-medium leading-tight">{pp.name}</div>
              <div className="text-[10.5px] text-ink-400 leading-tight">{pp.domain}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
