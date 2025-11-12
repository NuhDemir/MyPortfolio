import Comment from "../../domain/Comment.js";

class CommentRepository {
  async findAll(filters = {}, options = {}) {
    const {
      status,
      blogId,
      resourceType,
      resourceId,
      parentId,
      page = 1,
      limit = 20,
      sort = { createdAt: -1 },
    } = options;

    const query = { ...filters };

    if (status) query.status = status;
    if (blogId) query.blogId = blogId;
    if (resourceType) query.resourceType = resourceType;
    if (resourceId) query.resourceId = resourceId;
    if (parentId !== undefined) query.parentId = parentId;

    const skip = (page - 1) * limit;

    // Fetch all comments first to check which ones have ObjectId resourceIds
    const [comments, total] = await Promise.all([
      Comment.find(query)
        .populate("blogId", "title slug") // Backward compatibility
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments(query),
    ]);

    // Manually populate resourceId for each comment that has a valid ObjectId
    const populatedComments = await Promise.all(
      comments.map(async (comment) => {
        if (comment.resourceId && this.isObjectId(comment.resourceId)) {
          try {
            // Determine which model to populate from
            const Model =
              comment.resourceType === "Blog"
                ? (await import("../../../blog/domain/Blog.js")).default
                : (await import("../../../project/domain/Project.js")).default;

            const populatedResource = await Model.findById(comment.resourceId)
              .select("title slug")
              .lean();

            return {
              ...comment,
              resourceId: populatedResource || comment.resourceId,
            };
          } catch (error) {
            console.error(
              `Failed to populate resourceId for comment ${comment._id}:`,
              error
            );
            return comment;
          }
        }
        return comment;
      })
    );

    return {
      data: populatedComments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Helper method to check if value is a valid ObjectId
  isObjectId(value) {
    return /^[0-9a-fA-F]{24}$/.test(value);
  }

  async findById(id) {
    return Comment.findById(id)
      .populate("blogId", "title slug")
      .populate({
        path: "replies",
        match: { status: "approved" },
        options: { sort: { createdAt: 1 } },
      })
      .lean();
  }

  async create(commentData) {
    const comment = new Comment(commentData);
    return comment.save();
  }

  async update(id, updateData) {
    return Comment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async delete(id) {
    // Delete comment and all its replies
    await Comment.deleteMany({
      $or: [{ _id: id }, { parentId: id }],
    });
    return { success: true };
  }

  async updateStatus(id, status) {
    return this.update(id, { status });
  }

  async getStats() {
    const [total, pending, approved, rejected, spam] = await Promise.all([
      Comment.countDocuments(),
      Comment.countDocuments({ status: "pending" }),
      Comment.countDocuments({ status: "approved" }),
      Comment.countDocuments({ status: "rejected" }),
      Comment.countDocuments({ status: "spam" }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
      spam,
    };
  }

  async getRecentComments(limit = 10) {
    return Comment.find()
      .populate("blogId", "title slug")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
}

export default CommentRepository;
