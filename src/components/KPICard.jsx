import { ArrowDown, ArrowUp, Minus } from "lucide-react";

const statusColor = {
  green: { bar: "from-ok-500/30 to-ok-500/0", dot: "bg-ok-500", border: "border-ok-500/30", text: "text-ok-500" },
  amber: { bar: "from-warn-500/30 to-warn-500/0", dot: "bg-warn-500", border: "border-warn-500/30", text: "text-warn-500" },
  red:   { bar: "from-bad-500/30 to-bad-500/0", dot: "bg-bad-500", border: "border-bad-500/30", text: "text-bad-500" },
};

export default function KPICard({ kpi, onOpen, mini = false, history }) {
  const c = statusColor[kpi.status];
  const dir = kpi.direction === "lower-better";
  const trendUp = kpi.trend > 0;
  const trendIcon = kpi.trend === 0 ? Minus : trendUp ? ArrowUp : ArrowDown;
  const Trend = trendIcon;
  const trendIsGood = (dir && !trendUp) || (!dir && trendUp);
  const fmt = (v) => {
    if (kpi.unit === "%" || kpi.unit === "% std" || kpi.unit === "% of plan") return `${v.toFixed(1)}%`;
    if (kpi.unit === "$M") return `$${v.toFixed(1)}M`;
    if (kpi.unit === "hrs" || kpi.unit === "days") return `${v.toFixed(1)} ${kpi.unit}`;
    return `${Math.round(v)}${kpi.unit ? " " + kpi.unit : ""}`;
  };
  return (
    <button
      onClick={() => onOpen?.(kpi)}
      className={`group relative text-left bg-ink-900/60 hover:bg-ink-900 border ${c.border} rounded-lg overflow-hidden p-3 transition-all hover:translate-y-[-1px] hover:shadow-soft`}
    >
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${c.bar}`} />
      <div className="flex items-start gap-2">
        <div className={`h-2 w-2 rounded-full ${c.dot} mt-1.5 shrink-0`} />
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium text-ink-300 truncate" title={kpi.name}>{kpi.name}</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <div className="text-[20px] font-semibold text-white tracking-tight">{fmt(kpi.current)}</div>
            <div className="text-[10.5px] text-ink-500">/ {fmt(kpi.target)}</div>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className={`flex items-center gap-0.5 text-[10.5px] font-medium ${trendIsGood ? "text-ok-500" : "text-bad-500"}`}>
              <Trend size={11} />
              <span>{Math.abs(kpi.trend).toFixed(1)}{kpi.unit === "%" ? "pp" : ""}</span>
            </div>
            <div className="text-[10px] uppercase font-semibold tracking-wider opacity-60 text-ink-500">vs last</div>
          </div>
        </div>
      </div>
      {!mini && history && (
        <div className="mt-2 -mx-1">
          <Sparkline points={history} status={kpi.status} />
        </div>
      )}
    </button>
  );
}

function Sparkline({ points, status }) {
  const w = 220, h = 36, pad = 2;
  const values = points.map((p) => p.value);
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const x = (i) => pad + (i / (values.length - 1)) * (w - pad * 2);
  const y = (v) => h - pad - ((v - min) / range) * (h - pad * 2);
  const path = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  const area = `${path} L${x(values.length - 1)},${h} L${x(0)},${h} Z`;
  const stroke = status === "green" ? "#22c55e" : status === "amber" ? "#f59e0b" : "#ef4444";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9">
      <path d={area} fill={stroke} fillOpacity="0.08" />
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.value)} r={i === values.length - 1 ? 1.8 : 1.1} fill={stroke} />
      ))}
    </svg>
  );
}
