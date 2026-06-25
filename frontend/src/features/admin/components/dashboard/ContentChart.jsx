import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart } from "lucide-react";

const ContentChart = ({ distribution }) => {
  const data = distribution.map((d) => ({ name: d.label, value: d.value }));

  return (
    <div className="db-section db-section--alt">
      <div className="db-section__header">
        <PieChart size={18} />
        <h2>Icerik dagilimi</h2>
      </div>

      <div className="db-chart">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-border-soft)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--ds-muted)" }}
              axisLine={{ stroke: "var(--ds-border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--ds-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--ds-surface)",
                border: "1px solid var(--ds-border)",
                borderRadius: "var(--ds-radius-sm)",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="value"
              fill="var(--ds-fg)"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContentChart;
