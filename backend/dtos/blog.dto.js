import { z } from "zod";

const createBlogSchema = z.object({
  title: z.string().min(1, "Başlık boş bırakılamaz."),
  content: z.string().min(10, "Blog içeriği en az 10 karakter olmalıdır."),
  tags: z.string().optional().or(z.literal("")), // Virgülle ayrılmış string bekliyoruz
  category: z.string().optional().or(z.literal("")),
  isPublished: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional()
    .default(false), // Frontend'den string 'true'/'false' veya boolean gelebilir
});

const updateBlogSchema = createBlogSchema.partial();

export { createBlogSchema, updateBlogSchema };
