import asyncHandler from "express-async-handler";
import listProjectsUseCase from "../../../application/use-cases/listProjects.use-case.js";
import getProjectUseCase from "../../../application/use-cases/getProject.use-case.js";
import createProjectUseCase from "../../../application/use-cases/createProject.use-case.js";
import updateProjectUseCase from "../../../application/use-cases/updateProject.use-case.js";
import deleteProjectUseCase from "../../../application/use-cases/deleteProject.use-case.js";

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
    const resolvedImageUrl = req.file?.path ?? req.body?.imageUrl;

    if (!resolvedImageUrl) {
      res.status(400);
      throw new Error(
        "Proje görseli zorunludur. Bir dosya yükleyin veya imageUrl alanı sağlayın.",
      );
    }

    const payload = {
      ...req.body,
      imageUrl: resolvedImageUrl,
      tags: req.body.tags,
    };

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

  return {
    list,
    get,
    create,
    update,
    remove,
  };
};

export default createProjectController;
