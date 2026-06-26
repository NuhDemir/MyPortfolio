import { useState, useMemo } from "react";
import { ErrorMessage, Pagination } from "@shared";
import CommentStatsBar from "../components/commentManagement/CommentStatsBar.jsx";
import CommentFilters from "../components/commentManagement/CommentFilters.jsx";
import CommentTable from "../components/commentManagement/CommentTable.jsx";
import { useAdminComments } from "../hooks/useAdminComments";
import "../styles/admin-shared.css";

const AdminCommentManagementPage = () => {
  const {
    comments,
    stats,
    loading,
    error,
    page,
    totalPages,
    total,
    statusFilter,
    fetchComments,
    handleStatusChange,
    handleDelete,
    changeFilter,
    changePage,
  } = useAdminComments();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredComments = useMemo(() => {
    if (!searchQuery.trim()) return comments;
    const q = searchQuery.toLowerCase();
    return comments.filter(
      (c) =>
        (c.author?.name || "").toLowerCase().includes(q) ||
        (c.author?.email || "").toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        (c.resourceId?.title || c.blogId?.title || "").toLowerCase().includes(q)
    );
  }, [comments, searchQuery]);

  return (
    <div className="admin-management-page">
      <h1>Yorum Yönetimi</h1>

      {error && <ErrorMessage message={error} />}

      <CommentStatsBar stats={stats} />

      <CommentFilters
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onStatusChange={changeFilter}
        onSearchChange={setSearchQuery}
      />

      <CommentTable
        comments={filteredComments}
        loading={loading}
        error={null}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      {!loading && comments.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          itemsPerPage={10}
          totalItems={total}
          onPageChange={changePage}
          onItemsPerPageChange={() => {}}
        />
      )}
    </div>
  );
};

export default AdminCommentManagementPage;
