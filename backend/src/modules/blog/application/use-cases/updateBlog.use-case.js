export const updateBlogUseCase = async (id, payload, { blogService }) => {
  return blogService.updateBlog(id, payload);
};

export default updateBlogUseCase;
