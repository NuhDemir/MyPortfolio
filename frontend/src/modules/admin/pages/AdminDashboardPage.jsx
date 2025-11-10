import { useEffect, useMemo, useState } from "react";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorMessage from "@shared/ui/ErrorMessage.jsx";
import LoadingSpinner from "@shared/ui/LoadingSpinner.jsx";
import { getDashboardSnapshot } from "../services/dashboardService";
import "../styles/dashboard.css";

const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat("tr-TR", {
  numeric: "auto",
});

const RELATIVE_TIME_DIVISIONS = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

const formatRelativeTime = (isoString) => {
  if (!isoString) {
    return "";
  }

  const target = new Date(isoString);

  if (Number.isNaN(target.getTime())) {
    return "";
  }

  let duration = (target.getTime() - Date.now()) / 1000;

  for (const division of RELATIVE_TIME_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return RELATIVE_TIME_FORMATTER.format(
        Math.round(duration),
        division.unit
      );
    }
    duration /= division.amount;
  }

  return target.toLocaleDateString("tr-TR", { dateStyle: "medium" });
};

const getActivityIcon = (type) => {
  switch (type) {
    case "project":
      return <WorkspacesRoundedIcon fontSize="inherit" />;
    case "blog":
      return <ArticleRoundedIcon fontSize="inherit" />;
    case "message":
      return <ChatBubbleOutlineRoundedIcon fontSize="inherit" />;
    default:
      return <TimelineRoundedIcon fontSize="inherit" />;
  }
};

const getActivityHeadline = (item) => {
  if (!item) {
    return "Yeni aktivite";
  }

  if (item.headline) {
    return item.headline;
  }

  if (item.type === "project") {
    return item.action === "updated"
      ? "Proje güncellendi"
      : "Yeni proje yayımlandı";
  }

  if (item.type === "blog") {
    return item.action === "updated"
      ? "Blog yazısı güncellendi"
      : "Yeni blog yazısı yayınlandı";
  }

  if (item.type === "message") {
    return item.action === "updated"
      ? "Mesaj güncellendi"
      : "Yeni mesaj alındı";
  }

  return "Yeni aktivite";
};

const initialStats = {
  projectCount: 0,
  blogCount: 0,
  messageCount: 0,
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(initialStats);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardSnapshot();

        setStats({
          projectCount: Number(data?.stats?.projects) || 0,
          blogCount: Number(data?.stats?.blogs) || 0,
          messageCount: Number(data?.stats?.messages) || 0,
        });

        setActivity(Array.isArray(data?.activity) ? data.activity : []);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : String(err ?? "Dashboard verileri yüklenirken bir hata oluştu.");
        setError(message);
        setActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const summaryLines = useMemo(
    () => [
      {
        id: "projects",
        label: "Yayınlanan projeler",
        value: stats.projectCount,
      },
      {
        id: "blogs",
        label: "Aktif blog yazısı",
        value: stats.blogCount,
      },
      {
        id: "messages",
        label: "Yanıt bekleyen mesaj",
        value: stats.messageCount,
      },
    ],
    [stats.blogCount, stats.messageCount, stats.projectCount]
  );

  const today = useMemo(
    () => new Date().toLocaleDateString("tr-TR", { dateStyle: "long" }),
    []
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <LoadingSpinner message="İstatistikler yükleniyor..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <ErrorMessage title="Hata" message={error} />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <section className="dashboard-hero">
        <div className="dashboard-hero__content">
          <span className="dashboard-hero__eyebrow">MyPortfolio · Admin</span>
          <h1 className="dashboard-hero__title">
            Kontrol merkezine hoş geldin
          </h1>
          <p className="dashboard-hero__description">
            Portföyünü besleyen içerik, proje ve mesajların tek noktadan
            yönetimi. Tüm metrikler siyah-beyaz minimal bir panelde seninle.
          </p>
        </div>
        <div className="dashboard-hero__meta">
          <div className="dashboard-badges">
            <span className="dashboard-badge">
              <CheckCircleRoundedIcon fontSize="inherit" />
              Sistem aktif
            </span>
            <span className="dashboard-badge dashboard-badge--muted">
              {today}
            </span>
          </div>
          <div className="dashboard-hero__meta-text">
            <TimelineRoundedIcon fontSize="inherit" aria-hidden="true" />
            <span>
              Anlık görünüm: {stats.projectCount + stats.blogCount} içerik,{" "}
              {stats.messageCount} mesaj
            </span>
          </div>
        </div>
      </section>

      <section className="dashboard-cards">
        <article className="dashboard-card">
          <span className="dashboard-card__icon" aria-hidden="true">
            <WorkspacesRoundedIcon fontSize="inherit" />
          </span>
          <span className="dashboard-card__title">Projeler</span>
          <span className="dashboard-card__value">{stats.projectCount}</span>
          <span className="dashboard-card__note">Portföyde yayınlanan</span>
        </article>
        <article className="dashboard-card">
          <span className="dashboard-card__icon" aria-hidden="true">
            <ArticleRoundedIcon fontSize="inherit" />
          </span>
          <span className="dashboard-card__title">Blog Yazıları</span>
          <span className="dashboard-card__value">{stats.blogCount}</span>
          <span className="dashboard-card__note">Editoryal içerik</span>
        </article>
        <article className="dashboard-card">
          <span className="dashboard-card__icon" aria-hidden="true">
            <ChatBubbleOutlineRoundedIcon fontSize="inherit" />
          </span>
          <span className="dashboard-card__title">Mesajlar</span>
          <span className="dashboard-card__value">{stats.messageCount}</span>
          <span className="dashboard-card__note">Gelen kutusu</span>
        </article>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-section">
          <div className="dashboard-section__header">
            <SpaceDashboardRoundedIcon fontSize="inherit" aria-hidden="true" />
            <h2>Son işlemler</h2>
          </div>
          <ul className="dashboard-activity">
            {activity.length > 0 ? (
              activity.map((item) => {
                const icon = getActivityIcon(item.type);
                const occurredAt =
                  item.occurredAt ?? item.updatedAt ?? item.createdAt ?? null;
                const relativeTime = formatRelativeTime(occurredAt);
                const fallbackDate = occurredAt
                  ? new Date(occurredAt).toLocaleString("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "-";
                const metaText = String(
                  item.resourceTitle ?? item.meta ?? item.title ?? "-"
                );

                return (
                  <li key={item.id}>
                    <span
                      className="dashboard-activity__icon"
                      aria-hidden="true"
                    >
                      {icon}
                    </span>
                    <div className="dashboard-activity__body">
                      <p className="dashboard-activity__title">
                        {getActivityHeadline(item)}
                      </p>
                      <p className="dashboard-activity__meta">{metaText}</p>
                    </div>
                    <time
                      className="dashboard-activity__time"
                      dateTime={occurredAt ?? ""}
                    >
                      {relativeTime || fallbackDate}
                    </time>
                  </li>
                );
              })
            ) : (
              <li className="dashboard-activity__empty">
                <span>Henüz aktivite yok</span>
              </li>
            )}
          </ul>
        </div>
        <div className="dashboard-section dashboard-section--outline">
          <div className="dashboard-section__header">
            <TimelineRoundedIcon fontSize="inherit" aria-hidden="true" />
            <h2>Öne çıkan sayılar</h2>
          </div>
          <ul className="dashboard-summary">
            {summaryLines.map(({ id, label, value }) => (
              <li key={id}>
                <span className="dashboard-summary__label">{label}</span>
                <span className="dashboard-summary__value">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
