export const createResourceUseCase = async (payload, { resourceService }) => {
  return resourceService.createResource(payload);
};

export default createResourceUseCase;
