export const getPublicAboutUseCase = async (_payload, { aboutService }) => {
  return aboutService.getPublicAboutContent();
};

export default getPublicAboutUseCase;
