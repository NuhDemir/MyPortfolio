export const createProjectUseCase = async (payload, { projectService }) => {
  return projectService.createProject(payload);
};

export default createProjectUseCase;
