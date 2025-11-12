import CommentController from "./interfaces/http/CommentController.js";
import CommentService from "./application/CommentService.js";
import CommentRepository from "./infrastructure/database/CommentRepository.js";

const initCommentModule = ({ authModule } = {}) => {
  const repository = new CommentRepository();
  const service = new CommentService(repository);
  const middleware = authModule?.middleware || null;
  const controller = new CommentController(service, middleware);

  return {
    router: controller.getRoutes(),
    service,
    repository,
    repositories: {
      commentRepository: repository,
    },
  };
};

export default initCommentModule;
