import { createNewsletterRoutes } from "./interfaces/http/routes/newsletter.routes.js";

export const initNewsletterModule = () => {
  const router = createNewsletterRoutes();

  return {
    router,
  };
};

export default initNewsletterModule;
