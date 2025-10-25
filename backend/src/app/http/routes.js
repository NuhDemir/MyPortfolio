import initAuthModule from "../../modules/auth/auth.module.js";
import initBlogModule from "../../modules/blog/blog.module.js";
import initProjectModule from "../../modules/project/project.module.js";

const modules = {
  auth: initAuthModule(),
  blog: null,
  project: null,
};

export const registerRoutes = (app) => {
  modules.blog = initBlogModule({ authModule: modules.auth });
  modules.project = initProjectModule({ authModule: modules.auth });
  app.use("/api/auth", modules.auth.router);
  app.use("/api/blog", modules.blog.router);
  app.use("/api/projects", modules.project.router);
};

export const getModules = () => modules;

export default registerRoutes;
