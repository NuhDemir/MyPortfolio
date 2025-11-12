import axiosClient from "@core/http/axiosClient";

const API_URL = "/comments";

export const commentService = {
  // Get all comments (admin)
  async getAllComments(params = {}) {
    const { data } = await axiosClient.get(API_URL, { params });
    return data;
  },

  // Get comment stats
  async getStats() {
    const { data } = await axiosClient.get(`${API_URL}/stats`);
    return data;
  },

  // Get single comment
  async getCommentById(id) {
    const { data } = await axiosClient.get(`${API_URL}/${id}`);
    return data;
  },

  // Get comments by blog
  async getCommentsByBlog(blogId, params = {}) {
    const { data } = await axiosClient.get(`${API_URL}/blog/${blogId}`, {
      params,
    });
    return data;
  },

  // Create comment
  async createComment(commentData) {
    const { data } = await axiosClient.post(API_URL, commentData);
    return data;
  },

  // Update comment
  async updateComment(id, commentData) {
    const { data } = await axiosClient.put(`${API_URL}/${id}`, commentData);
    return data;
  },

  // Delete comment
  async deleteComment(id) {
    await axiosClient.delete(`${API_URL}/${id}`);
    return { success: true };
  },

  // Approve comment
  async approveComment(id) {
    const { data } = await axiosClient.patch(`${API_URL}/${id}/approve`);
    return data;
  },

  // Reject comment
  async rejectComment(id) {
    const { data } = await axiosClient.patch(`${API_URL}/${id}/reject`);
    return data;
  },

  // Mark as spam
  async markAsSpam(id) {
    const { data } = await axiosClient.patch(`${API_URL}/${id}/spam`);
    return data;
  },
};

export default commentService;
