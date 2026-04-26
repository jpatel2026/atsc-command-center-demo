import { playbooks } from "../data/seed.js";
import { Play, BookOpen, Check, Pause, AlertTriangle, RotateCcw } from "lucide-react";

const lvlClass = {
  L0: "bg-ink-700 text-ink-200",
  L1: "bg-ok-500/15 text-ok-500",
  L2: "bg-accent-600/15 text-accent-200",
  L3: "bg-warn-500/15 text-warn-500",
};

export default function PlaybookLibrary({ runPlaybook }) {
  return (
    <div className="px-5 py-4 space-y-4">
      <div className="rounded-lg border border-ink-700/70 bg-gradient-to-br from-ink-900 via-ink-900 to-accent-900/10 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-accent-300">Playbook library (Epic 15)</div>
        <div className="text-white text-[16px] font-medium leading-tight mt-0.5">Versioned, multi-step action sequences for common exception patterns</div>
        <p className="text-[12.5px] text-ink-300 mt-2 max-w-3xl">
          Each playbook declares triggers, autonomy per step, approval points, success criteria, and a compensation flow. Lifecycle:
          draft → validated → active → retired. Versions immutable once active.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        {playbooks.map((p) => (
          <div key={p.id} className="rounded-lg border border-ink-700/70 bg-ink-900/40 p-4">
            <div className="flex items-center gap-2">
              <BookOpen size={14} className="text-accent-300" />
              <div className="text-white text-[14px] font-semibold tracking-tight">{p.name}</div>
              <span className={`text-[10.5px] rounded px-1.5 py-0.5 font-semibold ${lvlClass[p.initialAutonomy]}`}>{p.initialAutonomy}</span>
              <span className="ml-auto text-[10.5px] text-ink-400 font-mono">{p.id}</span>
            </div>
            <p className="text-[12px] text-ink-300 mt-1.5">{p.description}</p>
            <div className="text-[10.5px] text-ink-400 mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
              <span>{p.steps.length} steps</span>
              <span>· avg {p.avgRunMins}m</span>
              <span>· success {p.successRate}%</span>
              <span>· runs (7d): <b className="text-ink-200">{p.runs7d}</b></span>
              <span>· triggers: {p.triggers.join(" · ")}</span>
            </div>
            <ol className="mt-3 space-y-1.5">
              {p.steps.map((s) => (
                <li key={s.n} className="flex items-center gap-2 rounded border border-ink-800 bg-ink-950/40 px-2.5 py-1.5">
                  <span className="text-[10.5px] text-ink-400 font-mono w-6">{s.n}</span>
                  <span className="text-[12px] text-white truncate flex-1">{s.title}</span>
                  <span className={`text-[10px] rounded px-1.5 py-0.5 font-semibold ${lvlClass[s.autonomy]}`}>{s.autonomy}</span>
                  <span className="text-[10.5px] text-ink-400 w-28 text-right">{s.system}</span>
                  <span className="text-[9.5px] uppercase tracking-wide w-20 text-right">
                    {s.reversible
                      ? <span className="text-ok-500"><RotateCcw size={9} className="inline -mt-px" /> reversible</span>
                      : <span className="text-bad-500"><AlertTriangle size={9} className="inline -mt-px" /> irreversible</span>}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-3 flex gap-2">
              <button className="text-[11px] px-2 py-1 rounded-md bg-ink-800 hover:bg-ink-700">View versions</button>
              <button className="text-[11px] px-2 py-1 rounded-md bg-ink-800 hover:bg-ink-700">Validate</button>
              <button onClick={() => runPlaybook?.(p.id, "scope")} className="ml-auto text-[11.5px] px-2.5 py-1 rounded-md bg-accent-600 text-white hover:bg-accent-500 font-semibold inline-flex items-center gap-1">
                <Play size={11} /> Run playbook
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
