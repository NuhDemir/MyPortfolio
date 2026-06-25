import { z } from "zod";

const baseResourceSchema = {
  title: z.string().min(2, "Başlık en az 2 karakter olmalıdır."),
  url: z.string().url("Geçerli bir URL giriniz."),
  description: z.string().optional().default(""),
  type: z
    .enum(["kitap", "video", "makale", "kurs", "arac", "diger"])
    .optional()
    .default("diger"),
  tags: z
    .union([
      z.string().transform((value) =>
        value
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      ),
      z.array(z.string()),
    ])
    .optional()
    .default([]),
  author: z.string().optional().default(""),
  rating: z
    .union([z.string(), z.number()])
    .transform((v) => Math.min(5, Math.max(0, Number(v) || 0)))
    .optional()
    .default(0),
  language: z.enum(["tr", "en", "de", "fr", "es"]).optional().default("tr"),
  difficulty: z
    .enum(["baslangic", "orta", "ileri", "uzman"])
    .nullable()
    .optional()
    .default(null),
  notes: z.string().optional().default(""),
  isActive: z.coerce.boolean().optional().default(true),
  isFeatured: z.coerce.boolean().optional().default(false),
};

export const createResourceSchema = z.object({
  ...baseResourceSchema,
});

export const updateResourceSchema = z.object({
  title: baseResourceSchema.title.optional(),
  url: baseResourceSchema.url.optional(),
  description: baseResourceSchema.description.optional(),
  type: baseResourceSchema.type.optional(),
  tags: baseResourceSchema.tags.optional(),
  author: baseResourceSchema.author.optional(),
  rating: baseResourceSchema.rating.optional(),
  language: baseResourceSchema.language.optional(),
  difficulty: baseResourceSchema.difficulty.optional(),
  notes: baseResourceSchema.notes.optional(),
  isActive: baseResourceSchema.isActive.optional(),
  isFeatured: baseResourceSchema.isFeatured.optional(),
});

export default {
  createResourceSchema,
  updateResourceSchema,
};
