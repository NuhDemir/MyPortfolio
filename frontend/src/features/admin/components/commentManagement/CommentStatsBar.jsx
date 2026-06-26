import { MessageSquare, Clock, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import "./CommentStatsBar.css";

const STAT_ITEMS = [
  { key: "total", icon: MessageSquare, label: "Toplam", tone: "neutral" },
  { key: "pending", icon: Clock, label: "Beklemede", tone: "pending" },
  { key: "approved", icon: CheckCircle2, label: "Onaylı", tone: "success" },
  { key: "rejected", icon: XCircle, label: "Reddedildi", tone: "error" },
  { key: "spam", icon: ShieldAlert, label: "Spam", tone: "spam" },
];

const CommentStatsBar = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="comment-stats">
      {STAT_ITEMS.map(({ key, icon: Icon, label, tone }) => (
        <div key={key} className={`comment-stats__item comment-stats__item--${tone}`}>
          <span className="comment-stats__icon">{Icon && <Icon size={16} />}</span>
          <span className="comment-stats__value">{stats[key] ?? 0}</span>
          <span className="comment-stats__label">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default CommentStatsBar;
