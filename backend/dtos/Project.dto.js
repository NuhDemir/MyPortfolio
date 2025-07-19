import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Proje başlığı boş olamaz."),
  description: z.string.min(1, "Proje açıklaması boş olamaz."),

  imageUrl: z.string().url("Geçerli bir görsel URL'si olmalı.").optional(),

  githubUrl: z
    .string()
    .url("Geçerli bir GitHub URL'si olmalı.")
    .optional()
    .or(z.literal("")),
  liveUrl: z
    .string()
    .url("Geçerli bir canlı URL'si olmalı.")
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string().trim()).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
