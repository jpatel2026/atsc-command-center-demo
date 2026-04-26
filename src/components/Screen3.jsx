import { useMemo, useState } from "react";
import { milestones, orders, ordersAtMilestone, therapies, personas, playbooks } from "../data/seed.js";
import { ChevronRight, AlertTriangle, Bot, Play, Clock, Activity, MapPin } from "lucide-react";

export default function Screen3({ persona, openOrder, setOpenOrder, runPlaybook }) {
  const p = personas.find((pp) => pp.id === persona);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  if (openOrder) {
    return <OrderGantt order={openOrder} onBack={() => setOpenOrder(null)} runPlaybook={runPlaybook} />;
  }

  // Persona pivots
  if (persona === "MFG") return <PersonaPivot persona={p} entries={mfgBatches} setOpenOrder={setOpenOrder} />;
  if (persona === "QA") return <PersonaPivot persona={p} entries={qaLots} setOpenOrder={setOpenOrder} />;
  if (persona === "SP") return <PersonaPivot persona={p} entries={spCapacity} />;
  if (persona === "WH") return <PersonaPivot persona={p} entries={whShipments} />;
  if (persona === "CO") return <PersonaPivot persona={p} entries={coTickets} />;
  if (persona === "CE") return <PersonaPivot persona={p} entries={ceActivations} />;

  // SCO canonical view
  return <SCOOrderFlow persona={p} selectedMilestone={selectedMilestone} setSelectedMilestone={setSelectedMilestone} setOpenOrder={setOpenOrder} runPlaybook={runPlaybook} />;
}

/* ─────────────────── SCO canonical flow ─────────────────── */

