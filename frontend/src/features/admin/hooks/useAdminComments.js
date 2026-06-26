import { useCallback, useEffect, useRef, useState } from "react";
import { commentService } from "../services/commentService";
import { showAdminToast } from "../utils/adminToast";

const PAGE_SIZE = 10;

export const useAdminComments = () => {
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const cancelRef = useRef(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit, sort: "-createdAt" };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      const response = await commentService.getAllComments(params);
      if (cancelRef.current) return;
      setComments(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotal(response.total || 0);
    } catch (err) {
      if (cancelRef.current) return;
      setError("Yorumlar yüklenirken bir hata oluştu");
    } finally {
      if (!cancelRef.current) setLoading(false);
    }
  }, [page, limit, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await commentService.getStats();
      if (!cancelRef.current) setStats(response.data);
    } catch {
      // stats silently fail
    }
  }, []);

  useEffect(() => {
    cancelRef.current = false;
    fetchComments();
    fetchStats();
    return () => {
      cancelRef.current = true;
    };
  }, [fetchComments, fetchStats]);

  const handleStatusChange = useCallback(async (id, action) => {
    setError(null);
    try {
      switch (action) {
        case "approve":
          await commentService.approveComment(id);
          break;
        case "reject":
          await commentService.rejectComment(id);
          break;
        case "spam":
          await commentService.markAsSpam(id);
          break;
      }
      showAdminToast(
        { approve: "Yorum onaylandı.", reject: "Yorum reddedildi.", spam: "Spam olarak işaretlendi." }[action],
        { type: "success" }
      );
      await fetchComments();
      await fetchStats();
    } catch (err) {
      setError("Durum güncellenirken bir hata oluştu");
      showAdminToast(err?.message || "İşlem başarısız.", { type: "error" });
    }
  }, [fetchComments, fetchStats]);

  const handleDelete = useCallback(async (id) => {
    if (!id) return;
    setError(null);
    try {
      await commentService.deleteComment(id);
      showAdminToast("Yorum silindi.", { type: "success" });
      if (comments.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchComments();
      }
      await fetchStats();
    } catch (err) {
      setError("Yorum silinirken bir hata oluştu");
      showAdminToast(err?.message || "Silme başarısız.", { type: "error" });
    }
  }, [comments.length, page, fetchComments, fetchStats]);

  const changeFilter = useCallback((newFilter) => {
    setStatusFilter(newFilter);
    setPage(1);
  }, []);

  const changePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  return {
    comments,
    stats,
    loading,
    error,
    page,
    limit,
    totalPages,
    total,
    statusFilter,
    setError,
    fetchComments,
    fetchStats,
    handleStatusChange,
    handleDelete,
    changeFilter,
    changePage,
    changeLimit,
  };
};

export default useAdminComments;
