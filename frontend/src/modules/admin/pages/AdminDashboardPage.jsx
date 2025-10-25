import { useEffect, useState } from "react";
import { getBlogs } from "../services/blogService";
import { getProjects } from "../services/projectService";
import ErrorMessage from "@shared/ui/ErrorMessage.jsx";
import LoadingSpinner from "../../../shared/ui/LoadingSpinner.jsx";
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
      <h1>Dashboard'a Hoş Geldiniz!</h1>
      <p>
        Burada portföyünüzle ilgili genel bilgileri ve istatistikleri
        görebilirsiniz.
      </p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Toplam Proje</h3>
          <p>{stats.projectCount}</p>
        </div>
        <div className="dashboard-card">
          <h3>Blog Yazıları</h3>
          <p>{stats.blogCount}</p>
        </div>
        <div className="dashboard-card">
          <h3>Gelen Mesajlar</h3>
          <p>{stats.messageCount}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Son İşlemler</h2>
        <ul>
          <li>Yeni proje eklendi: E-ticaret Sitesi</li>
          <li>Yeni mesaj alındı: [Kullanıcı Adı]</li>
          <li>Blog yazısı güncellendi: React Performans İpuçları</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
