import { useState } from "react";
import { Bot, X, Send, Sparkles, AlertTriangle, Play, ShieldAlert, Check, RotateCcw } from "lucide-react";
import { exceptionList, recentActions, approvals, playbooks } from "../data/seed.js";

const tabs = [
  { id: "exc", label: "Exceptions" },
  { id: "rec", label: "Recommendations" },
  { id: "appr", label: "Approvals" },
  { id: "play", label: "Playbooks" },
  { id: "hist", label: "History" },
  { id: "ask", label: "Ask" },
];

export default function AgentDock({ open, setOpen, screen, persona, runPlaybook, agentScope }) {
  const [tab, setTab] = useState("exc");
  if (!open) return null;
  return (
    <aside className="fixed top-[121px] right-0 bottom-0 w-[380px] glass border-l border-ink-700/70 z-30 flex flex-col">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-ink-700/70">
        <div className="h-6 w-6 rounded-md bg-accent-600/20 grid place-items-center text-accent-300 ring-1 ring-accent-500/30">
          <Bot size={13} />
        </div>
        <div className="leading-tight flex-1 min-w-0">
          <div className="text-[12.5px] font-semibold text-white">AI Agent</div>
          <div className="text-[10px] text-ink-400 truncate">{agentScope}</div>
        </div>
        <button onClick={() => setOpen(false)} className="h-6 w-6 grid place-items-center rounded text-ink-300 hover:text-white hover:bg-ink-800">
          <X size={14} />
        </button>
      </div>

      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-ink-700/70 bg-ink-900/40 overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-2 py-1 rounded text-[11.5px] font-medium ${tab === t.id ? "bg-accent-600/15 text-accent-200" : "text-ink-300 hover:text-white"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {tab === "exc" && <Exceptions runPlaybook={runPlaybook} />}
        {tab === "rec" && <Recommendations runPlaybook={runPlaybook} />}
        {tab === "appr" && <Approvals />}
        {tab === "play" && <PlaybooksMini runPlaybook={runPlaybook} />}
        {tab === "hist" && <History />}
        {tab === "ask" && <Ask />}
      </div>
    </aside>
  );
}

function Exceptions({ runPlaybook }) {
  return (
    <div className="p-3 space-y-2">
      <div className="text-[10.5px] uppercase tracking-wider text-ink-400 font-semibold">Latest exceptions in scope · ranked by impact</div>
      {exceptionList.map((e) => (
        <div key={e.id} className={`rounded-md border p-2.5 ${
          e.severity === "critical" ? "border-bad-500/40 bg-bad-500/5" :
          e.severity === "high" ? "border-warn-500/40 bg-warn-500/5" :
          "border-ink-700/70 bg-ink-900/60"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold uppercase rounded px-1.5 py-0.5 ${
              e.severity === "critical" ? "bg-bad-500/20 text-bad-500" : e.severity === "high" ? "bg-warn-500/20 text-warn-500" : "bg-ink-700 text-ink-200"
            }`}>{e.severity}</span>
            <span className="text-[10px] text-ink-400">{e.detected}</span>
            <span className="ml-auto text-[10px] font-mono text-ink-400">{e.id}</span>
          </div>
          <div className="text-[12.5px] font-semibold text-white mt-1.5 leading-snug">{e.title}</div>
          <div className="text-[11px] text-ink-300 mt-0.5">{e.impact}</div>
          {e.agent.state === "playbook" && (
            <div className="mt-2 rounded bg-accent-600/10 border border-accent-500/30 p-2 text-[11px]">
              <div className="text-accent-200 font-semibold flex items-center gap-1"><Bot size={11} /> Playbook running · step {e.agent.step}</div>
              <div className="text-ink-300">awaiting: {e.agent.awaiting}</div>
            </div>
          )}
          {e.agent.state === "acted" && (
            <div className="mt-2 rounded bg-ok-500/10 border border-ok-500/30 p-2 text-[11px]">
              <div className="text-ok-500 font-semibold flex items-center gap-1"><Check size={11} /> Agent acted · {e.agent.autonomy}</div>
              <ul className="list-disc list-inside text-ink-300 mt-0.5">
                {e.agent.actions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
          {e.agent.state === "approval" && (
            <div className="mt-2 rounded bg-warn-500/10 border border-warn-500/30 p-2 text-[11px]">
              <div className="text-warn-500 font-semibold flex items-center gap-1"><AlertTriangle size={11} /> Awaiting approval</div>
              <div className="text-ink-300">{e.agent.awaiting}</div>
            </div>
          )}
          {e.agent.state === "recommendation" && (
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => e.agent.playbookId && runPlaybook?.(e.agent.playbookId, e.id)}
                className="text-[11px] px-2 py-1 rounded-md bg-accent-600 text-white hover:bg-accent-500 font-semibold inline-flex items-center gap-1"
              >
                <Play size={11} /> Run {e.agent.playbookId || "action"}
              </button>
              <button className="text-[11px] px-2 py-1 rounded-md bg-ink-800 hover:bg-ink-700">Why this</button>
              <span className="ml-auto text-[10px] text-ink-400">{e.agent.autonomy}</span>
            </div>
          )}
          <div className="mt-2 text-[10px] text-ink-500 truncate">sources: {e.sources.join(" · ")}</div>
        </div>
      ))}
    </div>
  );
}

function Recommendations({ runPlaybook }) {
  const recs = [
    { title: "Re-prioritize 4 at-risk T2 batches at Leiden Aug 14–16", impact: "+1.2d slack", level: "L1", target: "MES" },
    { title: "Run apheresis slip recovery on 3 selected T1 orders", impact: "−2.1d projected", level: "L2", target: "Slot+Patient+TC", playbookId: "PB-APH-SLIP" },
    { title: "Escalate DE country team backlog (8 cases)", impact: "SLA recovery", level: "L1", target: "Ticket" },
    { title: "Update DP availability ETA at 3 TCs", impact: "Patient comm freshness", level: "L1", target: "TC Portal" },
  ];
  return (
    <div className="p-3 space-y-2">
      <div className="text-[10.5px] uppercase tracking-wider text-ink-400 font-semibold">Recommended next-best actions</div>
      {recs.map((r, i) => (
        <div key={i} className="rounded-md border border-ink-700/70 bg-ink-900/60 p-2.5">
          <div className="text-[12.5px] font-medium text-white leading-snug">{r.title}</div>
          <div className="text-[11px] text-ink-300 mt-0.5">expected: {r.impact} · target: {r.target}</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10.5px] rounded bg-accent-600/15 text-accent-200 px-1.5 py-0.5 font-semibold">{r.level}</span>
            <button className="text-[11px] px-2 py-1 rounded-md bg-ink-800 hover:bg-ink-700">Why this</button>
            <button className="text-[11px] px-2 py-1 rounded-md bg-ink-800 hover:bg-ink-700">Preview</button>
            <button
              onClick={() => r.playbookId ? runPlaybook?.(r.playbookId, "scope") : null}
              className="ml-auto text-[11px] px-2 py-1 rounded-md bg-accent-600 text-white hover:bg-accent-500 font-semibold inline-flex items-center gap-1"
            >
              <Play size={11} /> Execute
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Approvals() {
  return (
    <div className="p-3 space-y-2">
      <div className="text-[10.5px] uppercase tracking-wider text-ink-400 font-semibold">Approvals queue</div>
      {approvals.map((a) => (
        <div key={a.id} className="rounded-md border border-ink-700/70 bg-ink-900/60 p-2.5">
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className={`rounded px-1.5 py-0.5 font-semibold ${
              a.priority === "critical" ? "bg-bad-500/20 text-bad-500" :
              a.priority === "high" ? "bg-warn-500/20 text-warn-500" :
              "bg-ink-700 text-ink-200"
            }`}>{a.priority}</span>
            <span className="text-ink-400 font-mono">{a.id}</span>
            <span className="ml-auto text-ink-300 font-mono">expires in {a.expiresIn}</span>
          </div>
          <div className="text-[12.5px] font-medium text-white mt-1.5 leading-snug">{a.action}</div>
          <div className="text-[11px] text-ink-300 mt-0.5">target: <span className="font-mono text-ink-200">{a.target}</span> · {a.requester}</div>
          <div className="text-[10.5px] text-ink-400 mt-1">level <b>{a.level}</b> · blast {a.blast} · reversible {a.reversible}</div>
          <div className="mt-2 flex gap-2">
            <button className="text-[11.5px] px-2.5 py-1 rounded-md bg-ok-500/15 text-ok-500 hover:bg-ok-500/20 font-semibold">Approve</button>
            <button className="text-[11.5px] px-2.5 py-1 rounded-md bg-ink-800 hover:bg-ink-700">Deny</button>
            <button className="text-[11.5px] px-2.5 py-1 rounded-md bg-ink-800 hover:bg-ink-700">Preview</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PlaybooksMini({ runPlaybook }) {
  return (
    <div className="p-3 space-y-2">
      <div className="text-[10.5px] uppercase tracking-wider text-ink-400 font-semibold">Playbook library · {playbooks.length}</div>
      {playbooks.map((p) => (
        <div key={p.id} className="rounded-md border border-ink-700/70 bg-ink-900/60 p-2.5">
          <div className="flex items-center gap-2">
            <div className="text-[12.5px] font-semibold text-white">{p.name}</div>
            <span className="ml-auto text-[10.5px] rounded bg-accent-600/15 text-accent-200 px-1.5 py-0.5 font-semibold">{p.initialAutonomy}</span>
          </div>
          <div className="text-[11px] text-ink-300 mt-0.5 leading-snug">{p.description}</div>
          <div className="text-[10.5px] text-ink-500 mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
            <span>{p.steps.length} steps</span>
            <span>· avg {p.avgRunMins}m</span>
            <span>· success {p.successRate}%</span>
            <span>· {p.runs7d} runs (7d)</span>
          </div>
          <div className="mt-2 flex gap-2">
            <button className="text-[11px] px-2 py-1 rounded-md bg-ink-800 hover:bg-ink-700">View steps</button>
            <button onClick={() => runPlaybook?.(p.id, "scope")} className="ml-auto text-[11px] px-2.5 py-1 rounded-md bg-accent-600 text-white hover:bg-accent-500 font-semibold inline-flex items-center gap-1">
              <Play size={11} /> Run
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function History() {
  return (
    <div className="p-3 space-y-1">
      <div className="text-[10.5px] uppercase tracking-wider text-ink-400 font-semibold mb-1">Recent actions (human + agent)</div>
      {recentActions.map((h, i) => (
        <div key={i} className="text-[11.5px] rounded-md border border-ink-800 bg-ink-900/50 px-2.5 py-1.5 flex items-center gap-2">
          <span className="font-mono text-[10.5px] text-ink-400 w-10">{h.ts}</span>
          <span className={`text-[9.5px] font-semibold rounded px-1 py-0.5 ${h.actor === "agent" ? "bg-accent-600/15 text-accent-200" : "bg-ink-700 text-ink-200"}`}>{h.actor}</span>
          <span className="text-[9.5px] text-ink-400 w-7">{h.level}</span>
          <span className="flex-1 truncate text-ink-100">{h.action}</span>
          <span className={`text-[9.5px] rounded px-1 py-0.5 ${h.outcome === "success" ? "bg-ok-500/15 text-ok-500" : h.outcome === "awaiting-approval" ? "bg-warn-500/15 text-warn-500" : "bg-ink-700 text-ink-200"}`}>{h.outcome}</span>
        </div>
      ))}
    </div>
  );
}

function Ask() {
  const [q, setQ] = useState("");
  const [chat, setChat] = useState([
    { who: "agent", text: "Ask anything in scope — KPIs, exceptions, orders, in-flight actions. I'll cite sources and refuse out-of-scope." },
    { who: "user", text: "Why did Aph→DP cycle time slip in March?" },
    { who: "agent", text: "Mar 2026 cycle time averaged 107% of standard, ~7pp above target. The slip is concentrated in T2 CryoAph orders out of Leiden (62% of variance), driven by Aph cryopreservation step time +5.4h. Likely cause: operator backlog after the 2026-02-22 maintenance window. I have 3 recommended actions, all L1 or L2.\n\nSources: MES batch records · TMS sensor stream · QMS deviation log." },
  ]);
  const send = () => {
    if (!q.trim()) return;
    setChat([...chat, { who: "user", text: q }, { who: "agent", text: "Working on a grounded answer (demo) — see the live drill-down on Aph→DP cycle for the full breakdown with citations." }]);
    setQ("");
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {chat.map((m, i) => (
          <div key={i} className={`max-w-[90%] rounded-md p-2 text-[12.5px] leading-snug ${m.who === "user" ? "ml-auto bg-accent-600/15 text-white" : "bg-ink-900/70 text-ink-100 border border-ink-700/70"}`}>
            {m.who === "agent" && <div className="text-[10px] uppercase tracking-wider text-accent-300 font-semibold mb-1 flex items-center gap-1"><Sparkles size={10} /> agent</div>}
            <div style={{ whiteSpace: "pre-line" }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-700/70 p-2">
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask the agent…"
            className="flex-1 bg-ink-900/70 border border-ink-700 rounded px-2.5 py-1.5 text-[12.5px] outline-none focus:border-accent-500"
          />
          <button onClick={send} className="h-8 w-8 rounded-md bg-accent-600 text-white grid place-items-center hover:bg-accent-500"><Send size={13} /></button>
        </div>
        <div className="mt-1.5 text-[10px] text-ink-500 flex items-center gap-2">
          <ShieldAlert size={10} /> Scoped to your persona & filters · refuses out-of-scope
        </div>
      </div>
    </div>
  );
}
