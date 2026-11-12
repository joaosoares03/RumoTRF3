"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axis = { stroke: "var(--muted)", fontSize: 11, tickLine: false, axisLine: false } as const;
const tooltipStyle = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12, color: "var(--text)" };

export function DailyActivityChart({ data }: { data: { label: string; minutos: number; questoes: number; taxa: number | null }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" {...axis} />
        <YAxis yAxisId="m" {...axis} />
        <YAxis yAxisId="t" orientation="right" domain={[0, 100]} {...axis} hide />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--surface-2)" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar yAxisId="m" dataKey="minutos" name="Minutos estudados" fill="var(--accent)" radius={[6, 6, 0, 0]} maxBarSize={26} />
        <Bar yAxisId="m" dataKey="questoes" name="Questões" fill="var(--teal)" radius={[6, 6, 0, 0]} maxBarSize={26} />
        <Line yAxisId="t" dataKey="taxa" name="% acertos" stroke="var(--amber)" strokeWidth={2} dot={{ r: 2 }} connectNulls />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function SimpleBars({ data, dataKey, nameKey, color = "var(--accent)", unit, height = 260 }: { data: Record<string, unknown>[]; dataKey: string; nameKey: string; color?: string; unit?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid stroke="var(--border)" horizontal={false} />
        <XAxis type="number" {...axis} unit={unit} />
        <YAxis type="category" dataKey={nameKey} width={150} {...axis} tick={{ fontSize: 11, fill: "var(--muted)" }} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--surface-2)" }} />
        <Bar dataKey={dataKey} fill={color} radius={[0, 6, 6, 0]} maxBarSize={18} unit={unit} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendChart({ data, lines }: { data: Record<string, unknown>[]; lines: { key: string; name: string; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" {...axis} />
        <YAxis {...axis} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {lines.map((l) => (
          <Line key={l.key} dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2.2} dot={{ r: 3 }} connectNulls />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AreaTrend({ data, dataKey, name, color = "var(--accent)" }: { data: Record<string, unknown>[]; dataKey: string; name: string; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id={`g-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" {...axis} />
        <YAxis {...axis} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area dataKey={dataKey} name={name} stroke={color} fill={`url(#g-${dataKey})`} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SkillRadar({ data }: { data: { name: string; taxa: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted)" }} />
        <Radar dataKey="taxa" name="% acertos" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.25} />
        <Tooltip contentStyle={tooltipStyle} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
