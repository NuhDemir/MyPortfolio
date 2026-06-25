import { useState } from "react";
import { ArrowLeft } from "lucide-react";
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
        isActive: editData.isActive !== false,
        isFeatured: editData.isFeatured === true,
      };
    }
    return { ...INITIAL_STATE };
  });

  const [coverFile, setCoverFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setCoverFile(file);
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

      if (coverFile) {
        formData.append("coverImage", coverFile);
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
          <div className="form-group">
            <label>Kapak Gorseli</label>
            <input type="file" accept="image/*" onChange={handleCoverChange} />
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
