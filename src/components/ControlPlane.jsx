import { controlPlane } from "../data/seed.js";

export default function ControlPlane() {
  const cp = controlPlane;
  return (
    <div className="px-5 py-4 space-y-4">
      <div className="rounded-lg border border-ink-700/70 bg-gradient-to-br from-ink-900 via-ink-900 to-accent-900/10 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-accent-300">Agent observability & control plane (Epic 17)</div>
        <div className="text-white text-[16px] font-medium leading-tight mt-0.5">Real-time view of agent actions, queues, errors, retries, rollbacks, drift</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        <Stat label="Actions (24h)" value={cp.actions24h} tone="white" />
        <Stat label="Success rate" value={`${cp.successRate}%`} tone="good" />
        <Stat label="Intervention rate" value={`${cp.interventionRate}%`} sub="humans overriding recs" tone="warn" />
        <Stat label="Override rate" value={`${cp.overrideRate}%`} sub="rejected before execute" tone="warn" />
        <Stat label="Rollback rate" value={`${cp.rollbackRate}%`} tone="warn" />
        <Stat label="Approval SLA breach" value={cp.approvalSlaBreach} tone="bad" />
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <div className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 mb-3">Action volume by autonomy level</div>
          <BarSeries data={cp.byLevel.map((d) => ({ label: d.level, value: d.count }))} />
        </div>
        <div className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 mb-3">Action volume by downstream system</div>
          <BarSeries data={cp.bySystem.map((d) => ({ label: d.system, value: d.count }))} />
        </div>
      </div>

      <div className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 mb-3">Drift & quality monitoring (7 days)</div>
        <DriftChart data={cp.driftSeries} />
        <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
          <Legend color="#22c55e" label="Recommendation accept rate" />
          <Legend color="#ef4444" label="Override rate" />
          <Legend color="#5fb0ff" label="Narrative quality score" />
        </div>
        <div className="mt-3 text-[12px] text-ink-300">
          Drift events trigger review tickets and (optionally) policy actions — e.g., temporarily lower autonomy level. Findings feed
          back into the prompt and grounding pipeline (CC-11.3).
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, tone = "white" }) {
  const t = tone === "good" ? "text-ok-500" : tone === "warn" ? "text-warn-500" : tone === "bad" ? "text-bad-500" : "text-white";
  return (
    <div className="rounded-md border border-ink-700/70 bg-ink-950/60 px-3 py-2">
      <div className="text-[10.5px] uppercase tracking-wide text-ink-400 font-medium">{label}</div>
      <div className={`text-[18px] font-semibold tracking-tight ${t}`}>{value}</div>
      {sub && <div className="text-[10.5px] text-ink-400">{sub}</div>}
    </div>
  );
}
function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block w-3 h-1.5 rounded" style={{ background: color }} />
      <span className="text-ink-300">{label}</span>
    </div>
  );
}
function BarSeries({ data }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-1.5">
      {data.map((d) => (
        <div key={d.label} className="grid grid-cols-[140px,1fr,40px] items-center gap-2 text-[11.5px]">
          <div className="text-ink-300 truncate">{d.label}</div>
          <div className="h-2 rounded bg-ink-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent-700 to-accent-400" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <div className="text-ink-200 text-right font-mono text-[11px]">{d.value}</div>
        </div>
      ))}
    </div>
  );
}
function DriftChart({ data }) {
  const w = 720, h = 180, padX = 28, padY = 14;
  const max = 100;
  const x = (i) => padX + (i / (data.length - 1)) * (w - padX * 2);
  const y = (v) => h - padY - (v / max) * (h - padY * 2);
  const line = (key, color) => (
    <path
      d={data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d[key])}`).join(" ")}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  );
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[180px]">
      {[20, 40, 60, 80].map((v) => (
        <line key={v} x1={padX} x2={w - padX} y1={y(v)} y2={y(v)} stroke="#262b34" strokeWidth="1" />
      ))}
      {line("accept", "#22c55e")}
      {line("override", "#ef4444")}
      {line("narrative", "#5fb0ff")}
      {data.map((d, i) => (
        <text key={d.day} x={x(i)} y={h - 2} fontSize="10" textAnchor="middle" fill="#717a8a">{d.day}</text>
      ))}
    </svg>
  );
}
