export const updateProjectUseCase = async (id, payload, { projectService }) => {
  return projectService.updateProject(id, payload);
};

export default updateProjectUseCase;
