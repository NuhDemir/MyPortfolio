import { useCallback, useEffect, useState } from "react";
import { cloneDefaultAboutContent } from "@features/about";
import {
  getAboutAdminContent,
  updateAboutAdminContent,
} from "../services/aboutService";

const toPrettyJson = (value) => JSON.stringify(value ?? [], null, 2);

const toKeywordsString = (keywords) =>
  Array.isArray(keywords) ? keywords.join(", ") : "";

const createFormDataFromContent = (content) => ({
  badge: content?.header?.badge ?? "",
  title: content?.header?.title ?? "",
  subtitle: content?.header?.subtitle ?? "",
  githubUsername: content?.github?.username ?? "",
  githubProfileUrl: content?.github?.profileUrl ?? "",
  statsJson: toPrettyJson(content?.stats),
  servicesJson: toPrettyJson(content?.services),
  seoTitle: content?.seo?.title ?? "",
  seoDescription: content?.seo?.description ?? "",
  seoKeywords: toKeywordsString(content?.seo?.keywords),
  isActive: Boolean(content?.isActive),
});

const parseJsonArray = (rawValue, label) => {
  if (!rawValue || !String(rawValue).trim()) {
    return [];
  }

  let parsed;
  try {
    parsed = JSON.parse(rawValue);
  } catch {
    throw new Error(`${label} alani gecerli JSON olmali.`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`${label} alani JSON dizi formatinda olmali.`);
  }

  return parsed;
};

export const useAdminAbout = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState(() =>
    createFormDataFromContent(cloneDefaultAboutContent()),
  );

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

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const handleInputChange = useCallback((event) => {
    const { name, type, checked, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const buildPayload = useCallback((currentFormData) => {
    const stats = parseJsonArray(currentFormData.statsJson, "Stats");
    const services = parseJsonArray(currentFormData.servicesJson, "Services");

    return {
      header: {
        badge: currentFormData.badge,
        title: currentFormData.title,
        subtitle: currentFormData.subtitle,
      },
      github: {
        username: currentFormData.githubUsername,
        profileUrl: currentFormData.githubProfileUrl,
      },
      stats,
      services,
      seo: {
        title: currentFormData.seoTitle,
        description: currentFormData.seoDescription,
        keywords: currentFormData.seoKeywords
          .split(",")
          .map((keyword) => keyword.trim())
          .filter(Boolean),
      },
      isActive: Boolean(currentFormData.isActive),
    };
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setSaving(true);
      setError("");
      setSuccessMessage("");

      try {
        const payload = buildPayload(formData);
        const updated = await updateAboutAdminContent(payload);
        setFormData(createFormDataFromContent(updated));
        setSuccessMessage("About icerigi basariyla guncellendi.");
      } catch (err) {
        setError(err?.message || "About icerigi guncellenirken bir hata olustu.");
      } finally {
        setSaving(false);
      }
    },
    [buildPayload, formData],
  );

  return {
    loading,
    saving,
    error,
    successMessage,
    formData,
    handleInputChange,
    handleSubmit,
    refresh: fetchAbout,
  };
};

export default useAdminAbout;
