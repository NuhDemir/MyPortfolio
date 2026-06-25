import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CHART_COLORS = ["#111111", "#333333", "#555555", "#777777", "#999999", "#bbbbbb"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)", padding: "8px 12px", fontFamily: "var(--ds-font-body)", fontSize: "0.8125rem" }}>
      <strong style={{ color: "var(--ds-fg)" }}>{label}</strong>
      <span style={{ color: "var(--ds-muted)", marginLeft: 8 }}>{payload[0].value} repo</span>
    </div>
  );
};

export const LanguageChart = ({ data = [] }) => {
  if (!data.length) return null;

  return (
    <div className="about3__chart">
      <h3 className="about3__chart-title">En Çok Kullanılan Diller</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 0, bottom: 4, left: 0 }} barCategoryGap="40%">
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontFamily: "var(--ds-font-body)", fontSize: 11, fill: "var(--ds-muted)" }} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--ds-surface)" }} />
          <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={48}>
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MetricsChart = ({ data = [] }) => {
  if (!data.length) return null;

  return (
    <div className="about3__chart">
      <h3 className="about3__chart-title">Genel Metrikler</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 0 }} barCategoryGap="30%">
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" axisLine={false} tickLine={false} tick={{ fontFamily: "var(--ds-font-body)", fontSize: 11, fill: "var(--ds-muted)" }} width={80} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--ds-surface)" }} />
          <Bar dataKey="value" radius={[0, 2, 2, 0]} maxBarSize={24}>
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
