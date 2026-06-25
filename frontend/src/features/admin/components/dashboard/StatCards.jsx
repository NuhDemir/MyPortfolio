import { Link } from "react-router-dom";
import { Blocks, FileText, MessageSquare, Contact, ChevronRight } from "lucide-react";

const STAT_CARDS = [
  { id: "projects", to: "/admin/projects", Icon: Blocks, label: "Projeler", note: "Portfoyde yayinlanan" },
  { id: "blogs", to: "/admin/blog", Icon: FileText, label: "Blog Yazilari", note: "Editoryal icerik" },
  { id: "comments", to: "/admin/comments", Icon: MessageSquare, label: "Yorumlar", noteFn: (s) => `${s.pendingCommentCount} beklemede` },
  { id: "about", to: "/admin/about", Icon: Contact, label: "About", note: "Hakkimda icerigi", valueOverride: "CMS" },
];

const StatCards = ({ stats }) => {
  return (
    <section className="db-cards">
      {STAT_CARDS.map(({ id, to, Icon, label, note, noteFn, valueOverride }) => {
        const value = valueOverride ?? stats[id === "blogs" ? "blogCount" : id === "comments" ? "commentCount" : id === "projects" ? "projectCount" : ""];
        const noteText = noteFn ? noteFn(stats) : note;

        return (
          <Link key={id} to={to} className="db-card">
            <span className="db-card__icon">
              {Icon && <Icon size={20} />}
            </span>
            <span className="db-card__label">{label}</span>
            <span className="db-card__value">{value}</span>
            <span className="db-card__note">{noteText}</span>
            <span className="db-card__cta">
              Yonet <ChevronRight size={14} />
            </span>
          </Link>
        );
      })}
    </section>
  );
};

export default StatCards;
