import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import CommentIcon from "@mui/icons-material/Comment";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ErrorMessage from "@shared/ui/ErrorMessage.jsx";
import LoadingSpinner from "@shared/ui/LoadingSpinner.jsx";
import { getDashboardSnapshot } from "../services/dashboardService";
import { commentService } from "../services/commentService";
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
        division.unit,
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

const getActivityHref = (item) => {
  if (!item) {
    return null;
  }

  switch (item.type) {
    case "project":
      return "/admin/projects";
    case "blog":
      return "/admin/blog";
    case "message":
      return null;
    default:
      return null;
  }
};

const initialStats = {
  projectCount: 0,
  blogCount: 0,
  messageCount: 0,
  commentCount: 0,
  pendingCommentCount: 0,
};

const ITEMS_PER_PAGE = 4;

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(initialStats);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard data and comment stats in parallel
        const [dashboardData, commentStats] = await Promise.all([
          getDashboardSnapshot(),
          commentService
            .getStats()
            .catch(() => ({ data: { total: 0, pending: 0 } })),
        ]);

        setStats({
          projectCount: Number(dashboardData?.stats?.projects) || 0,
          blogCount: Number(dashboardData?.stats?.blogs) || 0,
          messageCount: Number(dashboardData?.stats?.messages) || 0,
          commentCount: Number(commentStats?.data?.total) || 0,
          pendingCommentCount: Number(commentStats?.data?.pending) || 0,
        });

        setActivity(
          Array.isArray(dashboardData?.activity) ? dashboardData.activity : [],
        );
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
        id: "comments",
        label: "Toplam yorum",
        value: stats.commentCount,
      },
      {
        id: "pendingComments",
        label: "Bekleyen yorum",
        value: stats.pendingCommentCount,
      },
      {
        id: "messages",
        label: "Mesaj (yakında)",
        value: stats.messageCount,
      },
    ],
    [
      stats.blogCount,
      stats.commentCount,
      stats.messageCount,
      stats.pendingCommentCount,
      stats.projectCount,
    ],
  );

  const distributionItems = useMemo(() => {
    const items = [
      { id: "projects", label: "Projeler", value: stats.projectCount },
      { id: "blogs", label: "Blog", value: stats.blogCount },
      { id: "comments", label: "Yorum", value: stats.commentCount },
      {
        id: "pendingComments",
        label: "Bekleyen yorum",
        value: stats.pendingCommentCount,
        tone: "warning",
      },
    ];

    const maxValue = Math.max(1, ...items.map((item) => item.value));
    return items.map((item) => ({
      ...item,
      percent: Math.round((item.value / maxValue) * 100),
    }));
  }, [
    stats.blogCount,
    stats.commentCount,
    stats.pendingCommentCount,
    stats.projectCount,
  ]);

  // Pagination for activity
  const totalPages = Math.ceil(activity.length / ITEMS_PER_PAGE);
  const paginatedActivity = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return activity.slice(startIndex, endIndex);
  }, [activity, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const today = useMemo(
    () => new Date().toLocaleDateString("tr-TR", { dateStyle: "long" }),
    [],
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

          <div
            className="dashboard-hero__actions"
            aria-label="Hızlı aksiyonlar"
          >
            <Link className="dashboard-action" to="/admin/projects">
              <WorkspacesRoundedIcon fontSize="inherit" aria-hidden="true" />
              Projeler
            </Link>
            <Link className="dashboard-action" to="/admin/blog">
              <ArticleRoundedIcon fontSize="inherit" aria-hidden="true" />
              Blog
            </Link>
            <Link className="dashboard-action" to="/admin/comments">
              <CommentIcon fontSize="inherit" aria-hidden="true" />
              Yorumlar
              {stats.pendingCommentCount > 0 ? (
                <span
                  className="dashboard-action__badge"
                  aria-label="Bekleyen yorum"
                >
                  {stats.pendingCommentCount}
                </span>
              ) : null}
            </Link>
          </div>
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
            {stats.pendingCommentCount > 0 ? (
              <span className="dashboard-badge dashboard-badge--warning">
                <CommentIcon fontSize="inherit" aria-hidden="true" />
                {stats.pendingCommentCount} yorum beklemede
              </span>
            ) : null}
          </div>
          <div className="dashboard-hero__meta-text">
            <TimelineRoundedIcon fontSize="inherit" aria-hidden="true" />
            <span>
              Anlık görünüm: {stats.projectCount + stats.blogCount} içerik,{" "}
              {stats.messageCount} mesaj, {stats.commentCount} yorum
            </span>
          </div>
        </div>
      </section>

      <section className="dashboard-cards">
        <Link
          className="dashboard-card dashboard-card--link"
          to="/admin/projects"
          aria-label="Projeleri yönet"
        >
          <span className="dashboard-card__icon" aria-hidden="true">
            <WorkspacesRoundedIcon fontSize="inherit" />
          </span>
          <span className="dashboard-card__title">Projeler</span>
          <span className="dashboard-card__value">{stats.projectCount}</span>
          <span className="dashboard-card__note">Portföyde yayınlanan</span>
          <span className="dashboard-card__cta" aria-hidden="true">
            Yönet <ChevronRightRoundedIcon fontSize="inherit" />
          </span>
        </Link>
        <Link
          className="dashboard-card dashboard-card--link"
          to="/admin/blog"
          aria-label="Blog yazılarını yönet"
        >
          <span className="dashboard-card__icon" aria-hidden="true">
            <ArticleRoundedIcon fontSize="inherit" />
          </span>
          <span className="dashboard-card__title">Blog Yazıları</span>
          <span className="dashboard-card__value">{stats.blogCount}</span>
          <span className="dashboard-card__note">Editoryal içerik</span>
          <span className="dashboard-card__cta" aria-hidden="true">
            Yönet <ChevronRightRoundedIcon fontSize="inherit" />
          </span>
        </Link>
        <div
          className="dashboard-card dashboard-card--disabled"
          aria-disabled="true"
        >
          <span className="dashboard-card__icon" aria-hidden="true">
            <ChatBubbleOutlineRoundedIcon fontSize="inherit" />
          </span>
          <span className="dashboard-card__title">Mesajlar</span>
          <span className="dashboard-card__value">{stats.messageCount}</span>
          <span className="dashboard-card__note">Yakında</span>
        </div>
        <Link
          className={`dashboard-card dashboard-card--link${
            stats.pendingCommentCount > 0 ? " dashboard-card--attention" : ""
          }`}
          to="/admin/comments"
          aria-label="Yorumları yönet"
        >
          <span className="dashboard-card__icon" aria-hidden="true">
            <CommentIcon fontSize="inherit" />
          </span>
          <span className="dashboard-card__title">Yorumlar</span>
          <span className="dashboard-card__value">{stats.commentCount}</span>
          <span className="dashboard-card__note">
            {stats.pendingCommentCount} beklemede
          </span>
          <span className="dashboard-card__cta" aria-hidden="true">
            Yönet <ChevronRightRoundedIcon fontSize="inherit" />
          </span>
        </Link>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-section">
          <div className="dashboard-section__header">
            <SpaceDashboardRoundedIcon fontSize="inherit" aria-hidden="true" />
            <h2>Son işlemler</h2>
            {activity.length > ITEMS_PER_PAGE && (
              <span className="dashboard-section__count">
                {activity.length} işlem
              </span>
            )}
          </div>
          <ul className="dashboard-activity">
            {paginatedActivity.length > 0 ? (
              paginatedActivity.map((item) => {
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
                  item.resourceTitle ?? item.meta ?? item.title ?? "-",
                );

                const href = getActivityHref(item);
                const RowComponent = href ? Link : "div";
                const rowProps = href
                  ? { to: href, className: "dashboard-activity__row" }
                  : { className: "dashboard-activity__row" };

                return (
                  <li key={item.id}>
                    <RowComponent {...rowProps}>
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
                    </RowComponent>
                  </li>
                );
              })
            ) : (
              <li className="dashboard-activity__empty">
                <span>Henüz aktivite yok</span>
              </li>
            )}
          </ul>

          {/* Pagination Controls */}
          {activity.length > ITEMS_PER_PAGE && (
            <div className="dashboard-pagination">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="dashboard-pagination__btn"
                aria-label="Önceki sayfa"
              >
                <NavigateBeforeIcon fontSize="inherit" />
              </button>
              <span className="dashboard-pagination__info">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="dashboard-pagination__btn"
                aria-label="Sonraki sayfa"
              >
                <NavigateNextIcon fontSize="inherit" />
              </button>
            </div>
          )}
        </div>
        <div className="dashboard-section dashboard-section--outline">
          <div className="dashboard-section__header">
            <TimelineRoundedIcon fontSize="inherit" aria-hidden="true" />
            <h2>Öne çıkan sayılar</h2>
          </div>

          <div className="dashboard-chart" aria-label="İçerik dağılımı grafiği">
            <div className="dashboard-chart__header">
              <span className="dashboard-chart__title">İçerik dağılımı</span>
              <span className="dashboard-chart__hint">Oransal</span>
            </div>
            <ul className="dashboard-bars" aria-label="İçerik dağılımı">
              {distributionItems.map(({ id, label, value, percent, tone }) => (
                <li key={id} className="dashboard-bar">
                  <div className="dashboard-bar__meta">
                    <span className="dashboard-bar__label">{label}</span>
                    <span className="dashboard-bar__value">{value}</span>
                  </div>
                  <div
                    className={
                      tone === "warning"
                        ? "dashboard-bar__track dashboard-bar__track--warning"
                        : "dashboard-bar__track"
                    }
                    role="img"
                    aria-label={`${label}: ${value}`}
                  >
                    <span
                      className="dashboard-bar__fill"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
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
