export const getBlogUseCase = async ({ slug, isAdmin }, { blogService }) => {
  return blogService.getBlogBySlug(slug, { isAdmin });
};

export default getBlogUseCase;
