import { useEffect, useMemo, useState } from "react";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorMessage from "@shared/ui/ErrorMessage.jsx";
import LoadingSpinner from "@shared/ui/LoadingSpinner.jsx";
import { getBlogs } from "../services/blogService";
import { getProjects } from "../services/projectService";
import "../styles/dashboard.css";

const initialStats = {
  projectCount: 0,
  blogCount: 0,
  messageCount: 0,
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [projects, blogs] = await Promise.all([
          getProjects(),
          getBlogs(),
        ]);

        setStats({
          projectCount: projects.length,
          blogCount: blogs.length,
          messageCount: 0,
        });
      } catch (err) {
        setError(
          err.message || "Dashboard verileri yüklenirken bir hata oluştu."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activityFeed = useMemo(
    () => [
      {
        id: 1,
        icon: <WorkspacesRoundedIcon fontSize="inherit" />,
        title: "Yeni proje yayımlandı",
        meta: "E-ticaret Sitesi",
        time: "Az önce",
      },
      {
        id: 2,
        icon: <ArticleRoundedIcon fontSize="inherit" />,
        title: "Blog yazısı güncellendi",
        meta: "React Performans İpuçları",
        time: "1 saat önce",
      },
      {
        id: 3,
        icon: <ChatBubbleOutlineRoundedIcon fontSize="inherit" />,
        title: "Yeni mesaj alındı",
        meta: "Kariyer fırsatı",
        time: "Bugün",
      },
    ],
    []
  );

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
            {activityFeed.map(({ id, icon, title, meta, time }) => (
              <li key={id}>
                <span className="dashboard-activity__icon" aria-hidden="true">
                  {icon}
                </span>
                <div className="dashboard-activity__body">
                  <p className="dashboard-activity__title">{title}</p>
                  <p className="dashboard-activity__meta">{meta}</p>
                </div>
                <time className="dashboard-activity__time">{time}</time>
              </li>
            ))}
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
