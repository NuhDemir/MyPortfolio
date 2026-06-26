import { Search } from "lucide-react";
import "./CommentFilters.css";

const STATUS_OPTIONS = [
  { value: "all", label: "Tümü" },
  { value: "pending", label: "Beklemede" },
  { value: "approved", label: "Onaylandı" },
  { value: "rejected", label: "Reddedildi" },
  { value: "spam", label: "Spam" },
];

const CommentFilters = ({ statusFilter, searchQuery, onStatusChange, onSearchChange }) => {
  return (
    <div className="comment-filters">
      <div className="admin-search-wrap">
        <Search size={16} className="admin-search-icon" />
        <input
          type="text"
          className="admin-search-input"
          placeholder="Yorumlarda ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select
        className="admin-filter-select"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default CommentFilters;
