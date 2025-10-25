export const listProjectsUseCase = async (filters, { projectService }) => {
  return projectService.listProjects(filters);
};

export default listProjectsUseCase;
