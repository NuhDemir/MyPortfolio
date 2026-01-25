export const exportBlogsJsonUseCase = async ({ blogService }) => {
  const blogs = await blogService.exportBlogsForJson();

  return {
    type: "blogs",
    exportedAt: new Date().toISOString(),
    count: blogs.length,
    items: blogs,
  };
};

export default exportBlogsJsonUseCase;
