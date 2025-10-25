import { convertMarkdownToHtml } from "../../../../shared/utils/markdown.js";
import { generateSlug } from "../../../../shared/utils/slug.js";

export class BlogService {
  constructor({ blogRepository }) {
    this.blogRepository = blogRepository;
  }

  async listBlogs({ isAdmin = false } = {}) {
    const filter = isAdmin ? {} : { status: "published" };
    const blogs = await this.blogRepository.findAll(filter);

    return blogs.map((blog) => ({
      ...blog,
      content: convertMarkdownToHtml(blog.content),
    }));
  }

  async getBlogBySlug(slug, { isAdmin = false } = {}) {
    const filter = isAdmin ? {} : { status: "published" };
    const blog = await this.blogRepository.findBySlug(slug, filter);

    if (!blog) {
      throw new Error("Blog yazısı bulunamadı veya yayınlanmadı.");
    }

    await this.blogRepository.incrementViews(blog.id);

    return {
      ...blog,
      content: convertMarkdownToHtml(blog.content),
    };
  }

  async createBlog(data) {
    const payload = {
      ...data,
      slug: data.slug ?? generateSlug(data.title),
      tags: Array.isArray(data.tags)
        ? data.tags
        : (data.tags ?? "")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
    };

    const created = await this.blogRepository.create(payload);
    return {
      ...created,
      content: convertMarkdownToHtml(created.content),
    };
  }

  async updateBlog(id, data) {
    const payload = { ...data };

    if (payload.title && !payload.slug) {
      payload.slug = generateSlug(payload.title);
    }

    if (payload.tags && typeof payload.tags === "string") {
      payload.tags = payload.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    if (payload.isPublished !== undefined) {
      payload.status = payload.isPublished ? "published" : "draft";
    }

    const updated = await this.blogRepository.updateById(id, payload);

    if (!updated) {
      throw new Error("Blog yazısı bulunamadı.");
    }

    return {
      ...updated,
      content: convertMarkdownToHtml(updated.content),
    };
  }

  async deleteBlog(id) {
    const result = await this.blogRepository.deleteById(id);
    if (!result) {
      throw new Error("Blog yazısı bulunamadı.");
    }
    return result;
  }
}

export const createBlogService = ({ blogRepository }) => new BlogService({ blogRepository });

export default BlogService;
