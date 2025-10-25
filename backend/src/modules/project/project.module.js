import initAuthModule from "../auth/auth.module.js";
import { createProjectService } from "./application/services/ProjectService.js";
import { MongooseProjectRepository } from "./infrastructure/persistence/mongoose/MongooseProjectRepository.js";
import { createProjectRouter } from "./interfaces/http/routes/project.routes.js";

export const initProjectModule = (dependencies = {}) => {
  const projectRepository = new MongooseProjectRepository();
  const projectService = createProjectService({ projectRepository });

  const authModule = dependencies.authModule ?? initAuthModule();

  const router = createProjectRouter({
    projectService,
    middleware: authModule.middleware,
  });

  return {
    router,
    services: {
      projectService,
    },
    repositories: {
      projectRepository,
    },
    dependencies: {
      authModule,
    },
  };
};

export default initProjectModule;
