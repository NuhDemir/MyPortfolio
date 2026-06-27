import React from "react";

const StatCard = ({ icon: Icon, title, value, subtitle, trend, trendValue }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid var(--border-color)",
        borderRadius: "20px",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      className="stat-card-hover"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Icon && <Icon size={22} />}
        </div>
        {trend && (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "600",
              backgroundColor: trend === "up" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
              color: trend === "up" ? "#22c55e" : "#ef4444",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {trend === "up" ? "↑" : "↓"} {trendValue}
          </span>
        )}
      </div>

      <div>
        <h4 style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500" }}>
          {title}
        </h4>
        <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--text-primary)", marginTop: "4px" }}>
          {value}
        </div>
        {subtitle && (
          <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
            {subtitle}
          </p>
        )}
      </div>

      <style>{`
        .stat-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06) !important;
        }
      `}</style>
    </div>
  );
};

export default StatCard;
