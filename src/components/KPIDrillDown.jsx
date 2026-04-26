import { X, Sparkles, ChevronRight, Play, BookOpen } from "lucide-react";
import { kpiHistory, kpiNarratives, exceptionList, playbooks } from "../data/seed.js";

export default function KPIDrillDown({ kpi, onClose, runPlaybook }) {
  if (!kpi) return null;
  const history = kpiHistory[kpi.id] || [];
  const narrative = kpiNarratives[kpi.id] || defaultNarrative(kpi);
  const linkedExceptions = exceptionList.filter((e) => e.function === kpi.function).slice(0, 4);

  const status = kpi.status;
  const tone = status === "green" ? "ok" : status === "amber" ? "warn" : "bad";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-5xl max-h-[90vh] overflow-auto rounded-xl border border-ink-700 bg-ink-900 shadow-2xl">
        <div className="flex items-start gap-4 px-5 py-4 border-b border-ink-700/70 bg-gradient-to-r from-ink-900 to-ink-900/70">
          <div className={`h-10 w-10 rounded-md grid place-items-center bg-${tone}-500/15 text-${tone}-500 ring-1 ring-${tone}-500/30`}>
            <Sparkles size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] uppercase tracking-wider text-ink-400 font-semibold">{kpi.function} · KPI drill-down · 6-month history</div>
            <div className="text-white text-[18px] font-semibold tracking-tight">{kpi.name}</div>
            <div className="text-[12px] text-ink-400 mt-0.5">current <b className="text-white">{fmt(kpi.current, kpi.unit)}</b> · target <b className="text-ink-200">{fmt(kpi.target, kpi.unit)}</b> · status <b className={`text-${tone}-500 capitalize`}>{status}</b></div>
          </div>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded text-ink-300 hover:text-white hover:bg-ink-800"><X size={16} /></button>
        </div>

        <div className="p-5 grid lg:grid-cols-3 gap-4">
          {/* Trend */}
          <div className="lg:col-span-2 rounded-lg border border-ink-700/70 bg-ink-950/60 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 mb-2">6-month performance vs target</div>
            <TrendChart history={history} target={kpi.target} unit={kpi.unit} status={status} />
            <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-1.5 text-[11px]">
              {history.map((p) => {
                const dev = ((p.value - p.target) / p.target) * 100;
                const c = Math.abs(dev) < 2 ? "ok" : Math.abs(dev) < 5 ? "warn" : "bad";
                return (
                  <div key={p.month} className={`rounded border border-ink-800 bg-ink-900/40 px-2 py-1.5`}>
                    <div className="text-[10px] text-ink-400 font-medium">{p.month}</div>
                    <div className="text-white font-semibold">{fmt(p.value, kpi.unit)}</div>
                    <div className={`text-[10.5px] text-${c}-500`}>{dev >= 0 ? "+" : ""}{dev.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Narrative */}
          <div className="rounded-lg border border-accent-500/30 bg-accent-900/5 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-accent-300 flex items-center gap-1.5"><Sparkles size={12} /> GenAI narrative · aggregate</div>
            <p className="text-[13px] text-ink-100 leading-snug mt-2">{narrative.summary}</p>
            <ul className="mt-2 space-y-1 text-[12px] text-ink-200">
              {narrative.bullets.map((b, i) => <li key={i} className="flex gap-1.5"><span className="text-accent-300">•</span><span>{b}</span></li>)}
            </ul>
            <div className="mt-3 text-[10.5px] uppercase tracking-wide text-ink-400 font-semibold">Where to focus</div>
            <ul className="mt-1 space-y-1.5 text-[12px]">
              {narrative.focus.map((f, i) => (
                <li key={i} className="rounded-md border border-ink-700/70 bg-ink-950/40 p-2 flex items-start gap-2">
                  <ChevronRight size={12} className="text-accent-300 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-medium">{f.label}</div>
                    <div className="text-ink-400 text-[11px]">{f.note}</div>
                  </div>
                  {f.playbook && (
                    <button
                      onClick={() => runPlaybook?.(f.playbook, kpi.id)}
                      className="text-[10.5px] px-1.5 py-0.5 rounded bg-accent-600 text-white hover:bg-accent-500 font-semibold inline-flex items-center gap-1"
                    >
                      <Play size={10} /> Run
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-3 text-[10px] text-ink-500 flex items-center gap-2">
              confidence: <b className="text-ink-200 capitalize">{narrative.confidence}</b>
              <span>· sources: {narrative.sources.join(" · ")}</span>
            </div>
          </div>

          {/* Linked exceptions & playbooks */}
          <div className="lg:col-span-3 rounded-lg border border-ink-700/70 bg-ink-950/60 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 mb-2">Top exceptions in the period (linked) & relevant playbooks</div>
            <div className="grid lg:grid-cols-2 gap-2">
              <div className="space-y-1.5">
                {linkedExceptions.map((e) => (
                  <div key={e.id} className="rounded border border-ink-800 bg-ink-900/40 p-2 flex items-center gap-2">
                    <span className={`text-[9.5px] uppercase font-semibold rounded px-1 py-0.5 ${e.severity === "critical" ? "bg-bad-500/20 text-bad-500" : e.severity === "high" ? "bg-warn-500/20 text-warn-500" : "bg-ink-700 text-ink-200"}`}>{e.severity}</span>
                    <span className="text-[12px] text-white truncate">{e.title}</span>
                    <span className="ml-auto font-mono text-[10px] text-ink-400">{e.id}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                {playbooks.slice(0, 4).map((p) => (
                  <div key={p.id} className="rounded border border-ink-800 bg-ink-900/40 p-2 flex items-center gap-2">
                    <BookOpen size={12} className="text-accent-300" />
                    <div className="text-[12px] text-white truncate">{p.name}</div>
                    <span className="ml-auto text-[10px] rounded bg-accent-600/15 text-accent-200 px-1.5 py-0.5 font-semibold">{p.initialAutonomy}</span>
                    <button onClick={() => runPlaybook?.(p.id, kpi.id)} className="text-[10.5px] px-1.5 py-0.5 rounded bg-accent-600 text-white hover:bg-accent-500 font-semibold inline-flex items-center gap-1"><Play size={10} /> Run</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function fmt(v, unit) {
  if (unit === "%" || unit === "% std" || unit === "% of plan") return `${(+v).toFixed(1)}%`;
  if (unit === "$M") return `$${(+v).toFixed(1)}M`;
  if (unit === "hrs" || unit === "days") return `${(+v).toFixed(1)} ${unit}`;
  return `${Math.round(+v)}${unit ? " " + unit : ""}`;
}
function defaultNarrative(kpi) {
  return {
    summary: `${kpi.name} is currently ${fmt(kpi.current, kpi.unit)} vs target ${fmt(kpi.target, kpi.unit)}. The trend over the last 6 months shows ${kpi.trend > 0 ? "an upward" : "a downward"} drift; the most likely contributing causes are concentrated in a small subset of orders/sites — see the focus list.`,
    bullets: [
      "Aggregate-level pattern only — no individual patient is named.",
      "Each claim is traceable to its source data and time window.",
      "Confidence flagged where evidence is thin.",
    ],
    focus: [
      { label: "Address top contributing site / modality", playbook: null, note: "Targeted SOP review" },
      { label: "Run the relevant agent playbook", playbook: "PB-LOT-LOCK", note: "Where applicable per policy" },
    ],
    confidence: "medium",
    sources: ["Source-of-record dataset", "Audit log"],
  };
}

function TrendChart({ history, target, unit, status }) {
  const w = 700, h = 200, padX = 30, padY = 18;
  const values = history.map((p) => p.value);
  const min = Math.min(target * 0.85, ...values), max = Math.max(target * 1.15, ...values);
  const range = max - min || 1;
  const x = (i) => padX + (i / (history.length - 1)) * (w - padX * 2);
  const y = (v) => h - padY - ((v - min) / range) * (h - padY * 2);
  const path = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  const stroke = status === "green" ? "#22c55e" : status === "amber" ? "#f59e0b" : "#ef4444";
  const tolerancePct = 0.04;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[210px]">
      <defs>
        <linearGradient id="kpi-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Tolerance band */}
      <rect x={padX} y={y(target * (1 + tolerancePct))} width={w - padX * 2} height={Math.max(8, y(target * (1 - tolerancePct)) - y(target * (1 + tolerancePct)))} fill="#3a91ff" fillOpacity="0.06" />
      {/* Target line */}
      <line x1={padX} x2={w - padX} y1={y(target)} y2={y(target)} stroke="#3a91ff" strokeWidth="1" strokeDasharray="4 4" />
      <text x={w - padX + 4} y={y(target) + 3} fontSize="10" fill="#5fb0ff">target</text>

      {/* Deviation markers (red/green dots) */}
      {history.map((p, i) => {
        const dev = (p.value - target) / target;
        const fill = dev < -0.04 ? "#ef4444" : dev > 0.04 ? "#22c55e" : "#a8b0bd";
        return <circle key={i} cx={x(i)} cy={y(p.value)} r={3.5} fill={fill} />;
      })}

      {/* Area + line */}
      <path d={`${path} L${x(values.length - 1)},${h - padY} L${x(0)},${h - padY} Z`} fill="url(#kpi-area)" />
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* X axis labels */}
      {history.map((p, i) => (
        <text key={p.month} x={x(i)} y={h - 4} fontSize="10" textAnchor="middle" fill="#717a8a">{p.month}</text>
      ))}
    </svg>
  );
}
