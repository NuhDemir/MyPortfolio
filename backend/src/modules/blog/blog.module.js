import initAuthModule from "../auth/auth.module.js";
import { createBlogService } from "./application/services/BlogService.js";
import { MongooseBlogRepository } from "./infrastructure/persistence/mongoose/MongooseBlogRepository.js";
import { createBlogRouter } from "./interfaces/http/routes/blog.routes.js";

export const initBlogModule = (dependencies = {}) => {
  const blogRepository = new MongooseBlogRepository();
  const blogService = createBlogService({ blogRepository });

  const authModule = dependencies.authModule ?? initAuthModule();

  const router = createBlogRouter({
    blogService,
    middleware: authModule.middleware,
  });

  return {
    router,
    services: {
      blogService,
    },
    repositories: {
      blogRepository,
    },
    dependencies: {
      authModule,
    },
  };
};

export default initBlogModule;
