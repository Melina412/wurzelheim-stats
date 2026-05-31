import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EventType } from "@/data/stats";
import { fmt } from "@/lib/format";

type Props = { data: EventType[] };

const COLORS = [
  "#21a85b", // go-green (primary)
  "#7c5cff", // purple
  "#14b8a6", // teal
  "#ffcb05", // yellow
  "#ee1515", // red
  "#14723e", // green-deep
  "#f97316", // orange
  "#0ea5e9", // sky
  "#94a3b8", // slate
];

export function EventTypeChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  return (
    <ResponsiveContainer width="100%" height={Math.max(260, sorted.length * 42)}>
      <BarChart
        layout="vertical"
        data={sorted}
        margin={{ top: 4, right: 56, left: 8, bottom: 4 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="type"
          width={140}
          stroke="var(--text-muted)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: "var(--color-go-green)", fillOpacity: 0.06 }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload as EventType;
            return (
              <div className="rounded-xl border border-base bg-elevated px-4 py-3 text-sm shadow-xl">
                <p className="font-semibold text-base-fg">{d.type}</p>
                <p className="text-muted">
                  {d.count} Events · Ø {fmt(d.avgCheckIns)} Check-ins
                </p>
                <p className="text-go-green">{fmt(d.checkIns)} Check-ins gesamt</p>
              </div>
            );
          }}
        />
        <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={28}>
          {sorted.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
          <LabelList
            dataKey="count"
            position="right"
            fill="var(--text-muted)"
            fontSize={12}
            fontWeight={600}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
