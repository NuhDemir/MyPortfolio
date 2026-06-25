import asyncHandler from "express-async-handler";
import listBlogsUseCase from "../../../application/use-cases/listBlogs.use-case.js";
import getBlogUseCase from "../../../application/use-cases/getBlog.use-case.js";
import createBlogUseCase from "../../../application/use-cases/createBlog.use-case.js";
import updateBlogUseCase from "../../../application/use-cases/updateBlog.use-case.js";
import deleteBlogUseCase from "../../../application/use-cases/deleteBlog.use-case.js";
import exportBlogsJsonUseCase from "../../../application/use-cases/exportBlogsJson.use-case.js";

export const createBlogController = (dependencies) => {
  const list = asyncHandler(async (req, res) => {
    const isAdmin = req.user?.role === "admin";
    const blogs = await listBlogsUseCase({ isAdmin }, dependencies);
    console.log(`[Blog Controller] List returned ${blogs.length} blogs (admin=${isAdmin})`);
    res.json(blogs);
  });

  const get = asyncHandler(async (req, res) => {
    const blog = await getBlogUseCase(
      {
        slug: req.params.slug,
        isAdmin: req.user?.role === "admin",
      },
      dependencies,
    );

    res.json(blog);
  });

  const create = asyncHandler(async (req, res) => {
    const payload = {
      ...req.body,
      author: req.user.id,
    };

    console.log("[Blog Controller] Create payload received:", {
      title: payload.title,
      contentLength: payload.content?.length,
      category: payload.category,
      tags: payload.tags,
      isPublished: payload.isPublished,
      hasThumbnail: !!req.file?.path || !!req.body.thumbnailUrl,
    });

    if (req.file?.path) {
      payload.thumbnail = req.file.path;
    } else if (req.body.thumbnailUrl) {
      payload.thumbnail = req.body.thumbnailUrl;
    }

    const blog = await createBlogUseCase(payload, dependencies);
    console.log("[Blog Controller] Blog created:", { id: blog.id, slug: blog.slug, title: blog.title });
    res.status(201).json(blog);
  });

  const update = asyncHandler(async (req, res) => {
    const payload = {
      ...req.body,
    };

    if (req.file) {
      payload.thumbnail = req.file.path;
    }

    const blog = await updateBlogUseCase(req.params.id, payload, dependencies);
    res.json(blog);
  });

  const remove = asyncHandler(async (req, res) => {
    const result = await deleteBlogUseCase(req.params.id, dependencies);
    res.json(result);
  });

  const exportJson = asyncHandler(async (_req, res) => {
    const payload = await exportBlogsJsonUseCase(dependencies);

    const safeTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `blogs-export-${safeTimestamp}.json`;

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(JSON.stringify(payload, null, 2));
  });

  return {
    list,
    get,
    create,
    update,
    remove,
    exportJson,
  };
};

export default createBlogController;
