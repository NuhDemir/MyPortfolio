import { createAuthService } from "./application/services/AuthService.js";
import { MongooseUserRepository } from "./infrastructure/persistence/mongoose/MongooseUserRepository.js";
import PasswordHasher from "./infrastructure/security/PasswordHasher.js";
import JwtTokenService from "./infrastructure/security/JwtTokenService.js";
import { createAuthRouter } from "./interfaces/http/routes/auth.routes.js";
import { createAuthMiddleware } from "./interfaces/http/middleware/auth.middleware.js";

export const initAuthModule = () => {
  const userRepository = new MongooseUserRepository();
  const passwordHasher = new PasswordHasher();
  const tokenService = new JwtTokenService({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  });

  const authService = createAuthService({
    userRepository,
    passwordHasher,
    tokenService,
  });

  const middleware = createAuthMiddleware({ tokenService, userRepository });
  const router = createAuthRouter({ authService });

  return {
    router,
    services: {
      authService,
    },
    middleware,
    repositories: {
      userRepository,
    },
  };
};

export default initAuthModule;
