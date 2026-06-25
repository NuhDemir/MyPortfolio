import { useCallback, useEffect, useState } from "react";
import { deleteProject, getProjects } from "../services/projectService";
import { resolveProjectId } from "../utils/projectManagement";

export const useAdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = useCallback(
    async (project) => {
      const id =
        typeof project === "string" ? project : resolveProjectId(project);
      if (!id) {
        setError("Silinecek projenin kimliği bulunamadı.");
        return;
      }

      if (!window.confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
        return;
      }

      setLoading(true);
      try {
        await deleteProject(id);
        await fetchProjects();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects],
  );

  return {
    projects,
    loading,
    error,
    setError,
    fetchProjects,
    handleDelete,
    setLoading,
  };
};
