import { useState } from "react";
import AutonomyPolicy from "./AutonomyPolicy.jsx";
import PlaybookLibrary from "./PlaybookLibrary.jsx";
import ControlPlane from "./ControlPlane.jsx";
import { ShieldCheck, BookOpen, Activity, Server } from "lucide-react";

const tabs = [
  { id: "POL", label: "Autonomy & Policy", icon: ShieldCheck, blurb: "Levels · blast radius · reversibility · kill switch" },
  { id: "PB", label: "Playbooks", icon: BookOpen, blurb: "Versioned, multi-step action sequences" },
  { id: "OBS", label: "Control Plane", icon: Activity, blurb: "Agent observability, drift, qualification" },
];

export default function BackendPanel({ runPlaybook }) {
  const [tab, setTab] = useState("POL");
  return (
    <div>
      <div className="px-5 pt-4">
        <div className="rounded-lg border border-ink-700/70 bg-gradient-to-br from-ink-900 via-ink-900 to-ink-900/40 p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-md bg-ink-800 grid place-items-center text-ink-200 ring-1 ring-ink-700">
            <Server size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Backend · platform & governance</div>
            <div className="text-white text-[16px] font-medium leading-tight mt-0.5">
              Configuration & oversight surfaces — accessed by platform, policy, and validation owners
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1 border-b border-ink-700/70">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative px-3 py-2 text-[12.5px] font-medium flex items-center gap-2 transition-colors ${
                  active ? "text-white" : "text-ink-400 hover:text-ink-200"
                }`}
              >
                <Icon size={14} />
                <span>{t.label}</span>
                <span className="hidden md:inline text-[10.5px] text-ink-500 font-normal">· {t.blurb}</span>
                {active && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-accent-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "POL" && <AutonomyPolicy />}
      {tab === "PB" && <PlaybookLibrary runPlaybook={runPlaybook} />}
      {tab === "OBS" && <ControlPlane />}
    </div>
  );
}
