import KPICard from "./KPICard.jsx";
import { kpis, kpiHistory, personas } from "../data/seed.js";
import { ChevronRight } from "lucide-react";

export default function Screen2({ persona, onOpenKpi, setScreen }) {
  const p = personas.find((pp) => pp.id === persona);
  const kpiSet = p.kpis.map((id) => kpis[id]);

  return (
    <div className="px-5 py-4 space-y-4">
      <div className="rounded-lg border border-ink-700/70 bg-gradient-to-br from-ink-900 via-ink-900 to-ink-900/50 p-4 flex items-center gap-4">
        <div className="h-12 w-12 rounded-md grid place-items-center text-ink-900 font-semibold text-[16px]" style={{ background: p.color }}>
          {p.short.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: p.color }}>Persona view — {p.short}</div>
          <div className="text-white text-[16px] font-medium leading-tight mt-0.5">{p.name} — {p.domain}</div>
          <div className="text-[12px] text-ink-400 mt-1 max-w-3xl">{p.description}</div>
        </div>
        <button
          onClick={() => setScreen("S3")}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium bg-accent-600/15 text-accent-200 ring-1 ring-accent-500/30 hover:bg-accent-600/25"
        >
          Go to {p.short} execution view <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
        {kpiSet.map((k) => (
          <div key={k.id} className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10.5px] uppercase tracking-wider text-ink-400 font-semibold">{k.function}</div>
              <div className="text-[10.5px] text-ink-500">target {fmtTarget(k)}</div>
            </div>
            <KPICard kpi={k} history={kpiHistory[k.id]} onOpen={onOpenKpi} />
            <PersonaContext kpi={k} />
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 mb-2">Action authority — {p.name}</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 text-[12px]">
          {p.actionScope.map((s) => (
            <div key={s} className="rounded-md border border-ink-700/70 bg-ink-950/60 px-3 py-2">
              <div className="text-white font-medium">{labelSystem(s)}</div>
              <div className="text-ink-400 text-[11px] mt-0.5">{describeScope(s)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function fmtTarget(k) {
  if (k.unit === "%") return `${k.target}%`;
  return `${k.target}${k.unit ? " " + k.unit : ""}`;
}

function PersonaContext({ kpi }) {
  const ctxMap = {
    mfg_inprocess_dev: "Cluster: RTP suite 2 day-7 expansion handoff",
    qa_open_dev: "12 records aged > 30 days · 5 EM · 4 IPC",
    sco_excursions: "DP-LOT-2204 RTP→TC-NYC excursion live",
    co_ticket_aging: "DE country team backlog · agent routing engaged",
    wh_excursions: "1 active excursion · auto-lock complete",
    sco_orders_status: "53 amber · 25 red · 9 playbooks running",
    sco_aph_dp_cycle: "T2 CryoAph from Leiden +5.4h Aph cryo step",
    qa_capa_aging: "3 effectiveness checks overdue",
  };
  const c = ctxMap[kpi.id];
  if (!c) return null;
  return <div className="mt-2 text-[11px] text-ink-300 px-1 truncate" title={c}>📍 {c}</div>;
}
function labelSystem(s) {
  const m = {
    MES: "MES — Manufacturing Execution",
    QMS_LIMS: "QMS / LIMS",
    SLOT: "Slot Management",
    LOGISTICS: "Logistics / TMS",
    PATIENT_ORCH: "Patient Orchestration",
    TC_PORTAL: "Treatment Center Portal",
    ERP: "ERP / Supply",
    WMS: "Warehouse Management",
    TICKET: "Backend Ticketing",
  };
  return m[s] || s;
}
function describeScope(s) {
  const m = {
    MES: "Slot swaps · batch reprioritization · in-process flags",
    QMS_LIMS: "Pre-fill deviation · CAPA initiate · lot lock — never auto-disposes",
    SLOT: "Reserve · release · reschedule · reprioritize · cancel",
    LOGISTICS: "Re-route · expedited carrier · replacement shipper",
    PATIENT_ORCH: "Templated comms · reschedule · re-enrollment · consent",
    TC_PORTAL: "ETA updates · infusion window confirm · CoC pushes",
    ERP: "Material req · transfer order · safety stock (approval)",
    WMS: "Lot lock · cycle count · location update",
    TICKET: "Resolve standard types · escalate · route to country team",
  };
  return m[s] || "—";
}
