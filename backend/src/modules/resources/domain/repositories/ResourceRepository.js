export class ResourceRepository {
  async findAll(_filter = {}) {
    throw new Error("ResourceRepository#findAll must be implemented");
  }

  async findBySlug(_slug) {
    throw new Error("ResourceRepository#findBySlug must be implemented");
  }

  async findById(_id) {
    throw new Error("ResourceRepository#findById must be implemented");
  }

  async create(_resourceData) {
    throw new Error("ResourceRepository#create must be implemented");
  }

  async updateById(_id, _updateData) {
    throw new Error("ResourceRepository#updateById must be implemented");
  }

  async deleteById(_id) {
    throw new Error("ResourceRepository#deleteById must be implemented");
  }
}

export default ResourceRepository;
