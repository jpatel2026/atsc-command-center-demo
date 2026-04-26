// Mock data for ATSC Operations Command Center.
// Two therapies (T1 commercial, T2 clinical), three modalities, seven personas,
// realistic KPIs, orders, milestones, playbooks, exceptions, and agent action policy.

export const therapies = [
  {
    id: "T1",
    name: "Therapy #1",
    longName: "Adagene-cel (commercial)",
    stage: "Commercial",
    countriesApproved: 23,
    aphModality: "CryoAph",
    dpState: "Frozen",
    description:
      "Commercial autologous CAR-T approved across 23 countries. Cryopreservation occurs both pre and post manufacturing.",
  },
  {
    id: "T2",
    name: "Therapy #2",
    longName: "Velocel-cel (clinical)",
    stage: "Clinical",
    countriesApproved: 0,
    aphModality: "Fresh + CryoAph",
    dpState: "Frozen",
    description:
      "Clinical-stage autologous therapy operating with both Fresh apheresis and CryoAph manufacturing modalities; DP is always frozen.",
  },
];

export const modalities = [
  { id: "CryoAph", label: "CryoAph", appliesTo: ["T1", "T2"] },
  { id: "FreshAph", label: "Fresh Aph", appliesTo: ["T2"] },
];

export const sites = [
  { id: "MFG-RTP", name: "RTP — Manufacturing", country: "USA", region: "NA" },
  { id: "MFG-LEI", name: "Leiden — Manufacturing", country: "Netherlands", region: "EU" },
  { id: "MFG-SIN", name: "Singapore — Manufacturing", country: "Singapore", region: "APAC" },
  { id: "WH-RTP", name: "RTP — Cryo Warehouse", country: "USA", region: "NA" },
  { id: "WH-LEI", name: "Leiden — Cryo Warehouse", country: "Netherlands", region: "EU" },
];

export const countries = [
  "USA", "Canada", "United Kingdom", "Germany", "France", "Italy", "Spain",
  "Netherlands", "Belgium", "Sweden", "Denmark", "Switzerland", "Japan",
  "Australia", "Singapore", "South Korea", "Brazil", "Mexico", "Israel",
  "Austria", "Norway", "Ireland", "Finland",
];

export const personas = [
  {
    id: "MFG",
    name: "Manufacturing",
    short: "Mfg",
    color: "#5fb0ff",
    domain: "Mfg execution & schedule",
    description:
      "Owns batch execution; consumes daily mfg schedule. Acts on MES — slot swaps, batch reprioritization, in-process flags.",
    kpis: ["mfg_batch_success", "mfg_schedule_adh", "mfg_slot_util", "mfg_inprocess_dev", "mfg_cycle_time", "mfg_dp_yield"],
    actionScope: ["MES"],
  },
  {
    id: "QA",
    name: "Quality",
    short: "QA",
    color: "#a78bfa",
    domain: "Disposition, deviations, CAPA, CoA/CoC",
    description:
      "Owns release. Acts on QMS/LIMS — pre-fill deviations, request CAPA, lock lots. Never auto-disposes.",
    kpis: ["qa_open_dev", "qa_capa_aging", "qa_rft", "qa_disp_cycle", "qa_coa_time", "qa_complaints"],
    actionScope: ["QMS_LIMS"],
  },
  {
    id: "SCO",
    name: "Supply Chain Ops",
    short: "SCO",
    color: "#22c55e",
    domain: "End-to-end Aph logistics; daily Cryo & Mfg schedules",
    description:
      "Primary owner of Screen 3 order milestone view. Acts on slot management, logistics/TMS, patient orchestration, treatment center portal.",
    kpis: ["sco_aph_dp_cycle", "sco_orders_status", "sco_cryo_adh", "sco_mfg_adh", "sco_otif_in", "sco_otif_out", "sco_excursions"],
    actionScope: ["SLOT", "LOGISTICS", "PATIENT_ORCH", "TC_PORTAL"],
  },
  {
    id: "SP",
    name: "Supply Planning",
    short: "SP",
    color: "#f59e0b",
    domain: "Demand / supply balance, slot capacity, SLOB",
    description:
      "Acts on capacity parameters, transfer orders, safety stock — subject to approval.",
    kpis: ["sp_forecast_acc", "sp_slot_cap_util", "sp_slob", "sp_material_avail", "sp_finite_cap"],
    actionScope: ["ERP"],
  },
  {
    id: "WH",
    name: "Warehouse & Inventory",
    short: "WH",
    color: "#06b6d4",
    domain: "Storage and flow incl. LN2 / cryo storage",
    description:
      "Acts on WMS — lot lock for excursion, cycle count initiation, location update.",
    kpis: ["wh_inv_acc", "wh_ln2_util", "wh_dock_to_stock", "wh_pick_pack", "wh_excursions"],
    actionScope: ["WMS"],
  },
  {
    id: "CO",
    name: "Commercial Ops",
    short: "Comm Ops",
    color: "#ec4899",
    domain: "Backend: enrollment, exception management",
    description:
      "Acts on backend ticket system, patient/HCP communications, enrollment workflow.",
    kpis: ["co_enrol_cycle", "co_enrol_excep_sla", "co_order_acc", "co_ticket_aging", "co_resp_time"],
    actionScope: ["TICKET", "PATIENT_ORCH"],
  },
  {
    id: "CE",
    name: "Commercial Excellence",
    short: "Comm Exc",
    color: "#facc15",
    domain: "Sales / marketing leadership",
    description:
      "Acts on treatment center activation workflow and demand-shaping signals; mostly read for execution systems.",
    kpis: ["ce_country_demand", "ce_tc_activations", "ce_tc_throughput", "ce_t1_mix", "ce_throughput_per_tc"],
    actionScope: ["TC_PORTAL"],
  },
];

