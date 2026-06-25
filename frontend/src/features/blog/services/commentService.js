import { axiosClient } from "@core";

const API_URL = "/comments";

export const commentService = {
  // Get approved comments for a resource (blog or project)
  async getCommentsByResource(resourceType, resourceId) {
    const { data } = await axiosClient.get(
      `${API_URL}/${resourceType}/${resourceId}`
    );
    return data;
  },

  // Backward compatibility - Get comments by blog
  async getCommentsByBlog(blogId) {
    return this.getCommentsByResource("Blog", blogId);
  },

  // Create a new comment (public)
  async createComment(commentData) {
    const { data } = await axiosClient.post(API_URL, commentData);
    return data;
  },
};

export default commentService;
