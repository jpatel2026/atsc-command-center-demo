import { useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import FilterBar from "./components/FilterBar.jsx";
import Screen1 from "./components/Screen1.jsx";
import Screen2 from "./components/Screen2.jsx";
import Screen3 from "./components/Screen3.jsx";
import AgentDock from "./components/AgentDock.jsx";
import KPIDrillDown from "./components/KPIDrillDown.jsx";
import AutonomyPolicy from "./components/AutonomyPolicy.jsx";
import PlaybookLibrary from "./components/PlaybookLibrary.jsx";
import ControlPlane from "./components/ControlPlane.jsx";
import AuditLog from "./components/AuditLog.jsx";
import PlaybookRunner from "./components/PlaybookRunner.jsx";
import { personas, approvals } from "./data/seed.js";

export default function App() {
  const [persona, setPersona] = useState("SCO");
  const [screen, setScreen] = useState("S1");
  const [filters, setFilters] = useState({ therapy: "All", modality: "All", region: "All", time: "Today" });
  const [agentOpen, setAgentOpen] = useState(true);
  const [kpiOpen, setKpiOpen] = useState(null);
  const [openOrder, setOpenOrder] = useState(null);
  const [playbookRun, setPlaybookRun] = useState(null);

  const p = personas.find((x) => x.id === persona);
  const agentScope = useMemo(() => {
    const parts = [`${screenLabel(screen)}`];
    if (screen !== "S1") parts.push(`${p.name}`);
    if (filters.therapy !== "All") parts.push(filters.therapy);
    if (filters.region !== "All") parts.push(filters.region);
    return parts.join(" · ");
  }, [screen, persona, filters, p.name]);

  const runPlaybook = (playbookId, target) => setPlaybookRun({ playbookId, target });

  return (
    <div className={`flex flex-col min-h-screen ${agentOpen ? "lg:pr-[380px]" : ""}`}>
      <Header
        persona={persona}
        setPersona={setPersona}
        screen={screen}
        setScreen={setScreen}
        agentOpen={agentOpen}
        setAgentOpen={setAgentOpen}
        pendingApprovals={approvals.length}
      />
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        agentBadge="9 playbooks running · 5 awaiting approval"
      />

      <main className="flex-1">
        {screen === "S1" && <Screen1 onOpenKpi={setKpiOpen} filters={filters} />}
        {screen === "S2" && <Screen2 persona={persona} onOpenKpi={setKpiOpen} setScreen={setScreen} />}
        {screen === "S3" && (
          <Screen3
            persona={persona}
            openOrder={openOrder}
            setOpenOrder={setOpenOrder}
            runPlaybook={runPlaybook}
          />
        )}
        {screen === "POL" && <AutonomyPolicy />}
        {screen === "PB" && <PlaybookLibrary runPlaybook={runPlaybook} />}
        {screen === "OBS" && <ControlPlane />}
        {screen === "AUD" && <AuditLog />}
      </main>

      <AgentDock
        open={agentOpen}
        setOpen={setAgentOpen}
        screen={screen}
        persona={persona}
        runPlaybook={runPlaybook}
        agentScope={agentScope}
      />

      {kpiOpen && (
        <KPIDrillDown
          kpi={kpiOpen}
          onClose={() => setKpiOpen(null)}
          runPlaybook={(id, target) => { setKpiOpen(null); runPlaybook(id, target); }}
        />
      )}

      {playbookRun && (
        <PlaybookRunner run={playbookRun} onClose={() => setPlaybookRun(null)} />
      )}

      <Footer />
    </div>
  );
}

function screenLabel(s) {
  return ({
    S1: "Cross-functional",
    S2: "Persona view",
    S3: "Order / Batch",
    POL: "Autonomy & Policy",
    PB: "Playbooks",
    OBS: "Control Plane",
    AUD: "Audit",
  })[s] || s;
}

function Footer() {
  return (
    <footer className="px-5 py-3 border-t border-ink-700/70 text-[10.5px] text-ink-500 flex items-center gap-3 flex-wrap">
      <span>ATSC Operations Command Center · v2.0 (agentic execution)</span>
      <span>·</span>
      <span>Common data model · OrderID · Patient (de-identified) · Lot/Batch · Slot · Milestone · Deviation · Exception · Action · Playbook · Approval</span>
      <span className="ml-auto">GxP-aware · GAMP 5 risk-based validation</span>
    </footer>
  );
}
