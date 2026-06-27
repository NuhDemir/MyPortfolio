import { Router } from "express";
import createNewsletterController from "../controllers/newsletter.controller.js";

export const createNewsletterRoutes = () => {
  const router = Router();
  const controller = createNewsletterController();

  // Herkese açık endpoint
  router.post("/subscribe", controller.subscribe);

  return router;
};

export default createNewsletterRoutes;
