import { useState } from "react";
import { ArrowLeft, Upload, Link2, ImageIcon, X } from "lucide-react";
import { createResource, updateResource } from "../../services/resourceService.js";
import { showAdminToast } from "../../utils/adminToast.js";

const TYPES = [
  { value: "kitap", label: "Kitap" },
  { value: "video", label: "Video" },
  { value: "makale", label: "Makale" },
  { value: "kurs", label: "Kurs" },
  { value: "arac", label: "Arac" },
  { value: "diger", label: "Diger" },
];

const DIFFICULTIES = [
  { value: "", label: "Yok" },
  { value: "baslangic", label: "Baslangic" },
  { value: "orta", label: "Orta" },
  { value: "ileri", label: "Ileri" },
  { value: "uzman", label: "Uzman" },
];

const LANGUAGES = [
  { value: "tr", label: "Turkce" },
  { value: "en", label: "Ingilizce" },
  { value: "de", label: "Almanca" },
  { value: "fr", label: "Fransizca" },
  { value: "es", label: "Ispanyolca" },
];

const INITIAL_STATE = {
  title: "",
  url: "",
  description: "",
  type: "diger",
  tags: "",
  author: "",
  rating: 0,
  language: "tr",
  difficulty: "",
  notes: "",
  isActive: true,
  isFeatured: false,
};

