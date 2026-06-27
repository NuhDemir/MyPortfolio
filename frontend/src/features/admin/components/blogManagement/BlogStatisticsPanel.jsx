import React, { useMemo, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  FileText, Eye, Heart, Clock, Share2, TrendingUp, RefreshCw, BarChart2, Star 
} from "lucide-react";
import StatCard from "../common/StatCard.jsx";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

// Helper to format large numbers e.g. 154000 -> 154K
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const BlogStatisticsPanel = ({ blogs, onRefresh, loading }) => {
  // Compute all statistics efficiently using useMemo
  const stats = useMemo(() => {
    const totalBlogs = blogs.length;
    let totalViews = 0;
    let totalLikes = 0;
    let totalShares = 0;
    let totalReadingTime = 0;
    
    const categoryCountMap = {};
    const categoryViewsMap = {};
    const statusMap = { published: 0, draft: 0, archived: 0 };
    const monthMap = {}; // for Area Chart (Blogs over time)

    let mostViewed = null;
    let mostLiked = null;

    blogs.forEach(blog => {
      const views = blog.views || 0;
      const likes = blog.likes || 0;
      const shares = blog.shares || 0;
      const readingTime = blog.readingTime || 0;
      
      totalViews += views;
      totalLikes += likes;
      totalShares += shares;
      totalReadingTime += readingTime;

      // Category counts
      const cat = blog.category || 'Diğer';
      categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
      categoryViewsMap[cat] = (categoryViewsMap[cat] || 0) + views;

      // Status counts
      const stat = blog.status || (blog.isPublished ? 'published' : 'draft');
      statusMap[stat] = (statusMap[stat] || 0) + 1;

      // Time series (Blogs created over time grouped by YYYY-MM)
      const date = new Date(blog.createdAt);
      if (!isNaN(date)) {
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthMap[monthYear] = (monthMap[monthYear] || 0) + 1;
      }

      // Most viewed & Most liked
      if (!mostViewed || views > (mostViewed.views || 0)) mostViewed = blog;
      if (!mostLiked || likes > (mostLiked.likes || 0)) mostLiked = blog;
    });

    const avgReadingTime = totalBlogs > 0 ? (totalReadingTime / totalBlogs).toFixed(1) : 0;

    // Formatting for charts
    const categoryData = Object.keys(categoryCountMap).map(name => ({
      name,
      value: categoryCountMap[name]
    })).sort((a, b) => b.value - a.value);

    const categoryViewsData = Object.keys(categoryViewsMap).map(name => ({
      name,
      views: categoryViewsMap[name]
    })).sort((a, b) => b.views - a.views);

    const statusData = [
      { name: 'Yayınlandı', value: statusMap.published || 0 },
      { name: 'Taslak', value: statusMap.draft || 0 },
      { name: 'Arşiv', value: statusMap.archived || 0 },
    ].filter(item => item.value > 0);

    const timeSeriesData = Object.keys(monthMap).sort().map(date => ({
      date,
      count: monthMap[date]
    }));

    // Calculate a simple "trend" for Views (just mock comparing to 0 for UI demo)
    const viewsTrend = totalViews > 0 ? 'up' : null;
    const viewsTrendValue = "+12%";

    return {
      totalBlogs, totalViews, totalLikes, totalShares, avgReadingTime,
      categoryData, categoryViewsData, statusData, timeSeriesData,
      mostViewed, mostLiked, viewsTrend, viewsTrendValue
    };
  }, [blogs]);

  // Custom Tooltip for dark mode support
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          color: 'var(--text-primary)'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: 0, color: entry.color, fontSize: '14px' }}>
              {entry.name}: <span style={{ fontWeight: 'bold' }}>{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", animation: "fadeIn 0.4s ease" }}>
      
      {/* Header & Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.5rem", color: "var(--text-primary)" }}>Detaylı Analiz & İstatistikler</h2>
          <p style={{ margin: "4px 0 0 0", color: "var(--text-tertiary)", fontSize: "0.9rem" }}>
            Sistemdeki toplam {stats.totalBlogs} blog yazısının anlık analiz raporu.
          </p>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="admin-btn admin-btn--primary"
          style={{ padding: "8px 16px", borderRadius: "12px", gap: "8px" }}
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          {loading ? "Yenileniyor..." : "Verileri Yenile"}
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        <StatCard icon={FileText} title="Toplam Yazı" value={formatNumber(stats.totalBlogs)} />
        <StatCard icon={Eye} title="Toplam Görüntülenme" value={formatNumber(stats.totalViews)} trend={stats.viewsTrend} trendValue={stats.viewsTrendValue} />
        <StatCard icon={Heart} title="Toplam Beğeni" value={formatNumber(stats.totalLikes)} />
        <StatCard icon={Clock} title="Ort. Okuma Süresi" value={`${stats.avgReadingTime} dk`} />
      </div>

      {/* Main Charts Area */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        
        {/* Time Series Area Chart */}
        <div className="stat-panel-card">
          <div className="stat-panel-header">
            <TrendingUp size={18} />
            <h3>Zaman İçinde İçerik Üretimi</h3>
          </div>
          <div style={{ height: 300, width: "100%" }}>
            <ResponsiveContainer>
              <AreaChart data={stats.timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" name="Yazı Sayısı" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Views Bar Chart */}
        <div className="stat-panel-card">
          <div className="stat-panel-header">
            <BarChart2 size={18} />
            <h3>Kategori Bazlı Görüntülenme</h3>
          </div>
          <div style={{ height: 300, width: "100%" }}>
            <ResponsiveContainer>
              <BarChart data={stats.categoryViewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-secondary)', opacity: 0.5 }} />
                <Bar dataKey="views" name="Görüntülenme" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Charts & Top Performers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        
        {/* Status Distribution Pie Chart */}
        <div className="stat-panel-card">
          <div className="stat-panel-header">
            <PieChart size={18} />
            <h3>Yayın Durumu Dağılımı</h3>
          </div>
          <div style={{ height: 250, width: "100%" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div className="stat-panel-card top-performer">
            <div className="stat-panel-header">
              <Star size={18} color="#f59e0b" />
              <h3>En Çok Okunan Yazı</h3>
            </div>
            {stats.mostViewed ? (
              <div style={{ marginTop: "1rem" }}>
                <h4 style={{ margin: "0 0 8px 0", color: "var(--text-primary)", fontSize: "1rem" }}>{stats.mostViewed.title}</h4>
                <div style={{ display: "flex", gap: "1rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Eye size={14}/> {formatNumber(stats.mostViewed.views || 0)}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Heart size={14}/> {formatNumber(stats.mostViewed.likes || 0)}</span>
                </div>
              </div>
            ) : <p style={{ color: "var(--text-tertiary)" }}>Veri yok</p>}
          </div>

          <div className="stat-panel-card top-performer">
            <div className="stat-panel-header">
              <Heart size={18} color="#ef4444" />
              <h3>En Çok Beğenilen Yazı</h3>
            </div>
            {stats.mostLiked ? (
              <div style={{ marginTop: "1rem" }}>
                <h4 style={{ margin: "0 0 8px 0", color: "var(--text-primary)", fontSize: "1rem" }}>{stats.mostLiked.title}</h4>
                <div style={{ display: "flex", gap: "1rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Heart size={14}/> {formatNumber(stats.mostLiked.likes || 0)}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Share2 size={14}/> {formatNumber(stats.mostLiked.shares || 0)}</span>
                </div>
              </div>
            ) : <p style={{ color: "var(--text-tertiary)" }}>Veri yok</p>}
          </div>

        </div>
      </div>

      <style>{`
        .stat-panel-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
        .stat-panel-header {
          display: flex;
          alignItems: center;
          gap: 8px;
          margin-bottom: 1.5rem;
          color: var(--text-secondary);
        }
        .stat-panel-header h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }
        .top-performer {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BlogStatisticsPanel;
