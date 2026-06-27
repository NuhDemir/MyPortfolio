export const likeBlogUseCase = async (id, { blogService }) => {
  return blogService.likeBlog(id);
};

export default likeBlogUseCase;
