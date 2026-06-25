import { useState, useEffect, useMemo } from "react";
import { getDashboardSnapshot } from "../services/dashboardService.js";
import { commentService } from "../services/commentService.js";

const INITIAL_STATS = {
  projectCount: 0,
  blogCount: 0,
  messageCount: 0,
  commentCount: 0,
  pendingCommentCount: 0,
};

export const useDashboardData = () => {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);

      try {
        const [dashboardData, commentStats] = await Promise.all([
          getDashboardSnapshot(),
          commentService.getStats().catch(() => ({ data: { total: 0, pending: 0 } })),
        ]);

        if (cancelled) return;

        setStats({
          projectCount: Number(dashboardData?.stats?.projects) || 0,
          blogCount: Number(dashboardData?.stats?.blogs) || 0,
          messageCount: Number(dashboardData?.stats?.messages) || 0,
          commentCount: Number(commentStats?.data?.total) || 0,
          pendingCommentCount: Number(commentStats?.data?.pending) || 0,
        });

        setActivity(Array.isArray(dashboardData?.activity) ? dashboardData.activity : []);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err ?? "Veri yuklenemedi."));
        setActivity([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, []);

  const distribution = useMemo(() => {
    const items = [
      { id: "projects", label: "Projeler", value: stats.projectCount },
      { id: "blogs", label: "Blog", value: stats.blogCount },
      { id: "comments", label: "Yorum", value: stats.commentCount },
      { id: "pending", label: "Bekleyen", value: stats.pendingCommentCount },
    ];
    return items;
  }, [stats.projectCount, stats.blogCount, stats.commentCount, stats.pendingCommentCount]);

  const summaryLines = useMemo(() => [
    { id: "projects", label: "Yayinlanan projeler", value: stats.projectCount },
    { id: "blogs", label: "Aktif blog yazisi", value: stats.blogCount },
    { id: "comments", label: "Toplam yorum", value: stats.commentCount },
    { id: "pending", label: "Bekleyen yorum", value: stats.pendingCommentCount },
  ], [stats.projectCount, stats.blogCount, stats.commentCount, stats.pendingCommentCount]);

  return {
    stats,
    activity,
    loading,
    error,
    distribution,
    summaryLines,
  };
};

export default useDashboardData;