function SCOOrderFlow({ persona, selectedMilestone, setSelectedMilestone, setOpenOrder, runPlaybook }) {
  const counts = useMemo(() => {
    const by = { onTrack: 0, atRisk: 0, delayed: 0 };
    orders.forEach((o) => {
      if (o.status === "on-track") by.onTrack += 1;
      else if (o.status === "at-risk") by.atRisk += 1;
      else by.delayed += 1;
    });
    return by;
  }, []);
  const reasonCounts = useMemo(() => {
    const m = new Map();
    orders.filter((o) => o.status !== "on-track" && o.reason).forEach((o) => m.set(o.reason, (m.get(o.reason) || 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, []);

  const playbooksRunning = orders.filter((o) => o.agentState === "playbook").length;
  const awaitingApproval = orders.filter((o) => o.agentState === "approval").length;

  return (
    <div className="px-5 py-4 space-y-4">
      {/* Tier 1 — Aggregate */}
      <div className="rounded-lg border border-ink-700/70 bg-gradient-to-br from-ink-900 via-ink-900 to-ink-900/40 p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: persona.color }}>
              E2E Visibility · {persona.name} · aggregate view
            </div>
            <div className="text-white text-[16px] font-medium leading-tight mt-0.5">{orders.length} active orders across both therapies</div>
          </div>
          <div className="flex items-center gap-3">
            {therapies.map((t) => {
              const ct = orders.filter((o) => o.therapyId === t.id).length;
              return (
                <div key={t.id} className="rounded-md border border-ink-700/70 bg-ink-950/70 px-2.5 py-1.5">
                  <div className="text-[10px] uppercase tracking-wide text-ink-400">{t.name}</div>
                  <div className="text-[15px] font-semibold text-white">{ct}</div>
                  <div className="text-[10px] text-ink-400">{t.aphModality}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-3">
          <Stat label="On-track" value={counts.onTrack} pct={(counts.onTrack / orders.length) * 100} tone="good" />
          <Stat label="At-risk" value={counts.atRisk} pct={(counts.atRisk / orders.length) * 100} tone="warn" />
          <Stat label="Delayed" value={counts.delayed} pct={(counts.delayed / orders.length) * 100} tone="bad" />
          <Stat label="Playbooks running" value={playbooksRunning} sub="across in-scope orders" tone="neutral" icon={Bot} />
          <Stat label="Awaiting approval" value={awaitingApproval} sub="agent-proposed actions" tone="warn" icon={Activity} />
        </div>
        <div className="mt-3 text-[11px] text-ink-300 flex flex-wrap gap-x-3 gap-y-1">
          <span className="text-ink-400 uppercase tracking-wide font-medium mr-1">Top reasons:</span>
          {reasonCounts.map(([r, n]) => (
            <span key={r} className="rounded-md bg-bad-500/10 text-bad-500 ring-1 ring-bad-500/20 px-2 py-0.5">{r} · <b>{n}</b></span>
          ))}
        </div>
      </div>

      {/* Tier 2 — Milestone strip */}
      <div className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 mb-3">Milestone strip · 14-step patient journey</div>
        <div className="grid grid-cols-7 lg:grid-cols-14 gap-1">
          {milestones.map((m) => {
            const at = ordersAtMilestone(m.id);
            const ot = at.filter((o) => o.status === "on-track").length;
            const ar = at.filter((o) => o.status === "at-risk").length;
            const dl = at.filter((o) => o.status === "delayed").length;
            const agentAt = at.filter((o) => o.agentState !== "none").length;
            const isActive = selectedMilestone === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMilestone(isActive ? null : m.id)}
                className={`text-left rounded-md border p-2 text-[10.5px] transition-all ${
                  isActive ? "border-accent-500 bg-accent-600/10" : "border-ink-700/70 bg-ink-950/40 hover:border-ink-600"
                }`}
                title={m.name}
              >
                <div className="text-[9.5px] text-ink-400 uppercase font-semibold">M{m.n}</div>
                <div className="text-white text-[10.5px] font-medium truncate leading-tight" title={m.name}>{m.name}</div>
                <div className="text-[14px] font-semibold text-white mt-1">{at.length}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Pill tone="good" small>{ot}</Pill>
                  <Pill tone="warn" small>{ar}</Pill>
                  <Pill tone="bad" small>{dl}</Pill>
                </div>
                {agentAt > 0 && (
                  <div className="mt-1 flex items-center gap-1 text-[9.5px] text-accent-300 font-medium">
                    <Bot size={10} /> {agentAt} agent
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier 2.5 — milestone double-click */}
      {selectedMilestone && (
        <MilestoneDrill
          milestoneId={selectedMilestone}
          onSelectOrder={setOpenOrder}
          runPlaybook={runPlaybook}
          onClose={() => setSelectedMilestone(null)}
        />
      )}

      {!selectedMilestone && <OrderTable orders={orders.slice(0, 12)} onSelect={setOpenOrder} title="Recent orders" />}
    </div>
  );
}

function Stat({ label, value, sub, tone = "neutral", pct, icon: Icon }) {
  const t = tone === "good" ? "text-ok-500" : tone === "warn" ? "text-warn-500" : tone === "bad" ? "text-bad-500" : "text-white";
  return (
    <div className="rounded-md border border-ink-700/70 bg-ink-950/60 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wide text-ink-400 font-medium">
        {Icon && <Icon size={11} className="text-ink-400" />} {label}
      </div>
      <div className={`text-[20px] font-semibold tracking-tight ${t}`}>{value}</div>
      <div className="text-[10.5px] text-ink-400">{pct !== undefined ? `${pct.toFixed(1)}%` : sub}</div>
    </div>
  );
}
function Pill({ tone, small, children }) {
  const t = tone === "good" ? "bg-ok-500/15 text-ok-500" : tone === "warn" ? "bg-warn-500/15 text-warn-500" : "bg-bad-500/15 text-bad-500";
  return <span className={`${t} rounded ${small ? "text-[9.5px] px-1 py-0.5" : "text-[10.5px] px-1.5 py-0.5"} font-semibold`}>{children}</span>;
}

function MilestoneDrill({ milestoneId, onSelectOrder, runPlaybook, onClose }) {
  const ms = milestones.find((m) => m.id === milestoneId);
  const list = ordersAtMilestone(milestoneId).slice(0, 25);
  const [statusFilter, setStatusFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const filtered = list.filter((o) => (statusFilter === "all" || o.status === statusFilter) && (agentFilter === "all" || o.agentState === agentFilter));
  return (
    <div className="rounded-lg border border-accent-500/30 bg-accent-900/5 p-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-accent-300">Milestone double-click · orders at this step</div>
          <div className="text-white text-[15px] font-medium leading-tight">M{ms.n}: {ms.name} · {list.length} orders</div>
        </div>
        <div className="flex items-center gap-1">
          {["all", "on-track", "at-risk", "delayed"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-2 py-0.5 rounded text-[11px] ${statusFilter === s ? "bg-ink-700 text-white" : "text-ink-300 hover:bg-ink-800"}`}>{s}</button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {["all", "playbook", "approval", "acted", "none"].map((s) => (
            <button key={s} onClick={() => setAgentFilter(s)} className={`px-2 py-0.5 rounded text-[11px] ${agentFilter === s ? "bg-accent-600/20 text-accent-200" : "text-ink-300 hover:bg-ink-800"}`}>agent: {s}</button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button className="text-[11px] px-2 py-1 rounded-md bg-ink-800 hover:bg-ink-700">Bulk: assign owner</button>
          <button className="text-[11px] px-2 py-1 rounded-md bg-accent-600/15 ring-1 ring-accent-500/30 text-accent-200 hover:bg-accent-600/25" onClick={() => runPlaybook?.("PB-APH-SLIP", "selection")}>
            <span className="inline-flex items-center gap-1"><Play size={11} /> Run playbook on selection</span>
          </button>
          <button onClick={onClose} className="text-[11px] px-2 py-1 rounded-md bg-ink-800 hover:bg-ink-700">Close</button>
        </div>
      </div>
      <div className="mt-3 overflow-auto">
        <table className="w-full text-[12px]">
          <thead className="text-[10.5px] uppercase tracking-wide text-ink-400">
            <tr className="border-b border-ink-700/70">
              <Th>Order</Th><Th>Patient</Th><Th>Therapy / Modality</Th><Th>Status</Th><Th>Time-in-MS</Th><Th>Reason</Th><Th>Agent</Th><Th>Last update</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-ink-800/60 hover:bg-ink-900/40">
                <td className="px-2 py-1.5 font-mono text-[11.5px] text-white">{o.id}</td>
                <td className="px-2 py-1.5 font-mono text-[11.5px] text-ink-300">{o.patient}</td>
                <td className="px-2 py-1.5">{o.therapyId} · {o.modalityId}</td>
                <td className="px-2 py-1.5"><Pill tone={o.status === "on-track" ? "good" : o.status === "at-risk" ? "warn" : "bad"}>{o.status}</Pill></td>
                <td className="px-2 py-1.5 text-ink-300">{o.timeInMilestoneHrs}h</td>
                <td className="px-2 py-1.5 text-ink-300 text-[11.5px]">{o.reason || "—"}</td>
                <td className="px-2 py-1.5">{agentBadge(o.agentState)}</td>
                <td className="px-2 py-1.5 text-ink-400 text-[11px]">{o.lastUpdate}</td>
                <td className="px-2 py-1.5 text-right">
                  <button onClick={() => onSelectOrder(o)} className="text-[11px] px-2 py-1 rounded-md bg-accent-600/15 ring-1 ring-accent-500/30 text-accent-200 hover:bg-accent-600/25">Open Gantt <ChevronRight className="inline -mt-px" size={10} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Th({ children }) { return <th className="text-left px-2 py-1.5 font-medium">{children}</th>; }

function agentBadge(state) {
  if (state === "none") return <span className="text-[10.5px] text-ink-500">—</span>;
  if (state === "playbook") return <span className="inline-flex items-center gap-1 text-[10.5px] rounded bg-accent-600/15 text-accent-200 px-1.5 py-0.5"><Bot size={10} /> playbook</span>;
  if (state === "approval") return <span className="inline-flex items-center gap-1 text-[10.5px] rounded bg-warn-500/15 text-warn-500 px-1.5 py-0.5"><AlertTriangle size={10} /> approval</span>;
  if (state === "acted") return <span className="inline-flex items-center gap-1 text-[10.5px] rounded bg-ok-500/15 text-ok-500 px-1.5 py-0.5">✓ acted</span>;
  return null;
}

function OrderTable({ orders, onSelect, title }) {
  return (
    <div className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 mb-2">{title}</div>
      <div className="overflow-auto">
        <table className="w-full text-[12px]">
          <thead className="text-[10.5px] uppercase tracking-wide text-ink-400">
            <tr className="border-b border-ink-700/70">
              <Th>Order</Th><Th>Patient</Th><Th>Therapy / Mod</Th><Th>Milestone</Th><Th>Status</Th><Th>Reason</Th><Th>Agent</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-ink-800/60 hover:bg-ink-900/40">
                <td className="px-2 py-1.5 font-mono text-[11.5px] text-white">{o.id}</td>
                <td className="px-2 py-1.5 font-mono text-[11.5px] text-ink-300">{o.patient}</td>
                <td className="px-2 py-1.5">{o.therapyId} · {o.modalityId}</td>
                <td className="px-2 py-1.5">M{o.milestoneN}</td>
                <td className="px-2 py-1.5"><Pill tone={o.status === "on-track" ? "good" : o.status === "at-risk" ? "warn" : "bad"}>{o.status}</Pill></td>
                <td className="px-2 py-1.5 text-ink-300 text-[11.5px]">{o.reason || "—"}</td>
                <td className="px-2 py-1.5">{agentBadge(o.agentState)}</td>
                <td className="px-2 py-1.5 text-right">
                  <button onClick={() => onSelect(o)} className="text-[11px] px-2 py-1 rounded-md bg-ink-800 hover:bg-ink-700 text-ink-100">Open Gantt</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────── Order Gantt detail ─────────────────── */

function OrderGantt({ order, onBack, runPlaybook }) {
  const applicableMs = milestones.filter((m) => m.applies(order.therapyId, order.modalityId));
  // simulate progress: completed up to milestone-1, current at milestone, late beyond
  const idx = order.milestoneN - 1;

  const recs = [
    {
      title: `Re-prioritize batch to next-available Mfg slot at ${order.site === "MFG-RTP" ? "RTP" : order.site === "MFG-LEI" ? "Leiden" : "Singapore"} on Aug 14`,
      detail: `recovers ~1.5 days · confidence high · L1 (one-click) · blast 1 batch · reversible (12h)`,
      autonomy: "L1",
      target: "MES",
    },
    {
      title: `Run playbook: Apheresis slip recovery`,
      detail: `5-step playbook · pauses for SCO Lead approval at step 3 · L2`,
      autonomy: "L2",
      target: "Slot Mgmt + Patient Orch + TC Portal",
      playbookId: "PB-APH-SLIP",
    },
    {
      title: `Request expedited carrier for outbound DP`,
      detail: `recovers 0.8 days · confidence medium · L1 · cost +$1.4k · reversible (2h)`,
      autonomy: "L1",
      target: "TMS",
    },
    {
      title: `Notify HCP & patient of timeline shift (templated)`,
      detail: `L3 autonomous · 1 patient · irreversible (sent message)`,
      autonomy: "L3",
      target: "Patient Orch",
    },
  ];

  const history = [
    { ts: "14:48", actor: "agent", action: "Pre-filled deviation DEV-22041 (awaiting QA)", level: "L1", outcome: "awaiting-approval" },
    { ts: "13:22", actor: "user", action: "M.Patel released held Aph slot LON-Aug15", level: "—", outcome: "success" },
    { ts: "11:18", actor: "agent", action: "Recommended carrier expediting", level: "L0", outcome: "accepted" },
    { ts: "08:02", actor: "agent", action: "Detected slot slip via TC-LDN portal event", level: "L3", outcome: "success" },
  ];

  return (
    <div className="px-5 py-4 space-y-4">
      <button onClick={onBack} className="text-[12px] text-ink-300 hover:text-white inline-flex items-center gap-1">
        <ChevronRight size={14} className="rotate-180" /> Back to milestone view
      </button>

      <div className="rounded-lg border border-ink-700/70 bg-gradient-to-br from-ink-900 via-ink-900 to-ink-900/40 p-4 flex items-start gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-accent-300">Order Gantt · E2E execution detail</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <div className="text-white text-[18px] font-semibold tracking-tight font-mono">{order.id}</div>
            <div className="text-[12px] text-ink-300">· Patient {order.patient}</div>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[11.5px] text-ink-300">
            <span>{order.therapyId} · {order.modalityId}</span>
            <span className="text-ink-500">·</span>
            <span className="inline-flex items-center gap-1"><MapPin size={11} /> {order.site} → {order.tc} ({order.country})</span>
            <span className="text-ink-500">·</span>
            <Pill tone={order.status === "on-track" ? "good" : order.status === "at-risk" ? "warn" : "bad"}>{order.status}</Pill>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Cumulative late" value={`${order.daysLate.toFixed(1)}d`} tone={order.daysLate > 1.5 ? "bad" : order.daysLate > 0 ? "warn" : "good"} />
          <Stat label="Slack" value={`${order.slack.toFixed(1)}d`} tone={order.slack > 1 ? "good" : order.slack > 0 ? "warn" : "bad"} />
          <Stat label="Projected infusion" value={order.projectedInfusion} tone={order.projectedInfusion === "On commit" ? "good" : "warn"} />
        </div>
      </div>

      {/* Gantt */}
      <div className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 mb-3">Patient journey · standard vs actual ({applicableMs.length} steps)</div>
        <div className="space-y-1.5">
          {applicableMs.map((m, i) => {
            const status = i < idx ? "done" : i === idx ? (order.status === "delayed" ? "late" : "active") : "future";
            return <GanttRow key={m.id} milestone={m} status={status} order={order} index={i} total={applicableMs.length} />;
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bot size={14} className="text-accent-300" />
          <div className="text-[11px] font-semibold uppercase tracking-wider text-accent-300">Co-Pilot · ranked next-best actions</div>
        </div>
        <div className="space-y-2">
          {recs.map((r, i) => <RecCard key={i} rec={r} runPlaybook={runPlaybook} order={order} />)}
        </div>
      </div>

      {/* Action history */}
      <div className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 mb-3">Action history (human + agent)</div>
        <div className="divide-y divide-ink-800">
          {history.map((h, i) => (
            <div key={i} className="flex items-center gap-3 py-2 text-[12px]">
              <div className="text-ink-400 font-mono text-[11px] w-12">{h.ts}</div>
              <span className={`text-[10.5px] font-semibold rounded px-1.5 py-0.5 ${h.actor === "agent" ? "bg-accent-600/15 text-accent-200" : "bg-ink-700 text-ink-200"}`}>
                {h.actor}
              </span>
              <span className="text-[10.5px] text-ink-400 w-8">{h.level}</span>
              <div className="flex-1 min-w-0 truncate text-ink-100">{h.action}</div>
              <span className={`text-[10.5px] rounded px-1.5 py-0.5 ${h.outcome === "success" ? "bg-ok-500/15 text-ok-500" : h.outcome === "awaiting-approval" ? "bg-warn-500/15 text-warn-500" : "bg-ink-700 text-ink-200"}`}>{h.outcome}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GanttRow({ milestone, status, order, index, total }) {
  const colorMap = {
    done: "bg-ok-500/35 border-ok-500/50",
    active: "bg-warn-500/35 border-warn-500/50",
    late: "bg-bad-500/35 border-bad-500/50",
    future: "bg-ink-800 border-ink-700/70",
  };
  const labelTone = status === "future" ? "text-ink-400" : "text-white";
  const left = (index / total) * 100;
  const width = (1 / total) * 100;
  return (
    <div className="grid grid-cols-[180px,1fr] gap-3 items-center gantt-row rounded">
      <div className="flex items-center gap-2 text-[11.5px] truncate" title={milestone.name}>
        <span className="text-[10.5px] text-ink-500 font-mono w-8">M{milestone.n}</span>
        <span className={`truncate ${labelTone}`}>{milestone.name}</span>
      </div>
      <div className="relative h-7 rounded bg-ink-950/60 border border-ink-800 overflow-hidden">
        {/* Standard band */}
        <div className="absolute top-0 bottom-0 bg-ink-700/30 border-x border-ink-700/30" style={{ left: `${left}%`, width: `${width}%` }} />
        {/* Actual progress */}
        {status !== "future" && (
          <div className={`absolute top-1 bottom-1 rounded-sm border ${colorMap[status]}`}
            style={{
              left: `${left + (status === "late" ? 0.5 : 0)}%`,
              width: `${width * (status === "late" ? 1.4 : status === "active" ? 0.7 : 1)}%`,
            }}
          />
        )}
        <div className="absolute inset-0 flex items-center px-2">
          <span className="text-[10px] text-ink-500">{milestone.standardHrs}h std</span>
          {status === "late" && <span className="ml-auto text-[10px] text-bad-500 font-semibold flex items-center gap-1"><Clock size={10} /> +{order.daysLate.toFixed(1)}d</span>}
          {status === "active" && <span className="ml-auto text-[10px] text-warn-500 font-semibold">in progress</span>}
          {status === "done" && <span className="ml-auto text-[10px] text-ok-500 font-semibold">complete</span>}
        </div>
      </div>
    </div>
  );
}

function RecCard({ rec, runPlaybook, order }) {
  const tone = rec.autonomy === "L0" ? "neutral" : rec.autonomy === "L1" ? "good" : rec.autonomy === "L2" ? "accent" : "warn";
  const toneClasses = {
    neutral: "bg-ink-800 text-ink-100",
    good: "bg-ok-500/15 text-ok-500",
    accent: "bg-accent-600/15 text-accent-200",
    warn: "bg-warn-500/15 text-warn-500",
  };
  return (
    <div className="rounded-md border border-ink-700/70 bg-ink-950/40 p-3 flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-medium text-white truncate">{rec.title}</div>
        <div className="text-[11px] text-ink-400 mt-0.5 truncate">{rec.detail}</div>
        <div className="text-[10.5px] text-ink-500 mt-1">target: {rec.target}</div>
      </div>
      <span className={`text-[10.5px] rounded px-1.5 py-0.5 font-semibold ${toneClasses[tone]}`}>{rec.autonomy}</span>
      <button className="text-[11px] px-2 py-1 rounded-md bg-ink-800 hover:bg-ink-700">Why this</button>
      <button className="text-[11px] px-2 py-1 rounded-md bg-ink-800 hover:bg-ink-700">Preview</button>
      {rec.autonomy !== "L0" ? (
        <button
          onClick={() => rec.playbookId && runPlaybook?.(rec.playbookId, order.id)}
          className="text-[11px] px-2.5 py-1 rounded-md bg-accent-600 text-white hover:bg-accent-500 font-semibold inline-flex items-center gap-1"
        >
          <Play size={11} /> Execute
        </button>
      ) : (
        <span className="text-[11px] px-2.5 py-1 rounded-md bg-ink-800 text-ink-500">Recommend only</span>
      )}
    </div>
  );
}

/* ─────────────────── Persona pivots (non-SCO) ─────────────────── */

const mfgBatches = {
  title: "Batches in progress",
  columns: ["Batch", "Site / Suite", "Therapy", "Step", "Status", "Agent"],
  rows: [
    ["B-T1-2418", "RTP / Suite 1", "T1 · CryoAph", "Day-7 expansion", "on-track", "—"],
    ["B-T1-2419", "RTP / Suite 2", "T1 · CryoAph", "QC release", "at-risk", "approval (slot swap)"],
    ["B-T2-2420", "Leiden / Suite 1", "T2 · CryoAph", "Day-12 harvest", "delayed", "playbook: PB-LOT-LOCK"],
    ["B-T2-2421", "Leiden / Suite 2", "T2 · FreshAph", "Mfg start", "on-track", "—"],
    ["B-T1-2422", "Singapore / Suite 1", "T1 · CryoAph", "Day-3 transduction", "on-track", "—"],
    ["B-T2-2423", "RTP / Suite 3", "T2 · CryoAph", "QC test", "at-risk", "rec: re-test"],
  ],
};
const qaLots = {
  title: "Lots awaiting disposition",
  columns: ["Lot", "Therapy", "Site", "Aging", "Disposition checklist", "Agent"],
  rows: [
    ["DP-LOT-2204", "T1 · CryoAph", "RTP", "32h", "8/9 — CoC pending", "agent: deviation pre-fill (await QA)"],
    ["DP-LOT-2205", "T1 · CryoAph", "Leiden", "18h", "9/9 — ready", "—"],
    ["DP-LOT-2206", "T2 · FreshAph", "Leiden", "44h", "7/9 — IPC variance", "playbook: PB-LOT-LOCK"],
    ["DP-LOT-2207", "T1 · CryoAph", "RTP", "12h", "9/9 — ready", "—"],
    ["DP-LOT-2208", "T2 · CryoAph", "Singapore", "26h", "8/9 — sterility result", "rec: link evidence"],
  ],
};
const spCapacity = {
  title: "Slot capacity vs. confirmed demand",
  columns: ["Site", "Therapy / Modality", "Slots", "Demand", "Headroom", "SLOB exposure"],
  rows: [
    ["RTP", "T1 · CryoAph", "120/wk", "118", "+2", "$1.2M"],
    ["Leiden", "T1 · CryoAph", "80/wk", "72", "+8", "$0.6M"],
    ["Leiden", "T2 · FreshAph", "20/wk", "24", "−4", "$0.0M"],
    ["Leiden", "T2 · CryoAph", "20/wk", "18", "+2", "$0.4M"],
    ["Singapore", "T1 · CryoAph", "60/wk", "53", "+7", "$0.9M"],
  ],
};
const whShipments = {
  title: "Inbound / outbound + storage excursions",
  columns: ["ID", "Type", "Lot / Order", "ETA / ETD", "CoC integrity", "Agent"],
  rows: [
    ["SHP-7702", "Outbound DP", "DP-LOT-2204", "ETA TC-NYC 10:30", "BREACH", "agent: locked + dev pre-fill"],
    ["SHP-7703", "Outbound DP", "DP-LOT-2205", "ETA TC-LDN 17:00", "OK", "—"],
    ["SHP-7704", "Inbound Aph", "ORD-60042", "ETA RTP 22:00", "OK", "—"],
    ["SHP-7705", "Outbound DP", "DP-LOT-2207", "ETA TC-PAR 09:00", "OK", "—"],
    ["EXC-991", "Storage excursion", "DP-LOT-2204", "in-progress", "Time-in-excursion 1h12m", "agent: lot auto-locked"],
  ],
};
const coTickets = {
  title: "Open enrollment cases & tickets",
  columns: ["Case", "Type", "Country", "Aging", "Status", "Agent"],
  rows: [
    ["CASE-7711", "Eligibility", "Germany", "61h", "blocked — payer", "playbook: PB-ENROL-EXC"],
    ["CASE-7712", "Slot conflict", "France", "12h", "open", "rec: PB-TC-RESCHED"],
    ["CASE-7713", "Patient comm", "USA", "4h", "open", "agent routed to country team"],
    ["CASE-7714", "Order entry error", "Italy", "22h", "in progress", "—"],
    ["CASE-7715", "Consent re-sign", "Spain", "30h", "open", "agent: templated comm sent"],
  ],
};
const ceActivations = {
  title: "Treatment center activations & demand",
  columns: ["TC", "Country", "Status", "Throughput", "Demand attainment", "Agent"],
  rows: [
    ["TC-LDN", "United Kingdom", "active", "9/qtr", "92%", "—"],
    ["TC-AMS", "Netherlands", "activating", "—", "—", "rec: training schedule"],
    ["TC-PAR", "France", "active", "11/qtr", "97%", "—"],
    ["TC-MIL", "Italy", "active", "8/qtr", "89%", "rec: site engagement"],
    ["TC-MAD", "Spain", "active", "10/qtr", "95%", "—"],
  ],
};

function PersonaPivot({ persona, entries, setOpenOrder }) {
  return (
    <div className="px-5 py-4 space-y-4">
      <div className="rounded-lg border border-ink-700/70 bg-gradient-to-br from-ink-900 via-ink-900 to-ink-900/40 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: persona.color }}>{persona.name} — execution view (Tier 1 entry)</div>
        <div className="text-white text-[16px] font-medium leading-tight mt-0.5">{entries.title}</div>
      </div>
      <div className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
        <table className="w-full text-[12px]">
          <thead className="text-[10.5px] uppercase tracking-wide text-ink-400">
            <tr className="border-b border-ink-700/70">
              {entries.columns.map((c) => <Th key={c}>{c}</Th>)}
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {entries.rows.map((row, i) => (
              <tr key={i} className="border-b border-ink-800/60 hover:bg-ink-900/40">
                {row.map((cell, j) => (
                  <td key={j} className="px-2 py-1.5 text-ink-200">
                    {j === 0 ? <span className="font-mono text-[11.5px] text-white">{cell}</span> :
                      typeof cell === "string" && (cell.startsWith("agent:") || cell.startsWith("playbook:") || cell.startsWith("rec:") || cell.startsWith("approval"))
                        ? <span className="text-[11px] inline-flex items-center gap-1 rounded bg-accent-600/15 text-accent-200 px-1.5 py-0.5"><Bot size={10} /> {cell}</span>
                      : cell === "on-track" ? <Pill tone="good">{cell}</Pill>
                      : cell === "at-risk" ? <Pill tone="warn">{cell}</Pill>
                      : cell === "delayed" ? <Pill tone="bad">{cell}</Pill>
                      : cell === "BREACH" ? <Pill tone="bad">{cell}</Pill>
                      : cell === "OK" ? <Pill tone="good">{cell}</Pill>
                      : cell}
                  </td>
                ))}
                <td className="px-2 py-1.5 text-right">
                  {setOpenOrder ? (
                    <button onClick={() => setOpenOrder(orders[i % orders.length])} className="text-[11px] px-2 py-1 rounded-md bg-ink-800 hover:bg-ink-700">Inspect</button>
                  ) : (
                    <button className="text-[11px] px-2 py-1 rounded-md bg-ink-800 hover:bg-ink-700">Inspect</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
