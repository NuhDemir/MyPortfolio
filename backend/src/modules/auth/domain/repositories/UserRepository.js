export class UserRepository {
  async findByUsername(_username) {
    throw new Error("UserRepository#findByUsername must be implemented");
  }

  async findById(_id) {
    throw new Error("UserRepository#findById must be implemented");
  }

  async findByEmail(_email) {
    throw new Error("UserRepository#findByEmail must be implemented");
  }

  async findByIdentity(_identity) {
    throw new Error("UserRepository#findByIdentity must be implemented");
  }

  async create(_userData) {
    throw new Error("UserRepository#create must be implemented");
  }
}

export default UserRepository;
