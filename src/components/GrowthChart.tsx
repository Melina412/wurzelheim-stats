import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useT, useFormat } from "@/i18n/context";
import type { Monthly } from "@/data/stats";

type Props = { data: Monthly[] };

export function GrowthChart({ data }: Props) {
  const t = useT();
  const { fmt, fmtMonth } = useFormat();
  return (
    <ResponsiveContainer width="100%" height={360}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-go-green)"
              stopOpacity={0.55}
            />
            <stop
              offset="100%"
              stopColor="var(--color-go-green)"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tickFormatter={fmtMonth}
          stroke="var(--text-muted)"
          fontSize={11}
          tickMargin={8}
          minTickGap={24}
        />
        <YAxis
          stroke="var(--text-muted)"
          fontSize={11}
          width={48}
          tickFormatter={(v) => fmt(v as number)}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload as Monthly;
            return (
              <div className="rounded-xl border border-base bg-elevated px-4 py-3 text-sm shadow-xl">
                <p className="mb-1 font-semibold text-base-fg">
                  {fmtMonth(String(label))}
                </p>
                <p className="text-go-green">
                  {t("charts.participantsTotal", {
                    count: fmt(d.cumulativeParticipants),
                  })}
                </p>
                <p className="text-muted">
                  {t("charts.growthTooltipSub", {
                    new: fmt(d.newParticipants),
                    events: d.events,
                  })}
                </p>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="cumulativeParticipants"
          stroke="var(--color-go-green)"
          strokeWidth={3}
          fill="url(#growthFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
