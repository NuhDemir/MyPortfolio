import { z } from "zod";

const baseBlogSchema = {
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır."),
  content: z.string().min(10, "İçerik en az 10 karakter olmalıdır."),
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
    .optional(),
  category: z.string().optional(),
  isPublished: z.coerce.boolean().optional(),
  status: z.enum(["draft", "published", "archived", "scheduled"]).optional(),
};

export const createBlogSchema = z.object({
  ...baseBlogSchema,
});

export const updateBlogSchema = z.object({
  ...baseBlogSchema,
  title: baseBlogSchema.title.optional(),
  content: baseBlogSchema.content.optional(),
});

export default {
  createBlogSchema,
  updateBlogSchema,
};
