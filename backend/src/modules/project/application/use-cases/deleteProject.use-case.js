export const deleteProjectUseCase = async (id, { projectService }) => {
  return projectService.deleteProject(id);
};

export default deleteProjectUseCase;
