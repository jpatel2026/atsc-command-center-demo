import KPICard from "./KPICard.jsx";
import { kpis, kpiHistory, personas, therapies } from "../data/seed.js";
import { Boxes, BadgeCheck, Truck, BarChart3, Snowflake, Headphones, Megaphone } from "lucide-react";

const fnIcons = {
  MFG: Boxes,
  QA: BadgeCheck,
  SCO: Truck,
  SP: BarChart3,
  WH: Snowflake,
  CO: Headphones,
  CE: Megaphone,
};

export default function Screen1({ onOpenKpi, filters }) {
  return (
    <div className="px-5 py-4 space-y-4">
      <Banner filters={filters} />

      <div className="grid grid-cols-1 xl:grid-cols-7 lg:grid-cols-4 md:grid-cols-2 gap-3">
        {personas.map((p) => {
          const Icon = fnIcons[p.id] || Boxes;
          return (
            <div key={p.id} className="rounded-lg border border-ink-700/70 bg-ink-900/40 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-ink-700/70 bg-ink-900/60">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-6 w-6 rounded-md grid place-items-center" style={{ background: `${p.color}1A`, color: p.color }}>
                    <Icon size={13} />
                  </span>
                  <span className="text-[12px] font-semibold text-white truncate">{p.name}</span>
                </div>
                <div className="text-[10px] text-ink-400 font-medium uppercase tracking-wide">{p.kpis.length} KPIs</div>
              </div>
              <div className="p-2 space-y-2">
                {p.kpis.slice(0, 3).map((id) => {
                  const k = kpis[id];
                  return <KPICard key={id} kpi={k} history={kpiHistory[id]} onOpen={onOpenKpi} />;
                })}
              </div>
            </div>
          );
        })}
      </div>

      <NetworkOverview />
    </div>
  );
}

function Banner({ filters }) {
  return (
    <div className="rounded-lg border border-ink-700/70 bg-gradient-to-br from-ink-900 via-ink-900 to-accent-900/20 p-4 flex items-center gap-4">
      <div className="h-10 w-10 rounded-md bg-accent-600/20 grid place-items-center text-accent-300 ring-1 ring-accent-500/30">
        <Boxes size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-accent-300">Mission Control · cross-functional dashboard</div>
        <div className="text-white text-[15px] font-medium leading-tight mt-0.5">
          One operating picture across both therapies and {filters.region === "All" ? "all regions" : `${filters.region}`} — same starting view for every persona.
        </div>
      </div>
      <div className="hidden md:flex items-center gap-3 text-[11px]">
        {therapies.map((t) => (
          <div key={t.id} className="rounded-md bg-ink-800/70 border border-ink-700 px-2.5 py-1.5">
            <div className="text-ink-400 text-[10px] uppercase font-medium tracking-wide">{t.name}</div>
            <div className="text-white font-semibold">{t.stage}</div>
            <div className="text-ink-400 text-[10px]">{t.aphModality} · {t.countriesApproved > 0 ? `${t.countriesApproved} countries` : "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NetworkOverview() {
  const data = [
    { label: "Active orders", value: "412", sub: "+18 today", tone: "neutral" },
    { label: "On-track", value: "334", sub: "81.1%", tone: "good" },
    { label: "At-risk", value: "53", sub: "12.9%", tone: "warn" },
    { label: "Delayed", value: "25", sub: "6.0%", tone: "bad" },
    { label: "Open exceptions", value: "47", sub: "5 critical", tone: "bad" },
    { label: "In-flight playbooks", value: "9", sub: "3 awaiting approval", tone: "neutral" },
    { label: "Agent actions (24h)", value: "412", sub: "96.8% success", tone: "good" },
    { label: "Approvals breached SLA", value: "2", sub: "Comm Ops, SP", tone: "warn" },
  ];
  const tone = (t) => t === "good" ? "text-ok-500" : t === "warn" ? "text-warn-500" : t === "bad" ? "text-bad-500" : "text-white";
  return (
    <div className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Network overview</div>
        <div className="h-px flex-1 bg-ink-700/70" />
        <div className="text-[11px] text-ink-500">{new Date().toLocaleString()}</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        {data.map((d) => (
          <div key={d.label} className="rounded-md border border-ink-700/70 bg-ink-950/60 px-3 py-2">
            <div className="text-[10.5px] uppercase tracking-wide text-ink-400 font-medium">{d.label}</div>
            <div className={`text-[18px] font-semibold tracking-tight ${tone(d.tone)}`}>{d.value}</div>
            <div className="text-[10.5px] text-ink-400">{d.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
