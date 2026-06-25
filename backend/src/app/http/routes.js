import initAuthModule from "../../modules/auth/auth.module.js";
import initBlogModule from "../../modules/blog/blog.module.js";
import initProjectModule from "../../modules/project/project.module.js";
import initCommentModule from "../../modules/comment/comment.module.js";
import initAboutModule from "../../modules/about/about.module.js";
import initResourceModule from "../../modules/resources/resources.module.js";
import { createAdminDashboardRouter } from "./routes/admin-dashboard.routes.js";

const modules = {
  auth: initAuthModule(),
  blog: null,
  project: null,
  comment: null,
  about: null,
  resource: null,
};

export const registerRoutes = (app) => {
  // Health check endpoint for deployment monitoring
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
    });
  });

  modules.blog = initBlogModule({ authModule: modules.auth });
  modules.project = initProjectModule({ authModule: modules.auth });
  modules.comment = initCommentModule({ authModule: modules.auth });
  modules.about = initAboutModule({ authModule: modules.auth });
  modules.resource = initResourceModule({ authModule: modules.auth });
  const adminDashboardRouter = createAdminDashboardRouter({
    middleware: modules.auth.middleware,
    blogRepository: modules.blog.repositories.blogRepository,
    projectRepository: modules.project.repositories.projectRepository,
  });
  app.use("/api/auth", modules.auth.router);
  app.use("/api/blog", modules.blog.router);
  app.use("/api/projects", modules.project.router);
  app.use("/api/comments", modules.comment.router);
  app.use("/api/about", modules.about.router);
  app.use("/api/resources", modules.resource.router);
  app.use("/api/admin/dashboard", adminDashboardRouter);
};

export const getModules = () => modules;

export default registerRoutes;
