export const getResourceUseCase = async ({ slug, isAdmin }, { resourceService }) => {
  return resourceService.getResourceBySlug(slug, { isAdmin });
};

export default getResourceUseCase;
