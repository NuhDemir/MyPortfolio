export const exportProjectsJsonUseCase = async ({ projectService }) => {
  const projects = await projectService.listProjects({ lean: true });

  return {
    type: "projects",
    exportedAt: new Date().toISOString(),
    count: projects.length,
    items: projects,
  };
};

export default exportProjectsJsonUseCase;