// KPI library — central catalog. Thresholds are configurable per Therapy x Modality x Country.
export const kpis = {
  // Manufacturing
  mfg_batch_success: { id: "mfg_batch_success", name: "Batch success rate", function: "MFG", unit: "%", target: 96, current: 94.2, trend: -0.6, status: "amber", split: "T×M" },
  mfg_schedule_adh:  { id: "mfg_schedule_adh", name: "Schedule adherence (daily)", function: "MFG", unit: "%", target: 95, current: 91.7, trend: -1.1, status: "amber" },
  mfg_slot_util:     { id: "mfg_slot_util", name: "Slot utilization (Fresh vs Cryo)", function: "MFG", unit: "%", target: 85, current: 88.4, trend: 1.2, status: "green" },
  mfg_inprocess_dev: { id: "mfg_inprocess_dev", name: "In-process deviations", function: "MFG", unit: "events/wk", target: 4, current: 7, trend: 2, status: "red", direction: "lower-better" },
  mfg_cycle_time:    { id: "mfg_cycle_time", name: "Mfg cycle time vs standard", function: "MFG", unit: "% std", target: 100, current: 104, trend: 1.4, status: "amber", direction: "lower-better" },
  mfg_dp_yield:      { id: "mfg_dp_yield", name: "DP yield", function: "MFG", unit: "%", target: 92, current: 90.8, trend: -0.4, status: "amber" },

  // Quality
  qa_open_dev:    { id: "qa_open_dev", name: "Open deviations (aging)", function: "QA", unit: "count", target: 25, current: 38, trend: 4, status: "red", direction: "lower-better" },
  qa_capa_aging:  { id: "qa_capa_aging", name: "CAPA aging > 30d", function: "QA", unit: "count", target: 5, current: 12, trend: 2, status: "red", direction: "lower-better" },
  qa_rft:         { id: "qa_rft", name: "Right-first-time", function: "QA", unit: "%", target: 96, current: 95.1, trend: -0.3, status: "amber" },
  qa_disp_cycle:  { id: "qa_disp_cycle", name: "Disposition cycle time", function: "QA", unit: "hrs", target: 36, current: 41, trend: 2, status: "amber", direction: "lower-better" },
  qa_coa_time:    { id: "qa_coa_time", name: "CoA / CoC issuance time", function: "QA", unit: "hrs", target: 12, current: 10.5, trend: -0.5, status: "green", direction: "lower-better" },
  qa_complaints:  { id: "qa_complaints", name: "Confirmed quality events", function: "QA", unit: "events/mo", target: 3, current: 2, trend: -1, status: "green", direction: "lower-better" },

  // Supply Chain Ops
  sco_aph_dp_cycle: { id: "sco_aph_dp_cycle", name: "Aph→DP cycle time vs standard", function: "SCO", unit: "% std", target: 100, current: 107, trend: 3, status: "amber", direction: "lower-better" },
  sco_orders_status:{ id: "sco_orders_status", name: "Orders on-track / at-risk / delayed", function: "SCO", unit: "%", target: 90, current: 81.2, trend: -2.1, status: "amber" },
  sco_cryo_adh:    { id: "sco_cryo_adh", name: "Cryo schedule adherence", function: "SCO", unit: "%", target: 95, current: 96.3, trend: 0.4, status: "green" },
  sco_mfg_adh:     { id: "sco_mfg_adh", name: "Mfg schedule adherence (daily)", function: "SCO", unit: "%", target: 95, current: 91.0, trend: -1.4, status: "amber" },
  sco_otif_in:     { id: "sco_otif_in", name: "Logistics OTIF — Aph inbound", function: "SCO", unit: "%", target: 96, current: 92.4, trend: -1.2, status: "amber" },
  sco_otif_out:    { id: "sco_otif_out", name: "Logistics OTIF — DP outbound", function: "SCO", unit: "%", target: 97, current: 94.1, trend: -0.6, status: "amber" },
  sco_excursions:  { id: "sco_excursions", name: "Temp / chain-of-custody excursions", function: "SCO", unit: "events/wk", target: 2, current: 5, trend: 2, status: "red", direction: "lower-better" },

  // Supply Planning
  sp_forecast_acc:  { id: "sp_forecast_acc", name: "Forecast accuracy (rolling 3M)", function: "SP", unit: "%", target: 85, current: 82.4, trend: -0.8, status: "amber" },
  sp_slot_cap_util: { id: "sp_slot_cap_util", name: "Slot capacity utilization", function: "SP", unit: "%", target: 82, current: 88.5, trend: 2.1, status: "amber" },
  sp_slob:          { id: "sp_slob", name: "SLOB inventory value", function: "SP", unit: "$M", target: 4, current: 6.1, trend: 0.4, status: "amber", direction: "lower-better" },
  sp_material_avail:{ id: "sp_material_avail", name: "Material availability vs plan", function: "SP", unit: "%", target: 98, current: 96.9, trend: -0.5, status: "amber" },
  sp_finite_cap:    { id: "sp_finite_cap", name: "Finite capacity coverage", function: "SP", unit: "%", target: 100, current: 95.4, trend: -1.0, status: "amber" },

  // Warehouse & Inventory
  wh_inv_acc:       { id: "wh_inv_acc", name: "Inventory accuracy", function: "WH", unit: "%", target: 99, current: 99.2, trend: 0.1, status: "green" },
  wh_ln2_util:      { id: "wh_ln2_util", name: "LN2 / cryo storage utilization", function: "WH", unit: "%", target: 75, current: 81.4, trend: 1.6, status: "amber" },
  wh_dock_to_stock: { id: "wh_dock_to_stock", name: "Dock-to-stock cycle time", function: "WH", unit: "hrs", target: 4, current: 3.4, trend: -0.2, status: "green", direction: "lower-better" },
  wh_pick_pack:     { id: "wh_pick_pack", name: "Pick/pack accuracy (DP outbound)", function: "WH", unit: "%", target: 99.5, current: 99.7, trend: 0.0, status: "green" },
  wh_excursions:    { id: "wh_excursions", name: "Storage excursion events", function: "WH", unit: "events/mo", target: 1, current: 3, trend: 1, status: "red", direction: "lower-better" },

  // Commercial Ops
  co_enrol_cycle:    { id: "co_enrol_cycle", name: "Enrollment cycle time", function: "CO", unit: "days", target: 5, current: 6.2, trend: 0.4, status: "amber", direction: "lower-better" },
  co_enrol_excep_sla:{ id: "co_enrol_excep_sla", name: "Enrollment exceptions within SLA", function: "CO", unit: "%", target: 95, current: 87.6, trend: -2.3, status: "amber" },
  co_order_acc:      { id: "co_order_acc", name: "Order entry accuracy / first-pass yield", function: "CO", unit: "%", target: 97, current: 94.2, trend: -0.5, status: "amber" },
  co_ticket_aging:   { id: "co_ticket_aging", name: "Backend ticket aging > 48h", function: "CO", unit: "%", target: 8, current: 14.2, trend: 2.1, status: "red", direction: "lower-better" },
  co_resp_time:      { id: "co_resp_time", name: "Avg response time (HCP/patient)", function: "CO", unit: "hrs", target: 4, current: 3.6, trend: -0.2, status: "green", direction: "lower-better" },

  // Commercial Excellence
  ce_country_demand:    { id: "ce_country_demand", name: "Country demand attainment", function: "CE", unit: "%", target: 95, current: 91.4, trend: -1.1, status: "amber" },
  ce_tc_activations:    { id: "ce_tc_activations", name: "Treatment center activations", function: "CE", unit: "% of plan", target: 100, current: 92, trend: -3, status: "amber" },
  ce_tc_throughput:     { id: "ce_tc_throughput", name: "Treatment center throughput vs target", function: "CE", unit: "%", target: 95, current: 89.2, trend: -1.4, status: "amber" },
  ce_t1_mix:            { id: "ce_t1_mix", name: "Therapy #1 demand mix (regions)", function: "CE", unit: "%", target: 100, current: 100, trend: 0, status: "green" },
  ce_throughput_per_tc: { id: "ce_throughput_per_tc", name: "Patient throughput per active TC", function: "CE", unit: "/qtr", target: 12, current: 10.4, trend: -0.3, status: "amber" },
};

