import express from "express";
import { validateRequest } from "../../../../../shared/interfaces/http/middleware/validation.middleware.js";
import createBlogUpload from "../../../infrastructure/storage/CloudinaryStorageService.js";
import createBlogController from "../controllers/blog.controller.js";
import {
  createBlogSchema,
  updateBlogSchema,
} from "../validators/blog.schemas.js";

export const createBlogRouter = ({ middleware, ...dependencies }) => {
  const router = express.Router();
  const controller = createBlogController(dependencies);
  const upload = createBlogUpload();

  router.get("/", middleware.optionalAuth, controller.list);
  router.get(
    "/export/json",
    middleware.protect,
    middleware.authorizeAdmin,
    controller.exportJson,
  );
  router.get("/:slug", middleware.optionalAuth, controller.get);

  router.post(
    "/",
    middleware.protect,
    middleware.authorizeAdmin,
    upload.single("thumbnail"),
    validateRequest(createBlogSchema),
    controller.create,
  );

  router.put(
    "/:id",
    middleware.protect,
    middleware.authorizeAdmin,
    upload.single("thumbnail"),
    validateRequest(updateBlogSchema),
    controller.update,
  );

  router.delete(
    "/:id",
    middleware.protect,
    middleware.authorizeAdmin,
    controller.remove,
  );

  router.post("/:id/like", controller.like);

  return router;
};

export default createBlogRouter;
