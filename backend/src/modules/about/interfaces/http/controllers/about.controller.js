import asyncHandler from "express-async-handler";
import getPublicAboutUseCase from "../../../application/use-cases/getPublicAbout.use-case.js";
import getAdminAboutUseCase from "../../../application/use-cases/getAdminAbout.use-case.js";
import updateAboutUseCase from "../../../application/use-cases/updateAbout.use-case.js";

export const createAboutController = (dependencies) => {
  const getPublic = asyncHandler(async (_req, res) => {
    const content = await getPublicAboutUseCase({}, dependencies);
    res.json(content);
  });

  const getAdmin = asyncHandler(async (_req, res) => {
    const content = await getAdminAboutUseCase({}, dependencies);
    res.json(content);
  });

  const update = asyncHandler(async (req, res) => {
    const content = await updateAboutUseCase(req.body, {
      ...dependencies,
      actorId: req.user?.id,
    });

    res.json(content);
  });

  return {
    getPublic,
    getAdmin,
    update,
  };
};

export default createAboutController;
