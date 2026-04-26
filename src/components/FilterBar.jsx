import { Filter } from "lucide-react";
import { therapies, modalities } from "../data/seed.js";

const timeWindows = ["Today", "WTD", "MTD", "QTD"];
const regions = ["All", "NA", "EU", "APAC", "LATAM"];

export default function FilterBar({ filters, setFilters, agentBadge }) {
  const validModalities = filters.therapy === "T1"
    ? modalities.filter((m) => m.appliesTo.includes("T1"))
    : filters.therapy === "T2"
    ? modalities.filter((m) => m.appliesTo.includes("T2"))
    : modalities;

  return (
    <div className="border-b border-ink-700/70 bg-ink-950/70">
      <div className="px-5 py-2.5 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-ink-400 font-semibold">
          <Filter size={12} /> Filters
        </div>

        <Group label="Therapy">
          <Pill active={filters.therapy === "All"} onClick={() => setFilters({ ...filters, therapy: "All", modality: "All" })}>All</Pill>
          {therapies.map((t) => (
            <Pill key={t.id} active={filters.therapy === t.id} onClick={() => setFilters({ ...filters, therapy: t.id, modality: "All" })}>
              {t.name}
            </Pill>
          ))}
        </Group>

        <Group label="Modality">
          <Pill active={filters.modality === "All"} onClick={() => setFilters({ ...filters, modality: "All" })} disabled={filters.therapy === "T1"}>All</Pill>
          {validModalities.map((m) => (
            <Pill
              key={m.id}
              active={filters.modality === m.id}
              onClick={() => setFilters({ ...filters, modality: m.id })}
              disabled={filters.therapy === "T1" && m.id === "FreshAph"}
            >
              {m.label}
            </Pill>
          ))}
        </Group>

        <Group label="Region">
          {regions.map((r) => (
            <Pill key={r} active={filters.region === r} onClick={() => setFilters({ ...filters, region: r })}>{r}</Pill>
          ))}
        </Group>

        <Group label="Time">
          {timeWindows.map((t) => (
            <Pill key={t} active={filters.time === t} onClick={() => setFilters({ ...filters, time: t })}>{t}</Pill>
          ))}
        </Group>

        <div className="ml-auto flex items-center gap-3 text-[11.5px] text-ink-300">
          {agentBadge && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent-600/10 border border-accent-500/30 text-accent-200">
              <span className="h-1.5 w-1.5 rounded-full bg-ok-500"></span>
              <span className="font-medium">{agentBadge}</span>
            </div>
          )}
          <div className="text-ink-500">Last refresh: <span className="text-ink-300">14s ago</span></div>
        </div>
      </div>
    </div>
  );
}

function Group({ label, children }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10.5px] uppercase tracking-wide text-ink-500 font-medium mr-1">{label}</span>
      <div className="flex items-center gap-0.5 p-0.5 rounded-md bg-ink-900 border border-ink-700">{children}</div>
    </div>
  );
}

function Pill({ active, disabled, children, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`px-2 py-0.5 rounded text-[11.5px] font-medium transition-all ${
        active
          ? "bg-accent-600/20 text-accent-200 ring-1 ring-accent-500/30"
          : "text-ink-300 hover:bg-ink-800 hover:text-white"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}
