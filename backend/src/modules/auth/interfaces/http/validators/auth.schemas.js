import { z } from "zod";

export const loginSchema = z
  .object({
    identity: z.string().optional(),
    username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır.").optional(),
    email: z.string().email("Geçerli bir email adresi giriniz.").optional(),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
  })
  .refine((data) => data.identity || data.username || data.email, {
    message: "Kullanıcı adı veya email belirtilmelidir.",
    path: ["identity"],
  });

export const registerSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır."),
  email: z.string().email("Geçerli bir email adresi giriniz."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
});

export default {
  loginSchema,
  registerSchema,
};
