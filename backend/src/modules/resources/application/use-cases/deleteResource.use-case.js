export const deleteResourceUseCase = async (id, { resourceService }) => {
  return resourceService.deleteResource(id);
};

export default deleteResourceUseCase;
