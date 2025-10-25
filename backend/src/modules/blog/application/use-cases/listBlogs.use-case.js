export const listBlogsUseCase = async ({ isAdmin }, { blogService }) => {
  return blogService.listBlogs({ isAdmin });
};

export default listBlogsUseCase;
