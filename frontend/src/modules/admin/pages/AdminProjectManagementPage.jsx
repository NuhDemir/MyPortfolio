import { useCallback, useEffect, useMemo, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import ErrorMessage from "@shared/ui/ErrorMessage.jsx";
import LoadingSpinner from "@shared/ui/LoadingSpinner.jsx";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../services/projectService";
import "../styles/management.css";

const initialFormState = {
  id: "",
  slug: "",
  isFeatured: false,
  metadataTitle: "",
  metadataTagline: "",
  metadataCreatedAt: "",
  metadataRole: "",
  metadataPlatform: "",
  metadataStatus: "",
  visualsThumbnailUrl: "",
  visualsHeroVideoUrl: "",
  visualsPrimaryColor: "#111111",
  linksLiveDemo: "",
  linksGithub: "",
  linksFigma: "",
  techStackJson: "",
  caseStudyJson: "",
  tags: "",
  category: "",
};

const AdminProjectManagementPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

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

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setIsFormVisible(false);
    setEditingId(null);
    setFormData(initialFormState);
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setError(null);
  };

  const resolveProjectId = (project) => project?.id ?? project?._id ?? "";

  const getDisplayTitle = (project) =>
    project?.metadata?.title ?? project?.title ?? "";

  const getDisplayThumbnail = (project) =>
    project?.visuals?.thumbnailUrl ?? project?.imageUrl ?? null;

  const handleEditClick = (project) => {
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
      project?.links && typeof project.links === "object" ? project.links : {};

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
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
      return;
    }
    if (!id) {
      setError("Silinecek projenin kimliği bulunamadı.");
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
  };

  const handleSubmit = async (event) => {
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

    const parseOptionalJson = (value, label) => {
      const raw = String(value ?? "").trim();
      if (!raw) return undefined;
      try {
        return JSON.parse(raw);
      } catch {
        throw new Error(`${label} alanı geçerli bir JSON olmalı.`);
      }
    };

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
        dataToSubmit.append("isFeatured", String(Boolean(formData.isFeatured)));
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
  };

  const normalizeTags = (value) => {
    if (Array.isArray(value)) {
      return value.map((tag) => String(tag).trim()).filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    return [];
  };

  const normalizeTechnologies = (value) => {
    if (!value) return undefined;

    if (typeof value === "string") {
      return value;
    }

    if (Array.isArray(value)) {
      if (value.every((entry) => typeof entry === "string")) {
        return value.map((name) => ({ name }));
      }
      return value;
    }

    return value;
  };

  const normalizeProjectJson = (input) => {
    const project = input && typeof input === "object" ? input : {};

    const isV2Payload =
      Boolean(project?.metadata) ||
      Boolean(project?.visuals) ||
      Boolean(project?.techStack) ||
      Boolean(project?.links) ||
      Boolean(project?.caseStudy) ||
      project?.isFeatured !== undefined;

    if (isV2Payload) {
      const title =
        project?.metadata?.title ?? project.title ?? project.name ?? "";
      const tagline =
        project?.metadata?.tagline ??
        project.description ??
        project.summary ??
        "";

      const thumbnailUrl =
        project?.visuals?.thumbnailUrl ??
        project.imageUrl ??
        project.image ??
        project.thumbnailUrl ??
        "";

      const submission = {
        id: project.id,
        slug: project.slug,
        isFeatured: project.isFeatured ?? project.featured,
        metadata: {
          ...(project.metadata && typeof project.metadata === "object"
            ? project.metadata
            : {}),
          title,
          tagline,
        },
        visuals: {
          ...(project.visuals && typeof project.visuals === "object"
            ? project.visuals
            : {}),
          thumbnailUrl,
        },
        links: {
          ...(project.links && typeof project.links === "object"
            ? project.links
            : {}),
          github:
            project?.links?.github ?? project.githubUrl ?? project.github ?? "",
          liveDemo:
            project?.links?.liveDemo ?? project.liveUrl ?? project.url ?? "",
          figma: project?.links?.figma ?? project.figmaUrl ?? "",
        },
        techStack: project.techStack,
        caseStudy: project.caseStudy,
      };

      // tags/category/status gibi legacy alanları da opsiyonel olarak taşı
      const tags = normalizeTags(project.tags);
      if (tags.length > 0) submission.tags = tags;
      if (project.category) submission.category = project.category;
      if (project.status) submission.status = project.status;

      Object.keys(submission.links).forEach((key) => {
        if (!submission.links[key]) delete submission.links[key];
      });

      if (submission.visuals) {
        Object.keys(submission.visuals).forEach((key) => {
          if (!submission.visuals[key]) delete submission.visuals[key];
        });
      }

      Object.keys(submission).forEach((key) => {
        if (submission[key] === undefined) delete submission[key];
      });

      return submission;
    }

    const submission = {
      title: project.title ?? project.name ?? "",
      description: project.description ?? project.summary ?? "",
      githubUrl: project.githubUrl ?? project.github ?? "",
      liveUrl: project.liveUrl ?? project.url ?? "",
      imageUrl: project.imageUrl ?? project.image ?? project.thumbnailUrl ?? "",
      tags: normalizeTags(project.tags),
      category: project.category,
      featured: project.featured,
      status: project.status,
      priority: project.priority,
      difficulty: project.difficulty,
      duration: project.duration,
      startDate: project.startDate,
      endDate: project.endDate,
      technologies: normalizeTechnologies(project.technologies),
      metrics: project.metrics,
      client: project.client,
      seo: project.seo,
    };

    Object.keys(submission).forEach((key) => {
      if (submission[key] === undefined) {
        delete submission[key];
      }
    });

    if (!Array.isArray(submission.tags) || submission.tags.length === 0) {
      delete submission.tags;
    }

    if (!submission.githubUrl) {
      delete submission.githubUrl;
    }

    if (!submission.liveUrl) {
      delete submission.liveUrl;
    }

    return submission;
  };

  const handleJsonFilePick = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setJsonInput(text);
    } catch {
      setError("JSON dosyası okunamadı.");
    } finally {
      event.target.value = "";
    }
  };

  const handleJsonSubmit = async () => {
    try {
      setError(null);
      const parsedData = JSON.parse(jsonInput);
      const items = Array.isArray(parsedData) ? parsedData : [parsedData];

      if (items.length === 0) {
        setError("JSON içinde en az 1 proje olmalıdır.");
        return;
      }

      setLoading(true);

      let createdCount = 0;
      for (let index = 0; index < items.length; index += 1) {
        const submission = normalizeProjectJson(items[index]);

        const resolvedTitle =
          submission?.metadata?.title ?? submission?.title ?? "";
        const resolvedDescription =
          submission?.metadata?.tagline ?? submission?.description ?? "";
        const resolvedImageUrl =
          submission?.visuals?.thumbnailUrl ?? submission?.imageUrl ?? "";

        if (!resolvedTitle || !resolvedDescription) {
          setError(
            `JSON'daki proje #${index + 1} için en az 'title' ve 'description' (veya V2 için 'metadata.title' + 'metadata.tagline') alanları gereklidir.`,
          );
          return;
        }

        if (!resolvedImageUrl) {
          setError(
            `JSON'daki proje #${index + 1} için görsel URL zorunludur: 'imageUrl' (legacy) veya 'visuals.thumbnailUrl' (V2).`,
          );
          return;
        }

        await createProject(submission);
        createdCount += 1;
      }

      setIsJsonModalOpen(false);
      setJsonInput("");
      await fetchProjects();

      alert(`${createdCount} proje JSON ile eklendi!`);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Geçersiz JSON formatı. Lütfen formatı kontrol edin.");
      } else {
        setError(err.message || "JSON yüklenirken bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  const uiJsonTemplate = useMemo(
    () => [
      {
        id: "project-digital-obesity",
        slug: "digital-obesity",
        isFeatured: true,
        metadata: {
          title: "Digital Obesity",
          tagline:
            "Modern Çağın Sorunu: Dijital Obezite ve Bilgi Yükü Farkındalığı",
          createdAt: "2024-11-10",
          role: "Frontend Developer & UI Designer",
          platform: "Web Application",
          status: "Live",
        },
        visuals: {
          thumbnailUrl: "/assets/projects/digital-obesity/thumb.webp",
          heroVideoUrl: "/assets/projects/digital-obesity/preview.mp4",
          primaryColor: "#0cb845",
        },
        techStack: [
          { category: "Core", items: ["React", "Vite", "TypeScript"] },
          {
            category: "Styling & UI",
            items: ["SCSS Modules", "Neu Brutalism", "Framer Motion"],
          },
          {
            category: "Performance",
            items: ["Lighthouse Optimization", "Code Splitting"],
          },
        ],
        links: {
          liveDemo: "https://digital-obesity.netlify.app/",
          github: "https://github.com/kullaniciadi/digital-obesity",
          figma: "https://figma.com/file/digital-obesity-design",
        },
        caseStudy: {
          problem: {
            title: "Sonsuz Akış ve Dikkat Dağınıklığı",
            description:
              "Kullanıcılar modern web'de 'Infinite Scroll' ve bildirim yağmuru altında eziliyor. Standart arayüzler, kullanıcıyı sürekli tüketime teşvik ederek bilişsel yorgunluğa (dijital obeziteye) sebep oluyor.",
          },
          solution: {
            title: "Rahatsız Edici Sadelik: Neu Brutalism",
            description:
              "Kullanıcıyı yavaşlatmak ve düşündürmek için 'Anti-UX' prensiplerinden beslenen, yüksek kontrastlı ve ham (raw) bir arayüz tasarlandı. Görsel gürültü, bilinçli bir tasarım tercihi olarak kullanıldı.",
          },
          challenges: [
            {
              title: "Kaotik Tasarımda Performans Koruması",
              description:
                "Neu Brutalism tarzı yoğun gölgeler, borderlar ve üst üste binen elementler içerir. Bu 'kaosun' DOM boyutunu şişirmemesi ve render performansını (FPS) düşürmemesi için CSS 'will-change' optimizasyonları ve sanallaştırılmış listeler (virtualization) kullanıldı.",
            },
          ],
          metrics: [
            { label: "Lighthouse Performans", value: "98/100" },
            { label: "Ort. Sitede Kalma", value: "3.5 dk" },
            { label: "Bounce Rate", value: "%12 Düşüş" },
          ],
          highlightCode: {
            language: "typescript",
            fileName: "useGlitchEffect.ts",
            codeSnippet:
              "export const useGlitchEffect = (intensity: number) => {\n  const [offset, setOffset] = useState({ x: 0, y: 0 });\n\n  useEffect(() => {\n    if (intensity === 0) return;\n    const interval = setInterval(() => {\n      setOffset({\n        x: (Math.random() - 0.5) * intensity,\n        y: (Math.random() - 0.5) * intensity\n      });\n    }, 50);\n    return () => clearInterval(interval);\n  }, [intensity]);\n\n  return offset;\n};",
          },
        },
      },
    ],
    [],
  );

  return (
    <div className="admin-management-page">
      <h1>Proje Yönetimi</h1>
      {error && <ErrorMessage message={error} />}
      {!isFormVisible && (
        <div className="admin-action-buttons">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsFormVisible(true);
            }}
            className="admin-add-new-btn"
          >
            <AddRoundedIcon className="btn-icon" fontSize="inherit" />
            <span>Yeni Proje</span>
          </button>
          <button
            type="button"
            onClick={() => setIsJsonModalOpen(true)}
            className="admin-json-btn"
          >
            <UploadFileRoundedIcon className="btn-icon" fontSize="inherit" />
            <span>JSON ile Yükle</span>
          </button>
        </div>
      )}
      {isFormVisible && (
        <div className="admin-form-container">
          <h2>{editingId ? "Projeyi Düzenle" : "Yeni Proje Oluştur"}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="metadataTitle">Başlık (metadata.title)</label>
                <input
                  id="metadataTitle"
                  type="text"
                  name="metadataTitle"
                  value={formData.metadataTitle}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="slug">Slug</label>
                <input
                  id="slug"
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="digital-obesity"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="metadataTagline">
                  Tagline (metadata.tagline)
                </label>
                <input
                  id="metadataTagline"
                  type="text"
                  name="metadataTagline"
                  value={formData.metadataTagline}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Kategori (opsiyonel)</label>
                <input
                  id="category"
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="web / mobile / desktop ..."
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="metadataCreatedAt">
                  Oluşturma tarihi (metadata.createdAt)
                </label>
                <input
                  id="metadataCreatedAt"
                  type="date"
                  name="metadataCreatedAt"
                  value={formData.metadataCreatedAt}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="metadataStatus">Durum (metadata.status)</label>
                <input
                  id="metadataStatus"
                  type="text"
                  name="metadataStatus"
                  value={formData.metadataStatus}
                  onChange={handleInputChange}
                  placeholder="Live / Development / Beta / Legacy"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="metadataRole">Rol (metadata.role)</label>
                <input
                  id="metadataRole"
                  type="text"
                  name="metadataRole"
                  value={formData.metadataRole}
                  onChange={handleInputChange}
                  placeholder="Frontend Developer & UI Designer"
                />
              </div>

              <div className="form-group">
                <label htmlFor="metadataPlatform">
                  Platform (metadata.platform)
                </label>
                <input
                  id="metadataPlatform"
                  type="text"
                  name="metadataPlatform"
                  value={formData.metadataPlatform}
                  onChange={handleInputChange}
                  placeholder="Web Application"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="id">ID (opsiyonel)</label>
                <input
                  id="id"
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="project-digital-obesity"
                />
              </div>

              <div
                className="form-group"
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <label
                  className="projects-filter-toggle"
                  style={{ marginTop: "1.6rem" }}
                >
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  <span>Featured (isFeatured)</span>
                </label>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="tags">Etiketler (virgülle ayırın)</label>
                <input
                  id="tags"
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="ui, react, performans"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group form-group--file">
                <label htmlFor="image">
                  Proje görseli dosyası (opsiyonel)
                  {editingId ? " (değiştirmek için yeni dosya seçin)" : ""}
                </label>
                <div className="form-file-field">
                  <ImageOutlinedIcon className="btn-icon" fontSize="inherit" />
                  <input
                    id="image"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Önizleme"
                    className="image-preview"
                  />
                )}
              </div>
              <div className="form-group">
                <label htmlFor="visualsThumbnailUrl">
                  Thumbnail URL (visuals.thumbnailUrl)
                </label>
                <div className="form-field-with-icon">
                  <LinkRoundedIcon className="btn-icon" fontSize="inherit" />
                  <input
                    id="visualsThumbnailUrl"
                    type="text"
                    name="visualsThumbnailUrl"
                    value={formData.visualsThumbnailUrl}
                    onChange={handleInputChange}
                    placeholder="/assets/projects/... veya https://..."
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="visualsHeroVideoUrl">
                  Hero Video URL (visuals.heroVideoUrl)
                </label>
                <div className="form-field-with-icon">
                  <LinkRoundedIcon className="btn-icon" fontSize="inherit" />
                  <input
                    id="visualsHeroVideoUrl"
                    type="text"
                    name="visualsHeroVideoUrl"
                    value={formData.visualsHeroVideoUrl}
                    onChange={handleInputChange}
                    placeholder="/assets/projects/.../preview.mp4"
                  />
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="visualsPrimaryColor">
                  Primary Color (visuals.primaryColor)
                </label>
                <input
                  id="visualsPrimaryColor"
                  type="text"
                  name="visualsPrimaryColor"
                  value={formData.visualsPrimaryColor}
                  onChange={handleInputChange}
                  placeholder="#0cb845"
                />
              </div>

              <div className="form-group">
                <label htmlFor="linksLiveDemo">
                  Live Demo (links.liveDemo)
                </label>
                <div className="form-field-with-icon">
                  <LinkRoundedIcon className="btn-icon" fontSize="inherit" />
                  <input
                    id="linksLiveDemo"
                    type="url"
                    name="linksLiveDemo"
                    value={formData.linksLiveDemo}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="linksGithub">GitHub (links.github)</label>
                <div className="form-field-with-icon">
                  <LinkRoundedIcon className="btn-icon" fontSize="inherit" />
                  <input
                    id="linksGithub"
                    type="url"
                    name="linksGithub"
                    value={formData.linksGithub}
                    onChange={handleInputChange}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="linksFigma">Figma (links.figma)</label>
                <div className="form-field-with-icon">
                  <LinkRoundedIcon className="btn-icon" fontSize="inherit" />
                  <input
                    id="linksFigma"
                    type="url"
                    name="linksFigma"
                    value={formData.linksFigma}
                    onChange={handleInputChange}
                    placeholder="https://figma.com/..."
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="techStackJson">techStack (JSON array)</label>
              <textarea
                id="techStackJson"
                name="techStackJson"
                rows="6"
                value={formData.techStackJson}
                onChange={handleInputChange}
                placeholder='[{ "category": "Core", "items": ["React", "Vite"] }]'
              />
            </div>

            <div className="form-group">
              <label htmlFor="caseStudyJson">caseStudy (JSON object)</label>
              <textarea
                id="caseStudyJson"
                name="caseStudyJson"
                rows="10"
                value={formData.caseStudyJson}
                onChange={handleInputChange}
                placeholder='{"problem": {"title": "...", "description": "..."}}'
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="submit-btn">
                <SaveRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>{loading ? "Kaydediliyor..." : "Kaydet"}</span>
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                <CloseRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>İptal</span>
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="admin-list-container">
        <h2>Mevcut Projeler</h2>
        {loading && projects.length === 0 ? (
          <LoadingSpinner message="Projeler yükleniyor..." />
        ) : null}
        {!loading && !error && (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Görsel</th>
                  <th>Başlık</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? (
                  projects.map((project, index) => {
                    const projectId = resolveProjectId(project);
                    const displayTitle = getDisplayTitle(project);
                    const displayThumb = getDisplayThumbnail(project);
                    return (
                      <tr key={projectId || `project-${index}`}>
                        <td>
                          <img
                            src={displayThumb || ""}
                            alt={displayTitle}
                            className="list-thumbnail"
                          />
                        </td>
                        <td>{displayTitle}</td>
                        <td className="action-buttons">
                          <button
                            type="button"
                            onClick={() => handleEditClick(project)}
                            className="edit-btn"
                          >
                            <EditRoundedIcon
                              className="btn-icon"
                              fontSize="inherit"
                            />
                            <span>Düzenle</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(projectId)}
                            className="delete-btn"
                          >
                            <DeleteRoundedIcon
                              className="btn-icon"
                              fontSize="inherit"
                            />
                            <span>Sil</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3">Gösterilecek proje bulunamadı.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* JSON Upload Modal */}
      {isJsonModalOpen && (
        <div
          className="json-modal-overlay"
          onClick={() => setIsJsonModalOpen(false)}
        >
          <div className="json-modal" onClick={(e) => e.stopPropagation()}>
            <div className="json-modal-header">
              <h2>JSON ile Proje Yükle</h2>
              <label className="template-btn" style={{ cursor: "pointer" }}>
                <UploadFileRoundedIcon
                  className="btn-icon"
                  fontSize="inherit"
                />
                <span>Dosya Seç</span>
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={handleJsonFilePick}
                  style={{ display: "none" }}
                />
              </label>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(true)}
                className="template-btn"
              >
                <CodeRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>JSON Şablonunu Gör</span>
              </button>
              <button
                type="button"
                onClick={() => setIsJsonModalOpen(false)}
                className="modal-close-btn"
              >
                <CloseRoundedIcon fontSize="inherit" />
              </button>
            </div>
            <div className="json-modal-body">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="JSON verilerini buraya yapıştırın (tek proje objesi veya proje dizisi)..."
                rows={15}
                className="json-textarea"
              />
            </div>
            <div className="json-modal-footer">
              <button
                type="button"
                onClick={handleJsonSubmit}
                disabled={loading || !jsonInput.trim()}
                className="submit-btn"
              >
                <UploadFileRoundedIcon
                  className="btn-icon"
                  fontSize="inherit"
                />
                <span>{loading ? "Yükleniyor..." : "JSON'u Yükle"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsJsonModalOpen(false);
                  setJsonInput("");
                }}
                className="cancel-btn"
              >
                <CloseRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>İptal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Template Modal */}
      {isTemplateModalOpen && (
        <div
          className="json-modal-overlay"
          onClick={() => setIsTemplateModalOpen(false)}
        >
          <div
            className="json-modal template-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="json-modal-header">
              <h2>JSON Şablonu</h2>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="modal-close-btn"
              >
                <CloseRoundedIcon fontSize="inherit" />
              </button>
            </div>
            <div className="json-modal-body">
              <p className="template-description">
                Proje eklemek için aşağıdaki JSON formatını kullanın. Tek obje
                veya dizi gönderebilirsiniz.
              </p>
              <pre className="json-template-code">
                <code>{JSON.stringify(uiJsonTemplate, null, 2)}</code>
              </pre>
              <div className="template-info">
                <h3>Alan Açıklamaları:</h3>
                <ul>
                  <li>
                    <strong>metadata.title</strong>: Proje başlığı (zorunlu)
                  </li>
                  <li>
                    <strong>metadata.tagline</strong>: Kısa açıklama (zorunlu)
                  </li>
                  <li>
                    <strong>visuals.thumbnailUrl</strong>: Kapak görseli URL’i
                    (zorunlu)
                  </li>
                  <li>
                    <strong>links.github</strong>: GitHub URL (opsiyonel)
                  </li>
                  <li>
                    <strong>links.liveDemo</strong>: Canlı URL (opsiyonel)
                  </li>
                  <li>
                    <strong>techStack</strong>: Kategori + item listeleri
                    (opsiyonel)
                  </li>
                  <li>
                    <strong>caseStudy</strong>:
                    problem/solution/metrics/highlightCode (opsiyonel)
                  </li>
                  <li>
                    <strong>isFeatured</strong>: true/false (opsiyonel)
                  </li>
                  <li>
                    <strong>metadata.status</strong>:
                    Live/Development/Beta/Legacy (opsiyonel)
                  </li>
                </ul>
              </div>
            </div>
            <div className="json-modal-footer">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(uiJsonTemplate, null, 2),
                  );
                  alert("Şablon panoya kopyalandı!");
                }}
                className="submit-btn"
              >
                Şablonu Kopyala
              </button>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="cancel-btn"
              >
                <CloseRoundedIcon className="btn-icon" fontSize="inherit" />
                <span>Kapat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectManagementPage;
