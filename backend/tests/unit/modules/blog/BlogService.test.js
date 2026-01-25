import { jest } from "@jest/globals";
import { BlogService } from "../../../../src/modules/blog/application/services/BlogService.js";
import { convertMarkdownToHtml } from "../../../../src/shared/utils/markdown.js";

describe("BlogService", () => {
  const createDependencies = () => {
    const blogRepository = {
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      create: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
      incrementViews: jest.fn(),
    };

    return {
      blogRepository,
      blogService: new BlogService({ blogRepository }),
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listBlogs", () => {
    it("should list published blogs for non-admin", async () => {
      const { blogService, blogRepository } = createDependencies();
      blogRepository.findAll.mockResolvedValue([
        { id: "1", title: "Test", content: "Hello" },
      ]);

      const blogs = await blogService.listBlogs({ isAdmin: false });

      expect(blogRepository.findAll).toHaveBeenCalledWith({
        status: "published",
      });
      const expected = convertMarkdownToHtml("Hello").trim();
      expect(blogs[0].content.trim()).toBe(expected);
    });
  });

  describe("getBlogBySlug", () => {
    it("should increment views and return blog", async () => {
      const { blogService, blogRepository } = createDependencies();
      blogRepository.findBySlug.mockResolvedValue({
        id: "1",
        content: "Content",
      });

      const blog = await blogService.getBlogBySlug("test", { isAdmin: false });

      expect(blogRepository.findBySlug).toHaveBeenCalledWith("test", {
        status: "published",
      });
      expect(blogRepository.incrementViews).toHaveBeenCalledWith("1");
      const expected = convertMarkdownToHtml("Content").trim();
      expect(blog.content.trim()).toBe(expected);
    });

    it("should throw when blog not found", async () => {
      const { blogService, blogRepository } = createDependencies();
      blogRepository.findBySlug.mockResolvedValue(null);

      await expect(
        blogService.getBlogBySlug("test", { isAdmin: false }),
      ).rejects.toThrow("Blog yazısı bulunamadı veya yayınlanmadı.");
    });
  });

  describe("createBlog", () => {
    it("should create blog with generated slug", async () => {
      const { blogService, blogRepository } = createDependencies();
      blogRepository.create.mockResolvedValue({
        id: "1",
        title: "Title",
        content: "Content",
      });

      const blog = await blogService.createBlog({
        title: "Title",
        content: "Content",
      });

      expect(blogRepository.create).toHaveBeenCalled();
      const expected = convertMarkdownToHtml("Content").trim();
      expect(blog.content.trim()).toBe(expected);
    });
  });

  describe("updateBlog", () => {
    it("should update blog and convert content", async () => {
      const { blogService, blogRepository } = createDependencies();
      blogRepository.updateById.mockResolvedValue({
        id: "1",
        title: "Title",
        content: "Content",
      });

      const blog = await blogService.updateBlog("1", {
        title: "Title",
        content: "Content",
      });

      expect(blogRepository.updateById).toHaveBeenCalledWith(
        "1",
        expect.any(Object),
      );
      const expected = convertMarkdownToHtml("Content").trim();
      expect(blog.content.trim()).toBe(expected);
    });

    it("should throw when blog not found", async () => {
      const { blogService, blogRepository } = createDependencies();
      blogRepository.updateById.mockResolvedValue(null);

      await expect(blogService.updateBlog("1", {})).rejects.toThrow(
        "Blog yazısı bulunamadı.",
      );
    });
  });

  describe("deleteBlog", () => {
    it("should delete blog", async () => {
      const { blogService, blogRepository } = createDependencies();
      blogRepository.deleteById.mockResolvedValue({ message: "Deleted" });

      const result = await blogService.deleteBlog("1");

      expect(result).toEqual({ message: "Deleted" });
      expect(blogRepository.deleteById).toHaveBeenCalledWith("1");
    });

    it("should throw when blog not found", async () => {
      const { blogService, blogRepository } = createDependencies();
      blogRepository.deleteById.mockResolvedValue(null);

      await expect(blogService.deleteBlog("1")).rejects.toThrow(
        "Blog yazısı bulunamadı.",
      );
    });
  });

  describe("exportBlogsForJson", () => {
    it("should export all blogs with markdown and html", async () => {
      const { blogService, blogRepository } = createDependencies();
      blogRepository.findAll.mockResolvedValue([
        { id: "1", title: "Test", content: "# Hello" },
      ]);

      const exported = await blogService.exportBlogsForJson();

      expect(blogRepository.findAll).toHaveBeenCalledWith({});
      expect(exported).toHaveLength(1);
      expect(exported[0].content).toBe("# Hello");
      expect(exported[0].contentHtml.trim()).toBe(
        convertMarkdownToHtml("# Hello").trim(),
      );
    });
  });
});
