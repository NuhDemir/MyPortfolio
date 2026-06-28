import React, { useState, memo, useMemo } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import "./BlogChart.css";

const CHART_TYPES = [
  { key: "bar",  label: "Bar"   },
  { key: "line", label: "Line"  },
  { key: "area", label: "Area"  },
  { key: "pie",  label: "Pie"   },
  { key: "radar",label: "Radar" },
];

const PALETTE = ["#6366f1","#22d3ee","#f59e0b","#10b981","#f43f5e","#a78bfa","#34d399"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bc-tooltip">
      {label && <p className="bc-tooltip__label">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="bc-tooltip__item" style={{ color: p.color || p.fill }}>
          <span>{p.name || p.dataKey}</span>
          <span>{p.value}</span>
        </p>
      ))}
    </div>
  );
};

const BlogChart = memo(({ chartData }) => {
  const parsed = useMemo(() => {
    try {
      return typeof chartData === "string" ? JSON.parse(chartData) : chartData;
    } catch {
      return null;
    }
  }, [chartData]);

  const defaultType = parsed?.type && CHART_TYPES.find(t => t.key === parsed.type)
    ? parsed.type
    : "bar";

  const [activeType, setActiveType] = useState(defaultType);

  if (!parsed || !Array.isArray(parsed.data) || parsed.data.length === 0) {
    return (
      <div className="bc-error">
        <span>&#9888; Gecersiz grafik verisi. Lutfen JSON formatini kontrol edin.</span>
      </div>
    );
  }

  const { data, title, description, xKey, dataKeys } = parsed;

  // Auto-detect keys if not specified
  const x = xKey || Object.keys(data[0])[0];
  const keys = dataKeys || Object.keys(data[0]).filter(k => k !== x);

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 20, left: 0, bottom: 5 },
    };
    const axis = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-border-soft)" />
        <XAxis dataKey={x} tick={{ fontSize: 12, fill: "var(--ds-muted)" }} />
        <YAxis tick={{ fontSize: 12, fill: "var(--ds-muted)" }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
      </>
    );

    if (activeType === "pie") {
      const pieData = data.map((d) => ({ name: d[x], value: d[keys[0]] || 0 }));
      return (
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="75%" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine>
            {pieData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      );
    }

    if (activeType === "radar") {
      return (
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="var(--ds-border-soft)" />
          <PolarAngleAxis dataKey={x} tick={{ fontSize: 12, fill: "var(--ds-muted)" }} />
          {keys.map((k, i) => (
            <Radar key={k} name={k} dataKey={k} stroke={PALETTE[i % PALETTE.length]} fill={PALETTE[i % PALETTE.length]} fillOpacity={0.3} />
          ))}
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </RadarChart>
      );
    }

    if (activeType === "line") {
      return (
        <LineChart {...commonProps}>
          {axis}
          {keys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} stroke={PALETTE[i % PALETTE.length]} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          ))}
        </LineChart>
      );
    }

    if (activeType === "area") {
      return (
        <AreaChart {...commonProps}>
          {axis}
          {keys.map((k, i) => (
            <Area key={k} type="monotone" dataKey={k} stroke={PALETTE[i % PALETTE.length]} fill={PALETTE[i % PALETTE.length]} fillOpacity={0.15} strokeWidth={2} />
          ))}
        </AreaChart>
      );
    }

    // Default: Bar
    return (
      <BarChart {...commonProps}>
        {axis}
        {keys.map((k, i) => (
          <Bar key={k} dataKey={k} fill={PALETTE[i % PALETTE.length]} radius={[4, 4, 0, 0]} maxBarSize={60} />
        ))}
      </BarChart>
    );
  };

  return (
    <div className="bc-wrap">
      <div className="bc-header">
        <div className="bc-header__text">
          {title && <h3 className="bc-title">{title}</h3>}
          {description && <p className="bc-desc">{description}</p>}
        </div>
        <div className="bc-type-tabs" role="tablist" aria-label="Grafik Turu">
          {CHART_TYPES.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeType === t.key}
              className={`bc-tab ${activeType === t.key ? "bc-tab--active" : ""}`}
              onClick={() => setActiveType(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="bc-chart-area">
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
});

BlogChart.displayName = "BlogChart";
export default BlogChart;
