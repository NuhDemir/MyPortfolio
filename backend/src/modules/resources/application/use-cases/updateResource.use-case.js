export const updateResourceUseCase = async (id, payload, { resourceService }) => {
  return resourceService.updateResource(id, payload);
};

export default updateResourceUseCase;
