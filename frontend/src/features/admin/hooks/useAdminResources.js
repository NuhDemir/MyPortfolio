import { useState, useCallback, useEffect } from "react";
import { getResources, deleteResource } from "../services/resourceService.js";
import { showAdminToast } from "../utils/adminToast.js";

export const useAdminResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getResources();
      const list = Array.isArray(data) ? data : [];
      setResources(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteResource(id);
      setResources((prev) => prev.filter((r) => (r._id || r.id) !== id));
      showAdminToast("Kaynak basariyla silindi.", { type: "success" });
    } catch (err) {
      showAdminToast(err.message, { type: "error" });
    }
  }, []);

  return {
    resources,
    loading,
    error,
    fetchResources,
    handleDelete,
    setError,
    setLoading,
  };
};

export default useAdminResources;
