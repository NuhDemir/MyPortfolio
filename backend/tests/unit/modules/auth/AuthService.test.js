import { jest } from "@jest/globals";
import { AuthService } from "../../../../src/modules/auth/application/services/AuthService.js";

const createDependencies = () => {
  const userRepository = {
    findByIdentity: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const passwordHasher = {
    compare: jest.fn(),
    hash: jest.fn(),
  };

  const tokenService = {
    sign: jest.fn().mockReturnValue("token"),
  };

  return {
    userRepository,
    passwordHasher,
    tokenService,
    authService: new AuthService({
      userRepository,
      passwordHasher,
      tokenService,
    }),
  };
};

describe("AuthService", () => {
  describe("login", () => {
    it("should login with identity and password", async () => {
      const { authService, userRepository, passwordHasher } =
        createDependencies();

      userRepository.findByIdentity.mockResolvedValue({
        id: "1",
        username: "admin",
        password: "hashed",
        role: "admin",
      });
      passwordHasher.compare.mockResolvedValue(true);

      const result = await authService.login({
        identity: "admin",
        password: "secret",
      });

      expect(result).toEqual({
        _id: "1",
        username: "admin",
        email: undefined,
        role: "admin",
        token: "token",
      });
      expect(userRepository.findByIdentity).toHaveBeenCalledWith("admin");
      expect(passwordHasher.compare).toHaveBeenCalledWith("secret", "hashed");
    });

    it("should throw error when user not found", async () => {
      const { authService, userRepository } = createDependencies();

      userRepository.findByIdentity.mockResolvedValue(null);

      await expect(() =>
        authService.login({ identity: "admin", password: "secret" })
      ).rejects.toThrow("Kullanıcı bulunamadı veya bilgiler hatalı.");
    });

    it("should throw error when password mismatch", async () => {
      const { authService, userRepository, passwordHasher } =
        createDependencies();

      userRepository.findByIdentity.mockResolvedValue({
        id: "1",
        username: "admin",
        password: "hashed",
        role: "admin",
      });
      passwordHasher.compare.mockResolvedValue(false);

      await expect(() =>
        authService.login({ identity: "admin", password: "wrong" })
      ).rejects.toThrow("Kullanıcı adı veya şifre yanlış.");
    });
  });

  describe("registerAdmin", () => {
    it("should register new admin", async () => {
      const { authService, userRepository, passwordHasher } =
        createDependencies();

      userRepository.findByIdentity.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);
      passwordHasher.hash.mockResolvedValue("hashed");
      userRepository.create.mockResolvedValue({
        id: "1",
        username: "admin",
        email: "admin@example.com",
        role: "admin",
      });

      const result = await authService.registerAdmin({
        username: "admin",
        email: "admin@example.com",
        password: "secret",
      });

      expect(result).toEqual({
        _id: "1",
        username: "admin",
        email: "admin@example.com",
        role: "admin",
        token: "token",
      });
      expect(userRepository.create).toHaveBeenCalledWith({
        username: "admin",
        email: "admin@example.com",
        password: "hashed",
        role: "admin",
      });
    });

    it("should reject duplicate username", async () => {
      const { authService, userRepository } = createDependencies();

      userRepository.findByIdentity.mockResolvedValue({});

      await expect(
        authService.registerAdmin({
          username: "admin",
          email: "test@example.com",
          password: "secret",
        })
      ).rejects.toThrow("Kullanıcı adı zaten mevcut.");
    });

    it("should reject duplicate email", async () => {
      const { authService, userRepository } = createDependencies();

      userRepository.findByIdentity.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue({});

      await expect(
        authService.registerAdmin({
          username: "admin",
          email: "admin@example.com",
          password: "secret",
        })
      ).rejects.toThrow("Email adresi zaten kayıtlı.");
    });
  });
});
