import { AboutContent } from "../../../domain/entities/AboutContent.js";
import { AboutRepository } from "../../../domain/repositories/AboutRepository.js";
import { AboutModel } from "./AboutModel.js";

const MAIN_SLUG = "main";

export class MongooseAboutRepository extends AboutRepository {
  async getMain() {
    const document = await AboutModel.findOne({ slug: MAIN_SLUG }).lean();
    return AboutContent.fromPersistence(document);
  }

  async createMain(aboutData) {
    const document = await AboutModel.create({
      slug: MAIN_SLUG,
      ...aboutData,
    });

    return AboutContent.fromPersistence(document);
  }

  async updateMain(aboutData) {
    const { meta, ...rest } = aboutData ?? {};
    const setPayload = {
      ...rest,
      slug: MAIN_SLUG,
    };

    if (meta?.lastEditedBy) {
      setPayload["meta.lastEditedBy"] = meta.lastEditedBy;
    }

    if (meta?.lastEditedAt) {
      setPayload["meta.lastEditedAt"] = meta.lastEditedAt;
    }

    const updated = await AboutModel.findOneAndUpdate(
      { slug: MAIN_SLUG },
      {
        $set: setPayload,
        $inc: {
          "meta.version": 1,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    ).lean();

    return AboutContent.fromPersistence(updated);
  }
}

export default MongooseAboutRepository;
