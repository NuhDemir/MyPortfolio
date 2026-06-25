export const listResourcesUseCase = async ({ isAdmin, filters }, { resourceService }) => {
  return resourceService.listResources({ isAdmin, filters });
};

export default listResourcesUseCase;
