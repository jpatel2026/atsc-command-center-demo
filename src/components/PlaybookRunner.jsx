import { useEffect, useState } from "react";
import { playbooks } from "../data/seed.js";
import { X, Check, Pause, Play, AlertTriangle, RotateCcw } from "lucide-react";

const lvlClass = {
  L0: "bg-ink-700 text-ink-200",
  L1: "bg-ok-500/15 text-ok-500",
  L2: "bg-accent-600/15 text-accent-200",
  L3: "bg-warn-500/15 text-warn-500",
};

export default function PlaybookRunner({ run, onClose }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const pb = playbooks.find((p) => p.id === run?.playbookId);

  useEffect(() => {
    if (!pb || paused) return;
    if (stepIdx >= pb.steps.length) return;
    const step = pb.steps[stepIdx];
    // L1 / L2 with approval pause to simulate human-in-the-loop
    if (step.autonomy === "L1" && stepIdx === 2) {
      setPaused(true);
      return;
    }
    const t = setTimeout(() => setStepIdx((i) => i + 1), 1100);
    return () => clearTimeout(t);
  }, [stepIdx, paused, pb]);

  if (!run || !pb) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl rounded-xl border border-ink-700 bg-ink-900 shadow-2xl overflow-hidden">
        <div className="flex items-start gap-3 px-5 py-4 border-b border-ink-700/70 bg-gradient-to-r from-ink-900 to-accent-900/10">
          <div className="h-10 w-10 rounded-md bg-accent-600/20 grid place-items-center text-accent-300 ring-1 ring-accent-500/30">
            <Play size={18} />
          </div>
          <div className="flex-1">
            <div className="text-[10.5px] uppercase tracking-wider text-accent-300 font-semibold">Playbook execution · live trace</div>
            <div className="text-white text-[16px] font-semibold tracking-tight">{pb.name}</div>
            <div className="text-[12px] text-ink-400 mt-0.5">target: <span className="font-mono text-ink-200">{run.target}</span> · initial autonomy {pb.initialAutonomy} · idempotency keys enforced</div>
          </div>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded text-ink-300 hover:text-white hover:bg-ink-800"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-2">
          {pb.steps.map((s, i) => {
            const state = i < stepIdx ? "done" : i === stepIdx ? (paused ? "paused" : "running") : "pending";
            return (
              <div key={s.n} className={`rounded-md border p-3 flex items-center gap-3 ${
                state === "done" ? "border-ok-500/30 bg-ok-500/5" :
                state === "running" ? "border-accent-500 bg-accent-600/10 shimmer" :
                state === "paused" ? "border-warn-500/30 bg-warn-500/5" :
                "border-ink-700/70 bg-ink-950/40"
              }`}>
                <span className="text-[11.5px] font-mono text-ink-400 w-6">{s.n}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] text-white font-medium">{s.title}</div>
                  <div className="text-[10.5px] text-ink-400">target: {s.system} · {s.reversible ? "reversible · compensation handler available" : "irreversible"}</div>
                </div>
                <span className={`text-[10px] rounded px-1.5 py-0.5 font-semibold ${lvlClass[s.autonomy]}`}>{s.autonomy}</span>
                {state === "done" && <span className="text-[10.5px] text-ok-500 inline-flex items-center gap-1"><Check size={11} /> success</span>}
                {state === "running" && <span className="text-[10.5px] text-accent-200 inline-flex items-center gap-1"><Play size={11} /> running</span>}
                {state === "paused" && <span className="text-[10.5px] text-warn-500 inline-flex items-center gap-1"><Pause size={11} /> awaiting approval</span>}
                {state === "pending" && <span className="text-[10.5px] text-ink-500">pending</span>}
              </div>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-ink-700/70 bg-ink-950/40 flex items-center gap-2">
          {paused ? (
            <>
              <span className="text-[11.5px] text-warn-500 inline-flex items-center gap-1"><AlertTriangle size={12} /> Approval required to continue · SCO Lead</span>
              <button
                onClick={() => { setPaused(false); }}
                className="ml-auto text-[11.5px] px-3 py-1.5 rounded-md bg-ok-500/15 text-ok-500 hover:bg-ok-500/20 font-semibold inline-flex items-center gap-1"
              >
                <Check size={12} /> Approve & continue
              </button>
              <button className="text-[11.5px] px-3 py-1.5 rounded-md bg-bad-500/10 text-bad-500 hover:bg-bad-500/15 font-semibold">Deny</button>
            </>
          ) : stepIdx >= pb.steps.length ? (
            <>
              <span className="text-[11.5px] text-ok-500 inline-flex items-center gap-1"><Check size={12} /> Completed · all steps successful</span>
              <button className="ml-auto text-[11.5px] px-3 py-1.5 rounded-md bg-ink-800 hover:bg-ink-700 inline-flex items-center gap-1"><RotateCcw size={11} /> Compensate</button>
              <button onClick={onClose} className="text-[11.5px] px-3 py-1.5 rounded-md bg-accent-600 text-white hover:bg-accent-500 font-semibold">Close</button>
            </>
          ) : (
            <>
              <span className="text-[11.5px] text-ink-300">Executing playbook against the Action API · audit emitted at every step</span>
              <button onClick={() => setPaused(true)} className="ml-auto text-[11.5px] px-3 py-1.5 rounded-md bg-ink-800 hover:bg-ink-700 inline-flex items-center gap-1"><Pause size={11} /> Pause</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
