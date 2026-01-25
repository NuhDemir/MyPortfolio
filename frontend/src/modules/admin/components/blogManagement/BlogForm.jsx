import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

const BlogForm = ({
  editingId,
  loading,
  formData,
  categories,
  thumbnailPreview,
  onInputChange,
  onThumbnailChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="admin-form-container">
      <h2>
        {editingId ? "Blog Yazısını Düzenle" : "Yeni Blog Yazısı Oluştur"}
      </h2>

      <form onSubmit={onSubmit} className="admin-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Başlık</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Kategori</label>
            <input
              id="category"
              name="category"
              list="blog-categories"
              value={formData.category}
              onChange={onInputChange}
              placeholder="Örn: geliştirme"
            />
            <datalist id="blog-categories">
              {categories.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">İçerik</label>
          <textarea
            id="content"
            name="content"
            rows="8"
            value={formData.content}
            onChange={onInputChange}
            required
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="tags">Etiketler (virgülle ayırın)</label>
            <input
              id="tags"
              type="text"
              name="tags"
              value={formData.tags}
              onChange={onInputChange}
              placeholder="tasarım, deneyim"
            />
          </div>

          <div className="form-group form-group--file">
            <label htmlFor="thumbnail">
              Kapak Görseli{" "}
              {editingId ? "(değiştirmek için yeni dosya seçin)" : ""}
            </label>
            <div className="form-file-field">
              <ImageOutlinedIcon className="btn-icon" fontSize="inherit" />
              <input
                id="thumbnail"
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={onThumbnailChange}
              />
            </div>
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Blog kapak önizlemesi"
                className="image-preview"
              />
            ) : null}
          </div>
        </div>

        <label className="checkbox-group" htmlFor="isPublished">
          <input
            id="isPublished"
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={onInputChange}
          />
          <span>Yayınla</span>
          <span className="checkbox-group__state">
            {formData.isPublished ? "Yayında" : "Taslak"}
          </span>
        </label>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            <SaveRoundedIcon className="btn-icon" fontSize="inherit" />
            <span>
              {loading ? "Kaydediliyor..." : editingId ? "Güncelle" : "Kaydet"}
            </span>
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            <CloseRoundedIcon className="btn-icon" fontSize="inherit" />
            <span>İptal</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
