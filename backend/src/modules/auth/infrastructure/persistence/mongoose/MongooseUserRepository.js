import { User } from "../../../domain/entities/User.js";
import { UserRepository } from "../../../domain/repositories/UserRepository.js";
import { UserModel } from "./UserModel.js";

export class MongooseUserRepository extends UserRepository {
  async findByUsername(username) {
    const document = await UserModel.findOne({ username });
    return document ? User.fromPersistence(document) : null;
  }

  async findById(id, { includePassword = false } = {}) {
    const query = UserModel.findById(id);
    if (!includePassword) {
      query.select("-password");
    }
    const document = await query.exec();
    return document ? User.fromPersistence(document) : null;
  }

  async findByEmail(email) {
    const document = await UserModel.findOne({ email });
    return document ? User.fromPersistence(document) : null;
  }

  async findByIdentity(identity) {
    const document = await UserModel.findOne({
      $or: [{ username: identity }, { email: identity }],
    });
    return document ? User.fromPersistence(document) : null;
  }

  async create(userData) {
    const document = await UserModel.create(userData);
    return User.fromPersistence(document);
  }
}

export default MongooseUserRepository;
