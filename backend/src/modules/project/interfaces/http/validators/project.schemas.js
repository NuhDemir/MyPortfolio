import { z } from "zod";

const jsonPreprocess = (value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const jsonObject = (schema) => z.preprocess(jsonPreprocess, schema);
const jsonArray = (schema) => z.preprocess(jsonPreprocess, schema);

const tagsSchema = z
  .union([
    z.string().transform((value) =>
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
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

const techStackSchema = z.object({
  category: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

const projectLinksSchema = z
  .object({
    liveDemo: z
      .string()
      .url()
      .optional()
      .or(z.literal(""))
      .nullable()
      .optional(),
    github: z.string().url().optional().or(z.literal("")).nullable().optional(),
    figma: z.string().url().optional().or(z.literal("")).nullable().optional(),
  })
  .partial();

const caseStudySchema = z
  .object({
    problem: z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
      })
      .partial()
      .optional(),
    solution: z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
      })
      .partial()
      .optional(),
    challenges: z
      .array(
        z
          .object({
            title: z.string().min(1),
            description: z.string().min(1),
          })
          .partial(),
      )
      .optional(),
    metrics: z
      .array(
        z
          .object({
            label: z.string().min(1),
            value: z.string().min(1),
          })
          .partial(),
      )
      .optional(),
    highlightCode: z
      .object({
        language: z.string().min(1).optional(),
        fileName: z.string().min(1).optional(),
        codeSnippet: z.string().min(1).optional(),
        gistUrl: z
          .string()
          .url()
          .optional()
          .or(z.literal(""))
          .nullable()
          .optional(),
      })
      .partial()
      .optional(),
  })
  .partial();

const legacyBaseProjectSchema = {
  title: z.string().min(1, { message: "Başlık alanı boş bırakılamaz." }),
  description: z
    .string()
    .min(1, { message: "Açıklama alanı boş bırakılamaz." }),
  imageUrl: z.string().min(1).optional(),
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

const newProjectSchema = z
  .object({
    id: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    isFeatured: z.coerce.boolean().optional(),
    metadata: jsonObject(
      z
        .object({
          title: z.string().min(1),
          tagline: z.string().min(1),
          createdAt: z.coerce.date().optional(),
          role: z.string().min(1).optional(),
          platform: z.string().min(1).optional(),
          status: z.string().min(1).optional(),
        })
        .passthrough(),
    ),
    visuals: jsonObject(
      z
        .object({
          thumbnailUrl: z.string().min(1),
          heroVideoUrl: z.string().min(1).optional(),
          primaryColor: z.string().min(1).optional(),
        })
        .passthrough(),
    ),
    techStack: jsonArray(z.array(techStackSchema)).optional(),
    links: jsonObject(projectLinksSchema).optional(),
    caseStudy: jsonObject(caseStudySchema).optional(),
    tags: tagsSchema,
    category: z
      .enum(["web", "mobile", "desktop", "api", "library", "other"])
      .optional(),
  })
  .passthrough();

export const createProjectSchema = z.object({
  ...legacyBaseProjectSchema,
});

export const createProjectSchemaV2 = newProjectSchema;

export const createProjectSchemaAny = z.union([
  createProjectSchema,
  createProjectSchemaV2,
]);

export const updateProjectSchema = z.object({
  ...legacyBaseProjectSchema,
  title: legacyBaseProjectSchema.title.optional(),
  description: legacyBaseProjectSchema.description.optional(),
});

export const updateProjectSchemaV2 = newProjectSchema.partial();

export const updateProjectSchemaAny = z.union([
  updateProjectSchema,
  updateProjectSchemaV2,
]);

export default {
  createProjectSchema,
  createProjectSchemaV2,
  createProjectSchemaAny,
  updateProjectSchema,
  updateProjectSchemaV2,
  updateProjectSchemaAny,
};
