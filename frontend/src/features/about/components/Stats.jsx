import React from "react";
import { LanguageChart, MetricsChart } from "./Charts.jsx";

export const Stats = ({ stats = [], github }) => {
  const cardMetrics = [
    { value: github?.repos ?? "--", label: "Repo", extra: github?.topLang ? `#1 ${github.topLang}` : null },
    { value: github?.stars ?? "--", label: "Yıldız", extra: github?.followers ? `${github.followers} Takipçi` : null },
    ...stats.map((s) => ({ value: s.value ?? "--", label: s.label, link: s.link })),
  ];

  const metricChartData = [
    { label: "Repo", value: github?.repos ?? 0 },
    { label: "Yıldız", value: github?.stars ?? 0 },
    { label: "Takipçi", value: github?.followers ?? 0 },
    ...stats.map((s) => ({ label: s.label, value: parseInt(s.value, 10) || 0 })),
  ].filter((d) => d.value > 0);

  return (
    <div>
      <div className="about3__stats">
        {cardMetrics.map((m) => (
          <div key={m.label} className="about3__stat">
            <div className="about3__stat-label">{m.label}</div>
            <div className="about3__stat-value">{m.value}</div>
            {m.extra && <div className="about3__stat-extra">{m.extra}</div>}
            {m.link && (
              <a href={m.link} target="_blank" rel="noopener noreferrer" className="about3__stat-link">
                Görüntüle
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="about3__charts">
        {github?.languages?.length > 0 && <LanguageChart data={github.languages} />}
        {metricChartData.length > 0 && <MetricsChart data={metricChartData} />}
      </div>
    </div>
  );
};
