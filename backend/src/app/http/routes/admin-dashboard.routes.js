import express from "express";
import asyncHandler from "express-async-handler";

const ACTION_THRESHOLD_MS = 60 * 1000;

const toDate = (value) => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const resolveAction = (createdAt, updatedAt) => {
  if (createdAt && updatedAt) {
    const diff = updatedAt.getTime() - createdAt.getTime();
    if (diff > ACTION_THRESHOLD_MS) {
      return {
        action: "updated",
        occurredAt: updatedAt,
      };
    }
  }

  const occurredAt = createdAt ?? updatedAt ?? new Date();

  return {
    action: "created",
    occurredAt,
  };
};

const mapProjectActivity = (project) => {
  const createdAt = toDate(project.createdAt);
  const updatedAt = toDate(project.updatedAt);
  const { action, occurredAt } = resolveAction(createdAt, updatedAt);

  return {
    id: `project-${project.id}`,
    type: "project",
    action,
    headline:
      action === "updated" ? "Proje güncellendi" : "Yeni proje yayımlandı",
    resourceTitle: project.title,
    resourceSlug: project.slug,
    status: project.status ?? null,
    occurredAt: occurredAt?.toISOString() ?? null,
    createdAt: createdAt?.toISOString() ?? null,
    updatedAt: updatedAt?.toISOString() ?? null,
  };
};

const mapBlogActivity = (blog) => {
  const createdAt = toDate(blog.createdAt);
  const updatedAt = toDate(blog.updatedAt);
  const { action, occurredAt } = resolveAction(createdAt, updatedAt);

  return {
    id: `blog-${blog.id}`,
    type: "blog",
    action,
    headline:
      action === "updated"
        ? "Blog yazısı güncellendi"
        : "Yeni blog yazısı yayınlandı",
    resourceTitle: blog.title,
    resourceSlug: blog.slug,
    status: blog.status ?? null,
    occurredAt: occurredAt?.toISOString() ?? null,
    createdAt: createdAt?.toISOString() ?? null,
    updatedAt: updatedAt?.toISOString() ?? null,
  };
};

export const createAdminDashboardRouter = ({
  middleware,
  blogRepository,
  projectRepository,
}) => {
  const router = express.Router();

  router.get(
    "/",
    middleware.protect,
    middleware.authorizeAdmin,
    asyncHandler(async (_req, res) => {
      const [projects, blogs] = await Promise.all([
        projectRepository.findAll({}, { lean: true }),
        blogRepository.findAll({}, { lean: true }),
      ]);

      const stats = {
        projects: projects.length,
        blogs: blogs.length,
        messages: 0,
      };

      const activity = [
        ...projects.map(mapProjectActivity),
        ...blogs.map(mapBlogActivity),
      ]
        .filter((item) => item.occurredAt)
        .sort(
          (a, b) =>
            new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
        )
        .slice(0, 12);

      res.json({
        stats,
        activity,
      });
    })
  );

  return router;
};

export default createAdminDashboardRouter;
