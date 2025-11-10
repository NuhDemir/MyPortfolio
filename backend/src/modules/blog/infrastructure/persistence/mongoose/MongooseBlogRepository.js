import mongoose from "mongoose";
import { Blog } from "../../../domain/entities/Blog.js";
import { BlogRepository } from "../../../domain/repositories/BlogRepository.js";
import { BlogModel } from "./BlogModel.js";

const authorPopulate = {
  path: "author",
  select:
    "username email role profile.firstName profile.lastName profile.avatar preferences.theme",
};

export class MongooseBlogRepository extends BlogRepository {
  async findAll(filter = {}, options = {}) {
    const query = BlogModel.find(filter)
      .sort({ createdAt: -1 })
      .populate(authorPopulate);

    if (options.limit) {
      query.limit(options.limit);
    }

    if (options.lean === false) {
      // leave as mongoose documents
    } else {
      query.lean();
    }

    const documents = await query.exec();
    return documents.map((document) => Blog.fromPersistence(document));
  }

  async findBySlug(slug, filter = {}) {
    const document = await BlogModel.findOne({ slug, ...filter })
      .populate(authorPopulate)
      .lean();
    return Blog.fromPersistence(document);
  }

  async findById(id) {
    if (!id) {
      return null;
    }

    const normalizedId = mongoose.Types.ObjectId.isValid(id)
      ? id
      : slugToObjectId(id);

    if (!normalizedId) {
      return null;
    }

    const document = await BlogModel.findById(normalizedId)
      .populate(authorPopulate)
      .lean();
    return Blog.fromPersistence(document);
  }

  async create(blogData) {
    const document = await BlogModel.create(blogData);
    return this.findById(document._id);
  }

  async updateById(id, updateData) {
    if (!id) {
      return null;
    }

    const normalizedId = mongoose.Types.ObjectId.isValid(id)
      ? id
      : slugToObjectId(id);

    if (!normalizedId) {
      return null;
    }

    const updated = await BlogModel.findByIdAndUpdate(
      normalizedId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate(authorPopulate)
      .lean();

    return Blog.fromPersistence(updated);
  }

  async deleteById(id) {
    if (!id) {
      return null;
    }

    const normalizedId = mongoose.Types.ObjectId.isValid(id)
      ? id
      : slugToObjectId(id);

    if (!normalizedId) {
      return null;
    }

    const document = await BlogModel.findById(normalizedId).lean();
    if (!document) {
      return null;
    }

    await BlogModel.deleteOne({ _id: normalizedId });
    return { message: "Blog yazısı başarıyla silindi." };
  }

  async incrementViews(id) {
    const document = await BlogModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate(authorPopulate)
      .lean();

    return Blog.fromPersistence(document);
  }
}

const slugToObjectId = (value) => {
  if (!value) {
    return null;
  }

  if (mongoose.Types.ObjectId.isValid(value)) {
    return value;
  }

  return null;
};

export default MongooseBlogRepository;
