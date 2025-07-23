import Blog from "../models/Blog.js";

const findAllBlogs = async (filter = {}) => {
  return await Blog.find(filter).sort({ createdAt: -1 });
};

const findBlogBySlug = async (slug, filter = {}) => {
  return await Blog.findOne({ slug, ...filter });
};

const saveBlog = async (blogData) => {
  const blog = new Blog(blogData);
  return await blog.save();
};

const updateBlogById = async (id, updateData) => {
  const blog = await Blog.findById(id);
  if (!blog) return null;

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      blog[key] = updateData[key];
    }
  });
  return await blog.save();
};

const deleteBlogById = async (id) => {
  const blog = await Blog.findById(id);
  if (!blog) return null;
  await blog.deleteOne();
  return { message: "Blog yazısı başarıyla silindi." };
};

export {
  findAllBlogs,
  findBlogBySlug,
  saveBlog,
  updateBlogById,
  deleteBlogById,
};
