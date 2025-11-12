import asyncHandler from "express-async-handler";
import listBlogsUseCase from "../../../application/use-cases/listBlogs.use-case.js";
import getBlogUseCase from "../../../application/use-cases/getBlog.use-case.js";
import createBlogUseCase from "../../../application/use-cases/createBlog.use-case.js";
import updateBlogUseCase from "../../../application/use-cases/updateBlog.use-case.js";
import deleteBlogUseCase from "../../../application/use-cases/deleteBlog.use-case.js";

export const createBlogController = (dependencies) => {
  const list = asyncHandler(async (req, res) => {
    const blogs = await listBlogsUseCase(
      {
        isAdmin: req.user?.role === "admin",
      },
      dependencies
    );

    res.json(blogs);
  });

  const get = asyncHandler(async (req, res) => {
    const blog = await getBlogUseCase(
      {
        slug: req.params.slug,
        isAdmin: req.user?.role === "admin",
      },
      dependencies
    );

    res.json(blog);
  });

  const create = asyncHandler(async (req, res) => {
    const payload = {
      ...req.body,
      author: req.user.id,
    };

    // Handle file upload or URL
    if (req.file?.path) {
      payload.thumbnail = req.file.path;
    } else if (req.body.thumbnailUrl) {
      payload.thumbnail = req.body.thumbnailUrl;
    }

    const blog = await createBlogUseCase(payload, dependencies);
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

  return {
    list,
    get,
    create,
    update,
    remove,
  };
};

export default createBlogController;
