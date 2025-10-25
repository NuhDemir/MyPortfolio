export const deleteBlogUseCase = async (id, { blogService }) => {
  return blogService.deleteBlog(id);
};

export default deleteBlogUseCase;
