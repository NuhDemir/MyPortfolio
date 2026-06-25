import initAuthModule from "../auth/auth.module.js";
import { createResourceService } from "./application/services/ResourceService.js";
import { MongooseResourceRepository } from "./infrastructure/persistence/mongoose/MongooseResourceRepository.js";
import { createResourceRouter } from "./interfaces/http/routes/resource.routes.js";

export const initResourceModule = (dependencies = {}) => {
  const resourceRepository = new MongooseResourceRepository();
  const resourceService = createResourceService({ resourceRepository });

  const authModule = dependencies.authModule ?? initAuthModule();

  const router = createResourceRouter({
    resourceService,
    middleware: authModule.middleware,
  });

  return {
    router,
    services: {
      resourceService,
    },
    repositories: {
      resourceRepository,
    },
    dependencies: {
      authModule,
    },
  };
};

export default initResourceModule;
