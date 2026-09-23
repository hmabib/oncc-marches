"use client";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, Legend,
} from "recharts";

export function fmtTickDate(d: string) {
  if (!d) return "";
  const [, m, day] = d.split("-").map(Number);
  return `${String(day).padStart(2, "0")}/${String(m).padStart(2, "0")}`;
}

export function PriceChart({ data, series, height = 300, yLabel }: {
  data: any[]; series: { key: string; name: string; color: string }[]; height?: number; yLabel?: string;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EADFC6" />
          <XAxis dataKey="date" tickFormatter={fmtTickDate} tick={{ fontSize: 11 }} minTickGap={28} />
          <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} width={64} label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fontSize: 10 } : undefined} />
          <Tooltip
            labelFormatter={(l) => `Séance : ${String(l).split("-").reverse().join("/")}`}
            formatter={(v: any, name: any) => [Number(v).toLocaleString("fr-FR"), name]}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {series.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} dot={false} isAnimationActive={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AreaSingle({ data, dataKey, color, height = 120 }: { data: any[]; dataKey: string; color: string; height?: number }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.18} strokeWidth={2} isAnimationActive={false} />
          <Tooltip formatter={(v: any) => Number(v).toLocaleString("fr-FR")} labelFormatter={(l) => String(l).split("-").reverse().join("/")} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
