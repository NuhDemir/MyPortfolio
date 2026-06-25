import { z } from "zod";

const statCtaSchema = z.object({
  label: z.string().trim().min(1).max(80),
  url: z.string().trim().url(),
});

const statSchema = z.object({
  key: z.string().trim().min(2).max(40),
  label: z.string().trim().min(2).max(80),
  valueSource: z.enum(["static", "github"]).optional(),
  staticValue: z.union([z.string(), z.number()]).optional(),
  githubField: z
    .enum(["public_repos", "followers", "following", "public_gists"])
    .optional(),
  cta: statCtaSchema.optional(),
  order: z.coerce.number().int().min(0).optional(),
});

const modalItemSchema = z.object({
  title: z.string().trim().min(2).max(120),
  body: z.string().trim().min(2).max(500),
  linkLabel: z.string().trim().max(80).optional().or(z.literal("")),
  linkUrl: z.string().trim().url().optional().or(z.literal("")),
});

const modalSectionSchema = z.object({
  title: z.string().trim().min(2).max(120),
  items: z.array(modalItemSchema).optional(),
});

const serviceModalSchema = z.object({
  heading: z.string().trim().min(2).max(120),
  lead: z.string().trim().min(2).max(600),
  sections: z.array(modalSectionSchema).optional(),
  footnote: z.string().trim().max(500).optional().or(z.literal("")),
  footnoteLinkLabel: z.string().trim().max(80).optional().or(z.literal("")),
  footnoteLinkUrl: z.string().trim().url().optional().or(z.literal("")),
});

const linkSchema = z.object({
  label: z.string().trim().min(1).max(80),
  url: z.string().trim().url(),
});

const serviceSchema = z.object({
  id: z.string().trim().min(2).max(50),
  iconUrl: z.string().trim().url().optional(),
  iconBgColor: z.string().trim().max(50).optional(),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(2).max(800).optional(),
  order: z.coerce.number().int().min(0).optional(),
  image: z.string().trim().url().optional(),
  problem: z.string().trim().max(1000).optional(),
  solution: z.string().trim().max(1000).optional(),
  desc: z.string().trim().max(1000).optional(),
  tech: z.array(z.string().trim().min(1).max(80)).optional(),
  links: z.array(linkSchema).optional(),
  modal: serviceModalSchema.optional(),
});

export const updateAboutSchema = z
  .object({
    header: z
      .object({
        badge: z.string().trim().max(50).optional().or(z.literal("")),
        title: z.string().trim().min(2).max(120).optional(),
        subtitle: z.string().trim().max(300).optional().or(z.literal("")),
      })
      .optional(),
    github: z
      .object({
        username: z.string().trim().min(1).max(60).optional(),
        profileUrl: z.string().trim().url().optional(),
      })
      .optional(),
    stats: z.array(statSchema).optional(),
    services: z.array(serviceSchema).optional(),
    seo: z
      .object({
        title: z.string().trim().max(80).optional().or(z.literal("")),
        description: z.string().trim().max(180).optional().or(z.literal("")),
        keywords: z.array(z.string().trim().min(1)).optional(),
      })
      .optional(),
    isActive: z.coerce.boolean().optional(),
  })
  .strict();

export default {
  updateAboutSchema,
};
