import { FileText, Eye, Clock, Edit3 } from "lucide-react";
import "./BlogStatsBar.css";

const BlogStatsBar = ({ stats }) => {
  const items = [
    { icon: FileText, label: "Yayinda", value: stats.published, tone: "neutral" },
    { icon: Edit3, label: "Taslak", value: stats.drafts, tone: "muted" },
    { icon: Eye, label: "Goruntuleme", value: stats.totalViews, tone: "neutral" },
    { icon: Clock, label: "Ort. Okuma", value: stats.avgReadingTime ? `${stats.avgReadingTime}d` : "-", tone: "muted" },
  ];

  return (
    <div className="blog-stats">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="blog-stats__item">
          <span className="blog-stats__icon">{Icon && <Icon size={16} />}</span>
          <span className="blog-stats__value">{value}</span>
          <span className="blog-stats__label">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default BlogStatsBar;
