import { z } from "zod";

// Zod'da bir alanın zorunlu olduğunu belirtmek için .min(1) kullanılır.
// Hata mesajı .min()'in ikinci parametresi olarak verilir.
export const createProjectSchema = z.object({
  title: z.string().min(1, { message: "Başlık alanı boş bırakılamaz." }),

  description: z
    .string()
    .min(1, { message: "Açıklama alanı boş bırakılamaz." }),

  // URL'ler opsiyoneldir, ama girilirse geçerli bir formatta olmalıdır.
  githubUrl: z
    .string()
    .url({ message: "Lütfen geçerli bir GitHub URL'si girin." })
    .optional()
    .or(z.literal("")), // Boş string'e de izin ver

  liveUrl: z
    .string()
    .url({ message: "Lütfen geçerli bir Canlı URL girin." })
    .optional()
    .or(z.literal("")),

  tags: z.string().optional(),
});

// Güncelleme şeması: Tüm alanları opsiyonel yapar.
export const updateProjectSchema = createProjectSchema.partial();
