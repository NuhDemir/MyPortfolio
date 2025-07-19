import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(1, "Blog başlığı boş olamaz."),
  content: z.string.min(1, "Blog içeriği boş olamaz."),
  tags: z.array(z.string.trim()).optional(),
  category: z.string().trim().optional(),

  thumbnail: z.string
    .url("Geçerli bir görsel URL\ si olmalı.")
    .optional()
    .or(z.literal("")),
  isPublished: z.boolean().optional(),
});

// Blog Güncelleme için şema(tüm alanlar isteğe bağlı olabilir.)
export const updateBlogSchema = createBlogSchema.partial();
