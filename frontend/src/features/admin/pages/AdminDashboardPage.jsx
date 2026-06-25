import { ErrorMessage, LoadingSpinner } from "@shared";
import { useDashboardData } from "../hooks/useDashboardData.js";
import DashboardHero from "../components/dashboard/DashboardHero.jsx";
import StatCards from "../components/dashboard/StatCards.jsx";
import ActivityFeed from "../components/dashboard/ActivityFeed.jsx";
import ContentChart from "../components/dashboard/ContentChart.jsx";
import QuickSummary from "../components/dashboard/QuickSummary.jsx";
import "../styles/dashboard.css";

const AdminDashboardPage = () => {
  const { stats, activity, loading, error, distribution, summaryLines } = useDashboardData();

  if (loading) {
    return (
      <div className="db-page">
        <LoadingSpinner message="Istatistikler yukleniyor..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="db-page">
        <ErrorMessage title="Hata" message={error} />
      </div>
    );
  }

  return (
    <div className="db-page">
      <DashboardHero stats={stats} />
      <StatCards stats={stats} />
      <div className="db-grid">
        <ActivityFeed activity={activity} />
        <div className="db-grid__aside">
          <ContentChart distribution={distribution} />
          <QuickSummary summaryLines={summaryLines} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
