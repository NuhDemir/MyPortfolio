import { Link } from "react-router-dom";
import { Blocks, FileText, MessageSquare, Contact, CheckCircle, Clock } from "lucide-react";
import { formatDay } from "../../utils/dashboardFormatters.js";

const QUICK_LINKS = [
  { to: "/admin/projects", Icon: Blocks, label: "Projeler" },
  { to: "/admin/blog", Icon: FileText, label: "Blog" },
  { to: "/admin/comments", Icon: MessageSquare, label: "Yorumlar" },
  { to: "/admin/about", Icon: Contact, label: "About" },
];

const DashboardHero = ({ stats }) => {
  const today = formatDay();

  return (
    <section className="db-hero">
      <div className="db-hero__content">
        <span className="db-hero__eyebrow">Kontrol Merkezi</span>
        <h1 className="db-hero__title">Hos geldin</h1>
        <p className="db-hero__desc">
          Portfoyunu besleyen icerik, proje ve yorumlarin tek noktadan yonetimi.
        </p>

        <div className="db-hero__links">
          {QUICK_LINKS.map(({ to, Icon, label }) => (
            <Link key={to} to={to} className="db-hero__link">
              {Icon && <Icon size={16} />}
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="db-hero__meta">
        <div className="db-hero__status">
          <span className="db-hero__status-item">
            <CheckCircle size={14} />
            Sistem aktif
          </span>
          <span className="db-hero__status-item db-hero__status-item--muted">
            <Clock size={14} />
            {today}
          </span>
          {stats.pendingCommentCount > 0 && (
            <span className="db-hero__status-item db-hero__status-item--warn">
              <MessageSquare size={14} />
              {stats.pendingCommentCount} yorum beklemede
            </span>
          )}
        </div>
        <p className="db-hero__summary">
          {stats.projectCount + stats.blogCount} icerik · {stats.commentCount} yorum · {stats.messageCount} mesaj
        </p>
      </div>
    </section>
  );
};

export default DashboardHero;
