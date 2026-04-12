import initAuthModule from "../auth/auth.module.js";
import { createAboutService } from "./application/services/AboutService.js";
import { MongooseAboutRepository } from "./infrastructure/persistence/mongoose/MongooseAboutRepository.js";
import { createAboutRouter } from "./interfaces/http/routes/about.routes.js";

export const initAboutModule = (dependencies = {}) => {
  const aboutRepository = new MongooseAboutRepository();
  const aboutService = createAboutService({ aboutRepository });

  const authModule = dependencies.authModule ?? initAuthModule();

  const router = createAboutRouter({
    aboutService,
    middleware: authModule.middleware,
  });

  return {
    router,
    services: {
      aboutService,
    },
    repositories: {
      aboutRepository,
    },
    dependencies: {
      authModule,
    },
  };
};

export default initAboutModule;
