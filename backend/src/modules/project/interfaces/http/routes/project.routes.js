import express from "express";
import { validateRequest } from "../../../../../shared/interfaces/http/middleware/validation.middleware.js";
import createProjectUpload from "../../../infrastructure/storage/ProjectMediaUpload.js";
import createProjectController from "../controllers/project.controller.js";
import {
  createProjectSchemaAny,
  updateProjectSchemaAny,
} from "../validators/project.schemas.js";

export const createProjectRouter = ({ middleware, ...dependencies }) => {
  const router = express.Router();
  const controller = createProjectController(dependencies);
  const upload = createProjectUpload();

  router.get("/", controller.list);
  router.get("/:id", controller.get);

  router.post(
    "/",
    middleware.protect,
    middleware.authorizeAdmin,
    upload.single("image"),
    validateRequest(createProjectSchemaAny),
    controller.create,
  );

  router.put(
    "/:id",
    middleware.protect,
    middleware.authorizeAdmin,
    upload.single("image"),
    validateRequest(updateProjectSchemaAny),
    controller.update,
  );

  router.delete(
    "/:id",
    middleware.protect,
    middleware.authorizeAdmin,
    controller.remove,
  );

  return router;
};

export default createProjectRouter;
