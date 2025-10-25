export const createBlogUseCase = async (payload, { blogService }) => {
  return blogService.createBlog(payload);
};

export default createBlogUseCase;
