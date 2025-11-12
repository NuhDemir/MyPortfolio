class CommentService {
  constructor(commentRepository) {
    this.repository = commentRepository;
  }

  async getAllComments(options) {
    return this.repository.findAll({}, options);
  }

  async getCommentById(id) {
    const comment = await this.repository.findById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    return comment;
  }

  async getCommentsByResource(resourceType, resourceId, options = {}) {
    return this.repository.findAll({ resourceType, resourceId }, options);
  }

  // Backward compatibility
  async getCommentsByBlog(blogId, options = {}) {
    return this.repository.findAll({ blogId }, options);
  }

  async createComment(commentData) {
    // Validate required fields
    const hasResourceInfo = commentData.resourceType && commentData.resourceId;
    const hasBlogId = commentData.blogId;

    if (!hasResourceInfo && !hasBlogId) {
      throw new Error(
        "Either resourceType/resourceId or blogId must be provided"
      );
    }

    if (
      !commentData.author?.name ||
      !commentData.author?.email ||
      !commentData.content
    ) {
      throw new Error("Missing required fields");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(commentData.author.email)) {
      throw new Error("Invalid email format");
    }

    // Backward compatibility: Set resourceType and resourceId from blogId
    if (commentData.blogId && !commentData.resourceType) {
      commentData.resourceType = "Blog";
      commentData.resourceId = commentData.blogId;
    }

    return this.repository.create(commentData);
  }

  async updateComment(id, updateData) {
    const comment = await this.repository.findById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // If content is being updated, mark as edited
    if (updateData.content && updateData.content !== comment.content) {
      updateData.isEdited = true;
      updateData.editedAt = new Date();
    }

    return this.repository.update(id, updateData);
  }

  async deleteComment(id) {
    const comment = await this.repository.findById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    return this.repository.delete(id);
  }

  async approveComment(id) {
    return this.repository.updateStatus(id, "approved");
  }

  async rejectComment(id) {
    return this.repository.updateStatus(id, "rejected");
  }

  async markAsSpam(id) {
    return this.repository.updateStatus(id, "spam");
  }

  async getStats() {
    return this.repository.getStats();
  }

  async getRecentComments(limit) {
    return this.repository.getRecentComments(limit);
  }
}

export default CommentService;
