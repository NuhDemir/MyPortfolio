import asyncHandler from "express-async-handler";
import listResourcesUseCase from "../../../application/use-cases/listResources.use-case.js";
import getResourceUseCase from "../../../application/use-cases/getResource.use-case.js";
import createResourceUseCase from "../../../application/use-cases/createResource.use-case.js";
import updateResourceUseCase from "../../../application/use-cases/updateResource.use-case.js";
import deleteResourceUseCase from "../../../application/use-cases/deleteResource.use-case.js";

export const createResourceController = (dependencies) => {
  const list = asyncHandler(async (req, res) => {
    const resources = await listResourcesUseCase(
      {
        isAdmin: req.user?.role === "admin",
        filters: req.query,
      },
      dependencies,
    );
    res.json(resources);
  });

  const get = asyncHandler(async (req, res) => {
    const resource = await getResourceUseCase(
      {
        slug: req.params.slug,
        isAdmin: req.user?.role === "admin",
      },
      dependencies,
    );
    res.json(resource);
  });

  const create = asyncHandler(async (req, res) => {
    const payload = { ...req.body };

    if (req.file?.path) {
      payload.coverImage = req.file.path;
    } else if (req.body.coverImageUrl) {
      payload.coverImage = req.body.coverImageUrl;
    }

    const resource = await createResourceUseCase(payload, dependencies);
    res.status(201).json(resource);
  });

  const update = asyncHandler(async (req, res) => {
    const payload = { ...req.body };

    if (req.file?.path) {
      payload.coverImage = req.file.path;
    }

    const resource = await updateResourceUseCase(req.params.id, payload, dependencies);
    res.json(resource);
  });

  const remove = asyncHandler(async (req, res) => {
    const result = await deleteResourceUseCase(req.params.id, dependencies);
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

export default createResourceController;