// Generate 6-month historical series for any KPI (deterministic seed)
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
function makeHistory(kpi) {
  const rand = seededRand(kpi.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
  const months = ["Nov '25", "Dec '25", "Jan '26", "Feb '26", "Mar '26", "Apr '26"];
  const target = kpi.target;
  const current = kpi.current;
  const path = [];
  for (let i = 0; i < 6; i++) {
    const trendStep = (current - target) * (i / 5);
    const noise = (rand() - 0.5) * Math.max(target * 0.04, 1);
    let v = target + trendStep * 0.6 + noise;
    if (kpi.unit === "%") v = Math.max(0, Math.min(100, v));
    path.push({ month: months[i], value: +v.toFixed(2), target });
  }
  path[5].value = current;
  return path;
}
export const kpiHistory = Object.fromEntries(
  Object.values(kpis).map((k) => [k.id, makeHistory(k)])
);

// 14 milestones, parameterized per Therapy × Modality
export const milestones = [
  { n: 1, id: "enroll", name: "Enrollment / order confirm", standardHrs: 0, applies: () => true },
  { n: 2, id: "aph_slot", name: "Aph slot scheduling", standardHrs: 24, applies: () => true },
  { n: 3, id: "aph_collect", name: "Apheresis collection", standardHrs: 48, applies: () => true },
  { n: 4, id: "aph_logistics", name: "Aph logistics (inbound)", standardHrs: 36, applies: () => true },
  { n: 5, id: "aph_cryo", name: "Aph cryopreservation", standardHrs: 24, applies: (t, m) => t === "T1" || (t === "T2" && m === "CryoAph") },
  { n: 6, id: "mfg_start", name: "Mfg start", standardHrs: 12, applies: () => true },
  { n: 7, id: "mfg_exec", name: "Mfg execution", standardHrs: 240, applies: () => true },
  { n: 8, id: "qc", name: "QC testing", standardHrs: 96, applies: () => true },
  { n: 9, id: "qa_disp", name: "QA disposition / release", standardHrs: 36, applies: () => true },
  { n: 10, id: "dp_cryo", name: "DP cryopreservation", standardHrs: 24, applies: () => true },
  { n: 11, id: "dp_logistics", name: "DP logistics (outbound)", standardHrs: 48, applies: () => true },
  { n: 12, id: "tc_receipt", name: "TC receipt & storage", standardHrs: 12, applies: () => true },
  { n: 13, id: "infusion_ready", name: "Infusion ready", standardHrs: 48, applies: () => true },
  { n: 14, id: "infusion", name: "Infusion", standardHrs: 0, applies: () => true },
];

const reasonCodes = [
  "Apheresis collection slip",
  "In-process deviation",
  "Logistics delay",
  "Temperature excursion",
  "Slot capacity shortfall",
  "Patient eligibility issue",
  "TC scheduling conflict",
  "Material shortage",
  "QA disposition pending",
];

// Generate ~120 orders distributed across milestones
function genOrders() {
  const rand = seededRand(42);
  const out = [];
  const tcCenters = ["TC-NYC", "TC-BOS", "TC-CHI", "TC-LA", "TC-SF", "TC-LDN", "TC-AMS", "TC-BER", "TC-PAR", "TC-MIL", "TC-MAD", "TC-TYO", "TC-SIN", "TC-SYD", "TC-TOR"];
  for (let i = 0; i < 120; i++) {
    const therapyId = rand() < 0.6 ? "T1" : "T2";
    const modalityId = therapyId === "T1" ? "CryoAph" : (rand() < 0.5 ? "FreshAph" : "CryoAph");
    const milestoneIdx = Math.floor(rand() * 13);
    const ms = milestones[milestoneIdx];
    const r = rand();
    const status = r < 0.62 ? "on-track" : r < 0.86 ? "at-risk" : "delayed";
    const site = sites[Math.floor(rand() * 3)].id;
    const country = countries[Math.floor(rand() * countries.length)];
    const tc = tcCenters[Math.floor(rand() * tcCenters.length)];
    const reason = status === "on-track" ? null : reasonCodes[Math.floor(rand() * reasonCodes.length)];
    const daysLate = status === "on-track" ? 0 : status === "at-risk" ? +(rand() * 1.5).toFixed(1) : +((rand() * 3) + 1).toFixed(1);
    const agentR = rand();
    const agentState = agentR < 0.55 ? "none" : agentR < 0.78 ? "playbook" : agentR < 0.92 ? "approval" : "acted";
    out.push({
      id: `ORD-${(60000 + i).toString()}`,
      patient: `PT-${(rand().toString(36).slice(2, 8)).toUpperCase()}`,
      therapyId,
      modalityId,
      milestoneId: ms.id,
      milestoneN: ms.n,
      status,
      reason,
      timeInMilestoneHrs: +(rand() * 60 + 4).toFixed(1),
      lastUpdate: `${Math.floor(rand() * 23) + 1}h ago`,
      site,
      country,
      tc,
      daysLate,
      agentState,
      slack: status === "on-track" ? +(rand() * 2 + 0.5).toFixed(1) : 0,
      projectedInfusion: status === "delayed" ? `+${daysLate.toFixed(1)}d vs commit` : status === "at-risk" ? `±${daysLate.toFixed(1)}d` : "On commit",
    });
  }
  return out;
}
export const orders = genOrders();

// Helper to derive milestone-aggregate roll-up
export function ordersAtMilestone(milestoneId, allOrders = orders) {
  return allOrders.filter((o) => o.milestoneId === milestoneId);
}

// 6 starter playbooks per the brief
export const playbooks = [
  {
    id: "PB-APH-SLIP",
    name: "Apheresis slip recovery",
    description: "Detect slipped Aph collection, find next-best slot, reschedule patient & logistics, notify HCP.",
    steps: [
      { n: 1, title: "Detect slip", autonomy: "L3", system: "—", reversible: true },
      { n: 2, title: "Identify next available Aph slot", autonomy: "L3", system: "Slot Mgmt", reversible: true },
      { n: 3, title: "Reserve new slot (idempotent)", autonomy: "L1", system: "Slot Mgmt", reversible: true },
      { n: 4, title: "Notify patient + HCP via templated message", autonomy: "L2", system: "Patient Orch", reversible: true },
      { n: 5, title: "Update TC portal ETA", autonomy: "L2", system: "TC Portal", reversible: true },
      { n: 6, title: "Confirm & close", autonomy: "L1", system: "—", reversible: false },
    ],
    triggers: ["Apheresis collection slip"],
    initialAutonomy: "L2",
    avgRunMins: 8,
    successRate: 94,
    runs7d: 18,
  },
  {
    id: "PB-EXC-CONTAIN",
    name: "Excursion containment",
    description: "On confirmed temperature/CoC excursion, lock lot, notify Quality, prep deviation in QMS, propose disposition path.",
    steps: [
      { n: 1, title: "Confirm excursion event from sensor + carrier", autonomy: "L3", system: "WMS / TMS", reversible: false },
      { n: 2, title: "Auto-lock lot in WMS", autonomy: "L3", system: "WMS", reversible: true },
      { n: 3, title: "Pre-fill deviation record in QMS", autonomy: "L1", system: "QMS", reversible: true },
      { n: 4, title: "Notify Quality + SCO leads", autonomy: "L3", system: "Comms", reversible: true },
      { n: 5, title: "Recommend disposition path (impact assessment)", autonomy: "L0", system: "—", reversible: true },
    ],
    triggers: ["Temperature excursion"],
    initialAutonomy: "L3",
    avgRunMins: 4,
    successRate: 99,
    runs7d: 5,
  },
  {
    id: "PB-DP-DELAY",
    name: "DP delivery delay recovery",
    description: "Re-route shipment, request expedited carrier, replacement shipper if needed, update TC infusion window.",
    steps: [
      { n: 1, title: "Detect projected DP delivery slip", autonomy: "L3", system: "TMS", reversible: false },
      { n: 2, title: "Evaluate alternate carriers / routes (dry-run)", autonomy: "L3", system: "TMS", reversible: true },
      { n: 3, title: "Request expedited carrier", autonomy: "L1", system: "TMS", reversible: true },
      { n: 4, title: "Update TC infusion window", autonomy: "L1", system: "TC Portal", reversible: true },
      { n: 5, title: "Notify HCP & patient", autonomy: "L2", system: "Patient Orch", reversible: true },
    ],
    triggers: ["Logistics delay", "TC scheduling conflict"],
    initialAutonomy: "L1",
    avgRunMins: 12,
    successRate: 89,
    runs7d: 11,
  },
  {
    id: "PB-ENROL-EXC",
    name: "Enrollment exception triage",
    description: "Classify backend ticket, route to country team, send templated message, escalate if eligibility lapse.",
    steps: [
      { n: 1, title: "Classify ticket type", autonomy: "L3", system: "Ticket", reversible: true },
      { n: 2, title: "Route to country team", autonomy: "L3", system: "Ticket", reversible: true },
      { n: 3, title: "Send templated patient/HCP comms", autonomy: "L3", system: "Patient Orch", reversible: true },
      { n: 4, title: "Escalate if eligibility lapse risk", autonomy: "L1", system: "Ticket", reversible: false },
    ],
    triggers: ["Patient eligibility issue"],
    initialAutonomy: "L3",
    avgRunMins: 3,
    successRate: 96,
    runs7d: 42,
  },
  {
    id: "PB-TC-RESCHED",
    name: "Treatment center reschedule",
    description: "Coordinate alternate TC infusion window across SCO + Comm Ops + portal.",
    steps: [
      { n: 1, title: "Identify alternative infusion window", autonomy: "L3", system: "TC Portal", reversible: true },
      { n: 2, title: "Request TC confirmation", autonomy: "L1", system: "TC Portal", reversible: true },
      { n: 3, title: "Update HCP + patient", autonomy: "L2", system: "Patient Orch", reversible: true },
      { n: 4, title: "Update commitment dates", autonomy: "L1", system: "ERP", reversible: true },
    ],
    triggers: ["TC scheduling conflict"],
    initialAutonomy: "L1",
    avgRunMins: 9,
    successRate: 92,
    runs7d: 7,
  },
  {
    id: "PB-LOT-LOCK",
    name: "Lot lock & investigate",
    description: "On suspected quality event, lock lot, open investigation, link evidence.",
    steps: [
      { n: 1, title: "Lock lot in WMS", autonomy: "L1", system: "WMS", reversible: true },
      { n: 2, title: "Open deviation in QMS (pre-filled)", autonomy: "L1", system: "QMS", reversible: true },
      { n: 3, title: "Link sensor / batch evidence", autonomy: "L3", system: "QMS", reversible: true },
      { n: 4, title: "Notify QA reviewer", autonomy: "L3", system: "Comms", reversible: true },
    ],
    triggers: ["In-process deviation"],
    initialAutonomy: "L1",
    avgRunMins: 5,
    successRate: 98,
    runs7d: 3,
  },
];

export const exceptionList = [
  {
    id: "EX-9217",
    title: "Apheresis collection slip — TC-LDN, ORD-60042",
    impact: "1 patient — Therapy #1 — projected infusion +2.3d",
    detected: "14m ago",
    function: "SCO",
    therapy: "T1",
    severity: "high",
    agent: { state: "playbook", playbookId: "PB-APH-SLIP", step: 3, autonomy: "L2", awaiting: "SCO Lead approval" },
    sources: ["Slot Mgmt event", "TC-LDN portal"],
  },
  {
    id: "EX-9218",
    title: "Confirmed temperature excursion — DP-LOT-2204 (RTP→TC-NYC)",
    impact: "1 lot, 1 patient — Therapy #1",
    detected: "32m ago",
    function: "WH",
    therapy: "T1",
    severity: "critical",
    agent: { state: "acted", playbookId: "PB-EXC-CONTAIN", autonomy: "L3", actions: ["Lot auto-locked in WMS", "Deviation pre-filled in QMS"] },
    sources: ["TMS sensor stream", "Carrier ack"],
  },
  {
    id: "EX-9219",
    title: "Backend tickets aging >48h — DE country team",
    impact: "8 cases, 4 enrollment exceptions",
    detected: "2h ago",
    function: "CO",
    therapy: "T1",
    severity: "medium",
    agent: { state: "recommendation", playbookId: "PB-ENROL-EXC", autonomy: "L3" },
    sources: ["Ticket queue analytics"],
  },
  {
    id: "EX-9220",
    title: "Mfg slot conflict — RTP suite 2, Aug 14",
    impact: "2 batches at risk; T2 CryoAph",
    detected: "1h ago",
    function: "MFG",
    therapy: "T2",
    severity: "high",
    agent: { state: "approval", playbookId: null, autonomy: "L1", awaiting: "Mfg Director approval" },
    sources: ["MES schedule", "Capacity plan"],
  },
  {
    id: "EX-9221",
    title: "Open deviations >30d — QA backlog growing",
    impact: "12 records — risk to release SLA",
    detected: "Today",
    function: "QA",
    therapy: "T1",
    severity: "medium",
    agent: { state: "recommendation", playbookId: null, autonomy: "L0" },
    sources: ["QMS aging buckets"],
  },
];

// Autonomy policy
export const autonomyMatrix = [
  { actionType: "Reschedule Aph slot (no conflict)", system: "Slot Mgmt", level: "L1", blastRadius: "1 patient", reversibility: "Reversible (4h)", notes: "Idempotent; pre-execution conflict check" },
  { actionType: "Auto-lock lot on confirmed excursion", system: "WMS", level: "L3", blastRadius: "1 lot", reversibility: "Reversible", notes: "Sensor + carrier ack required" },
  { actionType: "Pre-fill deviation in QMS", system: "QMS/LIMS", level: "L1", blastRadius: "1 record", reversibility: "Reversible", notes: "QA always approves; never auto-disposes" },
  { actionType: "Batch disposition / release", system: "QMS/LIMS", level: "L0", blastRadius: "1 batch", reversibility: "Irreversible", notes: "GxP-critical — never agentic" },
  { actionType: "Reprioritize Mfg batch (daily)", system: "MES", level: "L1", blastRadius: "≤3 batches", reversibility: "Reversible-with-window (12h)", notes: "Daily horizon only" },
  { actionType: "Re-route shipment to alt site", system: "TMS", level: "L1", blastRadius: "1 shipment", reversibility: "Reversible-with-window (2h)", notes: "Carrier confirms" },
  { actionType: "Request expedited carrier", system: "TMS", level: "L1", blastRadius: "1 shipment", reversibility: "Reversible", notes: "Cost-impact preview required" },
  { actionType: "Send templated patient/HCP comm", system: "Patient Orch", level: "L3", blastRadius: "1 patient", reversibility: "Irreversible", notes: "Templated only — no free-text" },
  { actionType: "Resolve standard backend ticket", system: "Ticket", level: "L3", blastRadius: "≤10 tickets/hr", reversibility: "Reversible", notes: "Whitelisted ticket types" },
  { actionType: "Update DP availability ETA at TC", system: "TC Portal", level: "L1", blastRadius: "1 TC, 1 order", reversibility: "Reversible", notes: "TC ack required" },
  { actionType: "Update safety stock parameter", system: "ERP", level: "L0", blastRadius: "1 SKU", reversibility: "Reversible", notes: "Approval mandatory" },
  { actionType: "Override regulatory hold", system: "QMS", level: "L0", blastRadius: "—", reversibility: "Irreversible", notes: "Never agentic" },
];

// Approvals queue
export const approvals = [
  { id: "AP-3401", action: "Reserve Aph slot @ TC-AMS Aug 19 09:30", target: "ORD-60042", requester: "Agent (PB-APH-SLIP step 3)", level: "L1", blast: "1 patient", reversible: "Yes (4h)", expiresIn: "00:48", priority: "high" },
  { id: "AP-3402", action: "Reprioritize batch B-T2-2419 to RTP suite 3", target: "B-T2-2419", requester: "Agent (manual rec)", level: "L1", blast: "2 batches", reversible: "Yes (12h)", expiresIn: "01:42", priority: "high" },
  { id: "AP-3403", action: "Expedite carrier for DP shipment SHP-7702", target: "SHP-7702", requester: "Agent (PB-DP-DELAY step 3)", level: "L1", blast: "1 shipment", reversible: "Yes (2h)", expiresIn: "00:14", priority: "critical" },
  { id: "AP-3404", action: "Open deviation pre-fill — DP-LOT-2204", target: "DP-LOT-2204", requester: "Agent (PB-EXC-CONTAIN step 3)", level: "L1", blast: "1 record", reversible: "Yes", expiresIn: "03:05", priority: "high" },
  { id: "AP-3405", action: "Update safety stock — material MAT-419", target: "MAT-419", requester: "User: M.Patel (SP)", level: "L0", blast: "1 SKU", reversible: "Yes", expiresIn: "12:00", priority: "medium" },
];

// Recent action history (mix of human + agent)
export const recentActions = [
  { ts: "14:52", actor: "agent", level: "L3", system: "WMS", action: "Auto-locked DP-LOT-2204 on confirmed excursion", outcome: "success", linkedTo: "EX-9218" },
  { ts: "14:51", actor: "agent", level: "L3", system: "Comms", action: "Notified Quality + SCO leads (templated)", outcome: "success", linkedTo: "EX-9218" },
  { ts: "14:48", actor: "agent", level: "L1", system: "QMS", action: "Pre-filled deviation DEV-22041 (awaiting QA)", outcome: "awaiting-approval", linkedTo: "EX-9218" },
  { ts: "14:32", actor: "user", level: "—", system: "Slot Mgmt", action: "M.Patel: Confirmed Aph slot AMS-Aug19-09:30", outcome: "success", linkedTo: "EX-9217" },
  { ts: "14:18", actor: "agent", level: "L1", system: "TMS", action: "Requested expedited carrier for SHP-7702", outcome: "awaiting-approval", linkedTo: "—" },
  { ts: "14:02", actor: "agent", level: "L3", system: "Ticket", action: "Routed 6 enrollment tickets to DE country team", outcome: "success", linkedTo: "EX-9219" },
  { ts: "13:58", actor: "agent", level: "L3", system: "Patient Orch", action: "Sent reschedule comm to 4 patients (templated)", outcome: "success", linkedTo: "EX-9217" },
  { ts: "13:40", actor: "user", level: "—", system: "QMS", action: "S.Iverson: Approved CAPA initiation CAPA-1102", outcome: "success", linkedTo: "—" },
  { ts: "13:22", actor: "agent", level: "L1", system: "Slot Mgmt", action: "Released held Aph slot LON-Aug15 (rolled-back)", outcome: "rolled-back", linkedTo: "EX-9217" },
];

// Control plane / observability sample metrics
export const controlPlane = {
  actions24h: 412,
  successRate: 96.8,
  interventionRate: 7.4,
  overrideRate: 3.1,
  rollbackRate: 1.4,
  approvalSlaBreach: 2,
  byLevel: [
    { level: "L0 (recommend)", count: 78 },
    { level: "L1 (one-click)", count: 168 },
    { level: "L2 (playbook)", count: 119 },
    { level: "L3 (autonomous)", count: 47 },
  ],
  bySystem: [
    { system: "Slot Mgmt", count: 86 },
    { system: "Patient Orch", count: 74 },
    { system: "TC Portal", count: 51 },
    { system: "Logistics / TMS", count: 62 },
    { system: "MES", count: 41 },
    { system: "QMS / LIMS", count: 39 },
    { system: "ERP", count: 18 },
    { system: "WMS", count: 24 },
    { system: "Comms / Ticket", count: 17 },
  ],
  driftSeries: [
    { day: "Mon", accept: 88, override: 4, narrative: 92 },
    { day: "Tue", accept: 86, override: 5, narrative: 91 },
    { day: "Wed", accept: 89, override: 3, narrative: 94 },
    { day: "Thu", accept: 84, override: 6, narrative: 90 },
    { day: "Fri", accept: 87, override: 4, narrative: 92 },
    { day: "Sat", accept: 90, override: 3, narrative: 93 },
    { day: "Sun", accept: 89, override: 4, narrative: 93 },
  ],
};

// GenAI-style narratives for KPI drill-down (templated; aggregate-level, persona-toned)
export const kpiNarratives = {
  sco_aph_dp_cycle: {
    summary:
      "Aph→DP cycle time has crept ~7 % above standard over the last 8 weeks, driven primarily by Therapy #2 CryoAph orders out of Leiden (62 % of the variance) where Aph cryopreservation step times have lengthened by an average of 5.4 hours.",
    bullets: [
      "Cryo step time at Leiden trending up since week 8 — likely operator backlog after maintenance window 2026-02-22.",
      "Therapy #1 cycle remains within standard band; deviation is concentrated in T2 CryoAph.",
      "5 deviations in week of 2026-04-19 cluster around in-process testing turnaround — see EX-9221.",
    ],
    focus: [
      { label: "Stabilize Leiden Aph cryo throughput", playbook: "PB-EXC-CONTAIN", note: "Audit Leiden Aph cryo SOP cycle vs SOP standard" },
      { label: "Re-baseline standard for T2 CryoAph", playbook: null, note: "Last calibration 2025-09; clinical volume has 2.3×'d" },
      { label: "Run apheresis slip recovery on at-risk T2 orders", playbook: "PB-APH-SLIP", note: "11 T2 orders flagged amber at Aph-logistics step" },
    ],
    confidence: "medium",
    sources: ["MES batch records", "TMS sensor stream", "QMS deviation log"],
  },
  mfg_batch_success: {
    summary:
      "Batch success rate sits at 94.2 % vs target 96 %. Most loss concentrates in Therapy #2 batches (3 of 4 failures last quarter), with mode-3 in-process deviations during day-7 expansion.",
    bullets: [
      "Day-7 expansion failures cluster around RTP suite 2 — operator handoff at shift change.",
      "T1 CryoAph batches remain steady at 96.8 % success.",
      "No correlation with starting material lot age (within 0.5σ).",
    ],
    focus: [
      { label: "Stabilize RTP suite 2 day-7 handoff", playbook: "PB-LOT-LOCK", note: "Investigate handoff-time deviations" },
      { label: "MSAT review: T2 expansion media lot variability", playbook: null, note: "Media lot 88-Q dependency" },
    ],
    confidence: "high",
    sources: ["MES batch records", "QMS deviation log"],
  },
  qa_open_dev: {
    summary:
      "Open deviation count has risen to 38 with 12 records aged >30 days. The aging pile is dominated by environmental-monitoring excursions (5) and in-process testing variance (4).",
    bullets: [
      "Aging breakdown: 0–7d: 14 | 8–14d: 8 | 15–30d: 4 | >30d: 12.",
      "Two reviewers absent in Mar 2026 — review throughput dropped 18 %.",
      "Linked CAPAs are open but effectiveness-check overdue on 3.",
    ],
    focus: [
      { label: "Triage aging >30d backlog", playbook: null, note: "Reviewer reassignment" },
      { label: "Lot lock & investigate clusters", playbook: "PB-LOT-LOCK", note: "Group EM excursions for batched investigation" },
    ],
    confidence: "high",
    sources: ["QMS deviation log", "QA reviewer roster"],
  },
};
