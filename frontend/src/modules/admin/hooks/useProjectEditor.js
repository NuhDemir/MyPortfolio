import { useCallback, useState } from "react";
import { createProject, updateProject } from "../services/projectService";
import {
  getDisplayThumbnail,
  initialProjectFormState,
  normalizeTags,
  resolveProjectId,
} from "../utils/projectManagement";

const parseOptionalJson = (value, label) => {
  const raw = String(value ?? "").trim();
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`${label} alanı geçerli bir JSON olmalı.`);
  }
};

export const useProjectEditor = ({ fetchProjects, setError, setLoading }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialProjectFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const resetForm = useCallback(() => {
    setIsFormVisible(false);
    setEditingId(null);
    setFormData(initialProjectFormState);
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setError(null);
  }, [imagePreview, setError]);

  const handleInputChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file) {
        setImageFile(file);
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(URL.createObjectURL(file));
      }
    },
    [imagePreview],
  );

  const startNew = useCallback(() => {
    resetForm();
    setIsFormVisible(true);
  }, [resetForm]);

  const startEdit = useCallback(
    (project) => {
      const projectId = resolveProjectId(project);
      if (!projectId) {
        setError("Seçili proje kimliği alınamadı.");
        return;
      }

      resetForm();
      setEditingId(projectId);

      const metadata =
        project?.metadata && typeof project.metadata === "object"
          ? project.metadata
          : {};
      const visuals =
        project?.visuals && typeof project.visuals === "object"
          ? project.visuals
          : {};
      const links =
        project?.links && typeof project.links === "object"
          ? project.links
          : {};

      const createdAtRaw = metadata?.createdAt;
      const createdAt = createdAtRaw ? String(createdAtRaw).slice(0, 10) : "";

      const techStackText = project?.techStack
        ? JSON.stringify(project.techStack, null, 2)
        : "";
      const caseStudyText = project?.caseStudy
        ? JSON.stringify(project.caseStudy, null, 2)
        : "";

      setFormData({
        id: project?.id ?? "",
        slug: project?.slug ?? "",
        isFeatured: Boolean(project?.isFeatured ?? project?.featured ?? false),
        metadataTitle: metadata?.title ?? project.title ?? "",
        metadataTagline: metadata?.tagline ?? project.description ?? "",
        metadataCreatedAt: createdAt,
        metadataRole: metadata?.role ?? "",
        metadataPlatform: metadata?.platform ?? "",
        metadataStatus: metadata?.status ?? "",
        visualsThumbnailUrl: visuals?.thumbnailUrl ?? project.imageUrl ?? "",
        visualsHeroVideoUrl: visuals?.heroVideoUrl ?? "",
        visualsPrimaryColor: visuals?.primaryColor ?? "#111111",
        linksLiveDemo: links?.liveDemo ?? project.liveUrl ?? "",
        linksGithub: links?.github ?? project.githubUrl ?? "",
        linksFigma: links?.figma ?? "",
        techStackJson: techStackText,
        caseStudyJson: caseStudyText,
        tags: Array.isArray(project.tags)
          ? project.tags.join(", ")
          : (project.tags ?? ""),
        category: project?.category ?? "",
      });

      setImagePreview(getDisplayThumbnail(project));
      setIsFormVisible(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [resetForm, setError],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const title = String(formData.metadataTitle ?? "").trim();
      const tagline = String(formData.metadataTagline ?? "").trim();

      if (!title || !tagline) {
        setError("metadata.title ve metadata.tagline zorunludur.");
        return;
      }

      const thumbnailUrl = String(formData.visualsThumbnailUrl ?? "").trim();
      const heroVideoUrl = String(formData.visualsHeroVideoUrl ?? "").trim();
      const primaryColor = String(formData.visualsPrimaryColor ?? "").trim();

      if (!editingId && !imageFile && !thumbnailUrl) {
        setError(
          "Yeni proje oluşturmak için görsel zorunludur: bir dosya yükleyin veya visuals.thumbnailUrl girin.",
        );
        return;
      }

      if (!thumbnailUrl && (heroVideoUrl || primaryColor) && !imageFile) {
        setError(
          "Hero video / primary color girmek için visuals.thumbnailUrl da sağlamalısınız.",
        );
        return;
      }

      let techStack;
      let caseStudy;
      try {
        techStack = parseOptionalJson(formData.techStackJson, "techStack");
        caseStudy = parseOptionalJson(formData.caseStudyJson, "caseStudy");
      } catch (parseError) {
        setError(parseError.message);
        return;
      }

      if (techStack !== undefined && !Array.isArray(techStack)) {
        setError("techStack bir JSON array olmalıdır.");
        return;
      }

      if (
        caseStudy !== undefined &&
        (typeof caseStudy !== "object" || !caseStudy)
      ) {
        setError("caseStudy bir JSON object olmalıdır.");
        return;
      }

      const metadata = {
        title,
        tagline,
        ...(formData.metadataCreatedAt
          ? { createdAt: formData.metadataCreatedAt }
          : {}),
        ...(formData.metadataRole ? { role: formData.metadataRole } : {}),
        ...(formData.metadataPlatform
          ? { platform: formData.metadataPlatform }
          : {}),
        ...(formData.metadataStatus ? { status: formData.metadataStatus } : {}),
      };

      const visuals =
        thumbnailUrl || imageFile
          ? {
              thumbnailUrl: thumbnailUrl || "__upload__",
              ...(heroVideoUrl ? { heroVideoUrl } : {}),
              ...(primaryColor ? { primaryColor } : {}),
            }
          : undefined;

      const links = {
        ...(formData.linksLiveDemo ? { liveDemo: formData.linksLiveDemo } : {}),
        ...(formData.linksGithub ? { github: formData.linksGithub } : {}),
        ...(formData.linksFigma ? { figma: formData.linksFigma } : {}),
      };

      const tagsValue = normalizeTags(formData.tags);

      const submission = {
        ...(formData.id ? { id: formData.id } : {}),
        ...(formData.slug ? { slug: formData.slug } : {}),
        ...(formData.isFeatured ? { isFeatured: true } : {}),
        metadata,
        ...(visuals ? { visuals } : {}),
        ...(Object.keys(links).length > 0 ? { links } : {}),
        ...(techStack !== undefined ? { techStack } : {}),
        ...(caseStudy !== undefined ? { caseStudy } : {}),
        ...(tagsValue.length > 0 ? { tags: tagsValue } : {}),
        ...(formData.category ? { category: formData.category } : {}),
      };

      setLoading(true);
      setError(null);

      try {
        if (imageFile) {
          const dataToSubmit = new FormData();
          dataToSubmit.append("metadata", JSON.stringify(metadata));
          if (visuals) dataToSubmit.append("visuals", JSON.stringify(visuals));
          if (Object.keys(links).length > 0)
            dataToSubmit.append("links", JSON.stringify(links));
          if (techStack !== undefined)
            dataToSubmit.append("techStack", JSON.stringify(techStack));
          if (caseStudy !== undefined)
            dataToSubmit.append("caseStudy", JSON.stringify(caseStudy));

          if (formData.id) dataToSubmit.append("id", formData.id);
          if (formData.slug) dataToSubmit.append("slug", formData.slug);
          dataToSubmit.append(
            "isFeatured",
            String(Boolean(formData.isFeatured)),
          );
          if (formData.category)
            dataToSubmit.append("category", formData.category);
          if (formData.tags) dataToSubmit.append("tags", formData.tags);

          dataToSubmit.append("image", imageFile);

          if (editingId) {
            await updateProject(editingId, dataToSubmit);
          } else {
            await createProject(dataToSubmit);
          }
        } else {
          if (editingId) {
            await updateProject(editingId, submission);
          } else {
            await createProject(submission);
          }
        }

        resetForm();
        await fetchProjects();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [
      editingId,
      fetchProjects,
      formData,
      imageFile,
      resetForm,
      setError,
      setLoading,
    ],
  );

  return {
    isFormVisible,
    editingId,
    formData,
    imageFile,
    imagePreview,
    setIsFormVisible,
    setEditingId,
    setFormData,
    setImageFile,
    setImagePreview,
    resetForm,
    startNew,
    startEdit,
    handleInputChange,
    handleFileChange,
    handleSubmit,
  };
};
