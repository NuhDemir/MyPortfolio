export const getProjectUseCase = async (
  { id, slug, ...options },
  { projectService }
) => {
  if (slug) {
    return projectService.getProjectBySlug(slug, options);
  }

  if (!id) {
    throw new Error("Proje kimliği veya slug değeri zorunludur.");
  }

  return projectService.getProjectById(id, options);
};

export default getProjectUseCase;