const ResourceForm = ({ editData, onSuccess, onCancel }) => {
  const existingCover = editData?.coverImage || "";

  const [form, setForm] = useState(() => {
    if (editData) {
      return {
        title: editData.title || "",
        url: editData.url || "",
        description: editData.description || "",
        type: editData.type || "diger",
        tags: Array.isArray(editData.tags) ? editData.tags.join(", ") : (editData.tags || ""),
        author: editData.author || "",
        rating: editData.rating ?? 0,
        language: editData.language || "tr",
        difficulty: editData.difficulty || "",
        notes: editData.notes || "",
        coverImageFit: editData.coverImageFit || "cover",
        isActive: editData.isActive !== false,
        isFeatured: editData.isFeatured === true,
      };
    }
    return { ...INITIAL_STATE };
  });

  const [coverMode, setCoverMode] = useState(existingCover && !existingCover.startsWith("data:") ? "url" : "file");
  const [coverUrl, setCoverUrl] = useState(coverMode === "url" ? existingCover : "");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(existingCover || "");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverUrlChange = (e) => {
    const url = e.target.value;
    setCoverUrl(url);
    if (url) {
      setCoverPreview(url);
    } else if (existingCover && coverMode === "url") {
      setCoverPreview(existingCover);
    } else {
      setCoverPreview("");
    }
  };

  const clearCover = () => {
    setCoverFile(null);
    setCoverUrl("");
    setCoverPreview("");
  };

  const switchCoverMode = (mode) => {
    setCoverMode(mode);
    setCoverFile(null);
    if (mode === "url") {
      setCoverUrl(existingCover || "");
      setCoverPreview(existingCover || "");
    } else {
      setCoverUrl("");
      setCoverPreview(existingCover && coverMode === "file" ? existingCover : "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("url", form.url);
      formData.append("description", form.description);
      formData.append("type", form.type);
      formData.append("tags", form.tags);
      formData.append("author", form.author);
      formData.append("rating", String(form.rating));
      formData.append("language", form.language);
      formData.append("difficulty", form.difficulty || "");
      formData.append("notes", form.notes);
      formData.append("isActive", String(form.isActive));
      formData.append("isFeatured", String(form.isFeatured));
      formData.append("coverImageFit", form.coverImageFit || "cover");

      if (coverMode === "file" && coverFile) {
        formData.append("coverImage", coverFile);
      } else if (coverMode === "url" && coverUrl) {
        formData.append("coverImage", coverUrl);
      }

      if (editData) {
        await updateResource(editData._id || editData.id, formData);
        showAdminToast("Kaynak guncellendi.", { type: "success" });
      } else {
        await createResource(formData);
        showAdminToast("Kaynak olusturuldu.", { type: "success" });
      }

      onSuccess();
    } catch (err) {
      showAdminToast(err.message, { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-header">
        <button type="button" className="admin-btn-icon" onClick={onCancel} title="Geri don">
          <ArrowLeft size={18} />
        </button>
        <h2>{editData ? "Kaynagi Duzenle" : "Yeni Kaynak Ekle"}</h2>
      </div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Baslik *</label>
            <input type="text" value={form.title} onChange={handleChange("title")} required />
          </div>
          <div className="form-group">
            <label>URL *</label>
            <input type="url" value={form.url} onChange={handleChange("url")} required placeholder="https://" />
          </div>
          <div className="form-group">
            <label>Tur</label>
            <select value={form.type} onChange={handleChange("type")}>
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Yazar / Kaynak</label>
            <input type="text" value={form.author} onChange={handleChange("author")} />
          </div>
          <div className="form-group">
            <label>Dil</label>
            <select value={form.language} onChange={handleChange("language")}>
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Zorluk</label>
            <select value={form.difficulty} onChange={handleChange("difficulty")}>
              {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Puan (0-5)</label>
            <input type="number" min="0" max="5" step="1" value={form.rating} onChange={handleChange("rating")} />
          </div>
          <div className="form-group">
            <label>Etiketler (virgulle ayirin)</label>
            <input type="text" value={form.tags} onChange={handleChange("tags")} placeholder="react, frontend" />
          </div>
          <div className="form-group form-group--full">
            <label>Aciklama</label>
            <textarea rows="3" value={form.description} onChange={handleChange("description")} />
          </div>
          <div className="form-group form-group--full">
            <label>Notlar</label>
            <textarea rows="2" value={form.notes} onChange={handleChange("notes")} />
          </div>

          <div className="form-group form-group--full">
            <label>Kapak Gorseli</label>

            {coverPreview && (
              <div className="res-cover-preview">
                <img src={coverPreview} alt="Onizleme" />
                <button type="button" className="res-cover-clear" onClick={clearCover} aria-label="Gorseli kaldir">
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="res-cover-mode-tabs">
              <button
                type="button"
                className={`res-cover-mode-btn ${coverMode === "url" ? "res-cover-mode-btn--active" : ""}`}
                onClick={() => switchCoverMode("url")}
              >
                <Link2 size={14} /> URL
              </button>
              <button
                type="button"
                className={`res-cover-mode-btn ${coverMode === "file" ? "res-cover-mode-btn--active" : ""}`}
                onClick={() => switchCoverMode("file")}
              >
                <Upload size={14} /> Dosya Yukle
              </button>
            </div>

            {coverMode === "url" ? (
              <input
                type="url"
                value={coverUrl}
                onChange={handleCoverUrlChange}
                placeholder="https://example.com/image.jpg"
                className="res-cover-url-input"
              />
            ) : (
              <div className="form-file-field">
                <ImageIcon size={16} />
                <input type="file" accept="image/*" onChange={handleCoverFileChange} />
                {coverFile && <span className="res-cover-file-name">{coverFile.name}</span>}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Gorsel Boyutlandirma</label>
            <div className="res-cover-mode-tabs">
              <button
                type="button"
                className={`res-cover-mode-btn ${form.coverImageFit === "cover" ? "res-cover-mode-btn--active" : ""}`}
                onClick={() => setForm((prev) => ({ ...prev, coverImageFit: "cover" }))}
              >
                Kapla
              </button>
              <button
                type="button"
                className={`res-cover-mode-btn ${form.coverImageFit === "contain" ? "res-cover-mode-btn--active" : ""}`}
                onClick={() => setForm((prev) => ({ ...prev, coverImageFit: "contain" }))}
              >
                Sigdir
              </button>
              <button
                type="button"
                className={`res-cover-mode-btn ${form.coverImageFit === "auto" ? "res-cover-mode-btn--active" : ""}`}
                onClick={() => setForm((prev) => ({ ...prev, coverImageFit: "auto" }))}
              >
                Orjinal
              </button>
            </div>
          </div>

          <div className="form-group form-group--checkbox">
            <label>
              <input type="checkbox" checked={form.isActive} onChange={handleChange("isActive")} />
              Aktif
            </label>
          </div>
          <div className="form-group form-group--checkbox">
            <label>
              <input type="checkbox" checked={form.isFeatured} onChange={handleChange("isFeatured")} />
              One Cikan
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
            {submitting ? "Kaydediliyor..." : editData ? "Guncelle" : "Olustur"}
          </button>
          <button type="button" className="admin-btn admin-btn--cancel" onClick={onCancel}>
            Iptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceForm;
