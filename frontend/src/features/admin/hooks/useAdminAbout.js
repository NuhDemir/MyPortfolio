import { useCallback, useEffect, useState } from "react";
import {
  getAboutAdminContent,
  updateAboutAdminContent,
} from "../services/aboutService";

const toKeywordsString = (keywords) =>
  Array.isArray(keywords) ? keywords.join(", ") : "";

const createFormDataFromContent = (content) => ({
  badge: content?.header?.badge ?? "",
  title: content?.header?.title ?? "",
  subtitle: content?.header?.subtitle ?? "",
  githubUsername: content?.github?.username ?? "",
  githubProfileUrl: content?.github?.profileUrl ?? "",
  stats: content?.stats ?? [],
  services: content?.services ?? [],
  seoTitle: content?.seo?.title ?? "",
  seoDescription: content?.seo?.description ?? "",
  seoKeywords: toKeywordsString(content?.seo?.keywords),
  isActive: Boolean(content?.isActive),
});

export const useAdminAbout = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState(() =>
    createFormDataFromContent({}),
  );
  const [activeTab, setActiveTab] = useState("general");

  const fetchAbout = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const content = await getAboutAdminContent();
      setFormData(createFormDataFromContent(content));
    } catch (err) {
      setError(err?.message || "About icerigi getirilirken bir hata olustu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAbout(); }, [fetchAbout]);

  const handleInputChange = useCallback((event) => {
    const { name, type, checked, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const updateService = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.services];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, services: updated };
    });
  }, []);

  const addService = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { id: `service-${Date.now()}`, title: "", problem: "", solution: "", tech: [], links: [] },
      ],
    }));
  }, []);

  const removeService = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  }, []);

  const addServiceTech = useCallback((serviceIndex, tech) => {
    if (!tech.trim()) return;
    setFormData((prev) => {
      const updated = [...prev.services];
      updated[serviceIndex] = {
        ...updated[serviceIndex],
        tech: [...(updated[serviceIndex].tech || []), tech.trim()],
      };
      return { ...prev, services: updated };
    });
  }, []);

  const removeServiceTech = useCallback((serviceIndex, techIndex) => {
    setFormData((prev) => {
      const updated = [...prev.services];
      updated[serviceIndex] = {
        ...updated[serviceIndex],
        tech: updated[serviceIndex].tech.filter((_, i) => i !== techIndex),
      };
      return { ...prev, services: updated };
    });
  }, []);

  const addServiceLink = useCallback((serviceIndex, link) => {
    if (!link.label.trim() || !link.url.trim()) return;
    setFormData((prev) => {
      const updated = [...prev.services];
      updated[serviceIndex] = {
        ...updated[serviceIndex],
        links: [...(updated[serviceIndex].links || []), { label: link.label.trim(), url: link.url.trim() }],
      };
      return { ...prev, services: updated };
    });
  }, []);

  const removeServiceLink = useCallback((serviceIndex, linkIndex) => {
    setFormData((prev) => {
      const updated = [...prev.services];
      updated[serviceIndex] = {
        ...updated[serviceIndex],
        links: updated[serviceIndex].links.filter((_, i) => i !== linkIndex),
      };
      return { ...prev, services: updated };
    });
  }, []);

  const updateStat = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.stats];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, stats: updated };
    });
  }, []);

  const addStat = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      stats: [...prev.stats, { key: "", label: "", valueSource: "static", staticValue: "" }],
    }));
  }, []);

  const removeStat = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setSaving(true);
      setError("");
      setSuccessMessage("");

      try {
        const payload = {
          header: { badge: formData.badge, title: formData.title, subtitle: formData.subtitle },
          github: { username: formData.githubUsername, profileUrl: formData.githubProfileUrl },
          stats: formData.stats,
          services: formData.services,
          seo: {
            title: formData.seoTitle,
            description: formData.seoDescription,
            keywords: formData.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean),
          },
          isActive: Boolean(formData.isActive),
        };
        const updated = await updateAboutAdminContent(payload);
        setFormData(createFormDataFromContent(updated));
        setSuccessMessage("About icerigi basariyla guncellendi.");
      } catch (err) {
        setError(err?.message || "About icerigi guncellenirken bir hata olustu.");
      } finally {
        setSaving(false);
      }
    },
    [formData],
  );

  return {
    loading, saving, error, successMessage, formData, activeTab, setActiveTab,
    handleInputChange, handleSubmit, refresh: fetchAbout,
    updateService, addService, removeService,
    addServiceTech, removeServiceTech,
    addServiceLink, removeServiceLink,
    updateStat, addStat, removeStat,
  };
};

export default useAdminAbout;
