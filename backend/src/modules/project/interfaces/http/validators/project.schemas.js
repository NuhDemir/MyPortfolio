import { z } from "zod";

// ── Helpers ───────────────────────────────────────────────────────────────

const jsonPreprocess = (value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const jsonObject = (schema) => z.preprocess(jsonPreprocess, schema);
const jsonArray  = (schema) => z.preprocess(jsonPreprocess, schema);

const optionalUrl = z.string().url().optional().or(z.literal("")).nullable().optional();

const tagsSchema = z
  .union([
    z.string().transform((v) =>
      v.split(",").map((t) => t.trim()).filter(Boolean),
    ),
    z.array(z.string()),
  ])
  .optional();

// ── Sub-schemas ───────────────────────────────────────────────────────────

const technologySchema = z.object({
  name:        z.string().min(1),
  category:    z.enum(["frontend","backend","database","devops","design","testing","mobile","other"]).optional(),
  proficiency: z.enum(["learning","competent","proficient","expert"]).optional(),
});

const projectContextSchema = z
  .object({
    role:             z.string().min(1).optional(),
    teamSize:         z.coerce.number().min(1).optional(),
    platform:         z.string().min(1).optional(),
    duration:         z.string().optional(),
    startDate:        z.coerce.date().optional(),
    endDate:          z.coerce.date().optional(),
    difficulty:       z.enum(["beginner","intermediate","advanced","expert"]).optional(),
    repositoryAccess: z.enum(["public","private","enterprise","open-source"]).optional(),
    architecture:     z.enum(["monolithic","microservices","serverless","jamstack","spa","ssr","pwa","other"]).optional(),
  })
  .partial();

const projectVisualsSchema = z
  .object({
    thumbnailUrl:           z.string().min(1).optional(),
    heroImageUrl:           optionalUrl,
    heroVideoUrl:           optionalUrl,
    ogImage:                optionalUrl,
    primaryColor:           z.string().optional(),
    accentColor:            z.string().optional(),
    architectureDiagramUrl: optionalUrl,
    wireframeUrl:           optionalUrl,
    beforeImageUrl:         optionalUrl,
    afterImageUrl:          optionalUrl,
  })
  .partial();

const projectLinksSchema = z
  .object({
    liveDemo:      optionalUrl,
    github:        optionalUrl,
    figma:         optionalUrl,
    documentation: optionalUrl,
  })
  .partial();

const caseStudySchema = z
  .object({
    problem: z.object({ title: z.string().min(1), description: z.string().min(1) }).partial().optional(),
    solution: z.object({ title: z.string().min(1), description: z.string().min(1) }).partial().optional(),
    impact:   z.string().max(300).optional(),
    highlights: z.array(z.string()).optional(),
    challenges: z
      .array(z.object({ title: z.string().min(1), description: z.string().min(1) }).partial())
      .optional(),
    metrics: z
      .array(
        z.object({
          label: z.string().min(1),
          value: z.string().min(1),
          unit:  z.string().optional(),
        }).partial(),
      )
      .optional(),
    highlightCode: z
      .object({
        language:    z.string().min(1).optional(),
        fileName:    z.string().min(1).optional(),
        codeSnippet: z.string().min(1).optional(),
        gistUrl:     optionalUrl,
      })
      .partial()
      .optional(),
    gallery: z
      .array(
        z.object({
          url:     z.string().min(1),
          alt:     z.string().optional(),
          caption: z.string().optional(),
        }),
      )
      .optional(),
  })
  .partial();

const seoSchema = z
  .object({
    title:       z.string().max(60).optional(),
    description: z.string().max(160).optional(),
    keywords:    z.union([z.string(), z.array(z.string())]).optional(),
  })
  .partial()
  .optional();

const clientSchema = z
  .object({
    name:        z.string().optional(),
    website:     z.string().optional(),
    testimonial: z.string().optional(),
  })
  .partial()
  .optional();

const metricsSchema = z
  .object({
    codeLines:    z.coerce.number().min(0).optional(),
    commits:      z.coerce.number().min(0).optional(),
    contributors: z.coerce.number().min(1).optional(),
    testCoverage: z.coerce.number().min(0).max(100).optional(),
    deployments:  z.coerce.number().min(0).optional(),
  })
  .partial()
  .optional();

// ── V3 (canonical) project schema ─────────────────────────────────────────

const v3BaseFields = {
  id:          z.string().min(1).optional(),
  externalId:  z.string().min(1).optional(),
  slug:        z.string().min(1).optional(),
  title:       z.string().min(1, { message: "Başlık alanı boş bırakılamaz." }).optional(),
  tagline:     z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category:    z.enum(["web","mobile","desktop","api","library","tool","other"]).optional(),
  status:      z.enum(["active","archived","draft","maintenance"]).optional(),
  isFeatured:  z.coerce.boolean().optional(),
  priority:    z.coerce.number().min(1).max(10).optional(),
  tags:        tagsSchema,
  context:     jsonObject(projectContextSchema).optional(),
  visuals:     jsonObject(projectVisualsSchema).optional(),
  technologies: z
    .union([
      z.string().transform((v) => {
        try {
          const parsed = JSON.parse(v);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return v.split(",").map((t) => ({ name: t.trim() })).filter((t) => t.name);
        }
      }),
      z.array(technologySchema),
    ])
    .optional(),
  links:     jsonObject(projectLinksSchema).optional(),
  galleryImages: jsonArray(
    z.array(
      z.object({
        url:     z.string().min(1),
        alt:     z.string().optional(),
        caption: z.string().optional(),
        type:    z.enum(["screenshot","diagram","wireframe","mockup","other"]).optional(),
      }),
    ),
  ).optional(),
  caseStudy:  jsonObject(caseStudySchema).optional(),
  seo:        seoSchema,
  client:     clientSchema,
  metrics:    metricsSchema,
};

// ── Legacy (v1/v2) backward-compat fields ──────────────────────────────────

const legacyCompatFields = {
  imageUrl:   z.string().min(1).optional(),
  githubUrl:  z.string().url().optional().or(z.literal("")),
  liveUrl:    z.string().url().optional().or(z.literal("")),
  featured:   z.coerce.boolean().optional(),
  difficulty: z.enum(["beginner","intermediate","advanced"]).optional(),
  duration:   z.string().optional(),
  startDate:  z.coerce.date().optional(),
  endDate:    z.coerce.date().optional(),
  metadata:   jsonObject(
    z
      .object({
        title:     z.string().min(1),
        tagline:   z.string().min(1),
        createdAt: z.coerce.date().optional(),
        role:      z.string().optional(),
        platform:  z.string().optional(),
        status:    z.string().optional(),
      })
      .passthrough(),
  ).optional(),
  techStack: jsonArray(
    z.array(
      z.object({
        category: z.string().min(1),
        items:    z.array(z.string().min(1)).min(1),
      }),
    ),
  ).optional(),
};

// ── Exported schemas ──────────────────────────────────────────────────────

export const createProjectSchema = z
  .object({
    ...v3BaseFields,
    ...legacyCompatFields,
    // title required on create (no .optional() override)
    title: z.string().min(1, { message: "Başlık alanı boş bırakılamaz." }),
  })
  .passthrough();

export const updateProjectSchema = z
  .object({
    ...v3BaseFields,
    ...legacyCompatFields,
  })
  .passthrough();

// Keep named aliases the validators reference elsewhere
export const createProjectSchemaV2 = createProjectSchema;
export const createProjectSchemaAny = createProjectSchema;
export const updateProjectSchemaV2 = updateProjectSchema;
export const updateProjectSchemaAny = updateProjectSchema;

export default {
  createProjectSchema,
  createProjectSchemaV2,
  createProjectSchemaAny,
  updateProjectSchema,
  updateProjectSchemaV2,
  updateProjectSchemaAny,
};
