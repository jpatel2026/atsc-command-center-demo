import { autonomyMatrix } from "../data/seed.js";
import { ShieldCheck, AlertOctagon, Pause, RotateCcw, Globe } from "lucide-react";

const levelColor = {
  L0: "bg-ink-700 text-ink-200",
  L1: "bg-ok-500/15 text-ok-500 ring-1 ring-ok-500/30",
  L2: "bg-accent-600/15 text-accent-200 ring-1 ring-accent-500/30",
  L3: "bg-warn-500/15 text-warn-500 ring-1 ring-warn-500/30",
};

export default function AutonomyPolicy() {
  return (
    <div className="px-5 py-4 space-y-4">
      <div className="rounded-lg border border-ink-700/70 bg-gradient-to-br from-ink-900 via-ink-900 to-accent-900/10 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-accent-300">Autonomy & policy framework (Epic 14)</div>
        <div className="text-white text-[16px] font-medium leading-tight mt-0.5">Bounded autonomy — every action carries a level, blast radius, reversibility, and compensation path</div>
        <p className="text-[12.5px] text-ink-300 mt-2 max-w-3xl">
          Policies are versioned, reviewable, and require change-control sign-off appropriate to GxP impact. GxP-critical decisions
          (batch disposition, regulatory holds, quality records of record) never auto-execute and are pinned at L0 or L1.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-3">
        {[
          { lvl: "L0", title: "Recommend", text: "Propose only; no execute affordance.", ex: "Strategic recs, demand-shaping, cross-functional escalations.", count: 78, color: "ink" },
          { lvl: "L1", title: "One-click execute", text: "Human approves, agent executes single action.", ex: "Reschedule slot, expedite shipment, resolve standard ticket.", count: 168, color: "ok" },
          { lvl: "L2", title: "Approved playbook", text: "Pre-approved multi-step; pauses where policy requires.", ex: "Aph slip recovery, excursion containment, DP delay recovery.", count: 119, color: "accent" },
          { lvl: "L3", title: "Autonomous (guardrails)", text: "Acts within bounded scope; human-on-the-loop oversight.", ex: "Auto-lock lot on excursion, route std tickets, templated comms.", count: 47, color: "warn" },
        ].map((c) => (
          <div key={c.lvl} className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
            <div className="flex items-baseline gap-2">
              <span className={`text-[12px] font-semibold rounded px-2 py-0.5 ${levelColor[c.lvl]}`}>{c.lvl}</span>
              <div className="text-white text-[14px] font-semibold tracking-tight">{c.title}</div>
              <div className="ml-auto text-[10.5px] text-ink-400">{c.count} (24h)</div>
            </div>
            <p className="text-[12px] text-ink-300 mt-1.5">{c.text}</p>
            <div className="text-[11px] text-ink-400 mt-1.5">e.g. {c.ex}</div>
          </div>
        ))}
      </div>

      {/* Guardrails strip */}
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-2">
        {[
          { icon: ShieldCheck, label: "Pre-execution validation", note: "Scope, RBAC, autonomy, blast radius, system constraints" },
          { icon: AlertOctagon, label: "Blast-radius limits", note: "Max orders/lots/shipments per autonomous action window" },
          { icon: Pause, label: "Kill switch (scoped)", note: "Pause global or by system, persona, country, T×M, action type" },
          { icon: RotateCcw, label: "Reversibility classification", note: "Reversible / window / irreversible — irreversible blocked from L3" },
          { icon: Globe, label: "Region/Market policy", note: "Therapy #1 across 23 countries — local policy variants supported" },
        ].map((g) => (
          <div key={g.label} className="rounded-md border border-ink-700/70 bg-ink-950/60 p-3">
            <div className="flex items-center gap-2 text-[12px] text-white font-semibold"><g.icon size={14} /> {g.label}</div>
            <div className="text-[11px] text-ink-400 mt-1">{g.note}</div>
          </div>
        ))}
      </div>

      {/* Matrix */}
      <div className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Autonomy matrix · action types × system × level</div>
          <span className="text-[10.5px] text-ink-500">parameterized per persona × Therapy × Modality × Country</span>
          <button className="ml-auto text-[11px] px-2 py-1 rounded-md bg-bad-500/10 text-bad-500 border border-bad-500/30 hover:bg-bad-500/15">⏸ Kill switch</button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-[12px]">
            <thead className="text-[10.5px] uppercase tracking-wide text-ink-400">
              <tr className="border-b border-ink-700/70">
                <th className="text-left px-2 py-1.5 font-medium">Action type</th>
                <th className="text-left px-2 py-1.5 font-medium">System</th>
                <th className="text-left px-2 py-1.5 font-medium">Level</th>
                <th className="text-left px-2 py-1.5 font-medium">Blast radius</th>
                <th className="text-left px-2 py-1.5 font-medium">Reversibility</th>
                <th className="text-left px-2 py-1.5 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {autonomyMatrix.map((r, i) => (
                <tr key={i} className="border-b border-ink-800/60 hover:bg-ink-900/40">
                  <td className="px-2 py-1.5 text-white">{r.actionType}</td>
                  <td className="px-2 py-1.5 text-ink-300">{r.system}</td>
                  <td className="px-2 py-1.5"><span className={`text-[10.5px] font-semibold rounded px-1.5 py-0.5 ${levelColor[r.level]}`}>{r.level}</span></td>
                  <td className="px-2 py-1.5 text-ink-300">{r.blastRadius}</td>
                  <td className="px-2 py-1.5 text-ink-300">{r.reversibility}</td>
                  <td className="px-2 py-1.5 text-ink-400 text-[11.5px]">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
