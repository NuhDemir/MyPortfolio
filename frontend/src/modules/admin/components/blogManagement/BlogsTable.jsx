import { useEffect, useMemo, useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LoadingSpinner from "@shared/ui/LoadingSpinner.jsx";
import Pagination from "@shared/ui/Pagination.jsx";
import { resolveBlogId, resolveThumbnailUrl } from "../../utils/blogManagement";

const BlogsTable = ({
  blogs,
  loading,
  error,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onEdit,
  onDelete,
  onNew,
}) => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => {
    const unique = new Set(
      (Array.isArray(blogs) ? blogs : [])
        .map((blog) => String(blog?.category ?? "").trim())
        .filter(Boolean),
    );
    return Array.from(unique).sort((a, b) => a.localeCompare(b, "tr"));
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return (Array.isArray(blogs) ? blogs : []).filter((blog) => {
      const title = String(blog?.title ?? "").toLowerCase();
      const category = String(blog?.category ?? "").trim();
      const isPublished = Boolean(blog?.isPublished);

      if (normalizedQuery && !title.includes(normalizedQuery)) {
        return false;
      }

      if (statusFilter !== "all") {
        const desired = statusFilter === "published";
        if (isPublished !== desired) {
          return false;
        }
      }

      if (categoryFilter !== "all" && category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [blogs, categoryFilter, query, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / itemsPerPage),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      onPageChange?.(1);
    }
  }, [currentPage, onPageChange, totalPages]);

  useEffect(() => {
    onPageChange?.(1);
  }, [categoryFilter, onPageChange, query, statusFilter]);

  const pagedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="admin-list-container">
      <div className="admin-management__header">
        <h2>Mevcut Blog Yazıları</h2>
        <span
          className="admin-management__count"
          aria-label="Toplam blog sayısı"
        >
          {filteredBlogs.length}/{blogs.length}
        </span>
      </div>

      <div className="admin-management__controls" aria-label="Filtreler">
        <div className="admin-search">
          <span className="admin-search__icon" aria-hidden="true">
            <SearchRoundedIcon fontSize="inherit" />
          </span>
          <input
            className="admin-search__input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Başlığa göre ara..."
            aria-label="Başlığa göre ara"
          />
        </div>

        <div className="admin-filter">
          <label htmlFor="blog-status-filter">Durum</label>
          <select
            id="blog-status-filter"
            className="admin-filter__select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">Tümü</option>
            <option value="published">Yayında</option>
            <option value="draft">Taslak</option>
          </select>
        </div>

        <div className="admin-filter">
          <label htmlFor="blog-category-filter">Kategori</label>
          <select
            id="blog-category-filter"
            className="admin-filter__select"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">Tümü</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && blogs.length === 0 ? (
        <LoadingSpinner message="Blog yazıları yükleniyor..." />
      ) : null}

      {!loading && !error ? (
        <>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Kapak</th>
                  <th>Başlık</th>
                  <th>Kategori</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.length > 0 ? (
                  pagedBlogs.map((blog, index) => {
                    const blogId = resolveBlogId(blog);
                    const thumb = resolveThumbnailUrl(blog);
                    const isPublished = Boolean(blog.isPublished);

                    return (
                      <tr key={blogId || `blog-${index}`}>
                        <td>
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={blog.title}
                              className="list-thumbnail"
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>{blog.title}</td>
                        <td>{blog.category || "-"}</td>
                        <td>
                          <span
                            className={`admin-status-badge ${
                              isPublished
                                ? "admin-status-badge--published"
                                : "admin-status-badge--draft"
                            }`}
                          >
                            {isPublished ? "Yayında" : "Taslak"}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button
                              type="button"
                              onClick={() => onEdit(blog)}
                              className="admin-btn admin-btn--edit"
                              aria-label="Blog yazısını düzenle"
                              title="Düzenle"
                            >
                              <EditRoundedIcon
                                className="btn-icon"
                                fontSize="inherit"
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(blogId)}
                              className="admin-btn admin-btn--delete"
                              aria-label="Blog yazısını sil"
                              title="Sil"
                            >
                              <DeleteRoundedIcon
                                className="btn-icon"
                                fontSize="inherit"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className="admin-empty">
                        <p>Gösterilecek blog yazısı bulunamadı.</p>
                        {typeof onNew === "function" ? (
                          <button
                            type="button"
                            className="admin-add-new-btn"
                            onClick={onNew}
                          >
                            <AddRoundedIcon
                              className="btn-icon"
                              fontSize="inherit"
                            />
                            <span>Yeni Blog Yazısı</span>
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredBlogs.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredBlogs.length / itemsPerPage)}
              itemsPerPage={itemsPerPage}
              totalItems={filteredBlogs.length}
              onPageChange={onPageChange}
              onItemsPerPageChange={(newItemsPerPage) => {
                onItemsPerPageChange(newItemsPerPage);
                onPageChange(1);
              }}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default BlogsTable;
