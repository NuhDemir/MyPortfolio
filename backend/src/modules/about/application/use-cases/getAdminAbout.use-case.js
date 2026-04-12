export const getAdminAboutUseCase = async (_payload, { aboutService }) => {
  return aboutService.getAdminAboutContent();
};

export default getAdminAboutUseCase;
