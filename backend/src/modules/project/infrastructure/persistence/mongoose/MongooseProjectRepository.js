import { Project } from "../../../domain/entities/Project.js";
import { ProjectRepository } from "../../../domain/repositories/ProjectRepository.js";
import { ProjectModel } from "./ProjectModel.js";

export class MongooseProjectRepository extends ProjectRepository {
  async findAll(filter = {}, options = {}) {
    const query = ProjectModel.find(filter).sort({ createdAt: -1 });

    if (options.limit) {
      query.limit(options.limit);
    }

    if (options.lean) {
      query.lean();
    }

    const documents = await query.exec();
    return documents.map((document) => Project.fromPersistence(document));
  }

  async findById(id, options = {}) {
    const query = ProjectModel.findById(id);

    if (options.lean) {
      query.lean();
    }

    const document = await query.exec();
    return Project.fromPersistence(document);
  }

  async findBySlug(slug, options = {}) {
    const query = ProjectModel.findOne({ slug });

    if (options.lean) {
      query.lean();
    }

    const document = await query.exec();
    return Project.fromPersistence(document);
  }

  async create(projectData) {
    const document = await ProjectModel.create(projectData);
    return Project.fromPersistence(document);
  }

  async updateById(id, updateData) {
    const document = await ProjectModel.findById(id);

    if (!document) {
      return null;
    }

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        document[key] = value;
      }
    });

    const saved = await document.save();
    return Project.fromPersistence(saved);
  }

  async deleteById(id) {
    const document = await ProjectModel.findById(id);

    if (!document) {
      return null;
    }

    await document.deleteOne();
    return { message: "Proje başarıyla silindi." };
  }

  async incrementViews(id) {
    const document = await ProjectModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    return Project.fromPersistence(document);
  }
}

export default MongooseProjectRepository;
