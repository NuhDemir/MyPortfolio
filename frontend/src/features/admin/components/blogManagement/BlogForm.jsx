import { Save, X, Image, ArrowLeft } from "lucide-react";

const BlogForm = ({ editingId, loading, formData, categories, thumbnailPreview, onInputChange, onThumbnailChange, onSubmit, onCancel }) => {
  return (
    <div className="admin-form-container">
      <div className="admin-form-header">
        <button type="button" className="admin-btn-icon" onClick={onCancel} title="Geri don">
          <ArrowLeft size={18} />
        </button>
        <h2>{editingId ? "Blog Yazisini Duzenle" : "Yeni Blog Yazisi Olustur"}</h2>
      </div>

      <form onSubmit={onSubmit} className="admin-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Baslik</label>
            <input id="title" type="text" name="title" value={formData.title} onChange={onInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="category">Kategori</label>
            <input id="category" name="category" list="blog-categories" value={formData.category} onChange={onInputChange} placeholder="Orn: gelistirme" />
            <datalist id="blog-categories">
              {categories.map((option) => <option key={option} value={option} />)}
            </datalist>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">Icerik</label>
          <textarea id="content" name="content" rows="8" value={formData.content} onChange={onInputChange} required />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="tags">Etiketler (virgulle ayirin)</label>
            <input id="tags" type="text" name="tags" value={formData.tags} onChange={onInputChange} placeholder="tasarim, deneyim" />
          </div>
          <div className="form-group form-group--file">
            <label htmlFor="thumbnail">
              Kapak Gorseli {editingId ? "(degistirmek icin yeni dosya secin)" : ""}
            </label>
            <div className="form-file-field">
              <Image size={16} />
              <input id="thumbnail" type="file" name="thumbnail" accept="image/*" onChange={onThumbnailChange} />
            </div>
            {thumbnailPreview && (
              <img src={thumbnailPreview} alt="Blog kapak onizlemesi" className="image-preview" />
            )}
          </div>
        </div>

        <label className="checkbox-group" htmlFor="isPublished">
          <input id="isPublished" type="checkbox" name="isPublished" checked={formData.isPublished} onChange={onInputChange} />
          <span>Yayinla</span>
          <span className="checkbox-group__state">
            {formData.isPublished ? "Yayinda" : "Taslak"}
          </span>
        </label>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="admin-btn admin-btn--primary">
            <Save size={16} />
            {loading ? "Kaydediliyor..." : editingId ? "Guncelle" : "Kaydet"}
          </button>
          <button type="button" onClick={onCancel} className="admin-btn admin-btn--cancel">
            <X size={16} />
            Iptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
