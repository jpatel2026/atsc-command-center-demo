import { recentActions, exceptionList, approvals } from "../data/seed.js";
import { ShieldCheck, Lock, FileLock2, Globe } from "lucide-react";

const auditEvents = [
  { ts: "14:52:18", actor: "agent", level: "L3", scope: "WMS", action: "Auto-locked DP-LOT-2204 on confirmed excursion", before: "status=available", after: "status=locked", linked: "EX-9218" },
  { ts: "14:51:09", actor: "agent", level: "L3", scope: "Comms", action: "Notified Quality + SCO leads (templated)", before: "—", after: "5 recipients · template QA-EXC-01 v3", linked: "EX-9218" },
  { ts: "14:48:51", actor: "agent", level: "L1", scope: "QMS", action: "Pre-filled deviation DEV-22041", before: "—", after: "DEV-22041 status=draft (awaiting QA)", linked: "EX-9218" },
  { ts: "14:32:02", actor: "user (M.Patel · SCO)", level: "—", scope: "Slot Mgmt", action: "Confirmed Aph slot AMS-Aug19-09:30", before: "status=tentative", after: "status=confirmed", linked: "EX-9217" },
  { ts: "14:18:33", actor: "agent", level: "L1", scope: "TMS", action: "Requested expedited carrier for SHP-7702 (awaiting approval)", before: "carrier=STD-FRZ-A", after: "carrier=EXP-FRZ-B (proposed)", linked: "AP-3403" },
  { ts: "14:02:11", actor: "agent", level: "L3", scope: "Ticket", action: "Routed 6 enrollment tickets to DE country team", before: "queue=GLOBAL", after: "queue=DE-CO", linked: "EX-9219" },
  { ts: "13:58:47", actor: "agent", level: "L3", scope: "Patient Orch", action: "Sent reschedule comm to 4 patients (de-identified)", before: "—", after: "template P-RESC-02 v4 sent", linked: "EX-9217" },
  { ts: "13:40:21", actor: "user (S.Iverson · QA)", level: "—", scope: "QMS", action: "Approved CAPA initiation CAPA-1102", before: "CAPA draft", after: "CAPA active", linked: "—" },
  { ts: "13:22:08", actor: "agent", level: "L1", scope: "Slot Mgmt", action: "Released held Aph slot LON-Aug15 (rolled back)", before: "status=held", after: "status=available", linked: "EX-9217" },
  { ts: "13:10:58", actor: "policy admin", level: "—", scope: "Policy", action: "Updated autonomy: 'Reroute shipment' L1 → L1 (Germany only) — no change in level, scope narrowed", before: "scope=global", after: "scope=DE", linked: "POL-22-04" },
  { ts: "12:58:42", actor: "user (J.Tanaka · CE)", level: "—", scope: "TC Portal", action: "Activated treatment center TC-OSAKA", before: "status=onboarding", after: "status=active", linked: "—" },
  { ts: "12:47:16", actor: "agent", level: "L0", scope: "—", action: "Recommended capacity expansion for T2 CryoAph at Leiden (Q3)", before: "—", after: "rec accepted by SP", linked: "—" },
];

export default function AuditLog() {
  return (
    <div className="px-5 py-4 space-y-4">
      <div className="rounded-lg border border-ink-700/70 bg-gradient-to-br from-ink-900 via-ink-900 to-accent-900/10 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-accent-300">Audit, compliance, security (Epic 12)</div>
        <div className="text-white text-[16px] font-medium leading-tight mt-0.5">Tamper-evident log of every view, user/agent action, approval, rollback, policy change, AI output</div>
        <p className="text-[12.5px] text-ink-300 mt-2 max-w-3xl">
          Aligned to GxP and the regional regulatory expectations of the {23} Therapy #1 markets. Patient identifiers are de-identified by default;
          re-identification is gated by explicit, logged permission.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-2">
        {[
          { icon: ShieldCheck, label: "GAMP 5 risk-based", note: "Validation depth scaled by GxP impact per action type" },
          { icon: Lock, label: "Tamper-evident", note: "Append-only with cryptographic chain" },
          { icon: FileLock2, label: "PII de-identified", note: "Re-identification logged & auditable" },
          { icon: Globe, label: "Regional policy variants", note: "23 countries · Therapy #1 commercial scope" },
        ].map((g) => (
          <div key={g.label} className="rounded-md border border-ink-700/70 bg-ink-950/60 p-3">
            <div className="flex items-center gap-2 text-[12px] text-white font-semibold"><g.icon size={14} /> {g.label}</div>
            <div className="text-[11px] text-ink-400 mt-1">{g.note}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Audit stream — last hour</div>
          <span className="text-[10.5px] text-ink-500">filterable by actor / level / scope · exportable</span>
          <button className="ml-auto text-[11px] px-2 py-1 rounded-md bg-ink-800 hover:bg-ink-700">Export</button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-[12px]">
            <thead className="text-[10.5px] uppercase tracking-wide text-ink-400">
              <tr className="border-b border-ink-700/70">
                <th className="text-left px-2 py-1.5 font-medium">Timestamp</th>
                <th className="text-left px-2 py-1.5 font-medium">Actor</th>
                <th className="text-left px-2 py-1.5 font-medium">Level</th>
                <th className="text-left px-2 py-1.5 font-medium">Scope</th>
                <th className="text-left px-2 py-1.5 font-medium">Action</th>
                <th className="text-left px-2 py-1.5 font-medium">Before → After</th>
                <th className="text-left px-2 py-1.5 font-medium">Linked</th>
              </tr>
            </thead>
            <tbody>
              {auditEvents.map((e, i) => (
                <tr key={i} className="border-b border-ink-800/60 hover:bg-ink-900/40">
                  <td className="px-2 py-1.5 font-mono text-[11px] text-ink-300">{e.ts}</td>
                  <td className="px-2 py-1.5">
                    <span className={`text-[10px] font-semibold rounded px-1.5 py-0.5 ${
                      e.actor === "agent" ? "bg-accent-600/15 text-accent-200" :
                      e.actor.startsWith("policy") ? "bg-warn-500/15 text-warn-500" :
                      "bg-ink-700 text-ink-200"
                    }`}>{e.actor}</span>
                  </td>
                  <td className="px-2 py-1.5 text-ink-300">{e.level}</td>
                  <td className="px-2 py-1.5 text-ink-300">{e.scope}</td>
                  <td className="px-2 py-1.5 text-white">{e.action}</td>
                  <td className="px-2 py-1.5 text-[11.5px] text-ink-300">
                    <span className="text-ink-500">{e.before}</span>
                    <span className="mx-1 text-ink-600">→</span>
                    <span className="text-ink-200">{e.after}</span>
                  </td>
                  <td className="px-2 py-1.5 font-mono text-[10.5px] text-accent-200">{e.linked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
