export const registerAdminUseCase = async ({ username, email, password }, { authService }) => {
  if (!username || !email || !password) {
    throw new Error("Kullanıcı adı, email ve şifre gereklidir.");
  }

  return authService.registerAdmin({ username, email, password });
};

export default registerAdminUseCase;
