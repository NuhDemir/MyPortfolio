import asyncHandler from "express-async-handler";
import loginAdminUseCase from "../../../application/use-cases/loginAdmin.use-case.js";
import registerAdminUseCase from "../../../application/use-cases/registerAdmin.use-case.js";
import logger from "../../../../shared/infrastructure/logging/logger.js";

export const createAuthController = (dependencies) => {
  const login = asyncHandler(async (req, res) => {
    const { username, email, identity, password } = req.body;
    const loginIdentity = identity ?? username ?? email;

    const result = await loginAdminUseCase({ identity: loginIdentity, password }, dependencies);
    logger.info("Admin logged in", { username: result.username, id: result._id });
    res.json(result);
  });

  const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const result = await registerAdminUseCase({ username, email, password }, dependencies);
    logger.info("Admin registered", { username: result.username, id: result._id });
    res.status(201).json(result);
  });

  return {
    login,
    register,
  };
};

export default createAuthController;
