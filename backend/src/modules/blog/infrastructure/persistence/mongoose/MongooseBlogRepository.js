import { Blog } from "../../../domain/entities/Blog.js";
import { BlogRepository } from "../../../domain/repositories/BlogRepository.js";
import { BlogModel } from "./BlogModel.js";

export class MongooseBlogRepository extends BlogRepository {
  async findAll(filter = {}, options = {}) {
    const query = BlogModel.find(filter).sort({ createdAt: -1 });

    if (options.lean) {
      query.lean();
    }

    const documents = await query.exec();
    return documents.map((document) => Blog.fromPersistence(document));
  }

  async findBySlug(slug, filter = {}) {
    const document = await BlogModel.findOne({ slug, ...filter });
    return Blog.fromPersistence(document);
  }

  async findById(id) {
    const document = await BlogModel.findById(id);
    return Blog.fromPersistence(document);
  }

  async create(blogData) {
    const document = await BlogModel.create(blogData);
    return Blog.fromPersistence(document);
  }

  async updateById(id, updateData) {
    const document = await BlogModel.findById(id);
    if (!document) {
      return null;
    }

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        document[key] = value;
      }
    });

    const saved = await document.save();
    return Blog.fromPersistence(saved);
  }

  async deleteById(id) {
    const document = await BlogModel.findById(id);
    if (!document) {
      return null;
    }

    await document.deleteOne();
    return { message: "Blog yazısı başarıyla silindi." };
  }

  async incrementViews(id) {
    const document = await BlogModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    return Blog.fromPersistence(document);
  }
}

export default MongooseBlogRepository;
