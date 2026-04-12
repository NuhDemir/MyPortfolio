export const updateAboutUseCase = async (payload, { aboutService, actorId }) => {
  return aboutService.updateAboutContent(payload, { editorId: actorId });
};

export default updateAboutUseCase;
