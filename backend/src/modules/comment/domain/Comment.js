import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    // Reference to either Blog or Project
    resourceType: {
      type: String,
      enum: ["Blog", "Project"],
      index: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.Mixed,
      index: true,
    },
    // Deprecated: Keep for backward compatibility
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      index: true,
    },
    author: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      website: { type: String, trim: true },
      jobTitle: { type: String, trim: true },
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "spam"],
      default: "pending",
      index: true,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
commentSchema.index({
  resourceType: 1,
  resourceId: 1,
  status: 1,
  createdAt: -1,
});
commentSchema.index({ blogId: 1, status: 1, createdAt: -1 }); // Backward compatibility
commentSchema.index({ status: 1, createdAt: -1 });

// Pre-save hook to maintain backward compatibility
commentSchema.pre("save", function (next) {
  if (this.resourceType === "Blog" && this.resourceId && !this.blogId) {
    this.blogId = this.resourceId;
  }
  next();
});

// Virtual for replies
commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentId",
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
