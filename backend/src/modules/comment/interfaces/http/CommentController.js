import express from "express";

class CommentController {
  constructor(commentService, authMiddleware = null) {
    this.service = commentService;
    this.middleware = authMiddleware;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Public routes
    this.router.get(
      "/:resourceType/:resourceId",
      this.getCommentsByResource.bind(this)
    );
    this.router.post("/", this.createComment.bind(this));

    // Admin routes (only if middleware is provided)
    if (this.middleware) {
      this.router.get(
        "/",
        this.middleware.protect,
        this.middleware.authorizeAdmin,
        this.getAllComments.bind(this)
      );
      this.router.get(
        "/stats",
        this.middleware.protect,
        this.middleware.authorizeAdmin,
        this.getStats.bind(this)
      );
      this.router.get(
        "/:id",
        this.middleware.protect,
        this.middleware.authorizeAdmin,
        this.getCommentById.bind(this)
      );
      this.router.put(
        "/:id",
        this.middleware.protect,
        this.middleware.authorizeAdmin,
        this.updateComment.bind(this)
      );
      this.router.delete(
        "/:id",
        this.middleware.protect,
        this.middleware.authorizeAdmin,
        this.deleteComment.bind(this)
      );
      this.router.patch(
        "/:id/approve",
        this.middleware.protect,
        this.middleware.authorizeAdmin,
        this.approveComment.bind(this)
      );
      this.router.patch(
        "/:id/reject",
        this.middleware.protect,
        this.middleware.authorizeAdmin,
        this.rejectComment.bind(this)
      );
      this.router.patch(
        "/:id/spam",
        this.middleware.protect,
        this.middleware.authorizeAdmin,
        this.markAsSpam.bind(this)
      );
    }
  }

  async getAllComments(req, res, next) {
    try {
      // Parse sort parameter safely
      let sort = { createdAt: -1 }; // default sort
      if (req.query.sort) {
        if (typeof req.query.sort === "string") {
          // Handle string format like "-createdAt" or "createdAt"
          const sortField = req.query.sort.startsWith("-")
            ? req.query.sort.substring(1)
            : req.query.sort;
          const sortOrder = req.query.sort.startsWith("-") ? -1 : 1;
          sort = { [sortField]: sortOrder };
        } else if (typeof req.query.sort === "object") {
          sort = req.query.sort;
        }
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        status: req.query.status,
        blogId: req.query.blogId,
        sort,
      };

      const result = await this.service.getAllComments(options);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCommentById(req, res, next) {
    try {
      const comment = await this.service.getCommentById(req.params.id);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  async getCommentsByResource(req, res, next) {
    try {
      const { resourceType, resourceId } = req.params;

      // Validate resourceType
      if (!["Blog", "Project"].includes(resourceType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource type. Must be 'Blog' or 'Project'",
        });
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        status: "approved", // Only approved comments for public
        parentId: null, // Only top-level comments
      };

      const result = await this.service.getCommentsByResource(
        resourceType,
        resourceId,
        options
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async createComment(req, res, next) {
    try {
      const commentData = {
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      };

      // Validate resourceType if provided
      if (
        commentData.resourceType &&
        !["Blog", "Project"].includes(commentData.resourceType)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource type. Must be 'Blog' or 'Project'",
        });
      }

      const comment = await this.service.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req, res, next) {
    try {
      const comment = await this.service.updateComment(req.params.id, req.body);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      await this.service.deleteComment(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async approveComment(req, res, next) {
    try {
      const comment = await this.service.approveComment(req.params.id);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  async rejectComment(req, res, next) {
    try {
      const comment = await this.service.rejectComment(req.params.id);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  async markAsSpam(req, res, next) {
    try {
      const comment = await this.service.markAsSpam(req.params.id);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await this.service.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  getRoutes() {
    return this.router;
  }
}

export default CommentController;
