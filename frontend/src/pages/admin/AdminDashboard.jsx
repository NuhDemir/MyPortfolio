import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { getProjects } from "../../services/projectService"; // Proje servisi
import { getBlogs } from "../../services/blogService"; // Blog servisi
import LoadingSpinner from "../../components/common/LoadingSpinner"; // Yükleme animasyonu
import ErrorMessage from "../../components/common/ErrorMessage"; // Hata mesajı

const AdminDashboard = () => {
  // İstatistikler, yüklenme durumu ve hata için state'ler
  const [stats, setStats] = useState({
    projectCount: 0,
    blogCount: 0,
    messageCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Component yüklendiğinde verileri çekmek için useEffect
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Proje ve blog verilerini aynı anda çek
        const [projects, blogs] = await Promise.all([
          getProjects(),
          getBlogs(),
        ]);

        // Gelen verilerle state'i güncelle
        setStats({
          projectCount: projects.length,
          blogCount: blogs.length,
          messageCount: "N/A", // Backend'de mesaj servisi henüz yok
        });
      } catch (err) {
        // Hata olursa hata state'ini güncelle
        setError(
          err.message || "Dashboard verileri yüklenirken bir hata oluştu."
        );
      } finally {
        // Her durumda yüklenme durumunu false yap
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Sadece component mount olduğunda çalışır.

  // Yüklenme durumunu göster
  if (loading) {
    return (
      <div className="admin-dashboard">
        <LoadingSpinner message="İstatistikler yükleniyor..." />
      </div>
    );
  }

  // Hata durumunu göster
  if (error) {
    return (
      <div className="admin-dashboard">
        <ErrorMessage title="Hata" message={error} />
      </div>
    );
  }

  // Veriler başarılı bir şekilde yüklendiğinde dashboard'u göster
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
          <p>{stats.projectCount}</p> {/* Dinamik veri */}
        </div>
        <div className="dashboard-card">
          <h3>Blog Yazıları</h3>
          <p>{stats.blogCount}</p> {/* Dinamik veri */}
        </div>
        <div className="dashboard-card">
          <h3>Gelen Mesajlar</h3>
          <p>{stats.messageCount}</p> {/* Şimdilik statik veri */}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Son İşlemler</h2>
        <ul>
          {/* Bu kısım gelecekte daha da dinamik hale getirilebilir */}
          <li>Yeni proje eklendi: E-ticaret Sitesi</li>
          <li>Yeni mesaj alındı: [Kullanıcı Adı]</li>
          <li>Blog yazısı güncellendi: React Performans İpuçları</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
