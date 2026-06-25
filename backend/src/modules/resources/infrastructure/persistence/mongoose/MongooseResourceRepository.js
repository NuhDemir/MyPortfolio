import mongoose from "mongoose";
import { Resource } from "../../../domain/entities/Resource.js";
import { ResourceRepository } from "../../../domain/repositories/ResourceRepository.js";
import { ResourceModel } from "./ResourceModel.js";

export class MongooseResourceRepository extends ResourceRepository {
  async findAll(filter = {}) {
    const documents = await ResourceModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return documents.map((document) => Resource.fromPersistence(document));
  }

  async findBySlug(slug) {
    const document = await ResourceModel.findOne({ slug }).lean();
    return Resource.fromPersistence(document);
  }

  async findById(id) {
    if (!id) return null;

    const normalizedId = mongoose.Types.ObjectId.isValid(id)
      ? id
      : null;

    if (!normalizedId) return null;

    const document = await ResourceModel.findById(normalizedId).lean();
    return Resource.fromPersistence(document);
  }

  async create(resourceData) {
    const document = await ResourceModel.create(resourceData);
    return this.findById(document._id);
  }

  async updateById(id, updateData) {
    if (!id) return null;

    const normalizedId = mongoose.Types.ObjectId.isValid(id)
      ? id
      : null;

    if (!normalizedId) return null;

    const updated = await ResourceModel.findByIdAndUpdate(
      normalizedId,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    return Resource.fromPersistence(updated);
  }

  async deleteById(id) {
    if (!id) return null;

    const normalizedId = mongoose.Types.ObjectId.isValid(id)
      ? id
      : null;

    if (!normalizedId) return null;

    const document = await ResourceModel.findById(normalizedId).lean();
    if (!document) return null;

    await ResourceModel.deleteOne({ _id: normalizedId });
    return { message: "Kaynak başarıyla silindi." };
  }
}

export default MongooseResourceRepository;
