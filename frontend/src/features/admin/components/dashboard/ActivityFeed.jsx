import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Blocks, FileText, MessageSquare, History } from "lucide-react";
import { formatRelativeTime, formatDate, getActivityHeadline, getActivityRoute, getActivityIconKey } from "../../utils/dashboardFormatters.js";

const ICON_MAP = {
  Workspaces: Blocks,
  Article: FileText,
  Message: MessageSquare,
  Timeline: History,
};

const ITEMS_PER_PAGE = 4;

const ActivityFeed = ({ activity }) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(activity.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return activity.slice(start, start + ITEMS_PER_PAGE);
  }, [activity, safePage]);

  return (
    <div className="db-section">
      <div className="db-section__header">
        <History size={18} />
        <h2>Son islemler</h2>
        {activity.length > 0 && (
          <span className="db-section__badge">{activity.length}</span>
        )}
      </div>

      {activity.length === 0 ? (
        <p className="db-empty">Henuz aktivite yok.</p>
      ) : (
        <ul className="db-activity">
          {pageItems.map((item) => {
            const Icon = ICON_MAP[getActivityIconKey(item.type)] || History;
            const occurred = item.occurredAt ?? item.updatedAt ?? item.createdAt;
            const relative = formatRelativeTime(occurred);
            const fallback = formatDate(occurred);
            const headline = getActivityHeadline(item);
            const meta = String(item.resourceTitle ?? item.meta ?? item.title ?? "-");
            const route = getActivityRoute(item);

            const content = (
              <>
                <span className="db-activity__icon">
                  <Icon size={16} />
                </span>
                <div className="db-activity__body">
                  <p className="db-activity__title">{headline}</p>
                  <p className="db-activity__meta">{meta}</p>
                </div>
                <time className="db-activity__time" dateTime={occurred ?? ""}>
                  {relative || fallback}
                </time>
              </>
            );

            return (
              <li key={item.id}>
                {route ? (
                  <Link to={route} className="db-activity__row">
                    {content}
                  </Link>
                ) : (
                  <div className="db-activity__row">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="db-pagination">
          <button
            type="button"
            className="db-pagination__btn"
            disabled={safePage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Onceki sayfa"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="db-pagination__info">{safePage} / {totalPages}</span>
          <button
            type="button"
            className="db-pagination__btn"
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Sonraki sayfa"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
