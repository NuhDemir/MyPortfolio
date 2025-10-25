export class ProjectRepository {
  async findAll(_filter = {}, _options = {}) {
    throw new Error("ProjectRepository#findAll must be implemented");
  }

  async findById(_id, _options = {}) {
    throw new Error("ProjectRepository#findById must be implemented");
  }

  async findBySlug(_slug, _options = {}) {
    throw new Error("ProjectRepository#findBySlug must be implemented");
  }

  async create(_projectData) {
    throw new Error("ProjectRepository#create must be implemented");
  }

  async updateById(_id, _updateData) {
    throw new Error("ProjectRepository#updateById must be implemented");
  }

  async deleteById(_id) {
    throw new Error("ProjectRepository#deleteById must be implemented");
  }

  async incrementViews(_id) {
    throw new Error("ProjectRepository#incrementViews must be implemented");
  }
}

export default ProjectRepository;
