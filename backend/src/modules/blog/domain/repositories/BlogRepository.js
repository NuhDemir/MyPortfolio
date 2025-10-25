export class BlogRepository {
  async findAll(_filter = {}) {
    throw new Error("BlogRepository#findAll must be implemented");
  }

  async findBySlug(_slug, _filter = {}) {
    throw new Error("BlogRepository#findBySlug must be implemented");
  }

  async findById(_id) {
    throw new Error("BlogRepository#findById must be implemented");
  }

  async create(_blogData) {
    throw new Error("BlogRepository#create must be implemented");
  }

  async updateById(_id, _updateData) {
    throw new Error("BlogRepository#updateById must be implemented");
  }

  async deleteById(_id) {
    throw new Error("BlogRepository#deleteById must be implemented");
  }

  async incrementViews(_id) {
    throw new Error("BlogRepository#incrementViews must be implemented");
  }
}

export default BlogRepository;
