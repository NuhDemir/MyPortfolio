export const loginAdminUseCase = async ({ identity, password }, { authService }) => {
  if (!identity || !password) {
    throw new Error("Kullanıcı adı/email ve şifre gereklidir.");
  }

  return authService.login({ identity, password });
};

export default loginAdminUseCase;
