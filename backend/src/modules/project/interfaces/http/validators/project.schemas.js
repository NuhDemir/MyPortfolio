import { z } from "zod";

const tagsSchema = z
  .union([
    z.string().transform((value) =>
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    ),
    z.array(z.string()),
  ])
  .optional();

const technologySchema = z.object({
  name: z.string().min(1),
  category: z
    .enum(["frontend", "backend", "database", "devops", "design", "other"])
    .optional(),
});

const baseProjectSchema = {
  title: z.string().min(1, { message: "Başlık alanı boş bırakılamaz." }),
  description: z
    .string()
    .min(1, { message: "Açıklama alanı boş bırakılamaz." }),
  githubUrl: z
    .string()
    .url({ message: "Lütfen geçerli bir GitHub URL'si girin." })
    .optional()
    .or(z.literal("")),
  liveUrl: z
    .string()
    .url({ message: "Lütfen geçerli bir canlı bağlantı girin." })
    .optional()
    .or(z.literal("")),
  tags: tagsSchema,
  category: z
    .enum(["web", "mobile", "desktop", "api", "library", "other"])
    .optional(),
  featured: z.coerce.boolean().optional(),
  status: z.enum(["active", "archived", "draft", "maintenance"]).optional(),
  priority: z.coerce.number().min(1).max(10).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  duration: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  technologies: z
    .union([
      z.string().transform((value) => {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
          return value
            .split(",")
            .map((tech) => ({ name: tech.trim() }))
            .filter((tech) => tech.name);
        }
      }),
      z.array(technologySchema),
    ])
    .optional(),
  metrics: z
    .object({
      codeLines: z.coerce.number().min(0).optional(),
      commits: z.coerce.number().min(0).optional(),
      contributors: z.coerce.number().min(1).optional(),
    })
    .partial()
    .optional(),
  client: z
    .object({
      name: z.string().optional(),
      website: z.string().optional(),
      testimonial: z.string().optional(),
    })
    .partial()
    .optional(),
  seo: z
    .object({
      title: z.string().max(60).optional(),
      description: z.string().max(160).optional(),
      keywords: z.union([z.string(), z.array(z.string())]).optional(),
      ogImage: z.string().optional(),
    })
    .partial()
    .optional(),
};

export const createProjectSchema = z.object({
  ...baseProjectSchema,
});

export const updateProjectSchema = z.object({
  ...baseProjectSchema,
  title: baseProjectSchema.title.optional(),
  description: baseProjectSchema.description.optional(),
});

export default {
  createProjectSchema,
  updateProjectSchema,
};
