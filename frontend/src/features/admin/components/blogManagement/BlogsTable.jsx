import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { LoadingSpinner, Pagination } from "@shared";
import { resolveBlogId, resolveThumbnailUrl } from "../../utils/blogManagement";

const BlogsTable = ({ blogs, loading, error, currentPage, itemsPerPage, onPageChange, onItemsPerPageChange, onEdit, onDelete, onNew }) => {
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

      if (normalizedQuery && !title.includes(normalizedQuery)) return false;
      if (statusFilter !== "all") {
        const desired = statusFilter === "published";
        if (isPublished !== desired) return false;
      }
      if (categoryFilter !== "all" && category !== categoryFilter) return false;
      return true;
    });
  }, [blogs, categoryFilter, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) onPageChange?.(1);
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
        <h2>Mevcut Blog Yazilari</h2>
        <span className="admin-management__count" aria-label="Toplam blog sayisi">
          {filteredBlogs.length}/{blogs.length}
        </span>
      </div>

      <div className="admin-table-toolbar">
        <div className="admin-search-wrap">
          <Search size={14} className="admin-search-icon" />
          <input className="admin-search-input" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Basliga gore ara..." />
        </div>
        <select className="admin-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Tumu</option>
          <option value="published">Yayinda</option>
          <option value="draft">Taslak</option>
        </select>
        <select className="admin-filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">Tum Kategoriler</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {loading && blogs.length === 0 ? (
        <LoadingSpinner message="Blog yazilari yukleniyor..." />
      ) : null}

      {!loading && !error && (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Kapak</th>
                  <th>Baslik</th>
                  <th>Kategori</th>
                  <th>Durum</th>
                  <th>Islem</th>
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
                            <img src={thumb} alt={blog.title} className="list-thumbnail" />
                          ) : (
                            <span className="admin-thumb-placeholder" />
                          )}
                        </td>
                        <td className="admin-table-title">
                          <span className="admin-table-title-text">{blog.title}</span>
                        </td>
                        <td><span className="admin-badge">{blog.category || "-"}</span></td>
                        <td>
                          <span className={`admin-status-dot ${isPublished ? "active" : "inactive"}`} />
                          {isPublished ? "Yayinda" : "Taslak"}
                        </td>
                        <td>
                          <div className="admin-table-actions">
                            <button type="button" className="admin-btn-icon" title="Duzenle" onClick={() => onEdit(blog)}>
                              <Pencil size={14} />
                            </button>
                            <button type="button" className="admin-btn-icon admin-btn-icon--danger" title="Sil" onClick={() => onDelete(blogId)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <div className="admin-empty-state">
                        <p>Gosterilecek blog yazisi bulunamadi.</p>
                        {typeof onNew === "function" && (
                          <button type="button" className="admin-btn admin-btn--primary" onClick={onNew}>
                            <Plus size={16} />
                            Yeni Blog Yazisi
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredBlogs.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredBlogs.length / itemsPerPage)}
              itemsPerPage={itemsPerPage}
              totalItems={filteredBlogs.length}
              onPageChange={onPageChange}
              onItemsPerPageChange={(newItemsPerPage) => { onItemsPerPageChange(newItemsPerPage); onPageChange(1); }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BlogsTable;
