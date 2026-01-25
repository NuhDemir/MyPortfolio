import asyncHandler from "express-async-handler";
import listProjectsUseCase from "../../../application/use-cases/listProjects.use-case.js";
import getProjectUseCase from "../../../application/use-cases/getProject.use-case.js";
import createProjectUseCase from "../../../application/use-cases/createProject.use-case.js";
import updateProjectUseCase from "../../../application/use-cases/updateProject.use-case.js";
import deleteProjectUseCase from "../../../application/use-cases/deleteProject.use-case.js";
import exportProjectsJsonUseCase from "../../../application/use-cases/exportProjectsJson.use-case.js";

export const createProjectController = (dependencies) => {
  const list = asyncHandler(async (req, res) => {
    const projects = await listProjectsUseCase(
      {
        status: req.query.status,
        featured:
          req.query.featured !== undefined
            ? req.query.featured === "true"
            : undefined,
      },
      dependencies,
    );

    res.json(projects);
  });

  const get = asyncHandler(async (req, res) => {
    const identifier = req.params.id;
    const isMongoId = /^[0-9a-fA-F]{24}$/;

    const project = await getProjectUseCase(
      isMongoId.test(identifier) ? { id: identifier } : { slug: identifier },
      dependencies,
    );

    res.json(project);
  });

  const create = asyncHandler(async (req, res) => {
    const payload = {
      ...req.body,
      tags: req.body.tags,
    };

    if (req.file?.path) {
      payload.imageUrl = req.file.path;
      payload.visuals = {
        ...(payload.visuals ?? {}),
        thumbnailUrl: req.file.path,
      };
    } else {
      const thumbnailUrl =
        payload?.visuals?.thumbnailUrl ??
        payload?.imageUrl ??
        payload?.imageUrl;

      if (thumbnailUrl) {
        payload.imageUrl = payload.imageUrl ?? thumbnailUrl;
        payload.visuals = {
          ...(payload.visuals ?? {}),
          thumbnailUrl: payload.visuals?.thumbnailUrl ?? thumbnailUrl,
        };
      }
    }

    const resolvedImageUrl =
      payload?.visuals?.thumbnailUrl ?? payload?.imageUrl;

    if (!resolvedImageUrl) {
      res.status(400);
      throw new Error(
        "Proje görseli zorunludur. Bir dosya yükleyin veya visuals.thumbnailUrl/imageUrl alanı sağlayın.",
      );
    }

    const project = await createProjectUseCase(payload, dependencies);
    res.status(201).json(project);
  });

  const update = asyncHandler(async (req, res) => {
    const payload = {
      ...req.body,
      tags: req.body.tags,
    };

    if (req.file) {
      payload.imageUrl = req.file.path;
      payload.visuals = {
        ...(payload.visuals ?? {}),
        thumbnailUrl: req.file.path,
      };
    } else if (payload?.visuals?.thumbnailUrl && !payload.imageUrl) {
      payload.imageUrl = payload.visuals.thumbnailUrl;
    }

    const project = await updateProjectUseCase(
      req.params.id,
      payload,
      dependencies,
    );
    res.json(project);
  });

  const remove = asyncHandler(async (req, res) => {
    const result = await deleteProjectUseCase(req.params.id, dependencies);
    res.json(result);
  });

  const exportJson = asyncHandler(async (_req, res) => {
    const payload = await exportProjectsJsonUseCase(dependencies);

    const safeTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `projects-export-${safeTimestamp}.json`;

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(JSON.stringify(payload, null, 2));
  });

  return {
    list,
    get,
    create,
    update,
    remove,
    exportJson,
  };
};

export default createProjectController;
